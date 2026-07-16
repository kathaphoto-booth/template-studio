import { NextRequest, NextResponse } from "next/server";
// Pure JS constant-time comparison for Edge Runtime support
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

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

const PROTECTED_PATHS = ["/", "/admin"];
const PROTECTED_PREFIXES = ["/api/generate", "/api/admin"];

function isProtected(pathname: string): boolean {
  if (PROTECTED_PATHS.includes(pathname)) return true;
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
    const match = constantTimeCompare(provided, password);
    if (match) return NextResponse.next();
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
