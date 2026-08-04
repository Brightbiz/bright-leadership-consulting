REVOKE ALL ON FUNCTION public.cleanup_old_rate_limits() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_old_rate_limits() TO service_role;

REVOKE ALL ON FUNCTION public.sync_existing_leads_to_crm() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_existing_leads_to_crm() TO service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;