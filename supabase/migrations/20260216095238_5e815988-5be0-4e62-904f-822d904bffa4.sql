
-- Create readiness quiz results table
CREATE TABLE public.readiness_quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  answers JSONB NOT NULL DEFAULT '{}',
  recommended_tier TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.readiness_quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (lead capture - no auth required)
CREATE POLICY "Anyone can submit quiz results"
  ON public.readiness_quiz_results
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read quiz results
CREATE POLICY "Admins can view quiz results"
  ON public.readiness_quiz_results
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );
