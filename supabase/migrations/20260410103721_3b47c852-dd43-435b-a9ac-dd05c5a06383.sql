
CREATE OR REPLACE FUNCTION public.sync_existing_leads_to_crm()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_count INTEGER := 0;
  row_count INTEGER := 0;
BEGIN
  -- Sync contact_submissions
  INSERT INTO public.crm_contacts (name, email, phone, company, source, source_table, source_record_id, notes, created_at)
  SELECT cs.name, cs.email, cs.phone, cs.company, 'contact_form', 'contact_submissions', cs.id, cs.message, cs.created_at
  FROM public.contact_submissions cs
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, crm_contacts.name),
    phone = COALESCE(EXCLUDED.phone, crm_contacts.phone),
    company = COALESCE(EXCLUDED.company, crm_contacts.company),
    notes = CASE WHEN crm_contacts.notes IS NULL THEN EXCLUDED.notes
                 ELSE crm_contacts.notes || E'\n---\n' || EXCLUDED.notes END;
  GET DIAGNOSTICS row_count = ROW_COUNT;
  total_count := total_count + row_count;

  -- Sync newsletter_subscribers
  INSERT INTO public.crm_contacts (email, source, source_table, source_record_id, tags, created_at)
  SELECT ns.email, 'newsletter', 'newsletter_subscribers', ns.id, ARRAY['newsletter'], ns.subscribed_at
  FROM public.newsletter_subscribers ns
  ON CONFLICT (email) DO UPDATE SET
    tags = ARRAY(SELECT DISTINCT unnest(crm_contacts.tags || ARRAY['newsletter']));
  GET DIAGNOSTICS row_count = ROW_COUNT;
  total_count := total_count + row_count;

  -- Sync lead_magnet_downloads
  INSERT INTO public.crm_contacts (name, email, source, source_table, source_record_id, tags, created_at)
  SELECT lmd.name, lmd.email, 'lead_magnet', 'lead_magnet_downloads', lmd.id, ARRAY['lead_magnet', lmd.lead_magnet_name], lmd.downloaded_at
  FROM public.lead_magnet_downloads lmd
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, crm_contacts.name),
    tags = ARRAY(SELECT DISTINCT unnest(crm_contacts.tags || EXCLUDED.tags));
  GET DIAGNOSTICS row_count = ROW_COUNT;
  total_count := total_count + row_count;

  -- Sync readiness_quiz_results
  INSERT INTO public.crm_contacts (name, email, source, source_table, source_record_id, tags, created_at)
  SELECT rqr.name, rqr.email, 'readiness_quiz', 'readiness_quiz_results', rqr.id, ARRAY['quiz', rqr.recommended_tier], rqr.created_at
  FROM public.readiness_quiz_results rqr
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, crm_contacts.name),
    tags = ARRAY(SELECT DISTINCT unnest(crm_contacts.tags || EXCLUDED.tags));
  GET DIAGNOSTICS row_count = ROW_COUNT;
  total_count := total_count + row_count;

  -- Sync workbook_responses
  INSERT INTO public.crm_contacts (name, email, source, source_table, source_record_id, tags, created_at)
  SELECT wr.name, wr.email, 'workbook', 'workbook_responses', wr.id, ARRAY['workbook'], wr.created_at
  FROM public.workbook_responses wr
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, crm_contacts.name),
    tags = ARRAY(SELECT DISTINCT unnest(crm_contacts.tags || EXCLUDED.tags));
  GET DIAGNOSTICS row_count = ROW_COUNT;
  total_count := total_count + row_count;

  RETURN total_count;
END;
$$;
