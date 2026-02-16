
-- Create assessment results table
CREATE TABLE public.assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assessment_type text NOT NULL CHECK (assessment_type IN ('pre-course', 'post-course')),
  total_score integer NOT NULL DEFAULT 0,
  max_score integer NOT NULL DEFAULT 0,
  percentage numeric(5,2) NOT NULL DEFAULT 0,
  competency_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Users can view their own results
CREATE POLICY "Users can view their own assessment results"
ON public.assessment_results
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own results
CREATE POLICY "Users can insert their own assessment results"
ON public.assessment_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own results
CREATE POLICY "Users can update their own assessment results"
ON public.assessment_results
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all results
CREATE POLICY "Admins can view all assessment results"
ON public.assessment_results
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast lookups
CREATE INDEX idx_assessment_results_user_type ON public.assessment_results(user_id, assessment_type);
