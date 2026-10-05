ALTER TABLE public.contact_submissions
  ADD COLUMN utm_source text,
  ADD COLUMN utm_medium text,
  ADD COLUMN utm_campaign text;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_utm_format_check CHECK (
    (utm_source IS NULL OR utm_source ~ '^[A-Za-z0-9._-]{1,100}$') AND
    (utm_medium IS NULL OR utm_medium ~ '^[A-Za-z0-9._-]{1,100}$') AND
    (utm_campaign IS NULL OR utm_campaign ~ '^[A-Za-z0-9._-]{1,100}$')
  );

CREATE TABLE public.marketing_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  consent_text text NOT NULL,
  consent_version text NOT NULL,
  source_page text NOT NULL CHECK (char_length(source_page) <= 200),
  consented_at timestamptz NOT NULL DEFAULT now(),
  unsubscribe_token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX marketing_consents_email_idx ON public.marketing_consents (lower(email));

GRANT SELECT ON public.marketing_consents TO authenticated;
GRANT ALL ON public.marketing_consents TO service_role;
ALTER TABLE public.marketing_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view marketing consents"
  ON public.marketing_consents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));