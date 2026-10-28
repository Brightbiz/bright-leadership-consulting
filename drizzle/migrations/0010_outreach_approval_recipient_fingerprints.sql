ALTER TABLE public.outreach_batch_approvals ADD COLUMN recipient_fingerprints jsonb;

COMMENT ON COLUMN public.outreach_batch_approvals.recipient_fingerprints IS 'Map of draft id -> sha256 of subject, recipient email, name, role and company at approval time. Batch sends refuse any approval without it or with any mismatch.';

CREATE OR REPLACE FUNCTION public.outreach_draft_fingerprint(_draft_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT encode(extensions.digest(concat_ws(chr(31),
    coalesce(d.subject, ''),
    lower(btrim(coalesce(r.email, ''), E' \t\r\n')),
    coalesce(d.recipient_name, ''),
    coalesce(d.recipient_role, ''),
    coalesce(d.company, '')), 'sha256'), 'hex')
  FROM public.outreach_drafts d
  LEFT JOIN public.outreach_recipients r ON r.id = d.recipient_id
  WHERE d.id = _draft_id
$$;

REVOKE ALL ON FUNCTION public.outreach_draft_fingerprint(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.outreach_draft_fingerprint(uuid) TO service_role;