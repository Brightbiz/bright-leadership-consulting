export const LEGAL_CONTRACTING_IDENTITY =
  "Irene A. Agunbiade trading as Bright Leadership Consulting";

export const LEGAL_SUPPLIER_ADDRESS_LINES = [
  "82 James Carter Road",
  "Mildenhall",
  "England",
  "IP28 7DE",
] as const;

export const LEGAL_SUPPLIER_ADDRESS = LEGAL_SUPPLIER_ADDRESS_LINES.join("\n");
export const LEGAL_SUPPLIER_ADDRESS_INLINE = LEGAL_SUPPLIER_ADDRESS_LINES.join(", ");

export const BRIGHT_CONTACT_EMAIL = "info@brightleadershipconsulting.com";

export const TERMS_AND_CONDITIONS_VERSION = "TC-2026-09";
export const TERMS_AND_CONDITIONS_URL = "https://brightleadershipconsulting.com/terms";
export const PRIVACY_NOTICE_URL = "https://brightleadershipconsulting.com/privacy";

export const EMPLOYER_OFFER_PAYMENT_DUE_DAYS = 30;
export const EMPLOYER_OFFER_VAT_WORDING =
  "VAT is not charged because the supplier is not registered for VAT.";
export const EMPLOYER_OFFER_INVOICE_PAYMENT_INSTRUCTIONS =
  `Payment is due within ${EMPLOYER_OFFER_PAYMENT_DUE_DAYS} calendar days of the invoice date. Bank transfer details are supplied separately by Bright Leadership Consulting. Use the invoice number as the payment reference. For payment questions, contact ${BRIGHT_CONTACT_EMAIL}.`;

export const TERMS_AND_CONDITIONS_ACCEPTANCE_SNAPSHOT = [
  `Contracting and invoicing party: ${LEGAL_CONTRACTING_IDENTITY}, ${LEGAL_SUPPLIER_ADDRESS_INLINE}.`,
  "Employer-funded purchases of an individual place for a named participant are governed by the private offer issued for that purchase. Where the private offer conflicts with these Terms, the private offer prevails for that purchase.",
  "Programme fees are stated in British Pounds. Any tax or VAT treatment applicable to an invoiced offer is stated in the offer and invoice.",
  "Bright Leadership Consulting is not VAT registered. Employer-funded invoices issued by the supplier show VAT as £0.00 and state that VAT is not charged because the supplier is not registered for VAT.",
  "Providing, omitting or delaying a purchase-order number does not replace the employer's obligation to pay an accepted invoice in accordance with the agreed payment terms.",
].join("\n");