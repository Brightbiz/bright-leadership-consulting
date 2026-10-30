CREATE TABLE public.lp_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  organisation text,
  job_title text,
  contact_submission_id uuid REFERENCES public.contact_submissions(id) ON DELETE SET NULL,
  thinkific_user_id text,
  thinkific_account_status text NOT NULL DEFAULT 'not_checked' CHECK (thinkific_account_status IN ('not_checked','existing_account','new_account_needed','account_created')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lp_participants_email_normalised CHECK (email = lower(btrim(email)) AND position('@' in email) > 1)
);
CREATE UNIQUE INDEX lp_participants_email_key ON public.lp_participants (email);
CREATE UNIQUE INDEX lp_participants_thinkific_user_key ON public.lp_participants (thinkific_user_id) WHERE thinkific_user_id IS NOT NULL;

CREATE TABLE public.lp_enrolments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES public.lp_participants(id) ON DELETE CASCADE,
  cohort_code text NOT NULL CHECK (length(btrim(cohort_code)) BETWEEN 1 AND 80),
  enrolment_status text NOT NULL DEFAULT 'pending' CHECK (enrolment_status IN ('pending','enrolled','withdrawn')),
  invitation_status text NOT NULL DEFAULT 'not_sent' CHECK (invitation_status IN ('not_sent','sent','accepted')),
  invitation_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lp_enrolments_one_per_cohort UNIQUE (participant_id, cohort_code)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lp_participants TO authenticated;
GRANT ALL ON public.lp_participants TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lp_enrolments TO authenticated;
GRANT ALL ON public.lp_enrolments TO service_role;

ALTER TABLE public.lp_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lp_enrolments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage participants" ON public.lp_participants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage enrolments" ON public.lp_enrolments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_lp_participants_updated_at BEFORE UPDATE ON public.lp_participants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lp_enrolments_updated_at BEFORE UPDATE ON public.lp_enrolments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();