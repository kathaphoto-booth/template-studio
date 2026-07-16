-- Webhook idempotency ledger: each inbound provider event is recorded once by
-- its event id; a duplicate delivery hits the primary-key conflict and is
-- acknowledged without re-running side effects.
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- Service-role only (webhook handlers use the admin client); no public policies.
ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;
