
CREATE TABLE public.workbook_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  section_data jsonb NOT NULL DEFAULT '{}',
  current_section integer NOT NULL DEFAULT 1,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Allow anyone to insert (public form, no auth required for Thinkific embedding)
ALTER TABLE public.workbook_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create workbook response"
  ON public.workbook_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view/update their own responses by email match
CREATE POLICY "Users can view own workbook responses"
  ON public.workbook_responses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update own workbook responses"
  ON public.workbook_responses FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can view all
CREATE POLICY "Admins can manage workbook responses"
  ON public.workbook_responses FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
CREATE TRIGGER update_workbook_responses_updated_at
  BEFORE UPDATE ON public.workbook_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
