-- Lead spine: selections.lead is a bare TEXT lead_hash; every CRM table
-- (threads, invoices, contracts) needs a real FK to leads(id) or the data
-- fragments the way it did in HoneyBook. This adds the spine and backfills
-- from the existing hash without dropping the legacy column.
-- Council verdict 2026-07-10 (replace-honeybook), bottleneck #6.

ALTER TABLE public.selections
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id);

-- Backfill: the gallery passes ?lead=<lead_hash>, so selections.lead holds
-- the lead_hash. Rows with no matching lead stay NULL (organic/test picks).
UPDATE public.selections s
SET lead_id = l.id
FROM public.leads l
WHERE s.lead = l.lead_hash
  AND s.lead_id IS NULL;

CREATE INDEX IF NOT EXISTS selections_lead_id_idx ON public.selections (lead_id);
