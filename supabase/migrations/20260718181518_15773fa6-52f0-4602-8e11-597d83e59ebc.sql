
-- 1. crm_contacts (previously missing — referenced by AdminCRM and sync function)
CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  source_table TEXT,
  source_record_id UUID,
  status TEXT NOT NULL DEFAULT 'new',
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  deal_stage TEXT,
  estimated_value NUMERIC,
  next_follow_up TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_contacts TO authenticated;
GRANT ALL ON public.crm_contacts TO service_role;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage crm_contacts"
  ON public.crm_contacts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. outreach_recipients
CREATE TABLE public.outreach_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'Chair',
  company TEXT NOT NULL DEFAULT '',
  email TEXT,
  context TEXT NOT NULL DEFAULT '',
  priority BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach_recipients TO authenticated;
GRANT ALL ON public.outreach_recipients TO service_role;
ALTER TABLE public.outreach_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage outreach_recipients"
  ON public.outreach_recipients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_outreach_recipients_updated_at
  BEFORE UPDATE ON public.outreach_recipients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX outreach_recipients_user_idx ON public.outreach_recipients(user_id, sort_order);

-- 3. outreach_drafts
DO $$ BEGIN
  CREATE TYPE public.outreach_draft_status AS ENUM ('draft','sent','replied');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.outreach_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.outreach_recipients(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status public.outreach_draft_status NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  crm_contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach_drafts TO authenticated;
GRANT ALL ON public.outreach_drafts TO service_role;
ALTER TABLE public.outreach_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage outreach_drafts"
  ON public.outreach_drafts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_outreach_drafts_updated_at
  BEFORE UPDATE ON public.outreach_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX outreach_drafts_user_idx ON public.outreach_drafts(user_id, created_at DESC);
CREATE INDEX outreach_drafts_recipient_idx ON public.outreach_drafts(recipient_id);
