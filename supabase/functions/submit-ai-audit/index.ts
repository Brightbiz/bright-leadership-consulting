import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  buyerAcknowledgement,
  deliverBuyerAcknowledgement,
  type RequestSummary,
} from "../_shared/auditEmails.ts";


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

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Operational request types the result cards can generate. */
const REQUEST_TYPES = new Set([
  "thinkific",
  "purchaseRequest",
  "invoice",
  "po",
  "info",
  "proposal",
  "scoping",
  "call",
  "email",
]);

/** Routing answers Q14 can hold, priced and unpriced contexts alike. */
const Q14_VALUES = new Set([
  "card",
  "invoice",
  "po",
  "download",
  "review",
  "notready",
  "reviewoptions",
  "decisionpack",
  "proposal",
  "discuss",
  "notready2",
]);

/** Requests that must never be accepted without a confirmed quantity. */
const QTY_GATED = new Set(["invoice", "po"]);

/** Requests that produce a buyer acknowledgement and an internal notice. */
const COMMERCIAL = new Set(["purchaseRequest", "invoice", "po", "proposal", "scoping"]);


/** Layered submission protection thresholds. */
const MAX_PER_IP_PER_HOUR = 10;
const MAX_PER_EMAIL_PER_HOUR = 3;
/** A credible completion of eight readiness questions plus routing. */
const MIN_COMPLETION_MS = 20_000;

const PEPPER = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const enc = new TextEncoder();

