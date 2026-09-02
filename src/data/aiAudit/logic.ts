/**
 * AI Leadership Readiness Audit — scoring, routing, classification and CTA logic.
 *
 * Pure functions only, so the governing logic map can be unit-tested exactly.
 * Nothing here reads readiness as a purchase gate: readiness informs the
 * recommendation and the scaling caution, and never removes a purchase route.
 */

import {
  BANDS,
  INDIVIDUAL_PRICE_GBP,
  READINESS_QUESTIONS,
  type Band,
  type ProductKey,
} from "./questions";
import { THINKIFIC_SUPPORTS_PURCHASE_FOR_ANOTHER } from "./thinkific";

export type Q9 = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type Q10 = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type Q11Key =
  | "digital"
  | "digitalNamed"
  | "digitalDiscussion"
  | "facilitated"
  | "tailored"
  | "recommendMe";
export type Q11aKey = "customisation" | "confidential" | "advisory" | "unsuitable" | "uncertain";
export type Q12 = "now" | "30d" | "3m" | "6m" | "later" | "none";
export type Q13 = "approve" | "share" | "budget" | "sponsor" | "lead" | "research" | "none";
/** Priced context — shown only for Individual and Multiple digital access. */
export type Q14Priced = "card" | "invoice" | "po" | "download" | "review" | "notready";
/** Unpriced context — organisational, facilitated, tailored and unresolved routes. */
export type Q14Unpriced = "reviewoptions" | "decisionpack" | "proposal" | "discuss" | "notready2";
export type Q14 = Q14Priced | Q14Unpriced;

export type AuditState = {
  readiness: (number | null)[];
  q9: Q9 | null;
  q9a: "yes" | "no" | null;
  q10: Q10 | null;
  q11: Record<Q11Key, boolean>;
  q11a: Q11aKey[];
  q12: Q12 | null;
  q13: Q13 | null;
  q14: Q14 | null;
  /** Set when Q10 = H and the respondent chose "I still cannot estimate". */
  stillUncertain: boolean;
  /** Exact whole-number quantity for the 2–9 band. Null until valid. */
  exactQty: number | null;
};

export const emptyQ11: Record<Q11Key, boolean> = {
  digital: false,
  digitalNamed: false,
  digitalDiscussion: false,
  facilitated: false,
  tailored: false,
  recommendMe: false,
};

export const initialState = (): AuditState => ({
  readiness: Array(8).fill(null),
  q9: null,
  q9a: null,
  q10: null,
  q11: { ...emptyQ11 },
  q11a: [],
  q12: null,
  q13: null,
  q14: null,
  stillUncertain: false,
  exactQty: null,
});

/* ------------------------------------------------------------- Part A: score */

export const readinessTotal = (s: AuditState) =>
  s.readiness.reduce<number>((a, b) => a + (b ?? 0), 0);

export const bandFor = (score: number): Band => BANDS.find((b) => score <= b.max) ?? BANDS[3];

const dimsAt = (s: AuditState, target: number) =>
  READINESS_QUESTIONS.filter((_, i) => s.readiness[i] === target)
    .map((q) => q.dim)
    .join(" / ");

/** Ties are displayed jointly, never silently reduced to one dimension. */
export const strongestDimension = (s: AuditState) =>
  dimsAt(s, Math.max(...s.readiness.map((v) => v ?? 0)));
export const priorityDimension = (s: AuditState) =>
  dimsAt(s, Math.min(...s.readiness.map((v) => v ?? 0)));

/** Foundational-sequence caution. Advisory only — never blocks a purchase. */
export const showsScalingCaution = (s: AuditState) =>
  readinessTotal(s) <= 21 && ["E", "F", "G"].includes(String(s.q10));

/* ----------------------------------------------------------- Part B helpers */

export const digitalAccepted = (s: AuditState) =>
  s.q11.digital || s.q11.digitalNamed || s.q11.digitalDiscussion;

