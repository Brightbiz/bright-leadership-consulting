import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The raw Q14 routing selection must reach analytics unchanged, as one
 * consistent property (q14_value), and must never appear on events emitted
 * before Q14 has been answered.
 */

const trackEvent = vi.fn();
const reportEnquiryConversion = vi.fn();

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEvent(...args),
  reportEnquiryConversion: () => reportEnquiryConversion(),
}));

vi.mock("@/lib/auditSession", () => ({
  auditSessionId: () => "session-test",
  isStagingHost: () => false,
  isTestMode: () => true,
}));

const PRICED = ["card", "invoice", "po", "download", "review", "notready"] as const;
const UNPRICED = ["reviewoptions", "decisionpack", "proposal", "discuss", "notready2"] as const;
const ALL = [...PRICED, ...UNPRICED];

async function fresh() {
  vi.resetModules();
  trackEvent.mockClear();
  reportEnquiryConversion.mockClear();
  return await import("@/lib/aiAuditAnalytics");
}

const paramsFor = (name: string) =>
  trackEvent.mock.calls.find((c) => c[0] === name)?.[1] as Record<string, unknown>;

describe("audit analytics q14_value", () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  it("records every priced and unpriced value unchanged on the result event", async () => {
    for (const q14 of ALL) {
      const a = await fresh();
      a.trackAuditResultView({
        score: 24,
        band: "Developing",
        classification: "individual",
        recommendedProduct: "digital",
        quantityResolved: true,
        q14,
      });
      expect(paramsFor("ai_audit_result").q14_value).toBe(q14);
    }
  });

  it("records the value on action clicks without disturbing existing fields", async () => {
    for (const q14 of ALL) {
      const a = await fresh();
      a.trackAuditActionClick({
        action: "invoice",
        label: "Request an invoice",
        product: "digital",
        classification: "organisational",
        emphasis: "primary",
        quantity: 6,
        q14,
      });
      const p = paramsFor("ai_audit_action_click");
      expect(p.q14_value).toBe(q14);
      expect(p.audit_action).toBe("invoice");
      expect(p.cta_label).toBe("Request an invoice");
      expect(p.recommended_product).toBe("digital");
      expect(p.buyer_classification).toBe("organisational");
      expect(p.participant_quantity).toBe(6);
    }
  });

  it("records the value on qualified requests", async () => {
    for (const q14 of ALL) {
      const a = await fresh();
      a.trackAuditRequestSubmitted("invoice", 4, { q14 });
      const p = paramsFor("ai_audit_qualified_request");
      expect(p.q14_value).toBe(q14);
      expect(p.request_type).toBe("invoice");
    }
  });

  it("records the value on the outbound checkout click", async () => {
    const a = await fresh();
    a.trackAuditOutboundPurchase("https://example.test/checkout", "card");
    const p = paramsFor("ai_audit_outbound_checkout_click");
    expect(p.q14_value).toBe("card");
    expect(p.destination_url).toBe("https://example.test/checkout");
  });

  it("omits the property entirely when Q14 has not been answered", async () => {
    const a = await fresh();
    a.trackAuditStart();
    a.trackAuditStepView("q11", 60);
    a.trackAuditResultView({
      score: 12,
      band: "Early",
      classification: "generalInterest",
      recommendedProduct: "none",
      quantityResolved: false,
      q14: null,
    });
    a.trackAuditOutboundPurchase("https://example.test/checkout");
    for (const name of [
      "ai_audit_start",
      "ai_audit_step_view",
      "ai_audit_result",
      "ai_audit_outbound_checkout_click",
    ]) {
      expect(Object.keys(paramsFor(name))).not.toContain("q14_value");
    }
  });
});
