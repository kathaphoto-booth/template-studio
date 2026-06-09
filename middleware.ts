import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// ──────────────────────────────────────────────────────────────────────
// Studio gate — protects the admin/designer UI (and AI routes) behind a
// simple HTTP Basic auth check.
//
// PROTECTED   /          → studio UI (admin tweak)
//             /api/generate, /api/generate-theme → AI cost surface
//
// PUBLIC      /portal/[id]/template-design   → client-facing template gallery
//             /api/selection                 → client submits their pick (POST only)
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
  const password = process.env.STUDIO_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Server configuration error — contact administrator", { status: 503 });
    }
    return NextResponse.next(); // local dev only
  }

  const pathname = req.nextUrl.pathname;
  if (!isProtected(pathname)) return NextResponse.next();

  const authHeader = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const colonIndex = decoded.indexOf(":");
    const provided = decoded.slice(colonIndex + 1);
    const authBuf = Buffer.from(provided, "utf-8");
    const passBuf = Buffer.from(password, "utf-8");
    const match = authBuf.length === passBuf.length && timingSafeEqual(authBuf, passBuf);
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
