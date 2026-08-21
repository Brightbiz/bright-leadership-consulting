ALTER TABLE public.ai_audit_requests
  ADD COLUMN IF NOT EXISTS action_status text NOT NULL DEFAULT 'needs_action',
  ADD COLUMN IF NOT EXISTS actioned_at timestamptz,
  ADD COLUMN IF NOT EXISTS actioned_by uuid,
  ADD COLUMN IF NOT EXISTS actioned_by_email text,
  ADD COLUMN IF NOT EXISTS crm_failure_ack_at timestamptz,
  ADD COLUMN IF NOT EXISTS crm_failure_ack_by_email text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_audit_requests_action_status_check') THEN
    ALTER TABLE public.ai_audit_requests
      ADD CONSTRAINT ai_audit_requests_action_status_check
      CHECK (action_status IN ('needs_action', 'actioned'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ai_audit_requests_action_status_idx
  ON public.ai_audit_requests (action_status, created_at);