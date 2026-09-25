import {
  EMPLOYER_OFFER_PAYMENT_DUE_DAYS,
  EMPLOYER_OFFER_VAT_WORDING,
  LEGAL_CONTRACTING_IDENTITY,
  LEGAL_SUPPLIER_ADDRESS_INLINE,
  PRIVACY_NOTICE_URL,
  TERMS_AND_CONDITIONS_URL,
  TERMS_AND_CONDITIONS_VERSION,
} from "./legal";

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
export const EMPLOYER_OFFER_TERMS_VERSION = "ELM-EMP-2026-09-v4";
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
    heading: "1. Parties and scope",
    body: `This offer is made by ${LEGAL_CONTRACTING_IDENTITY}, of ${LEGAL_SUPPLIER_ADDRESS_INLINE} ("Bright Leadership Consulting"), to the employer named above. It is for one individual place on the Executive Leadership Mastery Programme for the named participant shown above, funded by that employer. It is not an organisational, multiple-place, cohort, facilitated or tailored engagement.`,
  },
  {
    heading: "2. Fee and VAT",
    body: `The fee is £1,297 for one individual place. VAT is £0.00. ${EMPLOYER_OFFER_VAT_WORDING}`,
  },
  {
    heading: "3. When the contract becomes binding",
    body: "A binding contract between the employer and Bright Leadership Consulting is formed when the employer's authorised representative accepts this offer using the button below before the expiry date. Bright Leadership Consulting will record the acceptance and send confirmation. No contract is formed if the offer has expired, been withdrawn or been reissued, or where the employer selects the referral route for a non-standard requirement.",
  },
  {
    heading: "4. Authority to accept",
    body: "The person accepting this offer confirms that they are authorised to enter into this contract on behalf of the employer named above, and that the employer is purchasing in the course of its business.",
  },
  {
    heading: "5. Invoicing and payment",
    body: `Bright Leadership Consulting will issue an invoice to the invoicing contact provided after acceptance. Payment is due within ${EMPLOYER_OFFER_PAYMENT_DUE_DAYS} calendar days of the invoice date. This is the final payment deadline, not a waiting period: the employer may pay the invoice at any time before the due date. A purchase order number is optional unless the employer requires one; where supplied, it will be quoted on the invoice. Providing, omitting or delaying a purchase order number does not change the payment deadline.`,
  },
  {
    heading: "6. Access",
    body: "Programme access will be enabled for the named participant within two business days after Bright Leadership Consulting has received both cleared payment in full and the information reasonably required to create the participant's access. Bright Leadership Consulting may withhold access until both requirements have been satisfied.",
  },
  {
    heading: "7. Overdue payment",
    body: "If payment has not been received by the due date, Bright Leadership Consulting may continue to withhold programme access and recover the sum due. Bright Leadership Consulting reserves its right to claim statutory interest and compensation under the Late Payment of Commercial Debts (Interest) Act 1998.",
  },
  {
    heading: "8. Named participant and personal access",
    body: "The place is for the named participant only. Programme access is personal to that participant and may not be shared, transferred or used by anyone else. The participant cannot be changed through this offer. Any change requires Bright Leadership Consulting's written approval and a reissued offer.",
  },
  {
    heading: "9. Cancellation and refunds",
    body: "The employer may cancel this purchase by giving Bright Leadership Consulting written notice before programme access has been enabled for the named participant. Bright Leadership Consulting will refund any fee already paid. Once programme access has been enabled, the fee is non-refundable, including where the participant does not start or complete the Programme, except where a refund is required by law. Nothing in this clause limits any right that cannot lawfully be excluded.",
  },
  {
    heading: "10. Non-standard requirements",
    body: "Requests for different pricing, additional places, bespoke delivery, alternative payment terms, a change of participant or supplier-onboarding conditions are not covered by this offer. They will be referred to Bright Leadership Consulting for review, and no acceptance or purchase will proceed until Bright Leadership Consulting has responded in writing.",
  },
  {
    heading: "11. No guaranteed outcome",
    body: "The Programme provides structured leadership development. Participation does not guarantee any particular business, career, commercial or leadership outcome.",
  },
  {
    heading: "12. Terms and Conditions, Privacy Notice and validity",
    body: `This offer incorporates Bright Leadership Consulting's Terms and Conditions (${TERMS_AND_CONDITIONS_URL}), Version ${TERMS_AND_CONDITIONS_VERSION}, a copy of which is kept with the record of acceptance. If this offer conflicts with the Terms and Conditions, this offer prevails for this purchase. Bright Leadership Consulting's Privacy Notice (${PRIVACY_NOTICE_URL}) is provided separately. It explains how employer and participant information is used and does not form part of this contract. This offer is valid until the expiry date shown and may be withdrawn by Bright Leadership Consulting at any time before acceptance.`,
  },
];

export const getEmployerOfferConfirmations = (employerOrganisation: string, participantName: string) => ({
  authority: `I am authorised to accept this offer on behalf of ${employerOrganisation}, which is purchasing in the course of its business.`,
  participant: `The place is for ${participantName} only. Access is personal to them and cannot be shared or transferred, and the participant cannot be changed without Bright Leadership Consulting's written approval and a reissued offer.`,
  terms: "I have read and accept this offer and the Terms and Conditions incorporated into it. I acknowledge that I have been given access to Bright Leadership Consulting's Privacy Notice.",
  privacy: "I confirm that I am authorised to provide the named participant's information for this purchase and that the participant will be given Bright Leadership Consulting's Privacy Notice.",
});

export const getEmployerOfferAcceptanceStatement = (employerOrganisation: string) =>
  `By selecting 'Accept offer and form contract', you accept this offer on behalf of ${employerOrganisation}. A binding contract is formed on acceptance. An invoice for £1,297 will be issued, showing VAT £0.00 and payable within ${EMPLOYER_OFFER_PAYMENT_DUE_DAYS} calendar days of the invoice date. ${EMPLOYER_OFFER_VAT_WORDING}`;

export const getEmployerOfferTermsText = () =>
  employerOfferTerms.map((term) => `${term.heading}\n${term.body}`).join("\n\n");