const q11aSubstantive = (s: AuditState) =>
  ["customisation", "confidential", "advisory", "unsuitable"].some((k) =>
    s.q11a.includes(k as Q11aKey),
  );
const q11aUncertainOnly = (s: AuditState) => s.q11a.includes("uncertain") && !q11aSubstantive(s);

type Baseline = { product: ProductKey | "unresolved" | "organisational-unresolved"; self?: boolean };

const baselineByQty = (qty: Q10 | null): Baseline => {
  if (qty === "A") return { product: "individual", self: true };
  if (qty === "B") return { product: "individual", self: false };
  if (qty === "C" || qty === "D") return { product: "multiple" };
  if (qty === "E" || qty === "F" || qty === "G") return { product: "organisational" };
  return { product: "unresolved" };
};

/** Rule 6 deterministic table (Q9 × Q10). Tailored is never reached here. */
const rule6Route = (q9: Q9 | null, qty: Q10 | null) => {
  const base = baselineByQty(qty);
  let alt: ProductKey | null = null;
  if (q9 === "B" || q9 === "D") {
    if (qty === "C" || qty === "D") base.product = "multiple";
    if (qty === "E" || qty === "F" || qty === "G") base.product = "organisational";
  }
  if (q9 === "C") {
    if (qty === "H") base.product = "organisational-unresolved";
    alt = "facilitated";
  }
  if (q9 === "E") {
    if (qty === "G") {
      base.product = "organisational";
      alt = "facilitated";
    }
    if (qty === "H") {
      base.product = "organisational-unresolved";
      alt = "facilitated";
    }
  }
  return { recommended: base, alternative: alt };
};

export type Route =
  | { type: "mismatch" }
  | { type: "generalInterest" }
  | {
      type: "rule2" | "rule3" | "rule4" | "rule5" | "unresolved";
      recommended: Baseline;
      alternative?: ProductKey | null;
    };

/** Part C — routing precedence. */
export function computeRoute(s: AuditState): Route {
  if (s.q9 === "F" && s.q9a === "no") return { type: "mismatch" };
  if (s.q9 === "G") return { type: "generalInterest" };

  const tailoredSelected = s.q11.tailored;
  const tailoredConfirmed = tailoredSelected && q11aSubstantive(s);
  const tailoredUncertainOnly = tailoredSelected && q11aUncertainOnly(s);

  if (tailoredConfirmed) {
    if (digitalAccepted(s) || s.q11.facilitated) {
      let alt: ProductKey;
      if (digitalAccepted(s)) {
        const b = baselineByQty(s.q10);
        // An unresolved quantity has no basis for committing to the
        // Organisational tier — the alternative stays tier-free.
        alt = b.product === "unresolved" ? "digitalUnresolved" : (b.product as ProductKey);
      } else {
        alt = "facilitated";
      }
      return { type: "rule5", recommended: { product: "tailored" }, alternative: alt };
    }
    return { type: "rule4", recommended: { product: "tailored" } };
  }

  const useRule6 = s.q11.recommendMe || tailoredUncertainOnly;

  let base: Baseline;
  let alt: ProductKey | null = null;

  if (useRule6 && !digitalAccepted(s) && !s.q11.facilitated) {
    const r = rule6Route(s.q9, s.q10);
    base = r.recommended;
    alt = r.alternative;
  } else if (digitalAccepted(s) && s.q11.facilitated) {
    base = baselineByQty(s.q10);
    alt = "facilitated";
  } else if (s.q11.facilitated && !digitalAccepted(s)) {
    return { type: "rule3", recommended: { product: "facilitated" } };
  } else {
    base = baselineByQty(s.q10);
  }

  if (base.product === "unresolved" || base.product === "organisational-unresolved") {
    return { type: "unresolved", recommended: base, alternative: alt };
  }
  return { type: alt ? "rule5" : "rule2", recommended: base, alternative: alt };
}

