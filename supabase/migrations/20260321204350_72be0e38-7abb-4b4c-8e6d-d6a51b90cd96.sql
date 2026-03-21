
-- Remove the overly permissive policy on rate_limits.
-- The edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS entirely,
-- so no public policy is needed.
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;
