CREATE TABLE public.outreach_batch_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid,
  approved_by_email text,
  recipient_draft_ids uuid[] NOT NULL,
  content_hash text NOT NULL,
  sender text NOT NULL,
  max_count integer NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  note text
);

GRANT SELECT, INSERT ON public.outreach_batch_approvals TO authenticated;
GRANT ALL ON public.outreach_batch_approvals TO service_role;

ALTER TABLE public.outreach_batch_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read batch approvals"
ON public.outreach_batch_approvals
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create batch approvals"
ON public.outreach_batch_approvals
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));