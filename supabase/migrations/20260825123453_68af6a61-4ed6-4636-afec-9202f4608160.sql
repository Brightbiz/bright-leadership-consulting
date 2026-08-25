-- Restrict public.purge_expired_ai_audit_data() to service_role only.
-- Reversible: GRANT EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() FROM anon;
REVOKE EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() TO service_role;