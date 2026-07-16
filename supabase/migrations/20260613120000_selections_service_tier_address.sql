-- V1 intake funnel: service tier + venue address on selections.
-- service_tier maps to lib/serviceTiers.ts ids (validated app-side; no DB CHECK
-- since the tier set evolves). address is PII — selections RLS is service_role-only,
-- so it is never exposed to anon/other clients.
ALTER TABLE public.selections
  ADD COLUMN IF NOT EXISTS service_tier text,
  ADD COLUMN IF NOT EXISTS address text;
