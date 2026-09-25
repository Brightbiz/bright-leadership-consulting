/**
 * Standard employer-funded ELM offer terms.
 *
 * Shown on every private offer link. Only these standard terms can appear;
 * anything non-standard is referred back to Bright Leadership Consulting.
 *
 * EMPLOYER_OFFER_TERMS_APPROVED must be set to true by Bright before any offer
 * can be issued. Changing any clause requires a new TERMS_VERSION.
 */

export const EMPLOYER_OFFER_TERMS_APPROVED = false;
export const EMPLOYER_OFFER_TERMS_VERSION = "ELM-EMP-2026-09-v1";
export const EMPLOYER_OFFER_DEFAULT_EXPIRY_DAYS = 14;
export const EMPLOYER_OFFER_FEE_GBP = 1297;

export const EMPLOYER_OFFER_STATUS_LABELS: Record<string, string> = {
  issued: "Issued",
  accepted: "Accepted",
  referred: "Referred to Bright",
  paid: "Paid",
  withdrawn: "Withdrawn",
  superseded: "Reissued",
  expired: "Expired",
};

export const employerOfferTerms: { heading: string; body: string }[] = [
  {
    heading: "1. Scope of this offer",
    body: "This offer is for one individual place on the Executive Leadership Mastery Programme for the named participant shown above, funded by the named employer. It is not an organisational, multiple-place, cohort or facilitated engagement.",
  },
  {
    heading: "2. Fee",
    body: "The fee is £1,297 for one individual place, as published on the programme page. The fee is invoiced to the employer on acceptance.",
  },
  {
    heading: "3. Invoicing and payment",
    body: "Bright Leadership Consulting will issue an invoice to the invoicing contact provided. A purchase order number will be quoted on the invoice where supplied. Payment is due within 30 days of the invoice date.",
  },
  {
    heading: "4. Access",
    body: "Programme access is issued to the named participant once payment has been received. Access is personal to the named participant and may not be shared.",
  },
  {
    heading: "5. Named participant",
    body: "The participant cannot be changed through this link. Any change of participant requires Bright Leadership Consulting's written approval and a reissued offer.",
  },
  {
    heading: "6. Non-standard requirements",
    body: "Requests for different pricing, additional places, bespoke delivery, alternative payment terms or supplier-onboarding conditions are not covered by this offer and will be referred back to Bright Leadership Consulting for review.",
  },
  {
    heading: "7. CPD",
    body: "The programme is accredited CPD activity with The CPD Standards Office (Provider 50838). A CPD Certificate of Attendance is issued to the participant on completion.",
  },
  {
    heading: "8. General terms",
    body: "This offer is made subject to Bright Leadership Consulting's Terms and Conditions and Privacy Notice, published on this website. Where they conflict, the terms on this page apply to this offer.",
  },
  {
    heading: "9. Validity",
    body: "This offer is valid until the expiry date shown and may be withdrawn by Bright Leadership Consulting before acceptance.",
  },
];
