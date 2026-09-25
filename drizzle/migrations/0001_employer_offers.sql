CREATE TABLE public.employer_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  contact_submission_id uuid REFERENCES public.contact_submissions(id) ON DELETE SET NULL,
  programme text NOT NULL DEFAULT 'Executive Leadership Mastery Programme',
  employer_organisation text NOT NULL,
  signatory_name text NOT NULL,
  signatory_email text NOT NULL,
  participant_name text NOT NULL,
  participant_role text,
  participant_email text,
  fee_gbp numeric NOT NULL DEFAULT 1297,
  payment_method text NOT NULL DEFAULT 'invoice',
  terms_version text NOT NULL,
  status text NOT NULL DEFAULT 'issued',
  expires_at timestamptz NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  issued_by uuid,
  issued_by_email text,
  first_opened_at timestamptz,
  last_opened_at timestamptz,
  open_count integer NOT NULL DEFAULT 0,
  accepted_at timestamptz,
  accepted_name text,
  accepted_role text,
  accepted_email text,
  po_number text,
  invoice_contact text,
  non_standard_request text,
  referred_at timestamptz,
  paid_at timestamptz,
  withdrawn_at timestamptz,
  superseded_by uuid REFERENCES public.employer_offers(id),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT employer_offers_status_chk CHECK (status IN ('issued','accepted','referred','paid','withdrawn','superseded'))
);
GRANT SELECT, INSERT, UPDATE ON public.employer_offers TO authenticated;
GRANT ALL ON public.employer_offers TO service_role;
ALTER TABLE public.employer_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage employer offers" ON public.employer_offers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX employer_offers_submission_idx ON public.employer_offers(contact_submission_id);
CREATE TRIGGER update_employer_offers_updated_at BEFORE UPDATE ON public.employer_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();