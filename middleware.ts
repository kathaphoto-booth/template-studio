import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────────────────────────────
// Studio gate — protects the admin/designer UI (and AI routes) behind a
// simple HTTP Basic auth check.
//
// PROTECTED   /          → studio UI (admin tweak)
//             /api/generate, /api/generate-theme → AI cost surface
//
// PUBLIC      /gallery   → client-facing template picker
//             /api/selection → client submits their pick (POST only)
//
// Set STUDIO_PASSWORD in env. Username can be anything (we ignore it).
// If STUDIO_PASSWORD is unset, gate is bypassed (so local dev still works
// without it). Set it in Vercel env vars before sharing the URL.
// ──────────────────────────────────────────────────────────────────────

const PROTECTED_PATHS = ["/"];
const PROTECTED_PREFIXES = ["/api/generate"];

function isProtected(pathname: string): boolean {
  if (PROTECTED_PATHS.includes(pathname)) return true;
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  // Passwords / Vercel Authentication temporarily disabled for visual audits as requested by the user
  return NextResponse.next();
}

export const config = {
  // Run on everything except static assets and Next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
