CREATE TABLE public.outreach_suppressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  reason text,
  added_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX outreach_suppressions_email_key ON public.outreach_suppressions (lower(email));
GRANT SELECT, INSERT, DELETE ON public.outreach_suppressions TO authenticated;
GRANT ALL ON public.outreach_suppressions TO service_role;
ALTER TABLE public.outreach_suppressions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage suppressions" ON public.outreach_suppressions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));