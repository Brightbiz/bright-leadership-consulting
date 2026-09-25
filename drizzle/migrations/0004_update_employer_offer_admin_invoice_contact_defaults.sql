ALTER TABLE public.employer_offers
  ALTER COLUMN invoice_contact_email SET DEFAULT 'admin@brightleadershipconsulting.com',
  ALTER COLUMN invoice_payment_instructions SET DEFAULT 'Payment is due within 30 calendar days of the invoice date. Bank transfer details are supplied separately by Bright Leadership Consulting. Use the invoice number as the payment reference.';

COMMENT ON COLUMN public.employer_offers.invoice_contact_email IS 'Bright administration email shown on accepted employer-funded ELM invoices for invoice, payment and programme access questions.';
COMMENT ON COLUMN public.employer_offers.invoice_payment_instructions IS 'Payment instructions shown on the employer-funded ELM invoice template; mailbox routing is held separately in invoice_contact_email.';