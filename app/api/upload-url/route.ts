import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rateLimit";

// ──────────────────────────────────────────────────────────────────────
// /api/upload-url — issues a presigned upload slot in the private
// `katha-references` bucket so client reference photos go to Storage,
// never as base64 into the database. The client completes the upload
// with supabase-js `uploadToSignedUrl(path, token, file)`.
//
// If Supabase isn't configured (local dev without env), returns 503 and
// the gallery falls back to its legacy inline-base64 path.
// ──────────────────────────────────────────────────────────────────────

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const rateLimitResult = await checkRateLimit(`upload_url:${ipHash}`, 15, 60);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { ok: false, error: "Too many uploads. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "15",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": rateLimitResult.reset,
        },
      }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { ok: false, error: "storage not configured" },
      { status: 503 }
    );
  }

  let body: { contentType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const contentType = String(body?.contentType || "");
  if (!ALLOWED.has(contentType)) {
    return NextResponse.json(
      { ok: false, error: "unsupported content type" },
      { status: 400 }
    );
  }

  const path = `refs/${randomUUID()}.${EXT[contentType]}`;

  const { data, error } = await supabaseAdmin.storage
    .from("katha-references")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: error?.message || "could not create upload url" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, path: data.path, token: data.token });
}
