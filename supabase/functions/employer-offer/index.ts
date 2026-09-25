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
const CONTRACTING_IDENTITY = "Irene A. Agunbiade trading as Bright Leadership Consulting";
const SUPPLIER_ADDRESS = "82 James Carter Road\nMildenhall\nEngland\nIP28 7DE";
const CONTACT_EMAIL = "info@brightleadershipconsulting.com";
const OFFER_TERMS_VERSION = "ELM-EMP-2026-09-v3";
const TERMS_CONDITIONS_VERSION = "TC-2026-09";
const TERMS_CONDITIONS_URL = "https://brightleadershipconsulting.com/terms";
const PRIVACY_NOTICE_URL = "https://brightleadershipconsulting.com/privacy";
const PAYMENT_DUE_DAYS = 30;
const FEE_GBP = 1297;
const VAT_WORDING = "VAT is not charged because the supplier is not registered for VAT.";
const PAYMENT_INSTRUCTIONS =
  `Payment is due within ${PAYMENT_DUE_DAYS} calendar days of the invoice date. Bank transfer details are supplied separately by Bright Leadership Consulting. Use the invoice number as the payment reference. For payment questions, contact ${CONTACT_EMAIL}.`;

const effectiveStatus = (o: { status: string; expires_at: string }) =>
  o.status === "issued" && new Date(o.expires_at).getTime() < Date.now() ? "expired" : o.status;

const offerReference = (id: string) => `ELM-${id.slice(0, 8).toUpperCase()}`;

const addDaysIsoDate = (date: Date, days: number) => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
};

const formatUkIsoDate = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/London",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
};

const addDaysFromIsoDate = (isoDate: string, days: number) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return addDaysIsoDate(new Date(), days);
  return addDaysIsoDate(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)), days);
};

const formatUkDateTime = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(date);

const getConfirmations = (employer: string, participant: string) => ({
  authority: `I am authorised to accept this offer on behalf of ${employer}, which is purchasing in the course of its business.`,
  participant: `The place is for ${participant} only. Access is personal to them and cannot be shared or transferred, and the participant cannot be changed without Bright Leadership Consulting's written approval and a reissued offer.`,
  terms: "I have read and accept this offer and the Terms and Conditions incorporated into it. I acknowledge that I have been given access to Bright Leadership Consulting's Privacy Notice.",
  privacy: "I confirm that I am authorised to provide the named participant's information for this purchase and that the participant will be given Bright Leadership Consulting's Privacy Notice.",
});

const offerTermsText = [
  ["1. Parties and scope", `This offer is made by ${CONTRACTING_IDENTITY}, of 82 James Carter Road, Mildenhall, England, IP28 7DE ("Bright Leadership Consulting"), to the employer named above. It is for one individual place on the Executive Leadership Mastery Programme for the named participant shown above, funded by that employer. It is not an organisational, multiple-place, cohort, facilitated or tailored engagement.`],
  ["2. Fee and VAT", `The fee is £1,297 for one individual place. VAT is £0.00. ${VAT_WORDING}`],
  ["3. When the contract becomes binding", "A binding contract between the employer and Bright Leadership Consulting is formed when the employer's authorised representative accepts this offer using the button below before the expiry date, and Bright Leadership Consulting records that acceptance. No contract is formed if the offer has expired, been withdrawn or been reissued, or if a non-standard requirement has been referred to Bright Leadership Consulting."],
  ["4. Authority to accept", "The person accepting this offer confirms that they are authorised to enter into this contract on behalf of the employer named above, and that the employer is purchasing in the course of its business."],
  ["5. Invoicing and payment", `Bright Leadership Consulting will issue an invoice to the invoicing contact provided after acceptance. Payment is due within ${PAYMENT_DUE_DAYS} calendar days of the invoice date. A purchase order number is optional unless the employer requires one; where supplied, it will be quoted on the invoice. Providing, omitting or delaying a purchase order number does not change the payment deadline.`],
  ["6. Access", "Programme access will be enabled for the named participant within two business days after Bright Leadership Consulting has received cleared payment in full and the information reasonably required to create the participant's access. Bright Leadership Consulting may withhold access until both requirements have been satisfied."],
  ["7. Overdue payment", "If payment has not been received by the due date, Bright Leadership Consulting may continue to withhold programme access and recover the sum due. Bright Leadership Consulting reserves its right to claim statutory interest and compensation under the Late Payment of Commercial Debts (Interest) Act 1998."],
  ["8. Named participant and personal access", "The place is for the named participant only. Programme access is personal to that participant and may not be shared, transferred or used by anyone else. The participant cannot be changed through this offer. Any change requires Bright Leadership Consulting's written approval and a reissued offer."],
  ["9. Cancellation and refunds", "The employer may cancel this purchase by giving Bright Leadership Consulting written notice before programme access has been enabled for the named participant. Bright Leadership Consulting will refund any fee already paid. Once programme access has been enabled, the fee is non-refundable, including where the participant does not start or complete the Programme, except where a refund is required by law. Nothing in this clause limits any right that cannot lawfully be excluded."],
  ["10. Non-standard requirements", "Requests for different pricing, additional places, bespoke delivery, alternative payment terms, a change of participant or supplier-onboarding conditions are not covered by this offer. They will be referred to Bright Leadership Consulting for review, and no acceptance or purchase will proceed until Bright Leadership Consulting has responded in writing."],
  ["11. No guaranteed outcome", "The Programme provides structured leadership development. Participation does not guarantee any particular business, career, commercial or leadership outcome."],
  ["12. Terms and Conditions, Privacy Notice and validity", `This offer incorporates Bright Leadership Consulting's Terms and Conditions (${TERMS_CONDITIONS_URL}), Version ${TERMS_CONDITIONS_VERSION}, a copy of which is kept with the record of acceptance. If this offer conflicts with the Terms and Conditions, this offer prevails for this purchase. Bright Leadership Consulting's Privacy Notice (${PRIVACY_NOTICE_URL}) is provided separately. It explains how employer and participant information is used and does not form part of this contract. This offer is valid until the expiry date shown and may be withdrawn by Bright Leadership Consulting at any time before acceptance.`],
].map(([heading, text]) => `${heading}\n${text}`).join("\n\n");

