
ALTER TABLE public.outreach_drafts
  ADD COLUMN IF NOT EXISTS parent_draft_id UUID REFERENCES public.outreach_drafts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_follow_up BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reply_text TEXT,
  ADD COLUMN IF NOT EXISTS reply_sentiment TEXT CHECK (reply_sentiment IN ('positive','neutral','negative','no_thanks','meeting_booked'));

CREATE INDEX IF NOT EXISTS outreach_drafts_parent_idx ON public.outreach_drafts(parent_draft_id);
CREATE INDEX IF NOT EXISTS outreach_drafts_crm_idx ON public.outreach_drafts(crm_contact_id);
