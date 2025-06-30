-- JobMate Supabase Configuration: Storage Buckets
-- This file configures storage buckets and access policies

-- Create storage buckets for different types of files
-- Note: This is a placeholder as actual bucket creation is done through Supabase Dashboard or API
-- The following SQL represents the equivalent RLS policies that should be applied

-- Create policies for avatars bucket
-- This bucket stores user profile pictures
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policies for listing_attachments bucket
-- This bucket stores files attached to listings
CREATE POLICY "Listing attachments are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing_attachments');

CREATE POLICY "Users can upload attachments to their own listings"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update attachments for their own listings"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listing_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete attachments for their own listings"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policies for application_attachments bucket
-- This bucket stores files attached to applications (resumes, portfolios)
CREATE POLICY "Application attachments are accessible to involved parties"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'application_attachments' AND
    (
      -- The applicant can view their own attachments
      (storage.foldername(name))[1] = auth.uid()::text OR
      -- The listing owner can view attachments for their listings
      EXISTS (
        SELECT 1
        FROM applications a
        JOIN listings l ON a.listing_id = l.id
        WHERE a.id::text = (storage.foldername(name))[2]
        AND l.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can upload attachments to their own applications"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'application_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update attachments for their own applications"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'application_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete attachments for their own applications"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'application_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policies for message_attachments bucket
-- This bucket stores files shared in messages
CREATE POLICY "Message attachments are accessible to conversation participants"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'message_attachments' AND
    EXISTS (
      SELECT 1
      FROM conversation_participants cp
      WHERE cp.conversation_id::text = (storage.foldername(name))[1]
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload attachments to their conversations"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'message_attachments' AND
    EXISTS (
      SELECT 1
      FROM conversation_participants cp
      WHERE cp.conversation_id::text = (storage.foldername(name))[1]
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own message attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'message_attachments' AND
    EXISTS (
      SELECT 1
      FROM messages m
      WHERE m.id::text = (storage.foldername(name))[2]
      AND m.sender_id = auth.uid()
    )
  );

-- Create helper function to generate presigned URLs for file uploads
CREATE OR REPLACE FUNCTION storage.get_presigned_url(
  bucket_name TEXT,
  object_path TEXT,
  expiry INTEGER DEFAULT 60
)
RETURNS TEXT AS $$
DECLARE
  presigned_url TEXT;
BEGIN
  -- This is a placeholder function
  -- In Supabase, presigned URLs are typically generated client-side
  -- or through Edge Functions
  presigned_url := 'https://placeholder-url/' || bucket_name || '/' || object_path;
  RETURN presigned_url;
END;
$$ LANGUAGE plpgsql;

-- Create function to get file path for a user's avatar
CREATE OR REPLACE FUNCTION get_avatar_path(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN 'avatars/' || user_id || '/profile.jpg';
END;
$$ LANGUAGE plpgsql;
