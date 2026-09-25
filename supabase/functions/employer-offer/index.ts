/**
 * Private employer-funded offer endpoint (token-based, no sign-in).
 *
 * actions:
 *   view   → returns the approved offer; records opened timestamps
 *   accept → records acceptance by the employer signatory
 *   refer  → records a non-standard requirement; no purchase proceeds
 *
 * The named participant, fee and terms cannot be changed through this endpoint.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "X-Robots-Tag": "noindex, nofollow" },
  });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN = /^[a-f0-9]{64}$/;

const effectiveStatus = (o: { status: string; expires_at: string }) =>
  o.status === "issued" && new Date(o.expires_at).getTime() < Date.now() ? "expired" : o.status;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const token = str(body.token, 64);
  const action = str(body.action, 10);
  if (!TOKEN.test(token)) return json({ error: "Offer not found" }, 404);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: offer, error } = await db.from("employer_offers").select("*").eq("token", token).maybeSingle();
  if (error || !offer) return json({ error: "Offer not found" }, 404);

  const status = effectiveStatus(offer);
  const now = new Date().toISOString();

  if (action === "view") {
    await db
      .from("employer_offers")
      .update({
        first_opened_at: offer.first_opened_at ?? now,
        last_opened_at: now,
        open_count: (offer.open_count ?? 0) + 1,
      })
      .eq("id", offer.id);

    const unavailable = status === "withdrawn" || status === "superseded" || status === "expired";
    return json({
      status,
      offer: unavailable
        ? null
        : {
            programme: offer.programme,
            employer_organisation: offer.employer_organisation,
            signatory_name: offer.signatory_name,
            participant_name: offer.participant_name,
            participant_role: offer.participant_role,
            fee_gbp: Number(offer.fee_gbp),
            payment_method: offer.payment_method,
            terms_version: offer.terms_version,
            expires_at: offer.expires_at,
            issued_at: offer.issued_at,
            accepted_at: offer.accepted_at,
            accepted_name: offer.accepted_name,
          },
    });
  }

  if (status !== "issued") return json({ error: "This offer can no longer be actioned.", status }, 409);

  if (action === "accept") {
    const name = str(body.name, 100);
    const role = str(body.role, 120);
    const email = str(body.email, 255).toLowerCase();
    const po = str(body.po_number, 60);
    const invoice = str(body.invoice_contact, 500);
    if (!name || !role || !EMAIL.test(email) || !invoice) return json({ error: "Please complete all required fields." }, 400);
    if (body.confirm_terms !== true || body.confirm_authority !== true || body.confirm_participant !== true)
      return json({ error: "Please confirm each statement." }, 400);
    if (str(body.terms_version, 40) !== offer.terms_version)
      return json({ error: "These terms have changed. Please reload the offer." }, 409);

    const { error: upErr } = await db
      .from("employer_offers")
      .update({
        status: "accepted",
        accepted_at: now,
        accepted_name: name,
        accepted_role: role,
        accepted_email: email,
        po_number: po || null,
        invoice_contact: invoice,
      })
      .eq("id", offer.id)
      .eq("status", "issued");
    if (upErr) return json({ error: "Acceptance could not be recorded." }, 500);
    return json({ ok: true, status: "accepted", accepted_at: now });
  }

  if (action === "refer") {
    const message = str(body.message, 2000);
    if (message.length < 10) return json({ error: "Please describe the requirement." }, 400);
    const { error: upErr } = await db
      .from("employer_offers")
      .update({ status: "referred", referred_at: now, non_standard_request: message })
      .eq("id", offer.id)
      .eq("status", "issued");
    if (upErr) return json({ error: "Request could not be recorded." }, 500);
    return json({ ok: true, status: "referred" });
  }

  return json({ error: "Invalid action" }, 400);
});