export type Classification =
  | "Technical-service mismatch"
  | "Not currently qualified"
  | "Individual purchaser"
  | "Ready to buy"
  | "Purchase under consideration"
  | "Early-stage organisational interest";

/** Part D — first match wins. */
export function classify(s: AuditState): Classification {
  if (s.q9 === "F" && s.q9a === "no") return "Technical-service mismatch";
  if (s.q9 === "G") return "Not currently qualified";
  if (s.q13 === "none" && s.q12 === "none") return "Not currently qualified";

  const route = computeRoute(s);
  if (
    (s.q10 === "A" || s.q10 === "B") &&
    "recommended" in route &&
    route.recommended.product === "individual"
  ) {
    return "Individual purchaser";
  }

  const soonRole = ["approve", "share", "budget", "sponsor"].includes(String(s.q13));
  const laterRole = soonRole || s.q13 === "lead";
  if ((s.q12 === "now" || s.q12 === "30d") && soonRole) return "Ready to buy";
  if (["now", "30d", "3m", "6m"].includes(String(s.q12)) && laterRole)
    return "Purchase under consideration";
  return "Early-stage organisational interest";
}

/* ---------------------------------------------------------- Part E: pricing */

export type PriceBlock = { total: string; note?: string; needsExactQty?: boolean };

export function priceBlockFor(product: ProductKey, s: AuditState): PriceBlock | null {
  if (product === "individual") return { total: "£895 per digital place" };
  if (product === "multiple") {
    const n = s.exactQty;
    return {
      total: n
        ? `${n} × £895 = £${(n * INDIVIDUAL_PRICE_GBP).toLocaleString("en-GB")}`
        : "£895 per digital place",
      note: n
        ? "Reference total based on the quantity you confirmed."
        : "Enter the exact number of participants to calculate the reference total. Purchase, invoice and purchase-order actions remain unavailable until an exact whole number is entered.",
      needsExactQty: true,
    };
  }
  if (product === "digitalUnresolved") {
    return {
      total: "£895 per digital place (individual reference price — no total calculated)",
      note: "No tier is committed until a participant number is confirmed.",
    };
  }
  if (product === "organisational") {
    // No participant count is ever assumed, so no organisational figure is
    // calculated or presented anywhere in the audit.
    return {
      total:
        "Organisational investment: confirmed after participant scope and delivery requirements are established.",
      note: "No organisational price or quotation is generated by this audit.",
    };
  }
  if (product === "facilitated") {
    return {
      total:
        "Facilitated delivery investment: confirmed after participant scope and facilitation requirements are established.",
      note: "No facilitated-package price or quotation is generated by this audit.",
    };
  }
  if (product === "tailored") {
    return {
      total: "Investment: determined via written scoping",
      note: "No price is shown until scope is agreed.",
    };
  }
  return null;
}

/* -------------------------------------------------------------- Part F: CTAs */

export type ActionKind =
  | "thinkific" // verified Thinkific purchase — individual self-purchase only
  | "purchaseRequest" // multi-seat / organisational / facilitated purchase request
  | "invoice"
  | "po"
  | "info"
  | "scoping"
  | "proposal"
  | "call"
  | "email";

export type Action = {
  kind: ActionKind;
  label: string;
  /** Explanatory note rendered under the action. */
  note?: string;
  /** True when the action must stay non-submittable until an exact quantity exists. */
  requiresExactQty?: boolean;
};

export type CtaPlan = { primary: Action[]; secondary: Action[]; tertiary: Action[] };

const EMAIL_ACTION: Action = { kind: "email", label: "Email a specific question" };

type ActionSet = {
  purchase: Action | null;
  invoice: Action | null;
  po: Action | null;
  /** Written-proposal route. Offered on unpriced organisational routes only. */
  proposal?: Action | null;
  info: Action;
};

type ActionKeyName = "purchase" | "invoice" | "po" | "proposal" | "info";

/** Fixed presentation order for secondary actions. */
const ACTION_ORDER: ActionKeyName[] = ["purchase", "invoice", "po", "proposal", "info"];

