ALTER TABLE public.outreach_drafts
  ADD COLUMN IF NOT EXISTS send_claim_id uuid,
  ADD COLUMN IF NOT EXISTS send_claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS send_state text NOT NULL DEFAULT 'unsent',
  ADD COLUMN IF NOT EXISTS provider_message_id text,
  ADD COLUMN IF NOT EXISTS provider_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivery_status text,
  ADD COLUMN IF NOT EXISTS reconciliation_note text;
ALTER TABLE public.outreach_drafts DROP CONSTRAINT IF EXISTS outreach_drafts_send_state_chk;
ALTER TABLE public.outreach_drafts ADD CONSTRAINT outreach_drafts_send_state_chk
  CHECK (send_state IN ('unsent','claimed','accepted','rejected','needs_reconciliation','suppressed'));