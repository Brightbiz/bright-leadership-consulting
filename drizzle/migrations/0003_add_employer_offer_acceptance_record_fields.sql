ALTER TABLE public.employer_offers
  ADD COLUMN IF NOT EXISTS payment_due_days integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS accepted_offer_terms_version text,
  ADD COLUMN IF NOT EXISTS accepted_offer_terms_text text,
  ADD COLUMN IF NOT EXISTS accepted_terms_conditions_version text,
  ADD COLUMN IF NOT EXISTS accepted_terms_conditions_url text,
  ADD COLUMN IF NOT EXISTS accepted_terms_conditions_text text,
  ADD COLUMN IF NOT EXISTS accepted_vat_treatment text,
  ADD COLUMN IF NOT EXISTS accepted_confirmation_authority_text text,
  ADD COLUMN IF NOT EXISTS accepted_confirmation_participant_text text,
  ADD COLUMN IF NOT EXISTS accepted_confirmation_terms_text text,
  ADD COLUMN IF NOT EXISTS accepted_confirmation_privacy_text text,
  ADD COLUMN IF NOT EXISTS accepted_statement_text text,
  ADD COLUMN IF NOT EXISTS accepted_at_uk text,
  ADD COLUMN IF NOT EXISTS paid_marked_by uuid,
  ADD COLUMN IF NOT EXISTS paid_marked_by_email text,
  ADD COLUMN IF NOT EXISTS paid_marked_at_uk text;

COMMENT ON COLUMN public.employer_offers.payment_due_days IS 'Employer-funded ELM invoice payment term in calendar days.';
COMMENT ON COLUMN public.employer_offers.accepted_offer_terms_version IS 'Offer terms version accepted by the employer representative.';
COMMENT ON COLUMN public.employer_offers.accepted_offer_terms_text IS 'Permanent text snapshot of the offer terms accepted.';
COMMENT ON COLUMN public.employer_offers.accepted_terms_conditions_version IS 'Terms and Conditions version incorporated into the accepted offer.';
COMMENT ON COLUMN public.employer_offers.accepted_terms_conditions_url IS 'Terms and Conditions URL incorporated into the accepted offer.';
COMMENT ON COLUMN public.employer_offers.accepted_terms_conditions_text IS 'Permanent text snapshot of the Terms and Conditions incorporated into the accepted offer.';
COMMENT ON COLUMN public.employer_offers.accepted_vat_treatment IS 'Exact VAT wording shown and accepted for this offer.';
COMMENT ON COLUMN public.employer_offers.accepted_confirmation_authority_text IS 'Exact authority confirmation text accepted.';
COMMENT ON COLUMN public.employer_offers.accepted_confirmation_participant_text IS 'Exact named-participant confirmation text accepted.';
COMMENT ON COLUMN public.employer_offers.accepted_confirmation_terms_text IS 'Exact offer-and-terms confirmation text accepted.';
COMMENT ON COLUMN public.employer_offers.accepted_confirmation_privacy_text IS 'Exact participant-information and Privacy Notice confirmation text accepted.';
COMMENT ON COLUMN public.employer_offers.accepted_statement_text IS 'Exact acceptance statement shown beside the acceptance button.';
COMMENT ON COLUMN public.employer_offers.accepted_at_uk IS 'UK-local acceptance timestamp including GMT or BST label, stored for display/audit.';
COMMENT ON COLUMN public.employer_offers.paid_marked_by IS 'Administrator user id who marked the employer-funded invoice paid.';
COMMENT ON COLUMN public.employer_offers.paid_marked_by_email IS 'Administrator email who marked the employer-funded invoice paid.';
COMMENT ON COLUMN public.employer_offers.paid_marked_at_uk IS 'UK-local paid timestamp including GMT or BST label, stored for display/audit.';