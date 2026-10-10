// One-shot sender for the approved ELM outreach drafts (admin Outreach tab).
// Sends every outreach_drafts row with status 'draft' (initial emails only,
// never follow-ups) to the linked outreach_recipients email address, using
// the approved production design, then marks the draft sent. Idempotent:
// once a draft is marked sent it is never picked up again.
//
// Invoked by a single pg_cron job (Tuesday 13 October 2026, 09:30 UTC /
// 10:30 London) and protected by a shared secret header. No anon access.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Approved production design (on-hold/email-design/outreach-production-draft.html),
// with the greeting and role/company line personalised per recipient.
const TEMPLATE = `<!DOCTYPE html>
<html lang='en'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Executive Leadership Mastery</title>
<style>body{margin:0;background:#F5F6F8;color:#1F1F1F}table{border-collapse:collapse}p{margin:0 0 18px}h1,h2{font-family:Georgia,serif;font-weight:normal}@media(max-width:480px){.body-copy,.headline{padding-left:20px!important;padding-right:20px!important}.headline h1{font-size:28px!important;line-height:36px!important}}</style></head>
<body>
<div style='display:none;max-height:0;overflow:hidden;mso-hide:all'>13 minutes on judgement, accountability, and influence and execution. Watch on demand, without registration.</div>
<table role='presentation' width='100%'><tr><td align='center' style='padding:24px 12px;background:#F5F6F8'><table role='presentation' width='600' style='width:100%;max-width:600px;background:#FFFFFF'>
<tr><td style='padding:18px 28px;border-bottom:3px solid #C2A24D'><img src='https://brightleadershipconsulting.com/__l5e/assets-v1/33a5fb57-aa25-4ad5-ae0b-153dfe22b9e1/bright-burgundy-navy.png' width='280' height='108' alt='Bright Leadership Consulting' style='display:block;width:280px;max-width:100%;height:auto;border:0'></td></tr>
<tr><td style='padding:0;background:#0B1D3B'><img src='https://brightleadershipconsulting.com/__l5e/assets-v1/fa260a2a-3782-4bf1-8b7c-fb8f762e73c3/glass-prism-test.jpg' width='600' height='300' alt='A clear glass prism with burgundy and gold light' style='display:block;width:100%;max-width:600px;height:auto;border:0'></td></tr>
<tr><td class='headline' style='padding:22px 28px 24px;background:#FFFFFF'><p style='margin:0 0 10px;font:bold 12px/18px Arial,Helvetica,sans-serif;color:#8B1E3F'>EXECUTIVE DEVELOPMENT &middot; OPEN WEBINAR</p><h1 style='margin:0 0 12px;font-size:32px;line-height:40px;color:#0B1D3B;font-family:Georgia,serif;font-weight:normal'>Has their leadership<br>kept pace with their role?</h1><p style='margin:0 0 6px;font:bold 20px/29px Georgia,serif;color:#8B1E3F'>Executive Leadership Mastery</p><p style='margin:0;font:15px/25px Arial,Helvetica,sans-serif;color:#1F1F1F'>For experienced and aspiring senior leaders.</p></td></tr>
<tr><td class='body-copy' style='padding:8px 28px 28px;font:16px/27px Arial,Helvetica,sans-serif;color:#1F1F1F'><p>Dear {{FIRST_NAME}},</p><p>As {{ROLE}} at {{COMPANY}}, you may find Bright's Executive Leadership Mastery webinar relevant to the development of your senior leaders.</p><h2 style='margin:0 0 12px;font-size:23px;line-height:32px;color:#8B1E3F;font-family:Georgia,serif;font-weight:normal'>Three disciplines for senior leadership</h2><p>Explore judgement, accountability, and influence and execution.</p><table role='presentation' width='100%'><tr><td style='padding:14px 16px;background:#F5F6F8;border-left:3px solid #C2A24D;font-size:14px;line-height:23px;color:#0B1D3B'>13-minute webinar &middot; Watch on demand &middot; No registration</td></tr></table><table role='presentation' style='margin-top:22px'><tr><td style='background:#8B1E3F;text-align:center'><a href='https://brightleadershipconsulting.com/executive-leadership-mastery/webinar' style='display:inline-block;padding:15px 26px;font:bold 16px/22px Arial,Helvetica,sans-serif;color:#FFFFFF;text-decoration:none'>View the webinar</a></td></tr></table></td></tr>
<tr><td class='body-copy' style='padding:28px;background:#F5F6F8;border-top:3px solid #8B1E3F;border-bottom:1px solid #E2E5EA;font:16px/27px Arial,Helvetica,sans-serif;color:#1F1F1F'><p style='font-size:12px;line-height:18px;font-weight:bold;color:#8B1E3F'>THE PROGRAMME</p><h2 style='margin:0 0 12px;font-size:23px;line-height:32px;color:#0B1D3B;font-family:Georgia,serif;font-weight:normal'>Employer-funded enrolment</h2><p>Executive Leadership Mastery is CPD-accredited through The CPD Standards Office.</p><p>If your organisation is considering funding a place, we can send the fee, invoicing terms and details of what the participant receives.</p><p>Reply to this email, or:</p><a href='https://brightleadershipconsulting.com/contact?enquiry=elm_employer_funded' style='color:#8B1E3F;font-weight:bold'>Request employer-funded enrolment information</a></td></tr>
<tr><td class='body-copy' style='padding:28px;font:15px/25px Arial,Helvetica,sans-serif;color:#1F1F1F'><p>Kind regards,</p><p style='margin:0 0 4px;font-weight:bold;color:#0B1D3B'>Irene A. Agunbiade</p><p style='margin:0'>Principal Consultant<br>Bright Leadership Consulting</p></td></tr>
<tr><td style='padding:28px;background:#0B1D3B;border-top:3px solid #C2A24D;font:12px/20px Arial,Helvetica,sans-serif;color:#FFFFFF'><p style='margin:0 0 14px;font:bold 19px/27px Georgia,serif'>Bright Leadership Consulting</p><p style='margin:0 0 18px'>Correspondence address:<br>82 James Carter Road, Mildenhall, England, IP28 7DE<br><a href='mailto:info@brightleadershipconsulting.com' style='color:#FFFFFF;word-break:break-word'>info@brightleadershipconsulting.com</a></p><p style='margin:0;padding-top:18px;border-top:1px solid #C2A24D'>I came across your details through Apollo, a business contact database, and am contacting you in your professional role. If you would prefer not to hear from me, simply reply and I will not contact you again. You can read how we handle your details at <a href='https://brightleadershipconsulting.com/privacy' style='color:#FFFFFF;word-break:break-word'>brightleadershipconsulting.com/privacy</a>.</p></td></tr>
</table></td></tr></table>
</body></html>`;

