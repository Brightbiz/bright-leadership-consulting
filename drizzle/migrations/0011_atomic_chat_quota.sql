CREATE OR REPLACE FUNCTION public.reserve_chat_quota(_ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_count integer;
BEGIN
  IF _ip_address IS NULL OR btrim(_ip_address) = '' OR length(_ip_address) > 200 THEN
    RAISE EXCEPTION 'Invalid quota address';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('chat-quota:' || _ip_address, 0));
  SELECT count(*) INTO v_count FROM public.rate_limits
    WHERE ip_address = _ip_address AND form_type = 'chat'
      AND created_at >= clock_timestamp() - interval '60 minutes';
  IF v_count >= 30 THEN
    RETURN false;
  END IF;
  INSERT INTO public.rate_limits (ip_address, form_type) VALUES (_ip_address, 'chat');
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_chat_quota(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_chat_quota(text) TO service_role;
COMMENT ON FUNCTION public.reserve_chat_quota(text) IS 'Service-only atomic reservation: maximum 30 chat requests per address in a rolling 60-minute window. Errors propagate so the caller fails closed.';