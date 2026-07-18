ALTER TABLE public.outreach_recipients
  ADD COLUMN IF NOT EXISTS cadence_days integer NOT NULL DEFAULT 14,
  ADD COLUMN IF NOT EXISTS do_not_follow_up boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS snooze_until timestamptz;