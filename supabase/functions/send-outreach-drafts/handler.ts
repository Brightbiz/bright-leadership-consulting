// Core sending logic for ELM outreach, structured for testing.
// All database and provider access is injected so tests can run with
// in-memory fakes and simulated provider responses (no real sends).

export const SENDER = "Bright Leadership Consulting <info@brightleadershipconsulting.com>";
export const REPLY_TO = "info@brightleadershipconsulting.com";
// Designated test address, enforced server-side. Test mode can only ever
// send here; production recipients are never selected in test mode.
export const TEST_ADDRESS = "aguns70418@aol.com";

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Production design (on-hold/email-design/outreach-production-draft.html),
// personalised per recipient. Footer block now carries Irene A. Agunbiade's
// name and role (incident-record requirement before any future batch).
export const TEMPLATE = `<!DOCTYPE html>
<html lang='en'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Executive Leadership Mastery</title>
<style>body{margin:0;background:#F5F6F8;color:#1F1F1F}table{border-collapse:collapse}p{margin:0 0 18px}h1,h2{font-family:Georgia,serif;font-weight:normal}@media(max-width:480px){.body-copy,.headline{padding-left:20px!important;padding-right:20px!important}.headline h1{font-size:28px!important;line-height:36px!important}}</style></head>
<body>
<div style='display:none;max-height:0;overflow:hidden;mso-hide:all'>13 minutes on judgement, accountability, and influence and execution. Watch on demand, without registration.</div>
<table role='presentation' width='100%'><tr><td align='center' style='padding:24px 12px;background:#F5F6F8'><table role='presentation' width='600' style='width:100%;max-width:600px;background:#FFFFFF'>
<tr><td style='padding:18px 28px;border-bottom:3px solid #C2A24D'><img src='https://brightleadershipconsulting.com/__l5e/assets-v1/33a5fb57-aa25-4ad5-ae0b-153dfe22b9e1/bright-burgundy-navy.png' width='280' height='108' alt='Bright Leadership Consulting' style='display:block;width:280px;max-width:100%;height:auto;border:0'></td></tr>
<tr><td style='padding:0;background:#0B1D3B'><img src='https://brightleadershipconsulting.com/__l5e/assets-v1/fa260a2a-3782-4bf1-8b7c-fb8f762e73c3/glass-prism-test.jpg' width='600' height='300' alt='A clear glass prism with burgundy and gold light' style='display:block;width:100%;max-width:600px;height:auto;border:0'></td></tr>
<tr><td class='headline' style='padding:22px 28px 24px;background:#FFFFFF'><p style='margin:0 0 10px;font:bold 12px/18px Arial,Helvetica,sans-serif;color:#8B1E3F'>EXECUTIVE DEVELOPMENT &middot; OPEN WEBINAR</p><h1 style='margin:0 0 12px;font-size:32px;line-height:40px;color:#0B1D3B;font-family:Georgia,serif;font-weight:normal'>Has their leadership<br>kept pace with their role?</h1><p style='margin:0 0 6px;font:bold 20px/29px Georgia,serif;color:#8B1E3F'>Executive Leadership Mastery</p><p style='margin:0;font:15px/25px Arial,Helvetica,sans-serif;color:#1F1F1F'>For experienced and aspiring senior leaders.</p></td></tr>
<tr><td class='body-copy' style='padding:8px 28px 28px;font:16px/27px Arial,Helvetica,sans-serif;color:#1F1F1F'><p>Dear {{FIRST_NAME}},</p><p>As {{ROLE}} at {{COMPANY}}, you may find Bright's Executive Leadership Mastery webinar relevant to the development of your senior leaders.</p><h2 style='margin:0 0 12px;font-size:23px;line-height:32px;color:#8B1E3F;font-family:Georgia,serif;font-weight:normal'>Three disciplines for senior leadership</h2><p>Explore judgement, accountability, and influence and execution.</p><table role='presentation' width='100%'><tr><td style='padding:14px 16px;background:#F5F6F8;border-left:3px solid #C2A24D;font-size:14px;line-height:23px;color:#0B1D3B'>13-minute webinar &middot; Watch on demand &middot; No registration</td></tr></table><table role='presentation' style='margin-top:22px'><tr><td style='background:#8B1E3F;text-align:center'><a href='https://brightleadershipconsulting.com/executive-leadership-mastery/webinar?utm_source=email&utm_medium=cold_outreach&utm_campaign=elm_cold_outreach_oct26' style='display:inline-block;padding:15px 26px;font:bold 16px/22px Arial,Helvetica,sans-serif;color:#FFFFFF;text-decoration:none'>View the webinar</a></td></tr></table></td></tr>
<tr><td class='body-copy' style='padding:28px;background:#F5F6F8;border-top:3px solid #8B1E3F;border-bottom:1px solid #E2E5EA;font:16px/27px Arial,Helvetica,sans-serif;color:#1F1F1F'><p style='font-size:12px;line-height:18px;font-weight:bold;color:#8B1E3F'>THE PROGRAMME</p><h2 style='margin:0 0 12px;font-size:23px;line-height:32px;color:#0B1D3B;font-family:Georgia,serif;font-weight:normal'>Employer-funded enrolment</h2><p>Executive Leadership Mastery is CPD-accredited through The CPD Standards Office.</p><p>If your organisation is considering funding a place, we can send the fee, invoicing terms and details of what the participant receives.</p><p>Reply to this email, or:</p><a href='https://brightleadershipconsulting.com/contact?enquiry=elm_employer_funded&utm_source=email&utm_medium=cold_outreach&utm_campaign=elm_cold_outreach_oct26' style='color:#8B1E3F;font-weight:bold'>Request employer-funded enrolment information</a></td></tr>
<tr><td class='body-copy' style='padding:28px;font:15px/25px Arial,Helvetica,sans-serif;color:#1F1F1F'><p>Kind regards,</p><p style='margin:0 0 4px;font-weight:bold;color:#0B1D3B'>Irene A. Agunbiade</p><p style='margin:0'>Principal Consultant<br>Bright Leadership Consulting</p></td></tr>
<tr><td style='padding:28px;background:#0B1D3B;border-top:3px solid #C2A24D;font:12px/20px Arial,Helvetica,sans-serif;color:#FFFFFF'><p style='margin:0 0 4px;font:bold 19px/27px Georgia,serif'>Bright Leadership Consulting</p><p style='margin:0 0 14px'>Irene A. Agunbiade &middot; Principal Consultant</p><p style='margin:0 0 18px'>Correspondence address:<br>82 James Carter Road, Mildenhall, England, IP28 7DE<br><a href='mailto:info@brightleadershipconsulting.com' style='color:#FFFFFF;word-break:break-word'>info@brightleadershipconsulting.com</a></p><p style='margin:0;padding-top:18px;border-top:1px solid #C2A24D'>I came across your details through Apollo, a business contact database, and am contacting you in your professional role. If you would prefer not to hear from me, simply reply and I will not contact you again. You can read how we handle your details at <a href='https://brightleadershipconsulting.com/privacy' style='color:#FFFFFF;word-break:break-word'>brightleadershipconsulting.com/privacy</a>.</p></td></tr>
</table></td></tr></table>
</body></html>`;

