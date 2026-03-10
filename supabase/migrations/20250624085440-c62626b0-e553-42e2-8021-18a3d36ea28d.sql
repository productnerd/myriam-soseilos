
-- Add image_url column to user_messages table
ALTER TABLE public.user_messages 
ADD COLUMN image_url text;

-- Create a storage bucket for message images
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-images', 'message-images', true);

-- Create storage policies for message images
CREATE POLICY "Allow public read access to message images"
ON storage.objects FOR SELECT
USING (bucket_id = 'message-images');

CREATE POLICY "Allow authenticated users to upload message images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'message-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update message images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'message-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete message images"
ON storage.objects FOR DELETE
USING (bucket_id = 'message-images' AND auth.role() = 'authenticated');
