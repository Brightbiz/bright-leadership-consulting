-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table to store user checklist results
CREATE TABLE public.checklist_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  checked_items TEXT[] NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.checklist_results ENABLE ROW LEVEL SECURITY;

-- Users can view their own results
CREATE POLICY "Users can view their own results"
ON public.checklist_results
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own results
CREATE POLICY "Users can insert their own results"
ON public.checklist_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own results
CREATE POLICY "Users can update their own results"
ON public.checklist_results
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_checklist_results_updated_at
BEFORE UPDATE ON public.checklist_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();