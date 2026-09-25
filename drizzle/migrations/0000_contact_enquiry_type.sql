ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS enquiry_type text;
CREATE INDEX IF NOT EXISTS contact_submissions_enquiry_type_idx ON public.contact_submissions(enquiry_type);