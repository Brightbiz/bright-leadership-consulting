CREATE TABLE public.admin_action_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id uuid,
  operator_email text,
  action text NOT NULL,
  outcome text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_action_log_operator_action_idx
  ON public.admin_action_log (operator_id, action, created_at DESC);

GRANT SELECT ON public.admin_action_log TO authenticated;
GRANT ALL ON public.admin_action_log TO service_role;

ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read the administrative action log"
  ON public.admin_action_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));