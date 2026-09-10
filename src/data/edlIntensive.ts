/**
 * Executive Decision Leadership Intensive™ — approved programme facts.
 *
 * Single source of truth for the sales page, application route,
 * employer-information route and the administrative view. Nothing here may be
 * paraphrased on a surface: dates, times, capacity and fee are fixed content.
 *
 * Staging build. The route is not linked from navigation, is excluded from the
 * sitemap and is served noindex until the launch blockers are cleared.
 */

export const EDL = {
  title: "Executive Decision Leadership Intensive™",
  provider: "Bright Leadership Consulting",
  lead: "Irene A. Agunbiade",
  cohort: "Six executives from non-competing organisations",
  format: "Live online",
  fee: "£1,950 per participant. No VAT is charged.",
  applicationsWindow: "14 September–11 October 2026",
  closingTime: "11.59 pm UK time on Sunday, 11 October 2026",
  programmeLine: "20 October–10 November 2026 · Live online · 2.00–5.00 pm UK time",
  reviewLine: "30-day implementation review: 8 December 2026",
  route: "/executive-decision-leadership-intensive",
  applyRoute: "/executive-decision-leadership-intensive/apply",
  employerRoute: "/executive-decision-leadership-intensive/employer-information",
} as const;

/**
 * Application window, date-locked. Applications open at 00.00 UK time on
 * 14 September 2026 and close at 11.59 pm UK time on 11 October 2026 (BST).
 */
export const EDL_APPLICATIONS_OPEN_AT = "2026-09-13T23:00:00.000Z";
export const EDL_APPLICATIONS_CLOSE_AT = "2026-10-11T22:59:59.999Z";

export type EdlWindowState = "before" | "open" | "closed";

export const edlWindowState = (now: Date = new Date()): EdlWindowState => {
  const t = now.getTime();
  if (t < Date.parse(EDL_APPLICATIONS_OPEN_AT)) return "before";
  if (t > Date.parse(EDL_APPLICATIONS_CLOSE_AT)) return "closed";
  return "open";
};

/** Primary and secondary calls to action, used verbatim on every surface. */
export const EDL_CTA = {
  primary: "Apply for the founding cohort",
  secondary: "Request employer information",
} as const;

/**
 * Placeholders held open by the launch blockers. They are rendered plainly so
 * no fabricated commitment reaches an applicant before approval.
 */
export const EDL_PLACEHOLDERS = {
  responsePeriod: "[RESPONSE PERIOD]",
  programmeEmail: "[PROGRAMME EMAIL]",
} as const;

/** Privacy-notice version recorded against every stored application. */
export const EDL_PRIVACY_NOTICE_VERSION = "edl-staging-2026-09";

export const EDL_SCHEDULE = [
  { session: "Orientation", when: "Thursday, 15 October 2026", time: "2.00–3.00 pm UK time" },
  { session: "FRAME", when: "Tuesday, 20 October 2026", time: "2.00–5.00 pm UK time" },
  { session: "TEST", when: "Tuesday, 27 October 2026", time: "2.00–5.00 pm UK time" },
  { session: "ALIGN", when: "Tuesday, 3 November 2026", time: "2.00–5.00 pm UK time" },
  { session: "MOBILISE", when: "Tuesday, 10 November 2026", time: "2.00–5.00 pm UK time" },
  {
    session: "Implementation review",
    when: "Tuesday, 8 December 2026",
    time: "2.00–3.30 pm UK time",
  },
] as const;

export const EDL_CONDITIONS = [
  {
    label: "Imprecise question",
    detail: "The organisation is solving the wrong or incomplete problem.",
  },
  { label: "Hidden assumptions", detail: "Confidence runs ahead of evidence." },
  {
    label: "Ambiguous authority",
    detail: "Ownership, approval and influence do not align.",
  },
  {
    label: "Premature mobilisation",
    detail: "Activity begins before the choice is understood.",
  },
] as const;

export const EDL_OUTCOMES = [
  "A precise and owned Decision Charter.",
  "An explicit view of assumptions, evidence and credible strategic options.",
  "Calibrated residual risk and clear decision rights.",
  "A Decision Integrity Brief and outcome-led Mobilisation Plan.",
  "A repeatable executive discipline for future consequential choices.",
] as const;

export const EDL_STAGES = [
  {
    stage: "FRAME",
    purpose: "Define the actual decision, stakes, ownership and boundaries.",
    output: "Decision Charter",
  },
  {
    stage: "TEST",
    purpose: "Expose assumptions, examine evidence and compare credible alternatives.",
    output: "Assumption, Evidence and Options Maps",
  },
  {
    stage: "ALIGN",
    purpose: "Clarify decision rights, stakeholder realities and residual risk.",
    output: "Decision Integrity Brief",
  },
  {
    stage: "MOBILISE",
    purpose: "Translate the decision into ownership, outcomes, sequencing and review.",
    output: "Mobilisation Plan",
  },
] as const;

export const EDL_INCLUDED = [
  "Four live, three-hour executive decision laboratories.",
  "One confidential 45-minute individual advisory session.",
  "Applied working materials and executive decision tools.",
  "Three to five hours of workplace application across the programme.",
  "One 90-minute implementation review approximately 30 days later.",
] as const;

