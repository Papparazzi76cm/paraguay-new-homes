
-- Create developer-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('developer-logos', 'developer-logos', true);

-- Allow authenticated developers to upload their own logo
CREATE POLICY "Developers can upload own logo"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'developer-logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow developers to update their own logo
CREATE POLICY "Developers can update own logo"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'developer-logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow developers to delete their own logo
CREATE POLICY "Developers can delete own logo"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'developer-logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Public read access for logos
CREATE POLICY "Logos are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'developer-logos');
