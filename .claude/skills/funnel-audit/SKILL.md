---
name: funnel-audit
description: Self-audit harness for the Katha booking funnel — Design questionnaire (layout, hierarchy, customizer UX, accessibility) + Marketing questionnaire (funnel spine, messaging, scarcity, proof). Run weekly during launch (4 rounds), or after any change to /gallery, the Vault Drawer, or the enrichment email. Every item returns pass/fail, severity, evidence, one prioritized fix, an A/B idea, and a confidence score.
---

# Funnel Audit — Katha Booking Funnel

Two questionnaires, ≤10 items each. Priority ruling (council `launch-funnel-first`,
2026-07-11): **conversion lift outranks brand polish**. Funnel-spine items are
CRITICAL by default; polish items cap at MAJOR.

## Output contract (every item)

| Field | Values |
|---|---|
| verdict | PASS / FAIL / UNCLEAR |
| severity | CRITICAL (blocks bookings) / MAJOR (measurable drag) / MINOR (polish) |
| evidence | screenshot path, DOM/console excerpt, SQL row, or file:line — never vibes |
| fix | one concrete change, smallest that resolves |
| ab_idea | the test that would prove the fix (now measurable via `funnel_events`) |
| confidence | high / medium / low — low + CRITICAL ⇒ flag for Jed, don't auto-fix |

UNCLEAR triggers a secondary probe (latency trace, SQL count, extra viewport)
before it may become a verdict. Items needing editorial judgment (tone,
photography selection) are flagged HUMAN — never auto-fixed.

## Evidence tooling

```bash
npm run dev                                   # or launch config pb-v3-no-email
npm run guard                                 # brand canon + layout law + detect
node .claude/skills/impeccable/scripts/detect.mjs --json app components lib
curl -s localhost:3011/api/availability       # live allow-list
# funnel_events (Supabase MCP): SELECT event, count(*) FROM funnel_events
#   WHERE created_at > now() - interval '7 days' GROUP BY 1;
```

Browser evidence via chrome-devtools MCP (full-page screenshots, a11y snapshot,
`emulate` for reduced-motion + mobile). The in-app Browser pane blacks out on
desktop with Lenis transform-scroll — use chrome-devtools or mobile viewport.

## Design questionnaire

| # | Check | Method | Threshold |
|---|---|---|---|
| D1 | **Act spine present & visually distinct** — date gate → plates → investment → proof, gate glide works | full-page screenshot pre/post date-hold | acts readable in the screenshot alone |
| D2 | **3-second CTA test** — is "Reserve a date" / the date gate unambiguous above the fold? | screenshot at 1440 + 375; count competing CTAs | exactly one primary intent per viewport |
| D3 | **Customizer/drawer latency** — Vault Drawer opens and preview updates instantly, choices persist across close/reopen | `performance.now()` trace via evaluate_script | < 300ms to interactive |
| D4 | **Copy integrity** — no mojibake, no `undefined`/`NaN` in rendered text, no broken line-breaks, lexicon-compliant | DOM innerText scan + guard vocab layer | zero corrupted strings |
| D5 | **Keyboard & focus** — date cells, plates, drawer, HUD all reachable; focus visible; gate `inert` while locked | tab-walk via a11y snapshot | full path keyboard-completable |
| D6 | **Tap targets** — interactive elements ≥ 44×44 on 375px | getBoundingClientRect sweep | zero under-size targets in the funnel path |
| D7 | **Reduced motion** — glide, entry, drawer all collapse to instant/crossfade | emulate `prefers-reduced-motion` | no opacity-0 traps, content complete |
| D8 | **Eyebrow discipline** — registry-voice mono eyebrows are the ONE deliberate kicker system; no per-section reflex scaffolding | count eyebrows per view | ≤1 per major section, consistent voice |

## Marketing questionnaire

| # | Check | Method | Threshold |
|---|---|---|---|
| M1 | **Funnel spine (CRITICAL)** — real-time availability shown before any contact info is asked | availability API + screenshot of calendar pre-capture | true calendar renders before any input field |
| M2 | **Field strategy** — required fields ≤5 at first capture; non-essentials deferred | count required inputs in Vault Drawer submit path | ≤5 required |
| M3 | **Pricing transparency** — price visible before commitment | where do tier prices first appear vs. first required field | price reachable without giving contact info |
| M4 | **Trust & follow-up** — instant confirmation email fires; sender/domain deliverable; copy sells (date status, tier, gallery link, reply promise) | dispatch results + rendered email audit | notified=true in prod; all 4 lever-4 elements present |
| M5 | **Truthful scarcity** — weekend-count line and any urgency copy derive from live data; zero fabricated urgency | trace copy to `available_dates` | every scarcity claim query-backed |
| M6 | **Social proof** — real photography visible; testimonial present | screenshot of The Work + testimonial search | ≥1 real-event proof block; testimonial is a known gap until Jed supplies one (HUMAN) |
| M7 | **Funnel instrumentation** — every step beacons; events persist | `funnel_events` SQL count by event | all 7 events represented after a test walk |
| M8 | **Abandonment visibility** — drop-off between `date_held` → `drawer_open` → `selection_submit` computable | SQL funnel query | query returns step counts |

## Self-correction loop

1. Run all items; collect UNCLEARs.
2. Each UNCLEAR gets exactly one deeper probe; still unclear ⇒ report as
   UNCLEAR with the probe evidence attached (never guess a verdict).
3. Fix CRITICAL+high-confidence immediately; queue MAJOR as tasks; log MINOR.
4. Re-run only failed items after fixes (not the whole battery).
5. Persist the round: verdict table → vault `.memory/handoff/<date>_funnel-audit.md`,
   one-line summary → `wiki/log.md` (op: `lint`), open items → `.memory/inbox.md`.

## Cadence

Weekly for the first 4 launch weeks, then after any funnel-surface change.
Compare `funnel_events` step-conversion week over week — the questionnaires
find candidate causes; the funnel data decides which fixes mattered.
