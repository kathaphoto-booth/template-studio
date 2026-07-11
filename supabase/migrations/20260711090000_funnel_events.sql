-- Funnel analytics: first-party event sink written by /api/track.
-- Service-role-only by design: RLS is enabled with ZERO policies, so the
-- anon and authenticated roles can neither read nor write; only the
-- service role (which bypasses RLS) touches this table.

create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  lead_hash text,
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.funnel_events enable row level security;
-- Intentionally no policies — do not add anon/authenticated grants.

create index if not exists funnel_events_event_created_at_idx
  on public.funnel_events (event, created_at);
