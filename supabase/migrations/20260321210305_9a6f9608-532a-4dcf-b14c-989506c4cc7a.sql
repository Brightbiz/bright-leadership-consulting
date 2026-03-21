
-- Remove open INSERT policies on public-facing tables.
-- All form submissions now go through the submit-form edge function using the service role key.

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can submit their email for lead magnet" ON public.lead_magnet_downloads;
DROP POLICY IF EXISTS "Anyone can submit quiz results" ON public.readiness_quiz_results;
DROP POLICY IF EXISTS "Anyone can create workbook response" ON public.workbook_responses;
