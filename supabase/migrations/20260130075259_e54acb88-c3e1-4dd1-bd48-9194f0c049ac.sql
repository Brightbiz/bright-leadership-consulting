-- Create table for lead magnet downloads
CREATE TABLE public.lead_magnet_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  lead_magnet_name TEXT NOT NULL DEFAULT '5-leadership-secrets'
);

-- Enable Row Level Security
ALTER TABLE public.lead_magnet_downloads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for lead capture)
CREATE POLICY "Anyone can submit their email for lead magnet" 
ON public.lead_magnet_downloads 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all downloads
CREATE POLICY "Admins can view all lead magnet downloads" 
ON public.lead_magnet_downloads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);