/** One-way hash. Raw IP addresses are never written to the database. */
async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(`${PEPPER}:${value}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------- visible challenge */

/**
 * A challenge is issued only when a submission looks automated. The expected
 * answer is carried in a signed token so no server state is required.
 */
async function issueChallenge() {
  const a = 2 + Math.floor(Math.random() * 7);
  const b = 2 + Math.floor(Math.random() * 7);
  const expires = Date.now() + 10 * 60 * 1000;
  const payload = `${a + b}:${expires}`;
  const signature = await hash(payload);
  return {
    token: `${btoa(payload)}.${signature.slice(0, 32)}`,
    question: `Please confirm you are a person: what is ${a} + ${b}?`,
  };
}

async function challengePasses(token: unknown, answer: unknown): Promise<boolean> {
  if (typeof token !== "string" || !token.includes(".")) return false;
  const [encoded, signature] = token.split(".");
  let payload = "";
  try {
    payload = atob(encoded);
  } catch {
    return false;
  }
  const expected = await hash(payload);
  if (expected.slice(0, 32) !== signature) return false;
  const [sum, expires] = payload.split(":");
  if (Number(expires) < Date.now()) return false;
  return Number(answer) === Number(sum);
}

/* ---------------------------------------------------------------- handler */

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
    const idempotencyKey = str(body?.idempotencyKey, 80);

    // Invisible honeypot. A real browser never fills this field.
    if (str(contact.companyWebsite, 200) || str(body?.companyWebsite, 200)) {
      console.log("submit-ai-audit: honeypot triggered");
      return json({ error: "Submission rejected." }, 400);
    }

    if (!email.includes("@") || !firstName || !lastName || !organisation || !jobTitle) {
      return json({ error: "Missing required details." }, 400);
    }
    if (!requestType) return json({ error: "Missing request type." }, 400);
    if (!idempotencyKey) return json({ error: "Missing submission key." }, 400);

    const score = Number(body?.readinessScore);
    if (!Number.isInteger(score) || score < 8 || score > 32) {
      return json({ error: "Invalid readiness score." }, 400);
    }

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

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const ipHash = await hash(clientIp);
    const emailHash = await hash(email);
    const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    /* ------------------------------------------- minimum completion time */

    const elapsedMs = Number(body?.elapsedMs);
    const tooFast = !Number.isFinite(elapsedMs) || elapsedMs < MIN_COMPLETION_MS;
    const solved = await challengePasses(body?.challengeToken, body?.challengeAnswer);

    if (tooFast && !solved) {
      const challenge = await issueChallenge();
      return json(
        {
          error: "Please confirm the short check below and submit again.",
          challengeRequired: true,
          ...challenge,
        },
        429,
      );
    }

    /* ---------------------------------------------------- hourly ceilings */

    const [{ count: ipCount }, { count: emailCount }] = await Promise.all([
      supabase
        .from("audit_submission_events")
        .select("*", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", windowStart),
      supabase
        .from("audit_submission_events")
        .select("*", { count: "exact", head: true })
        .eq("email_hash", emailHash)
        .gte("created_at", windowStart),
    ]);

    const overIp = (ipCount ?? 0) >= MAX_PER_IP_PER_HOUR;
    const overEmail = (emailCount ?? 0) >= MAX_PER_EMAIL_PER_HOUR;

    if (overIp || overEmail) {
      if (!solved) {
        const challenge = await issueChallenge();
        return json(
          {
            error:
              "We have recorded several requests from you in the last hour. Confirm the short check below, or email enquiries@brightleadershipconsulting.com and we will complete it manually.",
            challengeRequired: true,
            ...challenge,
          },
          429,
        );
      }
      if ((ipCount ?? 0) >= MAX_PER_IP_PER_HOUR * 3) {
        return json(
          {
            error:
              "Too many requests. Please email enquiries@brightleadershipconsulting.com and we will complete this manually.",
          },
          429,
        );
      }
    }

    /* --------------------------- atomic response + request + CRM mirror */

    const name = `${firstName} ${lastName}`;
    const classification = str(body?.classification, 80);
    const product = str(body?.product, 60);
    const actionLabel = str(body?.actionLabel, 160);
    const crmNote =
      `AI Leadership Readiness Audit — score ${score}, ${classification}. ` +
      `Request: ${actionLabel}${quantity ? ` (${quantity} places)` : ""}.`;

    const { data: result, error: rpcError } = await supabase.rpc("record_ai_audit_submission", {
      _idempotency_key: idempotencyKey,
      _email: email,
      _name: name,
      _organisation: organisation,
      _job_title: jobTitle,
      _readiness_score: score,
      _readiness_band: str(body?.readinessBand, 80),
      _classification: classification,
      _routing: body?.routing ?? {},
      _marketing_consent: body?.marketingConsent === true,
      _request_type: requestType,
      _action_label: actionLabel,
      _product: product,
      _participant_quantity: quantity,
      _crm_note: crmNote,
    });

    if (rpcError || !result) {
      console.error("record_ai_audit_submission failed", rpcError?.message);
      return json({ error: "Could not record the request." }, 500);
    }

    const outcome = result as {
      response_id: string;
      request_id: string;
      replayed: boolean;
      duplicate: boolean;
      crm_status: string;
    };

    // Ledger row written only for genuinely new submissions.
    if (!outcome.replayed) {
      await supabase
        .from("audit_submission_events")
        .insert({ ip_hash: ipHash, email_hash: emailHash });
    }

    /* -------------------------------------------- buyer acknowledgement */

    // Internal operational and CRM-failure notifications are NOT emailed. They
    // are surfaced in the secured administrative audit-requests view only.
    if (!outcome.replayed && COMMERCIAL.has(requestType)) {
      const summary: RequestSummary = {
        requestId: outcome.request_id,
        requestType,
        actionLabel,
        product,
        quantity,
        name,
        email,
        organisation,
        jobTitle,
      };
      const buyer = await deliverBuyerAcknowledgement(buyerAcknowledgement(summary));
      // Status is recorded for visibility only; suppression, bounce or failure
      // never deletes or invalidates the underlying request record, and the
      // buyer's on-screen confirmation is returned regardless.
      await supabase
        .from("ai_audit_requests")
        .update({
          buyer_ack_status: buyer === "pending" ? "pending_approval" : buyer,
          admin_notice_status: "admin_view_only",
        })
        .eq("id", outcome.request_id);
    }


    return json({
      ok: true,
      id: outcome.response_id,
      requestId: outcome.request_id,
      duplicate: outcome.duplicate,
      replayed: outcome.replayed,
      crmStatus: outcome.crm_status,
    });
  } catch (error) {
    console.error("submit-ai-audit error", error instanceof Error ? error.message : error);
    return json({ error: "Unexpected error." }, 500);
  }
});
