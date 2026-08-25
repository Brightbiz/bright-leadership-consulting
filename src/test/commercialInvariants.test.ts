import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { programmes, individualEnquiryPath } from "@/data/programmes";
import {
  CPD_PROVIDER_NUMBER,
  CPD_ACCREDITATION_PERIOD,
  CPD_PROVIDER_STATEMENT,
  CPD_PARTICIPANT_STATEMENT,
  CPD_CERTIFICATE_SCOPE_NOTE,
} from "@/data/accreditation";
import {
  THINKIFIC_INDIVIDUAL_URL,
  THINKIFIC_SUPPORTS_PURCHASE_FOR_ANOTHER,
  buildThinkificPurchaseUrl,
} from "@/data/aiAudit/thinkific";
import { scoreBand } from "@/data/aiAudit/logic";

/**
 * Commercial invariants: the identity-correction work must leave programmes,
 * prices, CPD wording, routes, CTAs, audit logic and checkout untouched.
 */

const APPROVED_TITLES = [
  "Executive Leadership Mastery Programme",
  "Strategic Leadership in the Age of AI",
  "Strategic AI Leadership for Organisations",
  "Augmented Leadership™",
];

describe("programme catalogue", () => {
  it("contains exactly the four approved programmes", () => {
    expect(programmes.map((p) => p.title)).toEqual(APPROVED_TITLES);
  });

  it("keeps the Executive Leadership Mastery fee and CPD hours fixed", () => {
    const elm = programmes[0];
    expect(elm.individualFee).toBe("£1,297");
    expect(elm.cpdHours).toBe("50–66 CPD hours");
    expect(elm.detailPage).toBe("/executive-leadership-mastery");
  });

  it("prices exclusively in GBP", () => {
    for (const p of programmes) {
      const money = [p.individualFee, p.paymentPlanSummary, p.paymentPlanDetail]
        .filter(Boolean)
        .join(" ");
      if (money) expect(money).toMatch(/£/);
      expect(money).not.toMatch(/[$€]/);
    }
  });

  it("routes individual enrolment through the in-site enquiry path", () => {
    for (const p of programmes) {
      expect(p.enrolmentAvailable).not.toBe(true);
      expect(p.link).toBe(individualEnquiryPath(p.title));
    }
  });
});

describe("CPD wording", () => {
  it("keeps provider number and accreditation period fixed", () => {
    expect(CPD_PROVIDER_NUMBER).toBe("50838");
    expect(CPD_ACCREDITATION_PERIOD).toBe("2025–2026");
    expect(CPD_PROVIDER_STATEMENT).toContain("The CPD Standards Office");
    expect(CPD_PARTICIPANT_STATEMENT).toContain("CPDSO Certificate of Attendance");
  });

  it("never describes the certificate as a qualification or certification", () => {
    expect(CPD_CERTIFICATE_SCOPE_NOTE).toMatch(
      /not a qualification, professional certification or academic award/
    );
    expect(CPD_PROVIDER_STATEMENT).not.toMatch(/\bcertification\b/i);
  });
});

describe("audit checkout", () => {
  it("keeps the verified £895 Thinkific destination and attribution-only params", () => {
    expect(THINKIFIC_INDIVIDUAL_URL).toBe(
      "https://bright-leadership-consulting.thinkific.com/products/courses/strategic-leadership-in-the-age-of-ai"
    );
    expect(THINKIFIC_SUPPORTS_PURCHASE_FOR_ANOTHER).toBe(false);

    const url = new URL(buildThinkificPurchaseUrl());
    expect(url.searchParams.get("utm_source")).toBe("brightleadershipconsulting");
    expect(url.searchParams.get("utm_campaign")).toBe("ai_leadership_readiness_audit");
    for (const leak of ["score", "band", "email", "name", "organisation"]) {
      expect(url.search).not.toContain(leak);
    }
  });
});

describe("audit scoring", () => {
  it("keeps the 8–32 band boundaries unchanged", () => {
    expect(scoreBand(8)).toBe(scoreBand(13));
    expect(scoreBand(8)).not.toBe(scoreBand(32));
    expect(typeof scoreBand(24)).toBe("string");
  });
});

describe("/ai-audit staging controls", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  const auditPage = readFileSync("src/pages/AiAudit.tsx", "utf8");

  it("stays out of the sitemap", () => {
    expect(sitemap).not.toContain("/ai-audit");
  });

  it("keeps noindex, nofollow", () => {
    expect(auditPage).toMatch(/noindex/);
    expect(auditPage).toMatch(/nofollow/);
  });
});

describe("primary CTA", () => {
  it("still reads 'Discuss Executive Alignment' in the footer", () => {
    expect(readFileSync("src/components/Footer.tsx", "utf8")).toContain(
      "Discuss Executive Alignment"
    );
  });
});