// Plain-text fallback. Values are inserted RAW here (no HTML escaping) —
// the 10 October incident defect was "&amp;" appearing in job titles.
export const TEXT_FALLBACK = `Dear {{FIRST_NAME}},

As {{ROLE}} at {{COMPANY}}, you may find Bright's Executive Leadership Mastery webinar relevant to the development of your senior leaders.

Three disciplines for senior leadership: judgement, accountability, and influence and execution.

13-minute webinar. Watch on demand. No registration:
https://brightleadershipconsulting.com/executive-leadership-mastery/webinar?utm_source=email&utm_medium=cold_outreach&utm_campaign=elm_cold_outreach_oct26

Employer-funded enrolment: Executive Leadership Mastery is CPD-accredited through The CPD Standards Office. If your organisation is considering funding a place, we can send the fee, invoicing terms and details of what the participant receives. Reply to this email, or request employer-funded enrolment information:
https://brightleadershipconsulting.com/contact?enquiry=elm_employer_funded&utm_source=email&utm_medium=cold_outreach&utm_campaign=elm_cold_outreach_oct26

Kind regards,
Irene A. Agunbiade
Principal Consultant
Bright Leadership Consulting

Bright Leadership Consulting — Irene A. Agunbiade, Principal Consultant
Correspondence address: 82 James Carter Road, Mildenhall, England, IP28 7DE
info@brightleadershipconsulting.com

I came across your details through Apollo, a business contact database, and am contacting you in your professional role. If you would prefer not to hear from me, simply reply and I will not contact you again. You can read how we handle your details at https://brightleadershipconsulting.com/privacy`;

