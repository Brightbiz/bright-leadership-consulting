-- ============================================================
-- AI Leadership Readiness Audit — approved corrections
-- ============================================================

-- 1. Hashed submission ledger for layered rate limiting.
CREATE TABLE IF NOT EXISTS public.audit_submission_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  email_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.audit_submission_events TO service_role;
ALTER TABLE public.audit_submission_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS audit_submission_events_ip_idx
  ON public.audit_submission_events (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_submission_events_email_idx
  ON public.audit_submission_events (email_hash, created_at DESC);

-- 2. Subject-request audit trail (no substantive personal data retained).
CREATE TABLE IF NOT EXISTS public.data_subject_request_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash text NOT NULL,
  action text NOT NULL,
  operator_id uuid,
  affected jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.data_subject_request_log TO authenticated;
GRANT ALL ON public.data_subject_request_log TO service_role;
ALTER TABLE public.data_subject_request_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view subject request log" ON public.data_subject_request_log;
CREATE POLICY "Admins can view subject request log"
  ON public.data_subject_request_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Idempotency + retention on the audit response record.
ALTER TABLE public.ai_audit_responses
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS purge_after timestamptz NOT NULL DEFAULT (now() + interval '90 days');
CREATE UNIQUE INDEX IF NOT EXISTS ai_audit_responses_idempotency_key_idx
  ON public.ai_audit_responses (idempotency_key) WHERE idempotency_key IS NOT NULL;

-- 4. Idempotency, duplicate merging, CRM mirroring status and retention on requests.
ALTER TABLE public.ai_audit_requests
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS crm_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS crm_error text,
  ADD COLUMN IF NOT EXISTS crm_contact_id uuid,
  ADD COLUMN IF NOT EXISTS crm_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS crm_last_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS duplicate_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS flagged_duplicate boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_submitted_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS retain_until timestamptz NOT NULL DEFAULT (now() + interval '24 months'),
  ADD COLUMN IF NOT EXISTS buyer_ack_status text NOT NULL DEFAULT 'not_sent',
  ADD COLUMN IF NOT EXISTS admin_notice_status text NOT NULL DEFAULT 'not_sent';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_audit_requests_crm_status_check') THEN
    ALTER TABLE public.ai_audit_requests
      ADD CONSTRAINT ai_audit_requests_crm_status_check
      CHECK (crm_status IN ('pending', 'completed', 'failed'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ai_audit_requests_idempotency_key_idx
  ON public.ai_audit_requests (idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS ai_audit_requests_crm_status_idx
  ON public.ai_audit_requests (crm_status, created_at DESC);

-- 5. Atomic response + request creation, duplicate merge and CRM mirror.
CREATE OR REPLACE FUNCTION public.record_ai_audit_submission(
  _idempotency_key text,
  _email text,
  _name text,
  _organisation text,
  _job_title text,
  _readiness_score integer,
  _readiness_band text,
  _classification text,
  _routing jsonb,
  _marketing_consent boolean,
  _request_type text,
  _action_label text,
  _product text,
  _participant_quantity integer,
  _crm_note text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(btrim(_email));
  v_response_id uuid;
  v_request_id uuid;
  v_existing_id uuid;
  v_crm_id uuid;
  v_crm_status text := 'pending';
  v_crm_error text := NULL;
  v_duplicate boolean := false;
BEGIN
  -- Replay of the same browser session: return the original records untouched.
  SELECT id INTO v_response_id
  FROM ai_audit_responses WHERE idempotency_key = _idempotency_key;

  IF v_response_id IS NOT NULL THEN
    SELECT id, crm_status INTO v_request_id, v_crm_status
    FROM ai_audit_requests WHERE idempotency_key = _idempotency_key;
    RETURN jsonb_build_object(
      'response_id', v_response_id, 'request_id', v_request_id,
      'replayed', true, 'duplicate', false, 'crm_status', v_crm_status);
  END IF;

  INSERT INTO ai_audit_responses (
    email, name, organisation, job_title, readiness_score, readiness_band,
    classification, routing, marketing_consent, idempotency_key)
  VALUES (
    v_email, _name, _organisation, _job_title, _readiness_score, _readiness_band,
    _classification, COALESCE(_routing, '{}'::jsonb), COALESCE(_marketing_consent, false),
    _idempotency_key)
  RETURNING id INTO v_response_id;

  -- Identical request inside 24 hours is merged and flagged, not duplicated.
  SELECT id INTO v_existing_id
  FROM ai_audit_requests
  WHERE lower(email) = v_email
    AND request_type = _request_type
    AND product = COALESCE(_product, '')
    AND COALESCE(participant_quantity, -1) = COALESCE(_participant_quantity, -1)
    AND last_submitted_at > now() - interval '24 hours'
  ORDER BY last_submitted_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    v_duplicate := true;
    UPDATE ai_audit_requests
       SET duplicate_count = duplicate_count + 1,
           flagged_duplicate = true,
           last_submitted_at = now(),
           response_id = v_response_id,
           name = COALESCE(NULLIF(_name, ''), name),
           organisation = COALESCE(NULLIF(_organisation, ''), organisation),
           job_title = COALESCE(NULLIF(_job_title, ''), job_title)
     WHERE id = v_existing_id
    RETURNING id INTO v_request_id;
  ELSE
    INSERT INTO ai_audit_requests (
      response_id, email, name, organisation, job_title, request_type,
      action_label, product, participant_quantity, idempotency_key, last_submitted_at)
    VALUES (
      v_response_id, v_email, _name, _organisation, _job_title, _request_type,
      COALESCE(_action_label, ''), COALESCE(_product, ''), _participant_quantity,
      _idempotency_key, now())
    RETURNING id INTO v_request_id;
  END IF;

  -- CRM mirror upserted on the normalised email address.
  BEGIN
    INSERT INTO crm_contacts (
      name, email, company, job_title, source, source_table, source_record_id, notes, tags)
    VALUES (
      _name, v_email, NULLIF(_organisation, ''), NULLIF(_job_title, ''),
      'ai_audit', 'ai_audit_requests', v_request_id, _crm_note,
      ARRAY['ai-audit', _request_type])
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, crm_contacts.name),
      company = COALESCE(EXCLUDED.company, crm_contacts.company),
      job_title = COALESCE(EXCLUDED.job_title, crm_contacts.job_title),
      source_record_id = EXCLUDED.source_record_id,
      notes = CASE
                WHEN crm_contacts.notes IS NULL THEN EXCLUDED.notes
                ELSE crm_contacts.notes || E'\n---\n' || EXCLUDED.notes
              END,
      tags = ARRAY(SELECT DISTINCT unnest(crm_contacts.tags || EXCLUDED.tags)),
      updated_at = now()
    RETURNING id INTO v_crm_id;
    v_crm_status := 'completed';
  EXCEPTION WHEN OTHERS THEN
    v_crm_status := 'failed';
    v_crm_error := left(SQLERRM, 500);
    v_crm_id := NULL;
  END;

  UPDATE ai_audit_requests
     SET crm_status = v_crm_status,
         crm_error = v_crm_error,
         crm_contact_id = v_crm_id,
         crm_attempts = crm_attempts + 1,
         crm_last_attempt_at = now()
   WHERE id = v_request_id;

  RETURN jsonb_build_object(
    'response_id', v_response_id, 'request_id', v_request_id,
    'replayed', false, 'duplicate', v_duplicate, 'crm_status', v_crm_status);
END;
$$;

REVOKE ALL ON FUNCTION public.record_ai_audit_submission(text, text, text, text, text, integer, text, text, jsonb, boolean, text, text, text, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_ai_audit_submission(text, text, text, text, text, integer, text, text, jsonb, boolean, text, text, text, integer, text) FROM anon;
REVOKE ALL ON FUNCTION public.record_ai_audit_submission(text, text, text, text, text, integer, text, text, jsonb, boolean, text, text, text, integer, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.record_ai_audit_submission(text, text, text, text, text, integer, text, text, jsonb, boolean, text, text, text, integer, text) TO service_role;

-- 6. Safe administrative retry of a failed CRM mirror.
CREATE OR REPLACE FUNCTION public.retry_ai_audit_crm_mirror(_request_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.ai_audit_requests;
  v_crm_id uuid;
  v_status text := 'pending';
  v_error text := NULL;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  SELECT * INTO r FROM ai_audit_requests WHERE id = _request_id;
  IF r.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Request not found');
  END IF;
  IF r.crm_status = 'completed' THEN
    RETURN jsonb_build_object('ok', true, 'crm_status', 'completed', 'note', 'Already mirrored');
  END IF;

  BEGIN
    INSERT INTO crm_contacts (
      name, email, company, job_title, source, source_table, source_record_id, notes, tags)
    VALUES (
      r.name, lower(r.email), NULLIF(r.organisation, ''), NULLIF(r.job_title, ''),
      'ai_audit', 'ai_audit_requests', r.id,
      'AI Leadership Readiness Audit request: ' || COALESCE(r.action_label, r.request_type),
      ARRAY['ai-audit', r.request_type])
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, crm_contacts.name),
      company = COALESCE(EXCLUDED.company, crm_contacts.company),
      job_title = COALESCE(EXCLUDED.job_title, crm_contacts.job_title),
      source_record_id = EXCLUDED.source_record_id,
      tags = ARRAY(SELECT DISTINCT unnest(crm_contacts.tags || EXCLUDED.tags)),
      updated_at = now()
    RETURNING id INTO v_crm_id;
    v_status := 'completed';
  EXCEPTION WHEN OTHERS THEN
    v_status := 'failed';
    v_error := left(SQLERRM, 500);
  END;

  UPDATE ai_audit_requests
     SET crm_status = v_status, crm_error = v_error, crm_contact_id = v_crm_id,
         crm_attempts = crm_attempts + 1, crm_last_attempt_at = now()
   WHERE id = _request_id;

  RETURN jsonb_build_object('ok', v_status = 'completed', 'crm_status', v_status, 'error', v_error);
END;
$$;

REVOKE ALL ON FUNCTION public.retry_ai_audit_crm_mirror(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.retry_ai_audit_crm_mirror(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.retry_ai_audit_crm_mirror(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.retry_ai_audit_crm_mirror(uuid) TO service_role;

-- 7. One restricted subject-request function across all three stores.
CREATE OR REPLACE FUNCTION public.admin_audit_subject_request(_email text, _action text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(btrim(_email));
  v_responses jsonb;
  v_requests jsonb;
  v_contact jsonb;
  v_counts jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  IF _action NOT IN ('preview', 'export', 'delete') THEN
    RAISE EXCEPTION 'Unsupported action';
  END IF;
  IF v_email IS NULL OR position('@' in v_email) = 0 THEN
    RAISE EXCEPTION 'A verified email address is required';
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb) INTO v_responses
  FROM (SELECT * FROM ai_audit_responses WHERE lower(email) = v_email ORDER BY created_at DESC) t;

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb) INTO v_requests
  FROM (SELECT * FROM ai_audit_requests WHERE lower(email) = v_email ORDER BY created_at DESC) t;

  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb) INTO v_contact
  FROM (SELECT * FROM crm_contacts WHERE lower(email) = v_email) t;

  v_counts := jsonb_build_object(
    'audit_responses', jsonb_array_length(v_responses),
    'request_records', jsonb_array_length(v_requests),
    'crm_contacts', jsonb_array_length(v_contact));

  IF _action = 'delete' THEN
    DELETE FROM ai_audit_requests WHERE lower(email) = v_email;
    DELETE FROM ai_audit_responses WHERE lower(email) = v_email;
    DELETE FROM crm_contacts WHERE lower(email) = v_email;
  END IF;

  INSERT INTO data_subject_request_log (email_hash, action, operator_id, affected)
  VALUES (encode(digest(v_email, 'sha256'), 'hex'), _action, auth.uid(), v_counts);

  RETURN jsonb_build_object(
    'action', _action,
    'counts', v_counts,
    'audit_responses', CASE WHEN _action = 'delete' THEN '[]'::jsonb ELSE v_responses END,
    'request_records', CASE WHEN _action = 'delete' THEN '[]'::jsonb ELSE v_requests END,
    'crm_contacts', CASE WHEN _action = 'delete' THEN '[]'::jsonb ELSE v_contact END,
    'learning_platform_note',
      'Learning-platform (Thinkific) records are held separately and must be actioned directly on that platform.');
END;
$$;

REVOKE ALL ON FUNCTION public.admin_audit_subject_request(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_audit_subject_request(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_audit_subject_request(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_audit_subject_request(text, text) TO service_role;

-- 8. Two-rule retention purge (90-day diagnostic data, 24-month request records).
CREATE OR REPLACE FUNCTION public.purge_expired_ai_audit_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_responses integer := 0;
  v_requests integer := 0;
  v_events integer := 0;
BEGIN
  UPDATE ai_audit_requests SET response_id = NULL
   WHERE response_id IN (SELECT id FROM ai_audit_responses WHERE purge_after < now());

  DELETE FROM ai_audit_responses WHERE purge_after < now();
  GET DIAGNOSTICS v_responses = ROW_COUNT;

  DELETE FROM ai_audit_requests WHERE retain_until < now();
  GET DIAGNOSTICS v_requests = ROW_COUNT;

  DELETE FROM audit_submission_events WHERE created_at < now() - interval '2 hours';
  GET DIAGNOSTICS v_events = ROW_COUNT;

  RETURN jsonb_build_object(
    'audit_responses_purged', v_responses,
    'request_records_purged', v_requests,
    'rate_limit_rows_purged', v_events);
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_ai_audit_data() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.purge_expired_ai_audit_data() FROM anon;
GRANT EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() TO service_role;