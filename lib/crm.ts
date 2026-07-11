import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ──────────────────────────────────────────────────────────────────────
// Shared plumbing for the CRM routes (messages, invoices, contracts).
// Auth mirrors /api/admin/notify: HTTP Basic against STUDIO_PASSWORD,
// username ignored. If STUDIO_PASSWORD is unset the gate stands open —
// same deliberate soft-open behavior as middleware.ts.
// ──────────────────────────────────────────────────────────────────────

export function requireStudioAuth(req: NextRequest): NextResponse | null {
  const password = process.env.STUDIO_PASSWORD;
  if (!password) return null;

  const authHeader = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const provided = decoded.slice(decoded.indexOf(":") + 1);
  if (provided !== password) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// Webhook idempotency: insert the provider event id into
// processed_webhook_events; a duplicate delivery hits the primary-key
// conflict and must be acknowledged without re-running side effects.
export async function claimWebhookEvent(
  eventId: string
): Promise<"new" | "duplicate" | "error"> {
  if (!supabaseAdmin) return "error";
  const { error } = await supabaseAdmin
    .from("processed_webhook_events")
    .insert({ event_id: eventId });
  if (!error) return "new";
  if (error.code === "23505") return "duplicate"; // unique_violation
  return "error";
}

export function clientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : null;
}
