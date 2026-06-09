-- Phase 4: interactive design state + reference-photo storage offload
--
-- 1. selections.configuration — single JSONB column holding the full
--    interactive React state (font, text position, tier, future knobs).
--    Keeps the relational columns lean; no per-knob schema churn.
-- 2. katha-references — private Storage bucket for client reference
--    photos. Clients upload via presigned URLs (anon INSERT only);
--    reads go through service_role signed URLs. No base64 in the DB.

-- ── 1. configuration jsonb ────────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'selections' AND column_name = 'configuration'
    ) THEN
        ALTER TABLE public.selections
        ADD COLUMN configuration jsonb DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- ── 2. katha-references bucket (private) ──────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('katha-references', 'katha-references', false, 1572864, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Anon may INSERT (presigned upload completes as anon); nobody but
-- service_role may read — service_role bypasses RLS, so no SELECT policy.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects'
        AND policyname = 'anon_insert_katha_references'
    ) THEN
        CREATE POLICY anon_insert_katha_references
        ON storage.objects FOR INSERT TO anon
        WITH CHECK (bucket_id = 'katha-references');
    END IF;
END $$;
