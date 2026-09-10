/**
 * Executive Decision Leadership Intensive™ — public intake endpoint.
 *
 * Two submission kinds, both server-validated and written with the service
 * role so no public client ever holds insert rights:
 *
 *   application       → edl_applications (+ edl_application_access_needs)
 *   employer_request  → edl_employer_requests
 *
 * Access-support answers are written to a separate restricted record. Neither
 * decision-case narrative, conflict detail nor access-support detail is ever
 * logged or echoed back. No payment route exists here by design: admission is
 * by human suitability assessment.
 */

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

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bool = (v: unknown) => v === true;
const nullable = (v: string) => (v === "" ? null : v);

/** ISO date (YYYY-MM-DD) or null. */
const dateOrNull = (v: unknown) => {
  const value = str(v, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMITS: Record<string, { max: number; windowMinutes: number }> = {
  edl_application: { max: 5, windowMinutes: 60 },
  edl_employer_request: { max: 5, windowMinutes: 60 },
};

const FUNDING_ROUTES = new Set([
  "Self-funded",
  "Employer-funded",
  "Funding route not yet confirmed",
]);
const YES_NO_UNSURE = new Set(["Yes", "No", "Unsure"]);
const ANONYMISABLE = new Set(["Yes", "No", "Unsure"]);
const ACCESS_ROUTES = new Set(["no", "yes", "private"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const kind = str(body?.kind, 40);
    const payload = (body?.payload ?? {}) as Record<string, unknown>;

    // Invisible honeypot. A real browser never fills this field. Answer as if
    // accepted so an automated client learns nothing from the response.
    if (str(body?.companyWebsite, 200) || str(payload.companyWebsite, 200)) {
      console.log("submit-edl-application: honeypot triggered");
      return json({ success: true }, 200);
    }


    if (kind !== "application" && kind !== "employer_request") {
      return json({ error: "Unknown submission type." }, 400);
    }

    // Programme held private: no public submission of any type is accepted.
    const EDL_PRIVATE = true;
    if (EDL_PRIVATE) {
      return json({ error: "This programme is not open at present." }, 403);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    /* ------------------------------------------------------- rate limiting */

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const limit = RATE_LIMITS[kind === "application" ? "edl_application" : "edl_employer_request"];
    const formType = kind === "application" ? "edl_application" : "edl_employer_request";
    const windowStart = new Date(Date.now() - limit.windowMinutes * 60_000).toISOString();

    await supabase.rpc("cleanup_old_rate_limits");
    const { count } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIp)
      .eq("form_type", formType)
      .gte("created_at", windowStart);

    if ((count ?? 0) >= limit.max) {
      return json(
        {
          error: `Too many submissions. Please try again in ${limit.windowMinutes} minutes.`,
        },
        429,
      );
    }

    /* ---------------------------------------------------- employer request */

    if (kind === "employer_request") {
      const requesterEmail = str(payload.requesterEmail, 255).toLowerCase();
      const row = {
        requester_name: str(payload.requesterName, 120),
        requester_role: str(payload.requesterRole, 120),
        requester_organisation: str(payload.requesterOrganisation, 200),
        requester_email: requesterEmail,
        participant_name: nullable(str(payload.participantName, 120)),
        participant_role: nullable(str(payload.participantRole, 120)),
        participant_email: nullable(str(payload.participantEmail, 255).toLowerCase()),
        invoice_required: nullable(str(payload.invoiceRequired, 20)),
        po_required: nullable(str(payload.poRequired, 20)),
        vendor_onboarding_required: nullable(str(payload.vendorOnboardingRequired, 20)),
        expected_decision_date: dateOrNull(payload.expectedDecisionDate),
        admin_question: nullable(str(payload.adminQuestion, 1000)),
        privacy_ack: bool(payload.privacyAck),
      };

      if (
        !row.requester_name ||
        !row.requester_role ||
        !row.requester_organisation ||
        !EMAIL.test(row.requester_email)
      ) {
        return json({ error: "Please complete the required requester details." }, 400);
      }
      if (!row.privacy_ack) {
        return json({ error: "The privacy acknowledgement is required." }, 400);
      }
      for (const value of [row.invoice_required, row.po_required, row.vendor_onboarding_required]) {
        if (value && !YES_NO_UNSURE.has(value)) {
          return json({ error: "Invalid administrative answer." }, 400);
        }
      }

      const { data, error } = await supabase
        .from("edl_employer_requests")
        .insert(row)
        .select("id")
        .single();

      if (error) {
        console.error("edl employer request insert failed", error.code);
        return json({ error: "Request could not be processed." }, 500);
      }

      await supabase.from("rate_limits").insert({ ip_address: clientIp, form_type: formType });
      return json({ ok: true, id: data.id });
    }

    /* --------------------------------------------------------- application */

    // Date-locked application window: 14 September – 11 October 2026 (UK time).
    const OPEN_AT = Date.parse("2026-09-13T23:00:00.000Z");
    const CLOSE_AT = Date.parse("2026-10-11T22:59:59.999Z");
    const nowMs = Date.now();
    if (nowMs < OPEN_AT || nowMs > CLOSE_AT) {
      return json(
        {
          error:
            nowMs < OPEN_AT
              ? "Applications open on 14 September 2026."
              : "Applications for the founding cohort have closed.",
        },
        403,
      );
    }

    const workEmail = str(payload.workEmail, 255).toLowerCase();
    const fundingRoute = str(payload.fundingRoute, 60);
    const anonymisable = str(payload.anonymisable, 20);

    const row: Record<string, unknown> = {
      full_name: str(payload.fullName, 120),
      work_email: workEmail,
      telephone: str(payload.telephone, 40),
      role_title: str(payload.roleTitle, 160),
      organisation: str(payload.organisation, 200),
      sector: str(payload.sector, 120),
      country: str(payload.country, 120),
      time_zone: str(payload.timeZone, 80),
      linkedin_url: nullable(str(payload.linkedinUrl, 300)),
      referral_source: str(payload.referralSource, 120),
      referral_detail: nullable(str(payload.referralDetail, 300)),

      resp_current: str(payload.respCurrent, 600),
      resp_decision_types: str(payload.respDecisionTypes, 600),
      resp_approvals: str(payload.respApprovals, 400),
      resp_authority: str(payload.respAuthority, 500),

      decision_statement: str(payload.decisionStatement, 600),
      decision_deadline: dateOrNull(payload.decisionDeadline),
      decision_why_now: str(payload.decisionWhyNow, 500),
      decision_at_risk: str(payload.decisionAtRisk, 600),
      decision_already_decided: str(payload.decisionAlreadyDecided, 400),
      decision_alternatives: str(payload.decisionAlternatives, 600),
      decision_off_limits: str(payload.decisionOffLimits, 400),
      anonymisable,

      conflict_note: nullable(str(payload.conflictNote, 1000)),
      ack_authorised: bool(payload.ackAuthorised),
      ack_no_recording: bool(payload.ackNoRecording),
      ack_confidentiality_limits: bool(payload.ackConfidentialityLimits),

      commit_attend: bool(payload.commitAttend),
      commit_week4: bool(payload.commitWeek4),
      commit_applied_work: bool(payload.commitAppliedWork),
      commit_challenge: bool(payload.commitChallenge),
      commit_confidentiality: bool(payload.commitConfidentiality),

      funding_route: fundingRoute,

      decl_accurate: bool(payload.declAccurate),
      decl_no_admission_guarantee: bool(payload.declNoAdmissionGuarantee),
      decl_employer_funding_subject: bool(payload.declEmployerFundingSubject),
      decl_no_outcome_guarantee: bool(payload.declNoOutcomeGuarantee),
      decl_privacy_read: bool(payload.declPrivacyRead),
      privacy_notice_version: str(payload.privacyNoticeVersion, 60),

      marketing_consent: bool(payload.marketingConsent),
      marketing_consent_at: bool(payload.marketingConsent) ? new Date().toISOString() : null,

      utm_source: nullable(str(payload.utmSource, 120)),
      utm_medium: nullable(str(payload.utmMedium, 120)),
      utm_campaign: nullable(str(payload.utmCampaign, 160)),
      gclid: nullable(str(payload.gclid, 200)),
    };

    const requiredText = [
      "full_name",
      "telephone",
      "role_title",
      "organisation",
      "sector",
      "country",
      "time_zone",
      "referral_source",
      "resp_current",
      "resp_decision_types",
      "resp_approvals",
      "resp_authority",
      "decision_statement",
      "decision_why_now",
      "decision_at_risk",
      "decision_already_decided",
      "decision_alternatives",
      "decision_off_limits",
      "privacy_notice_version",
    ];

    for (const field of requiredText) {
      if (!row[field]) return json({ error: "Please complete every required field." }, 400);
    }
    if (!EMAIL.test(workEmail)) return json({ error: "Work email appears invalid." }, 400);
    if (!row.decision_deadline) return json({ error: "A decision deadline is required." }, 400);
    if (!ANONYMISABLE.has(anonymisable)) return json({ error: "Invalid anonymisation answer." }, 400);
    if (!FUNDING_ROUTES.has(fundingRoute)) return json({ error: "Invalid funding route." }, 400);

    const requiredTrue = [
      "ack_authorised",
      "ack_no_recording",
      "ack_confidentiality_limits",
      "commit_attend",
      "commit_week4",
      "commit_applied_work",
      "commit_challenge",
      "commit_confidentiality",
      "decl_accurate",
      "decl_no_admission_guarantee",
      "decl_employer_funding_subject",
      "decl_no_outcome_guarantee",
      "decl_privacy_read",
    ];
    for (const field of requiredTrue) {
      if (row[field] !== true) {
        return json({ error: "Every required confirmation must be agreed." }, 400);
      }
    }

    if (fundingRoute === "Employer-funded") {
      const sponsorEmail = str(payload.sponsorEmail, 255).toLowerCase();
      row.sponsor_name = str(payload.sponsorName, 120);
      row.sponsor_role = str(payload.sponsorRole, 120);
      row.sponsor_email = sponsorEmail;
      row.org_legal_name = str(payload.orgLegalName, 200);
      row.po_required = str(payload.poRequired, 20);
      row.vendor_onboarding_required = str(payload.vendorOnboardingRequired, 20);
      row.expected_approval_date = dateOrNull(payload.expectedApprovalDate);

      if (!row.sponsor_name || !row.sponsor_role || !EMAIL.test(sponsorEmail) || !row.org_legal_name) {
        return json({ error: "Please complete the employer-funding details." }, 400);
      }
      if (
        !YES_NO_UNSURE.has(String(row.po_required)) ||
        !YES_NO_UNSURE.has(String(row.vendor_onboarding_required))
      ) {
        return json({ error: "Please answer the purchase-order questions." }, 400);
      }
    }

    // A case that cannot yet be anonymised is never auto-declined; it is held
    // for human review so a neutral case or individual route can be considered.
    if (anonymisable === "No") row.status = "conflict_hold";

    const { data, error } = await supabase
      .from("edl_applications")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      console.error("edl application insert failed", error.code);
      return json({ error: "Application could not be processed." }, 500);
    }

    /* -------------------------------- restricted access-support record */

    const accessRoute = str(payload.accessRoute, 20);
    if (ACCESS_ROUTES.has(accessRoute) && accessRoute !== "no") {
      const { error: accessError } = await supabase.from("edl_application_access_needs").insert({
        application_id: data.id,
        adjustment_route: accessRoute,
        adjustment_detail: nullable(str(payload.accessDetail, 1000)),
        preferred_contact_method: nullable(str(payload.accessContactMethod, 200)),
      });
      // A failure here must not invalidate a valid application; it is recorded
      // without detail so the applicant can be contacted separately.
      if (accessError) console.error("edl access-needs insert failed", accessError.code);
    }

    await supabase.from("rate_limits").insert({ ip_address: clientIp, form_type: formType });

    // Internal notification is deliberately not emailed while the programme
    // mailbox remains an unresolved launch blocker. Applications are surfaced
    // in the secured administrative view only.
    return json({ ok: true, id: data.id, heldForReview: anonymisable === "No" });
  } catch (error) {
    console.error("submit-edl-application error", error instanceof Error ? error.message : error);
    return json({ error: "Unexpected error." }, 500);
  }
});
