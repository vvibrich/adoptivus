/*
  # Create storage bucket for pet images

  1. New Storage
    - Create a public bucket named 'pets' for storing pet images
    - Enable public access to the bucket
*/

-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('pets', 'pets', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Allow public access to the bucket
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'pets');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'pets');

-- Allow users to update their own files
CREATE POLICY "Users can update their own files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'pets' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'pets' AND owner = auth.uid());

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'pets' AND owner = auth.uid());