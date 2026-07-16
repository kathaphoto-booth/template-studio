# commit.show · Audit report

**template-studio**
_https://github.com/kathaphoto-booth/template-studio_

## What this build missed
- 3 hardcoded localhost:3000 URLs in app/api/inquiry/route.ts, capture-screenshots.mjs, capture_mobile.cjs — will 404 in production.
- Webhook idempotency gap: handler at app/api/webhooks/honeybook/route.ts has 0 idempotency-key checks — duplicate event processing on provider retry.

## What it got right
- CI workflow active + lockfile present + 94 commits since May 31 — repo is being actively maintained with discipline.
- 4 structured SKILL.md definitions with valid frontmatter under .claude/skills/ — agentic scaffolding is deliberate, not accidental.
- Lighthouse mobile perf 98, desktop 100, accessibility 98, Best Practices 100 — zero console errors and 113 KB total payload.

## Score · 65 / 100

- Audit:      32/50
- Scout:      0/30
- Community:  1/20
- **Δ +7** since last audit

---
Audited on commit.show · https://commit.show/projects/e536b5c5-bbe6-4454-97ec-befb53ad0ca9
