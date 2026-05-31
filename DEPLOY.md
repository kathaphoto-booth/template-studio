# Deployment Guide — Katha Template Studio

Code lives at https://github.com/kathaphoto-booth/template-studio
Vercel auto-deploys on every push to `main`.

---

## 1. Connect Vercel to the repo (one-time)

1. Go to https://vercel.com/new
2. Import `kathaphoto-booth/template-studio`
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy**

## 2. Set environment variables (Vercel → Settings → Environment Variables)

| Variable | Value | Required? |
|---|---|---|
| `STUDIO_PASSWORD` | _pick a password — the admin studio at `/` will require it_ | **Yes** (else studio is public) |
| `RESEND_API_KEY` | Get free at https://resend.com → API Keys | **Yes** (for email notifications) |
| `NOTIFICATION_EMAIL` | `hello@kathabooth.com` (or your inbox) | **Yes** |
| `NOTIFICATION_FROM` | leave blank — uses Resend's `onboarding@resend.dev` until kathabooth.com is verified with Resend | Optional |
| `GEMINI_API_KEY` | only if using the AI theme generator | Optional |

After setting env vars, **redeploy** (Vercel → Deployments → ⋯ → Redeploy).

## 3. Disable Deployment Protection

Settings → Deployment Protection → Production → **None** (or Standard Protection if you want previews gated).
Without this, `/gallery` returns 401 to clients.

## 4. Custom domain

Settings → Domains → add `book.kathabooth.com`
Vercel shows the CNAME target (e.g. `cname.vercel-dns.com.`).
In Porkbun → DNS → add CNAME: `book` → `cname.vercel-dns.com.`

DNS propagates in 5–60 min. Test with: `dig book.kathabooth.com`.

## 5. Verify

- `https://book.kathabooth.com/gallery` → opens (public)
- `https://book.kathabooth.com/` → prompts for password (Basic auth)
- Submit a test pick from `/gallery` → email arrives in your inbox

---

## Sharing access with your business partner

**Option A — GitHub access**
- Org Settings → People → Invite member to `kathaphoto-booth`
- They can clone, edit templates, push (auto-deploys)

**Option B — View-only**
- Share `https://book.kathabooth.com/gallery` (no auth needed for clients)
- Share `STUDIO_PASSWORD` for `/` (admin tweak access)

## Adding HoneyBook to /api/selection later (Phase D)

`app/api/selection/route.ts` already has the dispatch stub for HoneyBook.
Set `HONEYBOOK_WEBHOOK_URL` (Zapier catch hook) or `HONEYBOOK_API_KEY` and
implement the body of `dispatchHoneyBook()` — same payload, no other changes needed.

## Headless client export (no studio UI)

To produce print-ready files for a client without using the studio:

```bash
# Edit scripts/export-tracy.mjs — change PRESET (names, format, etc.)
npm run export:tracy
# Outputs to ./exports/:
#   client_composite.png       (client proof)
#   client_alpha_overlay.png   (Luma Booth upload, X=0 Y=0)
#   client_composite_cmyk.pdf  (print vendor)
#   client_alpha_overlay.pdf   (alt print vendor delivery)
```