// Hash of the exact sending content. Approvals are bound to this hash, so
// any change to the template or text invalidates every outstanding approval.
export async function contentHash(): Promise<string> {
  const data = new TextEncoder().encode(TEMPLATE + "\n---TEXT---\n" + TEXT_FALLBACK);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface DraftRow {
  id: string;
  subject: string;
  recipient_name: string | null;
  recipient_role: string | null;
  company: string | null;
  email: string | null; // joined from outreach_recipients
}

export interface ApprovalRow {
  id: string;
  recipient_draft_ids: string[];
  content_hash: string;
  sender: string;
  max_count: number;
  expires_at: string;
  used_at: string | null;
  // draft id -> draftFingerprint() at approval time
  recipient_fingerprints: Record<string, string> | null;
}

// Per-recipient fingerprint: subject, address and every merge field. Must
// match public.outreach_draft_fingerprint() in the database exactly.
export async function draftFingerprint(d: DraftRow): Promise<string> {
  const canonical = [
    d.subject ?? "",
    (d.email ?? "").replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "").toLowerCase(),
    d.recipient_name ?? "",
    d.recipient_role ?? "",
    d.company ?? "",
  ].join("\u001f");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface SendResult {
  ok: boolean;
  status?: number;
  messageId?: string | null;
  error?: string;
}

export interface SendDeps {
  listEligibleDrafts(): Promise<DraftRow[]>;
  listSuppressedEmails(): Promise<string[]>;
  getApproval(id: string): Promise<ApprovalRow | null>;
  // Atomically marks the approval used; returns false if already used.
  claimApproval(id: string): Promise<boolean>;
  // Atomically moves one draft unsent -> claimed; returns false if taken.
  claimDraft(id: string, runId: string): Promise<boolean>;
  markDraft(id: string, runId: string, fields: Record<string, unknown>): Promise<void>;
  sendEmail(input: { to: string; subject: string; html: string; text: string; idempotencyKey: string }): Promise<SendResult>;
  sleep(ms: number): Promise<void>;
  now(): Date;
}

export interface BatchReport {
  mode: "batch" | "test";
  ok: boolean;
  error?: string;
  total?: number;
  sent?: number;
  results?: Array<{ id: string; to: string; sent: boolean; state?: string; error?: string }>;
}

const personalise = (template: string, draft: DraftRow, escape: (v: string) => string) => {
  const firstName = escape(((draft.recipient_name || "").trim().split(/\s+/)[0]) || "there");
  const role = escape(draft.recipient_role || "your role");
  const company = escape(draft.company || "your organisation");
  return template
    .replaceAll("{{FIRST_NAME}}", firstName)
    .replaceAll("{{ROLE}}", role)
    .replaceAll("{{COMPANY}}", company);
};

// Isolated test mode: sends ONE personalised copy to the designated test
// address only. Never claims, marks or otherwise touches draft state, and
// never sends to a production recipient. Does not consume a batch approval.
export async function runTestSend(deps: SendDeps, draftId: string | null): Promise<BatchReport> {
  const drafts = await deps.listEligibleDrafts();
  const draft = draftId ? drafts.find((d) => d.id === draftId) : drafts[0];
  if (!draft) {
    return { mode: "test", ok: false, error: draftId ? "Draft not eligible" : "No eligible drafts" };
  }
  const html = personalise(TEMPLATE, draft, escapeHtml);
  const text = personalise(TEXT_FALLBACK, draft, (v) => v); // raw for plain text
  const res = await deps.sendEmail({
    to: TEST_ADDRESS, // enforced here; the draft's real recipient is never used
    subject: draft.subject,
    html,
    text,
    idempotencyKey: `elm-outreach-test-${draft.id}`,
  });
  return {
    mode: "test",
    ok: res.ok,
    total: 1,
    sent: res.ok ? 1 : 0,
    results: [{ id: draft.id, to: TEST_ADDRESS, sent: res.ok, error: res.error }],
  };
}

// Batch mode: every send requires a valid, unused, unexpired approval bound
// to the exact recipient list, content hash, sender and maximum count.
export async function runBatchSend(deps: SendDeps, approvalId: string | null): Promise<BatchReport> {
  if (!approvalId) {
    return { mode: "batch", ok: false, error: "Missing batch approval" };
  }
  const approval = await deps.getApproval(approvalId);
  if (!approval) return { mode: "batch", ok: false, error: "Approval not found" };
  if (approval.used_at) return { mode: "batch", ok: false, error: "Approval already used" };
  if (new Date(approval.expires_at).getTime() <= deps.now().getTime()) {
    return { mode: "batch", ok: false, error: "Approval expired" };
  }
  if (approval.sender !== SENDER) return { mode: "batch", ok: false, error: "Sender mismatch" };
  if (approval.content_hash !== (await contentHash())) {
    return { mode: "batch", ok: false, error: "Content changed since approval" };
  }

  const approvedIds = new Set(approval.recipient_draft_ids);
  const allEligible = await deps.listEligibleDrafts();
  // Only approved drafts may be sent; anything else eligible is left untouched.
  const drafts = allEligible.filter((d) => approvedIds.has(d.id));
  if (drafts.length === 0) return { mode: "batch", ok: false, error: "No approved drafts eligible" };
  if (drafts.length > approval.max_count) {
    return { mode: "batch", ok: false, error: `Eligible ${drafts.length} exceeds approved maximum ${approval.max_count}` };
  }

  // Subject, address and merge fields must be exactly as approved for every
  // draft; any change invalidates the whole batch before any send.
  const fps = approval.recipient_fingerprints;
  if (!fps || typeof fps !== "object") {
    return { mode: "batch", ok: false, error: "Approval has no recipient fingerprints" };
  }
  const changed: string[] = [];
  for (const d of drafts) {
    if (fps[d.id] !== (await draftFingerprint(d))) changed.push(d.id);
  }
  if (changed.length > 0) {
    return { mode: "batch", ok: false, error: `Recipient details changed since approval: ${changed.join(", ")}` };
  }

  // Consume the approval atomically before sending. If two calls race, only
  // one wins; the other stops here. A consumed approval can never be reused,
  // even if the batch later fails part-way.
  if (!(await deps.claimApproval(approvalId))) {
    return { mode: "batch", ok: false, error: "Approval already used" };
  }

  const suppressedSet = new Set(
    (await deps.listSuppressedEmails()).map((e) => e.trim().toLowerCase()),
  );

  const results: BatchReport["results"] = [];
  const runId = crypto.randomUUID();

  for (const draft of drafts) {
    const to = (draft.email || "").trim();
    if (!to) {
      results!.push({ id: draft.id, to: "", sent: false, error: "No recipient email" });
      continue;
    }

    if (!(await deps.claimDraft(draft.id, runId))) {
      results!.push({ id: draft.id, to, sent: false, error: "Already claimed" });
      continue;
    }
    const mark = (fields: Record<string, unknown>) => deps.markDraft(draft.id, runId, fields);

    if (suppressedSet.has(to.toLowerCase())) {
      await mark({ send_state: "suppressed" });
      results!.push({ id: draft.id, to, sent: false, state: "suppressed", error: "Suppressed" });
      continue;
    }

    const html = personalise(TEMPLATE, draft, escapeHtml);
    const text = personalise(TEXT_FALLBACK, draft, (v) => v); // raw for plain text

    const res = await deps.sendEmail({
      to,
      subject: draft.subject,
      html,
      text,
      idempotencyKey: `elm-outreach-${draft.id}`,
    });

    if (!res.ok) {
      // Definite validation rejections vs anything where acceptance is
      // uncertain (timeouts, 5xx): flag for reconciliation, never auto-resend.
      const definite = res.status !== undefined && [400, 401, 403, 422].includes(res.status);
      const state = definite ? "rejected" : "needs_reconciliation";
      await mark({ send_state: state, reconciliation_note: `${res.status ?? "network"}: ${(res.error || "").slice(0, 300)}` });
      results!.push({ id: draft.id, to, sent: false, state, error: res.error });
      continue;
    }

    const nowIso = deps.now().toISOString();
    await mark({
      status: "sent",
      sent_at: nowIso,
      send_state: res.messageId ? "accepted" : "needs_reconciliation",
      provider_message_id: res.messageId ?? null,
      provider_accepted_at: nowIso,
      delivery_status: "accepted_not_confirmed",
      reconciliation_note: res.messageId ? null : "Accepted without message ID",
    });
    results!.push({ id: draft.id, to, sent: true, state: "accepted" });
    await deps.sleep(1200);
  }

  const sentCount = results!.filter((r) => r.sent).length;
  return { mode: "batch", ok: true, total: results!.length, sent: sentCount, results };
}
