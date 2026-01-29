-- Allow updating submissions (for marking as read/unread)
CREATE POLICY "Allow update on submissions"
ON public.contact_submissions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow deleting submissions
CREATE POLICY "Allow delete on submissions"
ON public.contact_submissions
FOR DELETE
USING (true);