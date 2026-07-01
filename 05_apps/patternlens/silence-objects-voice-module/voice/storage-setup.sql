-- ============================================
-- SUPABASE STORAGE SETUP FOR VOICE RECORDINGS
-- Run this in Supabase SQL Editor
-- ============================================

-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'voice-recordings',
  'voice-recordings',
  true,  -- Public for playback (files are user-scoped by path)
  52428800,  -- 50MB limit
  ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/m4a']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voice-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own recordings
CREATE POLICY "Users can read own recordings"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'voice-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own recordings
CREATE POLICY "Users can delete own recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voice-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Public can read (for audio playback URLs)
-- Note: Files are still scoped by user ID in path
CREATE POLICY "Public read access for playback"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-recordings');

-- ============================================
-- CLEANUP FUNCTION (Optional - for old recordings)
-- ============================================

-- Function to delete old voice recordings (older than 90 days)
CREATE OR REPLACE FUNCTION storage.cleanup_old_recordings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'voice-recordings'
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Schedule cleanup (requires pg_cron extension)
-- Uncomment if pg_cron is enabled:
-- SELECT cron.schedule('cleanup-old-recordings', '0 3 * * *', 'SELECT storage.cleanup_old_recordings()');
