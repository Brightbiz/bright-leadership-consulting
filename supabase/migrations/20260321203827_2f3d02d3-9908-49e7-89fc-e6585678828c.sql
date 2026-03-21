
-- Fix workbook_responses: restrict SELECT and UPDATE to admin-only (legacy table, no public read/update needed)
DROP POLICY IF EXISTS "Users can view own workbook responses" ON public.workbook_responses;
DROP POLICY IF EXISTS "Users can update own workbook responses" ON public.workbook_responses;

-- Only admins can view workbook responses
CREATE POLICY "Admins can view workbook responses"
  ON public.workbook_responses FOR SELECT TO anon, authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update workbook responses
CREATE POLICY "Admins can update workbook responses"
  ON public.workbook_responses FOR UPDATE TO anon, authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
