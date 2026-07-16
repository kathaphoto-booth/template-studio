# App Router Context & Routing Law

## Directory Scope
This directory contains page layouts, routes, middleware, and Next.js App Router configurations.

## Architecture Guidelines
- **Framework:** Next.js 15 + React 19 (await all `params` promises).
- **Core Pages:**
  - `/` -> Editor canvas and template constraint interface.
  - `/gallery` -> Public showcase of commissioned client designs.
  - `/admin` -> Selection list.
  - `/admin/[id]` -> Interactive selection view for specific clients.
- **Middleware:** `middleware.ts` handles password-gating using `STUDIO_PASSWORD`.
- **Caching Law:** Gallery and admin pages/API routes must bypass edge caching via `force-dynamic` to avoid stale state.