function actionSetFor(product: ProductKey, s: AuditState): ActionSet {
  const needsQty = product === "multiple";

  if (product === "individual") {
    const isSelf = s.q10 !== "B";
    const info: Action = { kind: "info", label: "Request programme information" };
    if (isSelf) {
      return {
        purchase: {
          kind: "thinkific",
          label: "Enrol now",
          note: "Payment, account creation and programme access are completed in one step on the programme platform.",
        },
        invoice: { kind: "invoice", label: "Request invoice" },
        po: null,
        info,
      };
    }
    // Purchasing for a different named participant. The programme platform has
    // no verified purchaser-pays / other-participant-enrols route, so this is
    // handled as an invoiced arrangement rather than enrolling the purchaser.
    return {
      purchase: THINKIFIC_SUPPORTS_PURCHASE_FOR_ANOTHER
        ? { kind: "thinkific", label: "Purchase for another leader" }
        : {
            kind: "invoice",
            label: "Purchase for another leader",
            note: "So the place is registered to the nominated leader rather than to you, this is arranged by invoice. We confirm the participant's details and issue their access directly.",
          },
      invoice: { kind: "invoice", label: "Request invoice" },
      po: null,
      info,
    };
  }

  if (product === "multiple") {
    return {
      purchase: {
        kind: "purchaseRequest",
        label: "Purchase digital places",
        requiresExactQty: needsQty,
      },
      invoice: { kind: "invoice", label: "Request invoice", requiresExactQty: needsQty },
      po: { kind: "po", label: "Submit purchase order", requiresExactQty: needsQty },
      info: { kind: "info", label: "Request a decision summary" },
    };
  }

  // Organisational and facilitated delivery carry no published price, so no
  // card, invoice or purchase-order route is presented from the audit.
  if (product === "organisational") {
    return {
      purchase: { kind: "purchaseRequest", label: "Request organisational options" },
      invoice: null,
      po: null,
      proposal: { kind: "proposal", label: "Request a written proposal" },
      info: { kind: "info", label: "Request an internal decision pack" },
    };
  }

  if (product === "facilitated") {
    return {
      purchase: { kind: "purchaseRequest", label: "Discuss facilitated delivery" },
      invoice: null,
      po: null,
      proposal: { kind: "proposal", label: "Request a written proposal" },
      info: { kind: "info", label: "Request a decision pack" },
    };
  }

  if (product === "digitalUnresolved") {
    // Where the participant number was deliberately left open, the card is the
    // generic digital-access card: a decision pack, not a tier comparison.
    const label = s.stillUncertain
      ? classify(s) === "Not currently qualified"
        ? "Request programme information"
        : "Request a decision pack"
      : "Request the digital-access comparison";
    return { purchase: null, invoice: null, po: null, info: { kind: "info", label } };
  }

  return {
    purchase: null,
    invoice: null,
    po: null,
    info: { kind: "info", label: "Request programme information" },
  };
}

/**
 * Q14 → internal action key. Both the priced and the unpriced option sets map
 * onto the same conceptual keys, so CTA resolution is identical whichever
 * variant of the question the respondent actually saw.
 */
export const q14Key = (s: AuditState): ActionKeyName | "notready" => {
  const map: Record<Q14, ActionKeyName | "notready"> = {
    card: "purchase",
    invoice: "invoice",
    po: "po",
    download: "info",
    review: "info",
    notready: "notready",
    reviewoptions: "purchase",
    decisionpack: "info",
    proposal: "proposal",
    discuss: "purchase",
    notready2: "notready",
  };
  return s.q14 ? map[s.q14] : "purchase";
};

/**
 * True only when the settled route recommends a priced digital tier. Quantity
 * is always resolved before Q14 renders, so this is never evaluated against an
 * open participant number for the purpose of choosing the question variant.
 */
export function q14ContextIsPriced(s: AuditState): boolean {
  const route = computeRoute(s);
  if (!("recommended" in route)) return false;
  const product = route.recommended.product;
  return product === "individual" || product === "multiple";
}

