-- Enable RLS on core tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Generation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditLog" ENABLE ROW LEVEL SECURITY;

-- Allow public viewing of results in the 'uploads' bucket
-- We use a DO block to prevent errors if the policy already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Read Access'
    ) THEN
        CREATE POLICY "Public Read Access"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'uploads' );
    END IF;
END
$$;