export const EDL_SUITABLE_FOR = [
  "Chief executives, managing directors, business owners and executive or functional directors.",
  "Senior leaders with decisions affecting several stakeholders, functions or material resources.",
  "Executives with a current choice involving money, time, capability, reputation or organisational standing.",
  "Leaders who own the decision, materially influence it or have direct access to the legitimate owner.",
] as const;

export const EDL_NOT_FOR = [
  "Routine operational choices without strategic consequence.",
  "General leadership inspiration without a live applied case.",
  "Participants seeking the facilitator or cohort to make the decision for them.",
  "Legal, tax, clinical, investment or other regulated professional advice.",
  "Cases that cannot be made safe for cohort work through anonymisation or use of a neutral case.",
] as const;

export const EDL_ARCHITECTURE = [
  {
    name: "Decision Integrity Framework™",
    detail: "Assumption Clarity, Structural Soundness, Risk Calibration and Execution Leverage.",
  },
  {
    name: "Executive Alignment Index™",
    detail: "Clarity, Alignment, Leadership Influence, Decision Authority and Coordination.",
  },
  { name: "Programme journey", detail: "FRAME → TEST → ALIGN → MOBILISE." },
] as const;

export const EDL_FAQ = [
  {
    q: "Is this coaching, consulting or training?",
    a: "It is principal-led applied executive development. It combines structured frameworks, facilitated challenge, individual application and a bounded confidential advisory session. The executive retains decision responsibility.",
  },
  {
    q: "Must my decision already be authorised?",
    a: "No. It may be open, recommended or approaching authorisation, provided genuine alternatives remain and you can influence the legitimate process.",
  },
  {
    q: "Will the cohort advise me what to do?",
    a: "No. Peers challenge framing, assumptions, evidence, risk and mobilisation; they do not make the decision or provide professional advice.",
  },
  {
    q: "How is confidentiality handled?",
    a: "Cases are anonymised, recording is prohibited and participants sign the final confidentiality undertaking. Absolute confidentiality cannot be guaranteed, so disclosure is minimised.",
  },
  {
    q: "Can my employer fund the place?",
    a: "Yes. An invoice or employer-information route is available after programme suitability has been established.",
  },
  {
    q: "What if I miss a session?",
    a: "All sessions are expected and Week 4 is mandatory. Any exceptional arrangement is governed by the final enrolment terms and must be approved in advance.",
  },
  {
    q: "Is the programme accredited or CPD-certified?",
    a: "No accreditation or CPD claim is made for the founding cohort.",
  },
  {
    q: "Will I receive a certificate?",
    a: "Completion recognition is issued only after the defined outputs and 30-day review requirements are met.",
  },
  {
    q: "What happens if my decision changes?",
    a: "The programme is designed to examine changed evidence and legitimate review. A materially unsuitable case may require substitution or redirection.",
  },
  {
    q: "Is the result guaranteed?",
    a: "No. The programme develops decision discipline and application; organisational and commercial outcomes remain uncertain.",
  },
] as const;

/** Options offered for "How did you hear about the programme?". */
export const EDL_REFERRAL_SOURCES = [
  "LinkedIn",
  "Search",
  "Direct approach from Bright Leadership Consulting",
  "Referral from a colleague or peer",
  "Existing relationship with Bright Leadership Consulting",
  "Newsletter or email",
  "Event or speaking engagement",
  "Other",
] as const;

export const EDL_FUNDING_ROUTES = [
  "Self-funded",
  "Employer-funded",
  "Funding route not yet confirmed",
] as const;

export const EDL_YES_NO_UNSURE = ["Yes", "No", "Unsure"] as const;

export const EDL_ACCESS_ROUTES = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes — I will describe what needs to be arranged" },
  { value: "private", label: "Prefer to discuss privately" },
] as const;

/** Administrative status values, in review order. */
export const EDL_APPLICATION_STATUSES = [
  "submitted",
  "under_review",
  "clarification_required",
  "clarification_scheduled",
  "conflict_hold",
  "conditionally_accepted",
  "waitlisted",
  "declined",
  "withdrawn",
  "offer_lapsed",
  "enrolled",
] as const;

export type EdlApplicationStatus = (typeof EDL_APPLICATION_STATUSES)[number];

export const EDL_STATUS_LABELS: Record<EdlApplicationStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  clarification_required: "Clarification required",
  clarification_scheduled: "Clarification scheduled",
  conflict_hold: "Conflict hold",
  conditionally_accepted: "Conditionally accepted",
  waitlisted: "Waitlisted",
  declined: "Declined",
  withdrawn: "Withdrawn",
  offer_lapsed: "Offer lapsed",
  enrolled: "Enrolled",
};

export const EDL_EMPLOYER_STATUSES = [
  "received",
  "pack_issued",
  "approver_verified",
  "offer_issued",
  "committed",
  "closed",
] as const;

export type EdlEmployerRequestStatus = (typeof EDL_EMPLOYER_STATUSES)[number];

export const EDL_EMPLOYER_STATUS_LABELS: Record<EdlEmployerRequestStatus, string> = {
  received: "Received",
  pack_issued: "Employer pack issued",
  approver_verified: "Approver verified",
  offer_issued: "Conditional offer issued",
  committed: "Employer commitment accepted",
  closed: "Closed",
};

/** Working days a conditional place is held before it lapses. */
export const EDL_OFFER_RESERVATION_WORKING_DAYS = 5;
