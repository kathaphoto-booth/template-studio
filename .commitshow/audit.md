# commit.show · Audit report

**template-studio**
_https://github.com/kathaphoto-booth/template-studio_

## What this build missed
- Webhook handler at app/api/webhooks/honeybook/route.ts has 0 signature checks — forged POST events accepted with no HMAC verification.
- Hardcoded http://localhost:3000 in app/api/inquiry/route.ts will silently fail on the live Vercel deployment.

## What it got right
- CI workflow present + npm lockfile + HTTPS enforced; desktop Lighthouse perf 99 with 0 console errors and 0 network failures.
- Session management wired: auth state listener + sign-out handler in hooks/useAuth.ts via @supabase/supabase-js; session gap = false.
- 64 commits across 2 contributors in 12 days; 186 files spanning frontend (7 React components, 10 pages) and backend API routes.

## Score · 58 / 100

- Audit:      29/50
- Scout:      0/30
- Community:  1/20

---
Audited on commit.show · https://commit.show/projects/e536b5c5-bbe6-4454-97ec-befb53ad0ca9
