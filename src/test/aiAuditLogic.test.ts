import { describe, expect, it } from "vitest";
import {
  buildCtaPlan,
  classify,
  computeRoute,
  initialState,
  isActionBlocked,
  isExactQtyValid,
  priceBlockFor,
  readinessTotal,
  bandFor,
  resolvedQuantity,
  type AuditState,
} from "@/data/aiAudit/logic";
import { INDIVIDUAL_PRICE_LABEL } from "@/data/aiAudit/questions";
import {
  THINKIFIC_SUPPORTS_PURCHASE_FOR_ANOTHER,
  buildThinkificPurchaseUrl,
} from "@/data/aiAudit/thinkific";

const state = (over: Partial<AuditState> = {}): AuditState => ({
  ...initialState(),
  readiness: [3, 3, 3, 3, 3, 3, 3, 3],
  ...over,
});

describe("readiness scoring", () => {
  it("spans 8 to 32 and bands accordingly", () => {
    expect(readinessTotal(state({ readiness: [1, 1, 1, 1, 1, 1, 1, 1] }))).toBe(8);
    expect(readinessTotal(state({ readiness: [4, 4, 4, 4, 4, 4, 4, 4] }))).toBe(32);
    expect(bandFor(8).title).not.toBe(bandFor(32).title);
    expect(bandFor(24).title).toBeTruthy();
  });
});

describe("Part C routing precedence", () => {
  it("Rule 1 — technical-only need with no leadership need is a mismatch", () => {
    const s = state({ q9: "F", q9a: "no" });
    expect(computeRoute(s).type).toBe("mismatch");
    expect(classify(s)).toBe("Technical-service mismatch");
  });

  it("general interest short-circuits before any product route", () => {
    expect(computeRoute(state({ q9: "G" })).type).toBe("generalInterest");
  });

  it("Rule 4 — confirmed tailored need with no other acceptable format", () => {
    const s = state({
      q9: "A",
      q10: "F",
      q11: { ...initialState().q11, tailored: true },
      q11a: ["confidential"],
    });
    const route = computeRoute(s);
    expect(route.type).toBe("rule4");
    expect("recommended" in route && route.recommended.product).toBe("tailored");
  });

  it("Rule 5 — tailored plus digital keeps digital as the alternative", () => {
    const s = state({
      q9: "A",
      q10: "C",
      q11: { ...initialState().q11, tailored: true, digital: true },
      q11a: ["customisation"],
    });
    const route = computeRoute(s);
    expect(route.type).toBe("rule5");
    expect("alternative" in route && route.alternative).toBe("multiple");
  });

  it("an unresolved participant count never commits a tier", () => {
    const s = state({ q9: "A", q10: "H", q11: { ...initialState().q11, digital: true } });
    expect(computeRoute(s).type).toBe("unresolved");
    expect(priceBlockFor("digitalUnresolved", s)?.total).toContain(INDIVIDUAL_PRICE_LABEL);
  });
});

describe("Part L — exact quantity gate for 2–9 places", () => {
  const s = (qty: number | null) =>
    state({ q9: "A", q10: "C", q11: { ...initialState().q11, digital: true }, exactQty: qty });

  it("rejects blank, fractional and out-of-range values", () => {
    expect(isExactQtyValid(null)).toBe(false);
    expect(isExactQtyValid(2.5)).toBe(false);
    expect(isExactQtyValid(1)).toBe(false);
    expect(isExactQtyValid(10)).toBe(false);
    expect(isExactQtyValid(4)).toBe(true);
  });

  it("blocks transaction actions until an exact whole number is entered", () => {
    const gatedBefore = buildCtaPlan("multiple", s(null))
      .primary.concat(buildCtaPlan("multiple", s(null)).secondary)
      .filter((a) => a.requiresExactQty);
    expect(gatedBefore.length).toBeGreaterThan(0);
    for (const action of gatedBefore) expect(isActionBlocked(action, s(null))).toBe(true);
    for (const action of gatedBefore) expect(isActionBlocked(action, s(6))).toBe(false);
  });

  it("carries the confirmed quantity into the downstream record", () => {
    expect(resolvedQuantity(s(null))).toBeNull();
    expect(resolvedQuantity(s(6))).toBe(6);
    expect(resolvedQuantity(state({ q10: "A" }))).toBe(1);
  });

  it("prices multiple places from the confirmed quantity only", () => {
    expect(priceBlockFor("multiple", s(null))?.total).toBe("£895 per digital place");
    expect(priceBlockFor("multiple", s(4))?.total).toContain("3,580");
  });
});

describe("purchase destination", () => {
  it("has no verified purchase-for-another flow, so B never buys directly", () => {
    expect(THINKIFIC_SUPPORTS_PURCHASE_FOR_ANOTHER).toBe(false);
    const s = state({ q9: "A", q10: "B", q11: { ...initialState().q11, digital: true } });
    const plan = buildCtaPlan("individual", s);
    expect([...plan.primary, ...plan.secondary].some((a) => a.kind === "thinkific")).toBe(false);
  });

  it("sends a self-purchasing buyer to the verified checkout with attribution only", () => {
    const s = state({ q9: "A", q10: "A", q11: { ...initialState().q11, digital: true } });
    expect(buildCtaPlan("individual", s).primary[0].kind).toBe("thinkific");
    const url = buildThinkificPurchaseUrl({ campaignSearch: "?utm_source=li&gclid=x" });
    expect(url).toContain("strategic-leadership-in-the-age-of-ai");
    expect(url).not.toMatch(/readiness|score|q9|q1[0-4]=/i);
  });
});
