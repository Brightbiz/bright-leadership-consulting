import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * GA4 (G-FX0BYSEL34) must run alongside the Google Ads tag (AW-18382257167),
 * audit events must reach GA4 through real gtag('event', ...) calls, consent
 * defaults must be untouched, and no PII may be transmitted.
 */

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("index.html tag configuration", () => {
  it("does not load gtag.js or configure any Google tag before consent", () => {
    expect(html).not.toContain("<script async src=\"https://www.googletagmanager.com");
    expect(html).not.toContain("gtag('config'");
    expect(html).not.toContain("gtm.js");
  });

  it("keeps Consent Mode v2 defaults denied", () => {
    expect(html).toContain("gtag('consent', 'default'");
    for (const signal of [
      "ad_storage: 'denied'",
      "analytics_storage: 'denied'",
      "ad_user_data: 'denied'",
      "ad_personalization: 'denied'",
    ]) {
      expect(html).toContain(signal);
    }
  });
});

describe("consent-gated loading", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.head.querySelectorAll("script[src*='googletagmanager']").forEach((s) => s.remove());
    window.gtag = vi.fn() as unknown as Window["gtag"];
  });
  const scripts = () => document.head.querySelectorAll("script[src*='googletagmanager']").length;

  it("loads nothing before a choice or after rejection", async () => {
    const c = await import("@/lib/consent");
    c.applyStoredConsent();
    expect(scripts()).toBe(0);
    c.setConsent({ analytics: false, advertising: false });
    expect(scripts()).toBe(0);
  });

  it("analytics-only loads GA4 without Ads; withdrawal disables GA4", async () => {
    const c = await import("@/lib/consent");
    c.setConsent({ analytics: true, advertising: false });
    expect(scripts()).toBe(1);
    const calls = (window.gtag as unknown as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls.some((x) => x[0] === "config" && x[1] === "G-FX0BYSEL34")).toBe(true);
    expect(calls.some((x) => x[0] === "config" && x[1] === "AW-18382257167")).toBe(false);
    c.withdrawConsent();
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-FX0BYSEL34"]).toBe(true);
  });
});

describe("analytics transmission", () => {
  const gtag = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    gtag.mockClear();
    localStorage.clear();
    window.dataLayer = [];
    window.gtag = gtag as unknown as Window["gtag"];
  });
  const grant = async (analytics: boolean, advertising: boolean) => {
    const c = await import("@/lib/consent");
    c.setConsent({ analytics, advertising });
    gtag.mockClear();
  };

  it("sends every event to GA4 with gtag('event', ...) and to the dataLayer", async () => {
    await grant(true, false);
    const { trackEvent, GA4_MEASUREMENT_ID } = await import("@/lib/analytics");
    trackEvent("section_view", { section_name: "x" });
    expect(gtag).toHaveBeenCalledWith("event", "section_view", {
      section_name: "x",
      send_to: GA4_MEASUREMENT_ID,
    });
    expect(window.dataLayer).toEqual([{ event: "section_view", section_name: "x" }]);
  });

  it("sends no GA4 event without analytics consent", async () => {
    const { trackEvent } = await import("@/lib/analytics");
    trackEvent("section_view", { section_name: "x" });
    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends the Ads conversion only with advertising consent", async () => {
    await grant(false, true);
    const { reportEnquiryConversion } = await import("@/lib/analytics");
    reportEnquiryConversion();
    expect(gtag).toHaveBeenCalledWith("event", "conversion", {
      send_to: "AW-18382257167/6zYBCLOIr98cEI_4q71E",
    });
  });

  it("does not duplicate the initial page view into GA4", async () => {
    await grant(true, false);
    const { trackPageView } = await import("@/lib/analytics");
    trackPageView("/");
    expect(gtag).not.toHaveBeenCalled();
    trackPageView("/courses");
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "page_view",
      expect.objectContaining({ page_path: "/courses" }),
    );
  });
});

describe("audit events reach GA4", () => {
  const gtag = vi.fn();
  const AUDIT_EVENTS = [
    "ai_audit_start",
    "ai_audit_step_view",
    "ai_audit_result",
    "ai_audit_action_click",
    "ai_audit_outbound_checkout_click",
    "ai_audit_qualified_request",
  ];

  beforeEach(() => {
    gtag.mockClear();
    window.dataLayer = [];
    window.gtag = gtag as unknown as Window["gtag"];
  });

  async function emitAll() {
    vi.resetModules();
    localStorage.clear();
    (await import("@/lib/consent")).setConsent({ analytics: true, advertising: false });
    gtag.mockClear();
    vi.doMock("@/lib/auditSession", () => ({
      auditSessionId: () => "session-test",
      isStagingHost: () => false,
      isTestMode: () => true,
    }));
    const a = await import("@/lib/aiAuditAnalytics");
    a.trackAuditStart();
    a.trackAuditStepView("q14", 80);
    a.trackAuditResultView({
      score: 24,
      band: "Developing",
      classification: "individual",
      recommendedProduct: "digital",
      quantityResolved: true,
      q14: "card",
    });
    a.trackAuditActionClick({
      action: "card",
      label: "Reserve a digital place",
      product: "digital",
      classification: "individual",
      emphasis: "primary",
      quantity: 1,
      q14: "card",
    });
    a.trackAuditOutboundPurchase("https://example.test/checkout", "card");
    a.trackAuditRequestSubmitted("invoice", 4, { q14: "invoice" });
  }

  it("transmits all six audit events through gtag", async () => {
    await emitAll();
    const sent = gtag.mock.calls.filter((c) => c[0] === "event").map((c) => c[1]);
    for (const name of AUDIT_EVENTS) expect(sent).toContain(name);
  });

  it("preserves q14_value and omits it when Q14 is unanswered", async () => {
    await emitAll();
    const params = (name: string) =>
      gtag.mock.calls.find((c) => c[1] === name)?.[2] as Record<string, unknown>;
    expect(params("ai_audit_result").q14_value).toBe("card");
    expect(params("ai_audit_qualified_request").q14_value).toBe("invoice");
    expect(Object.keys(params("ai_audit_start"))).not.toContain("q14_value");
    expect(Object.keys(params("ai_audit_step_view"))).not.toContain("q14_value");
  });

  it("transmits no personally identifiable fields", async () => {
    await emitAll();
    const banned = ["email", "name", "organisation", "organization", "phone", "message", "notes"];
    for (const call of gtag.mock.calls) {
      const params = call[2] as Record<string, unknown> | undefined;
      for (const key of Object.keys(params ?? {})) {
        expect(banned).not.toContain(key.toLowerCase());
      }
    }
  });
});
