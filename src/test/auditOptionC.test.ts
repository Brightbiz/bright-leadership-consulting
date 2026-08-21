import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Guards the approved Option C architecture for the AI Leadership Readiness Audit:
 *  - the buyer acknowledgement is the only email capable of being sent, and only
 *    behind BUYER_ACK_EMAILS_ENABLED, which must remain false;
 *  - the former internal operational and CRM-failure emails have no executable
 *    path anywhere in the repository;
 *  - the broad EMAILS_ENABLED flag no longer exists in executable code;
 *  - the administrative view is the authoritative operational channel.
 */

const emails = readFileSync("supabase/functions/_shared/auditEmails.ts", "utf8");
const submit = readFileSync("supabase/functions/submit-ai-audit/index.ts", "utf8");
const adminView = readFileSync("src/pages/AdminAuditRequests.tsx", "utf8");
const banner = readFileSync("src/components/admin/OutstandingActionsBanner.tsx", "utf8");

describe("email flags", () => {
  it("has no broad EMAILS_ENABLED flag in either edge-function module", () => {
    for (const source of [emails, submit]) {
      expect(/(^|[^_])\bEMAILS_ENABLED\b/m.test(source.replace(/BUYER_ACK_EMAILS_ENABLED/g, "X"))).toBe(
        false,
      );
    }
  });

  it("keeps BUYER_ACK_EMAILS_ENABLED as the single, disabled gate", () => {
    expect(emails).toContain("export const BUYER_ACK_EMAILS_ENABLED = false;");
    expect(emails.match(/BUYER_ACK_EMAILS_ENABLED/g)?.length).toBeGreaterThan(1);
  });

  it("exposes no internal or CRM-failure email builders or senders", () => {
    for (const banned of [
      "adminNotification",
      "crmFailureNotification",
      "deliverAdminNotification",
      "deliverCrmFailureNotification",
    ]) {
      expect(emails).not.toContain(banned);
      expect(submit).not.toContain(banned);
    }
  });

  it("only ever delivers the buyer acknowledgement", () => {
    const deliverCalls = submit.match(/deliver[A-Za-z]*\(/g) ?? [];
    expect(deliverCalls.every((c) => c.startsWith("deliverBuyerAcknowledgement("))).toBe(true);
    expect(deliverCalls.length).toBe(1);
  });

  it("addresses the buyer acknowledgement to the buyer only", () => {
    expect(emails).toMatch(/to:\s*r\.email/);
    expect(emails).not.toMatch(/to:\s*["'][^"']*@brightleadershipconsulting/);
  });

  it("records the internal notice as administrative-view only", () => {
    expect(submit).toContain('admin_notice_status: "admin_view_only"');
  });

  it("returns the buyer confirmation regardless of delivery outcome", () => {
    // The success payload is returned after the delivery attempt and is not
    // conditional on the resulting status.
    expect(submit).toMatch(/return json\(\{\s*\n?\s*ok: true/);
    expect(submit).not.toMatch(/if \(buyer === "failed"\)[\s\S]{0,80}return json\(\{ error/);
  });
});

describe("administrative operational channel", () => {
  it("tracks unactioned count, oldest age and CRM mirroring counts", () => {
    for (const label of [
      "Unactioned requests",
      "Oldest unactioned",
      "CRM pending",
      "CRM completed",
      "CRM failed",
    ]) {
      expect(adminView).toContain(label);
    }
  });

  it("records operator identity and timestamp when marking actioned", () => {
    expect(adminView).toContain("actioned_by_email: user?.email");
    expect(adminView).toContain("actioned_at: new Date().toISOString()");
    expect(adminView).toContain("crm_failure_ack_by_email: user?.email");
  });

  it("uses the security-definer retry rather than a client-side CRM write", () => {
    expect(adminView).toContain('rpc("retry_ai_audit_crm_mirror"');
    expect(adminView).not.toMatch(/from\("crm_contacts"\)/);
  });

  it("redirects unauthorised visitors away from the view", () => {
    expect(adminView).toContain('if (!user) return <Navigate to="/admin/login" replace />');
    expect(adminView).toContain('if (!isAdmin) return <Navigate to="/" replace />');
    // Records are only requested once admin status is confirmed.
    expect(adminView).toContain("if (isAdmin) void fetchRows();");
  });

  it("supports deep-linked needs-action and CRM-failed filters", () => {
    expect(adminView).toContain('filter === "needs-action"');
    expect(adminView).toContain('filter === "crm-failed"');
    expect(banner).toContain("/admin/audit-requests?filter=needs-action");
    expect(banner).toContain("/admin/audit-requests?filter=crm-failed");
  });
});