const TEXT_FALLBACK = `Dear {{FIRST_NAME}},

As {{ROLE}} at {{COMPANY}}, you may find Bright's Executive Leadership Mastery webinar relevant to the development of your senior leaders.

Three disciplines for senior leadership: judgement, accountability, and influence and execution.

13-minute webinar. Watch on demand. No registration:
https://brightleadershipconsulting.com/executive-leadership-mastery/webinar

Employer-funded enrolment: Executive Leadership Mastery is CPD-accredited through The CPD Standards Office. If your organisation is considering funding a place, we can send the fee, invoicing terms and details of what the participant receives. Reply to this email, or request employer-funded enrolment information:
https://brightleadershipconsulting.com/contact?enquiry=elm_employer_funded

Kind regards,
Irene A. Agunbiade
Principal Consultant
Bright Leadership Consulting

Correspondence address: 82 James Carter Road, Mildenhall, England, IP28 7DE
info@brightleadershipconsulting.com

I came across your details through Apollo, a business contact database, and am contacting you in your professional role. If you would prefer not to hear from me, simply reply and I will not contact you again. You can read how we handle your details at https://brightleadershipconsulting.com/privacy`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const secrets = [Deno.env.get("OUTREACH_CRON_KEY"), Deno.env.get("OUTREACH_CRON_KEY_2")].filter(Boolean);
  const provided = req.headers.get("X-Outreach-Secret");
  if (secrets.length === 0 || !provided || !secrets.includes(provided)) {
    return new Response(JSON.stringify({ error: "Unauthorised" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Resend credentials not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: drafts, error } = await supabase
    .from("outreach_drafts")
    .select("id, subject, recipient_name, recipient_role, company, recipient_id, outreach_recipients(email)")
    .eq("status", "draft")
    .eq("is_follow_up", false);

  if (error) {
    console.error("Failed to load drafts:", error);
    return new Response(JSON.stringify({ error: "Could not load drafts" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: suppressed, error: suppErr } = await supabase
    .from("outreach_suppressions")
    .select("email");
  if (suppErr) {
    console.error("Failed to load suppression list:", suppErr);
    return new Response(JSON.stringify({ error: "Could not load suppression list" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const suppressedSet = new Set((suppressed ?? []).map((s: { email: string }) => s.email.trim().toLowerCase()));

  const results: Array<{ id: string; to: string; sent: boolean; state?: string; error?: string }> = [];
  const runId = crypto.randomUUID();

  for (const draft of drafts ?? []) {
    const to = (draft.outreach_recipients as { email: string | null } | null)?.email;
    if (!to) {
      results.push({ id: draft.id, to: "", sent: false, error: "No recipient email" });
      continue;
    }

    // Atomic claim: only one execution can move a row from unsent -> claimed.
    const { data: claimed, error: claimErr } = await supabase
      .from("outreach_drafts")
      .update({ send_state: "claimed", send_claim_id: runId, send_claimed_at: new Date().toISOString() })
      .eq("id", draft.id)
      .eq("status", "draft")
      .eq("send_state", "unsent")
      .select("id");
    if (claimErr || !claimed || claimed.length !== 1) {
      results.push({ id: draft.id, to, sent: false, error: claimErr ? "Claim error" : "Already claimed" });
      continue;
    }
    const mark = (fields: Record<string, unknown>) =>
      supabase.from("outreach_drafts").update(fields).eq("id", draft.id).eq("send_claim_id", runId);

    if (suppressedSet.has(to.trim().toLowerCase())) {
      await mark({ send_state: "suppressed" });
      results.push({ id: draft.id, to, sent: false, state: "suppressed", error: "Suppressed" });
      continue;
    }

    const firstName = escapeHtml((draft.recipient_name || "").trim().split(/\s+/)[0] || "there");
    const role = escapeHtml(draft.recipient_role || "your role");
    const company = escapeHtml(draft.company || "your organisation");

    const html = TEMPLATE
      .replaceAll("{{FIRST_NAME}}", firstName)
      .replaceAll("{{ROLE}}", role)
      .replaceAll("{{COMPANY}}", company);
    const text = TEXT_FALLBACK
      .replaceAll("{{FIRST_NAME}}", firstName)
      .replaceAll("{{ROLE}}", role)
      .replaceAll("{{COMPANY}}", company);

    try {
      const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
          // Stable per outreach record: the provider drops repeats of this key.
          "Idempotency-Key": `elm-outreach-${draft.id}`,
        },
        body: JSON.stringify({
          from: "Bright Leadership Consulting <info@brightleadershipconsulting.com>",
          to: [to],
          subject: draft.subject,
          html,
          text,
          reply_to: "info@brightleadershipconsulting.com",
        }),
      });

      const bodyText = await response.text();
      if (!response.ok) {
        console.error(`Send failed for ${draft.id} [${response.status}]: ${bodyText}`);
        // Definite validation rejections vs anything where acceptance is uncertain.
        const definite = [400, 401, 403, 422].includes(response.status);
        const state = definite ? "rejected" : "needs_reconciliation";
        await mark({ send_state: state, reconciliation_note: `${response.status}: ${bodyText.slice(0, 300)}` });
        results.push({ id: draft.id, to, sent: false, state, error: `${response.status}` });
        continue;
      }

      let messageId: string | null = null;
      try { messageId = JSON.parse(bodyText)?.id ?? null; } catch { /* ignore */ }
      await mark({
        status: "sent",
        sent_at: new Date().toISOString(),
        send_state: messageId ? "accepted" : "needs_reconciliation",
        provider_message_id: messageId,
        provider_accepted_at: new Date().toISOString(),
        delivery_status: "accepted_not_confirmed",
        reconciliation_note: messageId ? null : "Accepted without message ID",
      });

      results.push({ id: draft.id, to, sent: true, state: "accepted" });
      await sleep(1200);
    } catch (err) {
      console.error(`Send error for ${draft.id}:`, err);
      // Network/timeout: the provider may have accepted. Never auto-resend.
      await mark({ send_state: "needs_reconciliation", reconciliation_note: String(err).slice(0, 300) });
      results.push({ id: draft.id, to, sent: false, state: "needs_reconciliation", error: String(err).slice(0, 300) });
    }
  }

  const sentCount = results.filter((r) => r.sent).length;
  console.log(`Outreach send complete: ${sentCount}/${results.length} sent`);

  return new Response(JSON.stringify({ total: results.length, sent: sentCount, results }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
