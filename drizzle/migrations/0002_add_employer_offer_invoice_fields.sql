ALTER TABLE public.employer_offers
  ADD COLUMN IF NOT EXISTS supplier_contracting_identity text NOT NULL DEFAULT 'Irene A. Agunbiade trading as Bright Leadership Consulting',
  ADD COLUMN IF NOT EXISTS supplier_address text NOT NULL DEFAULT '82 James Carter Road
Mildenhall
England
IP28 7DE',
  ADD COLUMN IF NOT EXISTS supplier_vat_registered boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS invoice_is_vat_invoice boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS invoice_number text,
  ADD COLUMN IF NOT EXISTS invoice_date date,
  ADD COLUMN IF NOT EXISTS payment_due_date date,
  ADD COLUMN IF NOT EXISTS invoice_net_amount_gbp numeric NOT NULL DEFAULT 1297,
  ADD COLUMN IF NOT EXISTS invoice_vat_amount_gbp numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invoice_total_gbp numeric NOT NULL DEFAULT 1297,
  ADD COLUMN IF NOT EXISTS invoice_description text NOT NULL DEFAULT 'One named individual place on the Executive Leadership Mastery Programme for [participant name].',
  ADD COLUMN IF NOT EXISTS invoice_payment_instructions text NOT NULL DEFAULT 'Payment is due within 30 days of the invoice date by bank transfer using the payment details supplied by Bright Leadership Consulting. For payment questions, contact info@brightleadershipconsulting.com.',
  ADD COLUMN IF NOT EXISTS invoice_contact_email text NOT NULL DEFAULT 'info@brightleadershipconsulting.com';

CREATE UNIQUE INDEX IF NOT EXISTS employer_offers_invoice_number_uidx
  ON public.employer_offers (invoice_number)
  WHERE invoice_number IS NOT NULL;

COMMENT ON COLUMN public.employer_offers.supplier_contracting_identity IS 'Contracting identity shown on private employer offers, acceptance records, and invoices.';
COMMENT ON COLUMN public.employer_offers.supplier_address IS 'Supplier address shown on private employer offer invoices.';
COMMENT ON COLUMN public.employer_offers.supplier_vat_registered IS 'False for current Bright Leadership Consulting invoices because the supplier is not VAT registered.';
COMMENT ON COLUMN public.employer_offers.invoice_is_vat_invoice IS 'False for current Bright Leadership Consulting invoices; invoices must not be described as VAT invoices.';
COMMENT ON COLUMN public.employer_offers.invoice_number IS 'Invoice number generated when an employer-funded ELM private offer is accepted.';
COMMENT ON COLUMN public.employer_offers.invoice_date IS 'Invoice date generated when an employer-funded ELM private offer is accepted.';
COMMENT ON COLUMN public.employer_offers.payment_due_date IS 'Payment due date generated from the accepted offer payment terms.';
COMMENT ON COLUMN public.employer_offers.invoice_description IS 'Line-item wording for the employer-funded ELM invoice; participant name is substituted at acceptance.';
COMMENT ON COLUMN public.employer_offers.invoice_payment_instructions IS 'Payment instructions shown on the employer-funded ELM invoice template.';
COMMENT ON COLUMN public.employer_offers.invoice_contact_email IS 'Bright contact email shown on the employer-funded ELM invoice template.';