import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Requests that must never be accepted without a confirmed 2–9 quantity. */
const QTY_GATED = new Set(["invoice", "po"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const contact = body?.contact ?? {};

    const email = str(contact.email, 200).toLowerCase();
    const firstName = str(contact.firstName, 100);
    const lastName = str(contact.lastName, 100);
    const organisation = str(contact.organisation, 200);
    const jobTitle = str(contact.jobTitle, 200);
    const requestType = str(body?.requestType, 40);

    if (!email.includes("@") || !firstName || !lastName || !organisation || !jobTitle) {
      return json({ error: "Missing required details." }, 400);
    }
    if (!requestType) return json({ error: "Missing request type." }, 400);

    const score = Number(body?.readinessScore);
    if (!Number.isInteger(score) || score < 8 || score > 32) {
      return json({ error: "Invalid readiness score." }, 400);
    }

    // Part L — the quantity is taken from the confirmed value only, never inferred.
    const rawQty = body?.participantQuantity;
    const quantity =
      rawQty === null || rawQty === undefined ? null : Number.isInteger(rawQty) ? rawQty : null;
    if (QTY_GATED.has(requestType) && (quantity === null || quantity < 1)) {
      return json({ error: "A confirmed participant quantity is required." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const name = `${firstName} ${lastName}`;

    const { data: response, error: responseError } = await supabase
      .from("ai_audit_responses")
      .insert({
        email,
        name,
        organisation,
        job_title: jobTitle,
        readiness_score: score,
        readiness_band: str(body?.readinessBand, 80),
        classification: str(body?.classification, 80),
        routing: body?.routing ?? {},
        marketing_consent: body?.marketingConsent === true,
      })
      .select("id")
      .single();

    if (responseError) {
      console.error("ai_audit_responses insert failed", responseError.message);
      return json({ error: "Could not record the audit response." }, 500);
    }

    const { error: requestError } = await supabase.from("ai_audit_requests").insert({
      response_id: response.id,
      email,
      name,
      organisation,
      job_title: jobTitle,
      request_type: requestType,
      action_label: str(body?.actionLabel, 160),
      product: str(body?.product, 60),
      participant_quantity: quantity,
    });

    if (requestError) {
      console.error("ai_audit_requests insert failed", requestError.message);
      return json({ error: "Could not record the request." }, 500);
    }

    // Mirror into the CRM so audit leads appear alongside every other source.
    const { error: crmError } = await supabase.from("crm_contacts").insert({
      name,
      email,
      company: organisation,
      job_title: jobTitle,
      source: "ai_audit",
      source_table: "ai_audit_requests",
      source_record_id: response.id,
      notes: `AI Leadership Readiness Audit — score ${score}, ${str(body?.classification, 80)}. Request: ${str(body?.actionLabel, 160)}${quantity ? ` (${quantity} places)` : ""}.`,
      tags: ["ai-audit", requestType],
    });
    if (crmError) console.error("crm_contacts insert failed", crmError.message);

    return json({ ok: true, id: response.id });
  } catch (error) {
    console.error("submit-ai-audit error", error instanceof Error ? error.message : error);
    return json({ error: "Unexpected error." }, 500);
  }
});

