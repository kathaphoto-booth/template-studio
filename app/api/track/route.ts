import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ──────────────────────────────────────────────────────────────────────
// /api/track — first-party funnel event sink (zero Google, zero SaaS)
//
// Contract:
//   • event must be on the allow-list — anything else is a 400, no work done
//   • console.log("[FUNNEL]", json) ALWAYS fires (greppable in Vercel logs)
//   • funnel_events insert is best-effort: only when supabaseAdmin is
//     configured, and a DB miss never surfaces to the client
//   • no PII: leadHash only, meta is size-capped
// ──────────────────────────────────────────────────────────────────────

const ALLOWED_EVENTS = new Set([
  "gallery_view",
  "date_check",
  "drawer_open",
  "selection_submit",
]);

const META_MAX_BYTES = 1024;

export async function POST(req: NextRequest) {
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const event = typeof body?.event === "string" ? body.event : "";
  if (!ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ ok: false, error: "unknown event" }, { status: 400 });
  }

  const leadHash =
    typeof body?.leadHash === "string" && body.leadHash.length > 0
      ? body.leadHash.slice(0, 64)
      : null;

  // meta is opaque jsonb but size-capped so a hostile payload can't bloat
  // logs or rows; oversized or malformed meta is dropped, not rejected.
  let meta: Record<string, unknown> | null = null;
  if (body?.meta && typeof body.meta === "object" && !Array.isArray(body.meta)) {
    try {
      if (JSON.stringify(body.meta).length <= META_MAX_BYTES) meta = body.meta;
    } catch {
      /* unserializable meta → dropped */
    }
  }

  // The log line is the source of truth even with no database configured.
  console.log(
    "[FUNNEL]",
    JSON.stringify({ event, lead_hash: leadHash, meta, at: new Date().toISOString() })
  );

  // Best-effort durable copy — never throws to the client.
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("funnel_events")
        .insert({ event, lead_hash: leadHash, meta });
      if (error) {
        console.error("[FUNNEL_DB_MISS]", JSON.stringify({ event, detail: error.message }));
      }
    } catch (err: any) {
      console.error(
        "[FUNNEL_DB_MISS]",
        JSON.stringify({ event, detail: err?.message || String(err) })
      );
    }
  }

  return NextResponse.json({ ok: true });
}
