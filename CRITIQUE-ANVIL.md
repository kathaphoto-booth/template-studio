# CRITIQUE-ANVIL.md — Backend self-critique log
### 2026-07-09 · executed inline by the Director (parallel subagent dispatch was cut off by the account session limit; same brief, sequential execution)

## Ground truth established first
- Live schema pulled read-only from Supabase (`information_schema.columns`, project `hvvomiyskizxzhyytcfd`): `leads` (client_name/client_email NOT NULL, event_date TEXT NOT NULL, lead_hash NOT NULL, + client_phone/venue_name/tier_selected/template_selected/addons/notes/source…), `selections` (template_id/name/layout NOT NULL + names/date/venue/font_family/reference_photos ARRAY/notes/lead/selected_at/configuration jsonb/service_tier/address), `available_dates` (date DATE NOT NULL, status TEXT NOT NULL, note).

## Pass 1 — silent-failure hunt
- `/api/lead` (vendor `@katha/core handleInquiry`): `Promise.allSettled` over database/honeybook/email; every rejection is mapped into the `dispatch` array with `ok:false` and a detail — **no silent loss**. Overall `ok` reflects any success; 202 when nothing dispatched. PASS, no fix needed.
- `/api/selection`: same fan-out pattern with per-target `{ok, detail}`; unconfigured targets report honestly ("not configured (skipped)"). PASS.
- **Finding fixed:** availability simply didn't exist — the funnel's calendar had no real source. Built `app/api/availability/route.ts` with the honest-failure contract: any fetch problem → 503 `{error}`, never an empty-but-200 calendar.
- **Upgrade:** the endpoint precomputes `selectable` server-side (status `open` AND ≥ today+7 in America/Los_Angeles) so no client can misimplement the notice rule.

## Pass 2 — schema-drift hunt (checked character-by-character against the live schema)
- Vendor `recordLead` insert: `client_name, client_email, event_date, lead_hash, status:'Inquired'`, conditional `client_phone/tier_selected/source/addons` + notes-fold — every column exists; whitelist honored. **No drift. No route wrapper needed.**
- `dispatchSupabase` insert: `template_id, template_name, layout, names, date, venue, font_family, reference_photos, notes, lead, selected_at` — all exist (`reference_photos` is a real ARRAY column, `selected_at` timestamptz accepts ISO). **Schema-valid as written.** `configuration` (jsonb) and `service_tier` exist as nullable spares — flagged for a future contract bump, NOT added now (the `Selection` type is a frozen seam).
- **Upgrade:** dates in the availability path are compared as ISO strings end-to-end (en-CA locale formatting) — the UTC off-by-one class of bug (PRD §7.5) is structurally impossible in this route.

## Pass 3 — error-shape consistency
- Availability: `{error}` + 503. Selection: `{ok:false, error}` + 400 / dispatch summary + 200/202. Lead: `{error}` + 400/503, dispatch summary + 200/202. Shapes are consistent within each surface and all failures carry a readable string. Acceptable; no change.
- **Upgrade:** `scripts/api-smoke.mjs` gates all live-write cases behind `SMOKE_LIVE=1` — the default run can never insert junk rows into the production tables while still proving every validation path.

## Evidence
- `node scripts/api-smoke.mjs` → **8/8 passed** (availability 200 shape + min-notice law, selection 400s on missing fields/bad JSON/forbidden word, lead 4xx readable on empty body + bad email, live-writes skipped by default).
- Dev server: zero unhandled rejections logged for these routes during the run.
