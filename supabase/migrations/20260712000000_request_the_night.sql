-- Request the Night r1.1 — data layer (spec 2026-07-12).
-- availability supersedes available_dates for the funnel read; the old
-- table stays untouched until cutover (spec "Open at build time").

create table if not exists public.availability (
  date   date not null,
  slot   text not null check (slot in ('afternoon','evening')),
  status text not null check (status in ('open','booked')),
  note   text,
  primary key (date, slot)
);

alter table public.availability enable row level security;

-- Same read posture as available_dates: public calendar is anon-readable.
create policy "Public can select availability"
  on public.availability for select to anon using (true);

-- Backfill: every open available_dates row opens BOTH slots; booked rows
-- book both slots (conservative — a legacy booking blocked the whole day).
insert into public.availability (date, slot, status, note)
select d.date, s.slot, d.status, d.note
from public.available_dates d
cross join (values ('afternoon'), ('evening')) as s(slot)
on conflict (date, slot) do nothing;

create table if not exists public.booking_requests (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id),
  date       date not null,
  slot       text not null check (slot in ('afternoon','evening')),
  tier       text not null,
  intake     jsonb,  -- {phone, venue_city, event_type, guest_estimate, start_time, notes}
  status     text not null default 'pending'
             check (status in ('pending','held','accepted','declined','expired','withdrawn')),
  decided_by text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

-- Service-role-only by design (funnel_events pattern): RLS on, zero policies.
alter table public.booking_requests enable row level security;

create index if not exists booking_requests_date_slot_status_idx
  on public.booking_requests (date, slot, status);
create index if not exists booking_requests_status_created_at_idx
  on public.booking_requests (status, created_at);

-- Rate limiting for /api/request (spec: requested-state must not be
-- spammable). Fixed-window counter keyed by caller-chosen key.
create table if not exists public.rate_limits (
  key          text not null,
  window_start timestamptz not null,
  count        integer not null default 1,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;
-- Intentionally no policies — service role only.

create or replace function public.check_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz;
  v_count integer;
begin
  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );
  insert into public.rate_limits (key, window_start, count)
  values (p_key, v_window, 1)
  on conflict (key, window_start)
  do update set count = public.rate_limits.count + 1
  returning count into v_count;
  return v_count <= p_max;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
