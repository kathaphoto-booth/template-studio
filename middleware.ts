import { NextRequest, NextResponse } from "next/server";

// Constant-time string compare. Node's crypto.timingSafeEqual is unavailable
// in the edge runtime (throws at request time), so we do it by hand.
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

// ──────────────────────────────────────────────────────────────────────
// Studio gate — protects the admin/designer UI (and AI routes) behind a
// simple HTTP Basic auth check.
//
// PROTECTED   /studio, /studio/*       → studio UI (admin tweak)
//             /admin,  /admin/*        → lead list + per-lead detail (PII)
//             /api/admin/*             → admin mutations (status, notify)
//             /api/generate*           → AI cost surface (future)
//
// PUBLIC      /                        → redirects to /gallery (the public front door)
//             /gallery                 → client-facing funnel
//             /portal/[id]/...         → client-facing template gallery
//             /api/selection, /api/lead, /api/request, /api/availability,
//             /api/upload-url, /api/webhooks/*
//
// Set STUDIO_PASSWORD in env. Username can be anything (we ignore it).
// If STUDIO_PASSWORD is unset, the gate stands open — in every environment.
// This is deliberate soft-open behavior: the public gallery must never be
// collateral damage of a missing env var. Set STUDIO_PASSWORD in Vercel
// before sharing the studio URL; until then the studio is reachable.
// ──────────────────────────────────────────────────────────────────────

// Exact path OR any sub-path under these bases is protected. Sub-path match
// uses the `base + "/"` boundary so "/admin" never accidentally matches
// "/administrator" — and, critically, "/admin/<lead-uuid>" IS gated (the
// earlier exact-match list let it through, leaking lead PII to anon callers).
const PROTECTED_BASES = ["/studio", "/admin", "/api/admin"];
// Loose string prefixes — anything starting with these is protected. Kept
// loose so "/api/generate" also covers a future "/api/generate-theme".
const PROTECTED_PREFIXES = ["/api/generate"];

function isProtected(pathname: string): boolean {
  if (PROTECTED_BASES.some((b) => pathname === b || pathname.startsWith(b + "/"))) return true;
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const password = process.env.STUDIO_PASSWORD || "";
  if (!password) {
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;
  if (!isProtected(pathname)) return NextResponse.next();

  const authHeader = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const colonIndex = decoded.indexOf(":");
    const provided = decoded.slice(colonIndex + 1);
    if (safeEqual(provided, password)) return NextResponse.next();
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Katha Studio"' },
  });
}

export const config = {
  // Run on everything except static assets and Next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
