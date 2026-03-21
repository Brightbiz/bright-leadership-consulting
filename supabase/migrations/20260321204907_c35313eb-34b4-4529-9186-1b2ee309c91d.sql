
-- Fix 1: Narrow workbook_responses policies from {anon, authenticated} to {authenticated} only
DROP POLICY IF EXISTS "Admins can view workbook responses" ON public.workbook_responses;
DROP POLICY IF EXISTS "Admins can update workbook responses" ON public.workbook_responses;

CREATE POLICY "Admins can view workbook responses"
  ON public.workbook_responses FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update workbook responses"
  ON public.workbook_responses FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: The existing "Admins can manage roles" ALL policy already covers admin operations.
-- The "Admins can view all roles" SELECT is redundant (covered by ALL). Drop it to simplify.
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
