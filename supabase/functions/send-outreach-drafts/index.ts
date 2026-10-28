// Sender for approved ELM outreach drafts (admin Outreach tab).
//
// Two modes, both behind the shared-secret header:
//   X-Outreach-Mode: test   — sends ONE personalised copy to the designated
//                             test address only (aguns70418@aol.com). Never
//                             touches draft state, never selects a production
//                             recipient. Optional X-Test-Draft-Id picks the
//                             draft to personalise from.
//   (default) batch         — requires X-Batch-Approval: <approval id>.
//                             The approval fixes the recipient list, content
//                             hash, sender and maximum count; it expires and
//                             can be used exactly once. All sending routes
//                             (manual calls and timers alike) come through
//                             this function, so every batch needs approval.
//
// Retains: suppression checks, atomic per-draft claims, provider idempotency
// keys, and needs_reconciliation flagging for uncertain outcomes.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  runBatchSend,
  runTestSend,
  contentHash,
  SENDER,
  REPLY_TO,
  type SendDeps,
  type DraftRow,
  type ApprovalRow,
} from "./handler.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const secrets = [Deno.env.get("OUTREACH_CRON_KEY"), Deno.env.get("OUTREACH_CRON_KEY_2")].filter(Boolean);
  const provided = req.headers.get("X-Outreach-Secret");
  if (secrets.length === 0 || !provided || !secrets.includes(provided)) {
    return json({ error: "Unauthorised" }, 401);
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
    return json({ error: "Resend credentials not configured" }, 500);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const deps: SendDeps = {
    async listEligibleDrafts(): Promise<DraftRow[]> {
      const { data, error } = await supabase
        .from("outreach_drafts")
        .select("id, subject, recipient_name, recipient_role, company, outreach_recipients(email)")
        .eq("status", "draft")
        .eq("send_state", "unsent")
        .eq("is_follow_up", false);
      if (error) throw new Error("Could not load drafts");
      return (data ?? []).map((d) => ({
        id: d.id,
        subject: d.subject,
        recipient_name: d.recipient_name,
        recipient_role: d.recipient_role,
        company: d.company,
        email: (d.outreach_recipients as { email: string | null } | null)?.email ?? null,
      }));
    },

    async listSuppressedEmails(): Promise<string[]> {
      const { data, error } = await supabase.from("outreach_suppressions").select("email");
      if (error) throw new Error("Could not load suppression list");
      return (data ?? []).map((s: { email: string }) => s.email);
    },

    async getApproval(id: string): Promise<ApprovalRow | null> {
      const { data, error } = await supabase
        .from("outreach_batch_approvals")
        .select("id, recipient_draft_ids, content_hash, sender, max_count, expires_at, used_at, recipient_fingerprints")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error("Could not load approval");
      return data as ApprovalRow | null;
    },

    async claimApproval(id: string): Promise<boolean> {
      const { data, error } = await supabase
        .from("outreach_batch_approvals")
        .update({ used_at: new Date().toISOString() })
        .eq("id", id)
        .is("used_at", null)
        .select("id");
      return !error && !!data && data.length === 1;
    },

    async claimDraft(id: string, runId: string): Promise<boolean> {
      const { data, error } = await supabase
        .from("outreach_drafts")
        .update({ send_state: "claimed", send_claim_id: runId, send_claimed_at: new Date().toISOString() })
        .eq("id", id)
        .eq("status", "draft")
        .eq("send_state", "unsent")
        .select("id");
      return !error && !!data && data.length === 1;
    },

    async markDraft(id: string, runId: string, fields: Record<string, unknown>): Promise<void> {
      await supabase.from("outreach_drafts").update(fields).eq("id", id).eq("send_claim_id", runId);
    },

    async sendEmail({ to, subject, html, text, idempotencyKey }) {
      try {
        const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify({ from: SENDER, to: [to], subject, html, text, reply_to: REPLY_TO }),
        });
        const bodyText = await response.text();
        if (!response.ok) {
          console.error(`Send failed [${response.status}]: ${bodyText}`);
          return { ok: false, status: response.status, error: bodyText.slice(0, 300) };
        }
        let messageId: string | null = null;
        try { messageId = JSON.parse(bodyText)?.id ?? null; } catch { /* ignore */ }
        return { ok: true, status: response.status, messageId };
      } catch (err) {
        console.error("Send error:", err);
        return { ok: false, error: String(err).slice(0, 300) };
      }
    },

    sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
    now: () => new Date(),
  };

  try {
    const mode = req.headers.get("X-Outreach-Mode") === "test" ? "test" : "batch";
    if (mode === "test") {
      const report = await runTestSend(deps, req.headers.get("X-Test-Draft-Id"));
      console.log(`Outreach TEST send: ${report.sent}/1 to designated test address`);
      return json(report, report.ok ? 200 : 400);
    }
    const report = await runBatchSend(deps, req.headers.get("X-Batch-Approval"));
    console.log(`Outreach batch: ${report.sent ?? 0}/${report.total ?? 0} sent`);
    return json({ ...report, content_hash: await contentHash() }, report.ok ? 200 : 400);
  } catch (err) {
    console.error("Outreach send error:", err);
    return json({ error: String(err).slice(0, 300) }, 500);
  }
});
