# katha-impeccable — Skill Test Report (2026-06-01)

Tested via `/skill-tester`. Two lenses: structure validator (wrong rubric, noted) and
the tests that matter for an instruction skill — triggering + behavior.

## 1. Structure validator — rubric mismatch (informational)
`skill_validator.py` scored 14.3/100 "POOR" — but it grades **Python engineering skills**
(expects README.md, `scripts/`, 100+ lines, Tier/Category/Author/Version fields). The
official `impeccable` skill scores the same way (37.5/100) under it. `katha-impeccable`
is a standard Anthropic **instruction skill** (name + description + body), so this rubric
does not apply. **Security scan: clean (no findings).**

## 2. Triggering — 16-case eval (`evals/trigger-evals.json`)
- 8 should-trigger: **8/8 fire** — explicit impeccable, "on brand?", template audit,
  Cormorant/D1, `npm run guard`, Signature-vs-palette, forbidden colors, pre-deploy.
- 8 should-not-trigger: **6 clean negatives** (generic impeccable on a non-Katha site,
  hex lookup, AWS audit, perf, code-review, deploy) + **2 borderline** (build an
  EB-Garamond component; generate new thumbnails) where the description *could* mildly
  over-trigger.
- **Verdict: strong.** Recall is the priority for a brand guard (better to over-check
  than ship drift). The 2 borderline cases are authoring/build tasks adjacent to the
  guard's audit scope — acceptable, optionally tightenable later.

## 3. Behavior — end-to-end path (verified live)
Following SKILL.md produced a correct verdict in its own §5 format:
```
CONTEXT     DESIGN.md/DESIGN_SYSTEM.v2/ignore.md/GUIDE: ✓ ✓ ✓ ✓
TIER SPLIT  81 presets · 31 Signature (held) · 50 Classic (exempt)
P0 BLOCK    None
P1 DRIFT    31 D1 font-drift + Tracy&Prince off-canon + 2 impeccable warnings
VERDICT     APPROVED
```
- ✓ Loads all four context files.
- ✓ Routes to `npm run guard` (not ad-hoc greps).
- ✓ Two-tier model applied: 31 Signature held, 50 Classic exempt.
- ✓ OAX guardrails present and match DESIGN_SYSTEM.v2 / ignore.md (legacy hex, Cormorant,
  Jacobean, pure b/w, Sequin-on-ecru, Loko-outside-CTA).

## Overall: PASS (for an instruction skill)
Triggers correctly, behaves correctly, reintroduces no OAX. Optional polish: tighten the
description to reduce the 2 borderline over-triggers; add a one-line README if it should
satisfy the engineering-skill validator.
