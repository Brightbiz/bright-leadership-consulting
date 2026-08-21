CREATE TABLE public.ai_audit_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  name text,
  organisation text,
  job_title text,
  readiness_score integer NOT NULL,
  readiness_band text NOT NULL DEFAULT '',
  classification text NOT NULL DEFAULT '',
  routing jsonb NOT NULL DEFAULT '{}'::jsonb,
  marketing_consent boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.ai_audit_responses TO service_role;
GRANT SELECT ON public.ai_audit_responses TO authenticated;
ALTER TABLE public.ai_audit_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view ai audit responses" ON public.ai_audit_responses
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.ai_audit_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id uuid REFERENCES public.ai_audit_responses(id) ON DELETE SET NULL,
  email text NOT NULL,
  name text,
  organisation text,
  job_title text,
  request_type text NOT NULL,
  action_label text NOT NULL DEFAULT '',
  product text NOT NULL DEFAULT '',
  participant_quantity integer,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.ai_audit_requests TO service_role;
GRANT SELECT, UPDATE ON public.ai_audit_requests TO authenticated;
ALTER TABLE public.ai_audit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view ai audit requests" ON public.ai_audit_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update ai audit requests" ON public.ai_audit_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_ai_audit_requests_updated_at
  BEFORE UPDATE ON public.ai_audit_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX ai_audit_requests_created_at_idx ON public.ai_audit_requests (created_at DESC);
CREATE INDEX ai_audit_responses_created_at_idx ON public.ai_audit_responses (created_at DESC);