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
export type Q14 = "card" | "invoice" | "po" | "download" | "review" | "notready";

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
    if (s.q10 === "G") {
      return {
        total: "Reference calculation depends on confirmed team size.",
        note: "Organisational pricing has not yet been approved. Provide a participant count for an indicative reference calculation.",
      };
    }
    const illustrative = s.q10 === "F" ? 25 : 15;
    return {
      total: `Reference calculation: ${illustrative} × £895 individual digital price`,
      note: "Organisational pricing has not yet been approved. This reference is not a quotation or live offer.",
    };
  }
  if (product === "facilitated") {
    return {
      total: "Investment: to be confirmed via package selection",
      note: "Package pricing is not yet approved.",
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
  info: Action;
};

function actionSetFor(product: ProductKey, s: AuditState): ActionSet {
  const needsQty = product === "multiple";

  if (product === "individual") {
    const isSelf = s.q10 !== "B";
    if (isSelf) {
      return {
        purchase: {
          kind: "thinkific",
          label: "Enrol now",
          note: "Payment, account creation and programme access are completed in one step on the programme platform.",
        },
        invoice: { kind: "invoice", label: "Request invoice" },
        po: null,
        info: { kind: "info", label: "Download programme information" },
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
      info: { kind: "info", label: "Download programme information" },
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
      info: { kind: "info", label: "Download a decision summary" },
    };
  }

  if (product === "organisational") {
    return {
      purchase: { kind: "purchaseRequest", label: "Purchase organisational access" },
      invoice: { kind: "invoice", label: "Request invoice" },
      po: { kind: "po", label: "Submit purchase order" },
      info: { kind: "info", label: "Download the internal decision pack" },
    };
  }

  if (product === "facilitated") {
    return {
      purchase: { kind: "purchaseRequest", label: "Select / reserve package" },
      invoice: { kind: "invoice", label: "Request invoice" },
      po: { kind: "po", label: "Submit purchase order" },
      info: { kind: "info", label: "Download decision pack" },
    };
  }

  if (product === "digitalUnresolved") {
    return {
      purchase: null,
      invoice: null,
      po: null,
      info: { kind: "info", label: "Download the digital access comparison" },
    };
  }

  return {
    purchase: null,
    invoice: null,
    po: null,
    info: { kind: "info", label: "Download programme information" },
  };
}

const q14Key = (s: AuditState): "purchase" | "invoice" | "po" | "info" | "notready" => {
  const map = {
    card: "purchase",
    invoice: "invoice",
    po: "po",
    download: "info",
    review: "info",
    notready: "notready",
  } as const;
  return s.q14 ? map[s.q14] : "purchase";
};

/** Part F — classification decides the category; Q14 the transaction type. */
export function buildCtaPlan(product: ProductKey, s: AuditState): CtaPlan {
  const classification = classify(s);

  if (product === "tailored") {
    if (classification === "Not currently qualified") {
      return { primary: [{ kind: "info", label: "Download programme information" }], secondary: [], tertiary: [] };
    }
    // The only place in the entire audit where a call is offered, and always last.
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

  if (classification === "Individual purchaser" && product === "individual") {
    const secondary = [set.invoice, set.info].filter(Boolean) as Action[];
    // "Purchase for another leader" already routes via invoice, so the generic
    // invoice action is not duplicated beneath it.
    const deduped =
      set.purchase?.kind === "invoice" ? secondary.filter((a) => a.kind !== "invoice") : secondary;
    return {
      primary: set.purchase ? [set.purchase] : [set.info],
      secondary: deduped,
      tertiary: [EMAIL_ACTION],
    };
  }

  const key = q14Key(s);
  const resolvePurchaseAction = (): Action | null => {
    if (key === "notready") return null;
    if (key === "info") return set.purchase;
    return set[key];
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

  // Ready to buy (and anything not covered above): fully governed by Q14.
  if (key === "notready") {
    return { primary: [set.info], secondary: [], tertiary: [EMAIL_ACTION] };
  }
  let primaryKey: "purchase" | "invoice" | "po" | "info" = key;
  if (!set[primaryKey]) primaryKey = "purchase";
  if (!set[primaryKey]) primaryKey = "info";
  const primary = set[primaryKey] as Action;
  const others = (["purchase", "invoice", "po", "info"] as const)
    .filter((k) => k !== primaryKey && set[k])
    .map((k) => set[k] as Action);
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