export const q14OptionsFor = (s: AuditState) =>
  q14ContextIsPriced(s) ? Q14_PRICED_OPTIONS : Q14_UNPRICED_OPTIONS;

/**
 * A stored Q14 answer from the other context must never survive a change to an
 * earlier answer. Checked on every entry to the Q14 screen, in both directions.
 */
export const isQ14ValidForContext = (s: AuditState): boolean =>
  s.q14 !== null && q14OptionsFor(s).some(([value]) => value === s.q14);

/** Part F — classification decides the category; Q14 the transaction type. */
export function buildCtaPlan(product: ProductKey, s: AuditState): CtaPlan {
  const classification = classify(s);
  const key = q14Key(s);

  if (product === "tailored") {
    // "Not ready" suppresses the scoping, proposal and conversation routes too.
    if (key === "notready") {
      return {
        primary: [{ kind: "info", label: "Request programme information" }],
        secondary: [],
        tertiary: [EMAIL_ACTION],
      };
    }
    if (classification === "Not currently qualified") {
      return {
        primary: [{ kind: "info", label: "Request programme information" }],
        secondary: [],
        tertiary: [],
      };
    }
    // The only place in the entire audit where a conversation is offered.
    return {
      primary: [{ kind: "scoping", label: "Complete scoping form" }],
      secondary: [{ kind: "proposal", label: "Request written proposal" }],
      tertiary: [
        {
          kind: "call",
          label: "Still unable to determine the right route? Book a scoping conversation",
        },
      ],
    };
  }

  const set = actionSetFor(product, s);

  if (classification === "Not currently qualified") {
    return { primary: [set.info], secondary: [], tertiary: [EMAIL_ACTION] };
  }

  const resolvePurchaseAction = (): Action | null => {
    if (key === "notready") return null;
    if (key === "info") return set.purchase;
    return set[key] ?? set.purchase;
  };

  if (classification === "Purchase under consideration") {
    const purchase = resolvePurchaseAction();
    return {
      primary: [set.info],
      secondary: purchase ? [purchase] : [],
      tertiary: [EMAIL_ACTION],
    };
  }

  if (classification === "Early-stage organisational interest") {
    const purchase = resolvePurchaseAction();
    const tertiary = purchase
      ? [{ ...purchase, label: `${purchase.label} — available` }, EMAIL_ACTION]
      : [EMAIL_ACTION];
    return { primary: [set.info], secondary: [], tertiary };
  }

  // Ready to buy, and the Individual/Multiple purchaser cases: Q14 governs.
  // A stated preference is never overridden by the classification.
  if (key === "notready") {
    return { primary: [set.info], secondary: [], tertiary: [EMAIL_ACTION] };
  }
  let primaryKey: ActionKeyName = key;
  if (!set[primaryKey]) primaryKey = "purchase";
  if (!set[primaryKey]) primaryKey = "info";
  const primary = set[primaryKey] as Action;
  const others = ACTION_ORDER.filter((k) => k !== primaryKey && set[k]).map(
    (k) => set[k] as Action,
  );
  return { primary: [primary], secondary: others, tertiary: [EMAIL_ACTION] };
}


/** Part L — transaction actions stay non-submittable without an exact quantity. */
export function isActionBlocked(action: Action, s: AuditState): boolean {
  return Boolean(action.requiresExactQty) && !isExactQtyValid(s.exactQty);
}

export const isExactQtyValid = (n: number | null): boolean =>
  n !== null && Number.isInteger(n) && n >= 2 && n <= 9;

/** Resolved quantity carried into any downstream record. Never inferred. */
export function resolvedQuantity(s: AuditState): number | null {
  if (s.q10 === "A" || s.q10 === "B") return 1;
  if (s.q10 === "C" || s.q10 === "D") return isExactQtyValid(s.exactQty) ? s.exactQty : null;
  return null;
}