const termsConditionsSnapshot = [
  `Contracting and invoicing party: ${CONTRACTING_IDENTITY}, 82 James Carter Road, Mildenhall, England, IP28 7DE.`,
  "Employer-funded purchases of an individual place for a named participant are governed by the private offer issued for that purchase. Where the private offer conflicts with these Terms, the private offer prevails for that purchase.",
  "Programme fees are stated in British Pounds. Any tax or VAT treatment applicable to an invoiced offer is stated in the offer and invoice.",
  "Bright Leadership Consulting is not VAT registered. Employer-funded invoices issued by the supplier show VAT as £0.00 and state that VAT is not charged because the supplier is not registered for VAT.",
  "Providing, omitting or delaying a purchase-order number does not replace the employer's obligation to pay an accepted invoice in accordance with the agreed payment terms.",
].join("\n");

const publicOffer = (offer: Record<string, unknown>) => ({
  id: offer.id,
  offer_reference: offerReference(String(offer.id)),
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
  accepted_role: offer.accepted_role,
  accepted_at_uk: offer.accepted_at_uk,
  accepted_offer_terms_version: offer.accepted_offer_terms_version,
  accepted_offer_terms_text: offer.accepted_offer_terms_text,
  po_number: offer.po_number,
  invoice_contact: offer.invoice_contact,
  invoice_number: offer.invoice_number,
  invoice_date: offer.invoice_date,
  payment_due_date: offer.payment_due_date,
  invoice_description: offer.invoice_description,
  invoice_net_amount_gbp: Number(offer.invoice_net_amount_gbp ?? FEE_GBP),
  invoice_vat_amount_gbp: Number(offer.invoice_vat_amount_gbp ?? 0),
  invoice_total_gbp: Number(offer.invoice_total_gbp ?? FEE_GBP),
  invoice_payment_instructions: offer.invoice_payment_instructions,
  invoice_contact_email: offer.invoice_contact_email,
  supplier_contracting_identity: offer.supplier_contracting_identity,
  supplier_address: offer.supplier_address,
});

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
  const isCurrentOfferTerms = offer.terms_version === OFFER_TERMS_VERSION;

  if (action === "view") {
    await db
      .from("employer_offers")
      .update({
        first_opened_at: offer.first_opened_at ?? now,
        last_opened_at: now,
        open_count: (offer.open_count ?? 0) + 1,
      })
      .eq("id", offer.id);

    const displayStatus = status === "issued" && !isCurrentOfferTerms ? "superseded" : status;
    const unavailable = displayStatus === "withdrawn" || displayStatus === "superseded" || displayStatus === "expired";
    return json({
      status: displayStatus,
      offer: unavailable ? null : publicOffer(offer),
    });
  }

  if (status !== "issued") return json({ error: "This offer can no longer be actioned.", status }, 409);
  if (!isCurrentOfferTerms) return json({ error: "These terms have changed. Please request a reissued offer." }, 409);

  if (action === "accept") {
    const name = str(body.name, 100);
    const role = str(body.role, 120);
    const email = str(body.email, 255).toLowerCase();
    const po = str(body.po_number, 60);
    const invoice = str(body.invoice_contact, 500);
    if (!name || !role || !EMAIL.test(email) || !invoice) return json({ error: "Please complete all required fields." }, 400);
    if (body.confirm_terms !== true || body.confirm_authority !== true || body.confirm_participant !== true || body.confirm_privacy !== true)
      return json({ error: "Please confirm each statement." }, 400);
    if (str(body.terms_version, 40) !== offer.terms_version)
      return json({ error: "These terms have changed. Please reload the offer." }, 409);

    const acceptedAt = new Date();
    const invoiceDate = formatUkIsoDate(acceptedAt);
    const paymentDueDate = addDaysFromIsoDate(invoiceDate, PAYMENT_DUE_DAYS);
    const ref = offerReference(offer.id);
    const invoiceNumber = `${ref}-${invoiceDate.replaceAll("-", "")}`;
    const confirmations = getConfirmations(offer.employer_organisation, offer.participant_name);
    const acceptedStatement = `By selecting 'Accept offer and form contract', you accept this offer on behalf of ${offer.employer_organisation}. A binding contract is formed on acceptance. An invoice for £1,297 will be issued, showing VAT £0.00 and payable within ${PAYMENT_DUE_DAYS} calendar days of the invoice date. ${VAT_WORDING}`;

    const { data: acceptedOffer, error: upErr } = await db
      .from("employer_offers")
      .update({
        status: "accepted",
        accepted_at: acceptedAt.toISOString(),
        accepted_name: name,
        accepted_role: role,
        accepted_email: email,
        po_number: po || null,
        invoice_contact: invoice,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        payment_due_date: paymentDueDate,
        invoice_description: `One named individual place on the Executive Leadership Mastery Programme for ${offer.participant_name}.`,
        invoice_net_amount_gbp: FEE_GBP,
        invoice_vat_amount_gbp: 0,
        invoice_total_gbp: FEE_GBP,
        invoice_payment_instructions: PAYMENT_INSTRUCTIONS,
        invoice_contact_email: CONTACT_EMAIL,
        supplier_contracting_identity: CONTRACTING_IDENTITY,
        supplier_address: SUPPLIER_ADDRESS,
        supplier_vat_registered: false,
        invoice_is_vat_invoice: false,
        payment_due_days: PAYMENT_DUE_DAYS,
        accepted_offer_terms_version: OFFER_TERMS_VERSION,
        accepted_offer_terms_text: offerTermsText,
        accepted_terms_conditions_version: TERMS_CONDITIONS_VERSION,
        accepted_terms_conditions_url: TERMS_CONDITIONS_URL,
        accepted_terms_conditions_text: termsConditionsSnapshot,
        accepted_vat_treatment: VAT_WORDING,
        accepted_confirmation_authority_text: confirmations.authority,
        accepted_confirmation_participant_text: confirmations.participant,
        accepted_confirmation_terms_text: confirmations.terms,
        accepted_confirmation_privacy_text: confirmations.privacy,
        accepted_statement_text: acceptedStatement,
        accepted_at_uk: formatUkDateTime(acceptedAt),
      })
      .eq("id", offer.id)
      .eq("status", "issued")
      .select("*")
      .maybeSingle();
    if (upErr) return json({ error: "Acceptance could not be recorded." }, 500);
    if (!acceptedOffer) return json({ error: "This offer can no longer be actioned.", status: "accepted" }, 409);
    return json({ ok: true, status: "accepted", accepted_at: acceptedAt.toISOString(), offer: publicOffer(acceptedOffer) });
  }

  if (action === "refer") {
    const message = str(body.message, 2000);
    if (message.length < 10) return json({ error: "Please describe the requirement." }, 400);
    const { data: referredOffer, error: upErr } = await db
      .from("employer_offers")
      .update({ status: "referred", referred_at: now, non_standard_request: message })
      .eq("id", offer.id)
      .eq("status", "issued")
      .select("id")
      .maybeSingle();
    if (upErr) return json({ error: "Request could not be recorded." }, 500);
    if (!referredOffer) return json({ error: "This offer can no longer be actioned.", status: "referred" }, 409);
    return json({ ok: true, status: "referred" });
  }

  return json({ error: "Invalid action" }, 400);
});
