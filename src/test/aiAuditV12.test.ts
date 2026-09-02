import { describe, expect, it } from "vitest";
import {
  computeRoute,
  initialState,
  isQ14ValidForContext,
  priceBlockFor,
  q14ContextIsPriced,
  q14OptionsFor,
  type AuditState,
} from "@/data/aiAudit/logic";
import { Q14_PRICED_OPTIONS, Q14_UNPRICED_OPTIONS } from "@/data/aiAudit/questions";

const state = (over: Partial<AuditState>): AuditState =>
  ({ ...initialState(), ...over }) as AuditState;

describe("v12 Q14 context", () => {
  it("shows the priced set on individual and confirmed-multiple routes", () => {
    for (const q10 of ["A", "B", "C", "D"] as const) {
      const s = state({ q9: "A", q10 });
      expect(q14ContextIsPriced(s)).toBe(true);
      expect(q14OptionsFor(s)).toEqual(Q14_PRICED_OPTIONS);
    }
  });

  it("shows the unpriced set on organisational and unresolved routes", () => {
    for (const q10 of ["E", "F", "G"] as const) {
      const s = state({ q9: "A", q10 });
      expect(q14ContextIsPriced(s)).toBe(false);
      expect(q14OptionsFor(s)).toEqual(Q14_UNPRICED_OPTIONS);
    }
  });

  it("invalidates an answer carried across a context flip, in both directions", () => {
    expect(isQ14ValidForContext(state({ q9: "A", q10: "E", q14: "card" }))).toBe(false);
    expect(isQ14ValidForContext(state({ q9: "A", q10: "A", q14: "proposal" }))).toBe(false);
    expect(isQ14ValidForContext(state({ q9: "A", q10: "A", q14: "card" }))).toBe(true);
    expect(isQ14ValidForContext(state({ q9: "A", q10: "E", q14: "proposal" }))).toBe(true);
  });
});

describe("v12 pricing invariants", () => {
  it("never calculates an organisational or facilitated figure", () => {
    for (const product of ["organisational", "facilitated"] as const) {
      const block = priceBlockFor(product, state({ q10: "F" }));
      expect(block?.total).not.toMatch(/£/);
      expect(JSON.stringify(block)).not.toMatch(/×/);
    }
  });

  it("only totals a multiple-place route once an exact quantity is confirmed", () => {
    expect(priceBlockFor("multiple", state({}))?.total).toBe("£895 per digital place");
    expect(priceBlockFor("multiple", state({ exactQty: 4 }))?.total).toBe("4 × £895 = £3,580");
  });
});

describe("v12 routing", () => {
  it("treats an unknown team size as unresolved so quantity is settled before Q14", () => {
    expect(computeRoute(state({ q9: "A", q10: "H" })).type).toBe("unresolved");
    expect(computeRoute(state({ q9: "A", q10: "G" })).type).not.toBe("unresolved");
  });
});
