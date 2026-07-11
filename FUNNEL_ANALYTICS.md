# Funnel Analytics — first-party, zero Google

Every event flows through `POST /api/track` (`app/api/track/route.ts`) via the
`track()` beacon in `lib/track.ts` (sendBeacon → fetch keepalive fallback).
No third-party scripts, no Google, no new SaaS. Events always land as a
`[FUNNEL]` line in the server log; when `SUPABASE_SERVICE_ROLE_KEY` is set they
also insert into `funnel_events` (best-effort — a DB miss logs
`[FUNNEL_DB_MISS]` and never surfaces to the client).

## The four events

| # | Event | Fires from | When |
|---|-------|-----------|------|
| 1 | `gallery_view` | `app/gallery/page.tsx` | Gallery mounts |
| 2 | `date_check` | `components/booking/DateGate.tsx` | An open-night plate is clicked (`meta.date` = ISO date) |
| 3 | `drawer_open` | `components/booking/VaultDrawer.tsx` | The Vault Drawer opens (any path: plate, tier, deep link, header CTA) |
| 4 | `selection_submit` | `components/customizer/CustomizerClient.tsx` | Immediately before the `/api/selection` POST (`leadHash` when a real lead id is present, `meta.templateId`) |

Payload shape: `{ event, leadHash?, meta? }`. Allow-list enforced server-side;
anything off-list is a 400. No PII beyond `leadHash`; `meta` is capped at 1 KB.

## Migration

`supabase/migrations/20260711090000_funnel_events.sql` — **not applied yet**.
RLS enabled with zero policies: service-role-only by construction.

## Step-by-step drop-off query

```sql
with counts as (
  select event, count(*) as n
  from funnel_events
  where created_at >= now() - interval '30 days'
  group by event
)
select
  s.step,
  s.event,
  coalesce(c.n, 0) as events,
  round(
    100.0 * coalesce(c.n, 0)
      / nullif(lag(coalesce(c.n, 0)) over (order by s.step), 0),
    1
  ) as pct_of_previous_step,
  round(
    100.0 * coalesce(c.n, 0)
      / nullif(first_value(coalesce(c.n, 0)) over (order by s.step), 0),
    1
  ) as pct_of_gallery_view
from (values
  ('gallery_view', 1),
  ('date_check', 2),
  ('drawer_open', 3),
  ('selection_submit', 4)
) as s(event, step)
left join counts c using (event)
order by s.step;
```

The biggest fall in `pct_of_previous_step` is the leak to fix first.

## No database configured?

Grep the deploy logs instead — the funnel is fully reconstructable from them:

```
grep '\[FUNNEL\]' | jq -r .event | sort | uniq -c
```
