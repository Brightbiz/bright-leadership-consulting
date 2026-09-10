CREATE TYPE public.edl_application_status AS ENUM (
  'submitted','under_review','clarification_required','clarification_scheduled',
  'conflict_hold','conditionally_accepted','waitlisted','declined','withdrawn',
  'offer_lapsed','enrolled'
);

CREATE TYPE public.edl_employer_request_status AS ENUM (
  'received','pack_issued','approver_verified','offer_issued','committed','closed'
);

CREATE TABLE public.edl_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  full_name text NOT NULL,
  work_email text NOT NULL,
  telephone text NOT NULL,
  role_title text NOT NULL,
  organisation text NOT NULL,
  sector text NOT NULL,
  country text NOT NULL,
  time_zone text NOT NULL,
  linkedin_url text,
  referral_source text NOT NULL,
  referral_detail text,

  resp_current text NOT NULL,
  resp_decision_types text NOT NULL,
  resp_approvals text NOT NULL,
  resp_authority text NOT NULL,

  decision_statement text NOT NULL,
  decision_deadline date NOT NULL,
  decision_why_now text NOT NULL,
  decision_at_risk text NOT NULL,
  decision_already_decided text NOT NULL,
  decision_alternatives text NOT NULL,
  decision_off_limits text NOT NULL,
  anonymisable text NOT NULL,

  conflict_note text,
  ack_authorised boolean NOT NULL DEFAULT false,
  ack_no_recording boolean NOT NULL DEFAULT false,
  ack_confidentiality_limits boolean NOT NULL DEFAULT false,

  commit_attend boolean NOT NULL DEFAULT false,
  commit_week4 boolean NOT NULL DEFAULT false,
  commit_applied_work boolean NOT NULL DEFAULT false,
  commit_challenge boolean NOT NULL DEFAULT false,
  commit_confidentiality boolean NOT NULL DEFAULT false,

  funding_route text NOT NULL,
  sponsor_name text,
  sponsor_role text,
  sponsor_email text,
  org_legal_name text,
  po_required text,
  vendor_onboarding_required text,
  expected_approval_date date,

  decl_accurate boolean NOT NULL DEFAULT false,
  decl_no_admission_guarantee boolean NOT NULL DEFAULT false,
  decl_employer_funding_subject boolean NOT NULL DEFAULT false,
  decl_no_outcome_guarantee boolean NOT NULL DEFAULT false,
  decl_privacy_read boolean NOT NULL DEFAULT false,
  privacy_notice_version text NOT NULL,

  marketing_consent boolean NOT NULL DEFAULT false,
  marketing_consent_at timestamptz,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  gclid text,

  status public.edl_application_status NOT NULL DEFAULT 'submitted',
  reviewer_id uuid,
  review_notes text,
  decision_at timestamptz,
  offer_reserved_until timestamptz
);

CREATE TABLE public.edl_application_access_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.edl_applications(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  adjustment_route text NOT NULL,
  adjustment_detail text,
  preferred_contact_method text
);

CREATE TABLE public.edl_employer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  requester_name text NOT NULL,
  requester_role text NOT NULL,
  requester_organisation text NOT NULL,
  requester_email text NOT NULL,
  participant_name text,
  participant_role text,
  participant_email text,
  invoice_required text,
  po_required text,
  vendor_onboarding_required text,
  expected_decision_date date,
  admin_question text,
  privacy_ack boolean NOT NULL DEFAULT false,
  status public.edl_employer_request_status NOT NULL DEFAULT 'received',
  linked_application_id uuid REFERENCES public.edl_applications(id) ON DELETE SET NULL
);

CREATE INDEX edl_applications_created_at_idx ON public.edl_applications (created_at DESC);
CREATE INDEX edl_applications_status_idx ON public.edl_applications (status);
CREATE INDEX edl_access_needs_application_idx ON public.edl_application_access_needs (application_id);
CREATE INDEX edl_employer_requests_created_at_idx ON public.edl_employer_requests (created_at DESC);

GRANT SELECT, UPDATE, DELETE ON public.edl_applications TO authenticated;
GRANT ALL ON public.edl_applications TO service_role;
GRANT SELECT, DELETE ON public.edl_application_access_needs TO authenticated;
GRANT ALL ON public.edl_application_access_needs TO service_role;
GRANT SELECT, UPDATE, DELETE ON public.edl_employer_requests TO authenticated;
GRANT ALL ON public.edl_employer_requests TO service_role;

ALTER TABLE public.edl_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edl_application_access_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edl_employer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view applications"
  ON public.edl_applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications"
  ON public.edl_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications"
  ON public.edl_applications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view access needs"
  ON public.edl_application_access_needs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete access needs"
  ON public.edl_application_access_needs FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view employer requests"
  ON public.edl_employer_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update employer requests"
  ON public.edl_employer_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete employer requests"
  ON public.edl_employer_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER edl_applications_updated_at
  BEFORE UPDATE ON public.edl_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER edl_employer_requests_updated_at
  BEFORE UPDATE ON public.edl_employer_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();