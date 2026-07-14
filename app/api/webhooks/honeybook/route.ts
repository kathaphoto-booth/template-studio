import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-honeybook-signature");
    const secret = process.env.HONEYBOOK_WEBHOOK_SECRET;

    if (secret && signature) {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = hmac.update(rawBody).digest("hex");
      // Use timing-safe equality to prevent timing attacks on the webhook signature
      try {
        const sigBuffer = Buffer.from(signature, "hex");
        const digestBuffer = Buffer.from(digest, "hex");
        
        if (sigBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(sigBuffer, digestBuffer)) {
          console.error("[Webhook] Invalid HoneyBook signature.");
          return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }
      } catch (e) {
        console.error("[Webhook] Signature buffer conversion failed.");
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("[Webhook] Missing HoneyBook signature or secret.");
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("[Webhook] Error parsing HoneyBook payload:", parseError);
      return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
    }
    console.log("[Webhook] Received HoneyBook event:", JSON.stringify(body, null, 2));

    if (!supabaseAdmin) {
      console.error("[Webhook] Supabase admin not configured.");
      return NextResponse.json({ ok: false, error: "supabase not configured" }, { status: 500 });
    }

    // Idempotency: HoneyBook retries deliveries on timeout/non-2xx, so the
    // same event can arrive more than once. Record a dedupe key up front —
    // a duplicate hits the primary-key conflict and is acknowledged without
    // re-running the side effects below. Prefer the payload's own event id,
    // but nothing in this repo has verified HoneyBook's real field names, so
    // fall back to hashing the raw body: a true retry resends byte-identical
    // content, so this still dedupes correctly even if the id guess is wrong
    // — it just can't false-positive on unrelated events the way a wrong
    // field-name guess could.
    const eventId = body?.event?.id || body?.id || crypto.createHash("sha256").update(rawBody).digest("hex");
    const { error: dedupeError } = await supabaseAdmin
      .from("processed_webhook_events")
      .insert({ event_id: String(eventId) });

    if (dedupeError) {
      if (dedupeError.code === "23505") {
        console.log("[Webhook] Duplicate delivery, already processed:", eventId);
        return NextResponse.json({ ok: true, received: true, duplicate: true });
      }
      console.error("[Webhook] Failed to record event id, processing without dedupe:", dedupeError);
    }

    // Identify event type
    const eventType = body?.event?.type || body?.type || "unknown";

    // We are looking for payment and contract completions
    if (eventType === "payment_completed" || eventType === "contract_signed" || eventType === "project_booked") {
      
      // Attempt to find the client email or lead hash from the payload
      const clientEmail = body?.data?.client_email || body?.data?.email || body?.client?.email;
      const leadHash = body?.data?.lead_hash || body?.lead_hash;

      if (leadHash) {
        const { error } = await supabaseAdmin
          .from("leads")
          .update({ status: "contracted_and_paid" })
          .eq("lead_hash", leadHash);
          
        if (error) {
          console.error("[Webhook] Supabase update by lead_hash failed:", error);
        } else {
          console.log("[Webhook] Successfully updated lead status by lead_hash:", leadHash);
        }
      } else if (clientEmail) {
        const { error } = await supabaseAdmin
          .from("leads")
          .update({ status: "contracted_and_paid" })
          .eq("client_email", clientEmail);

        if (error) {
          console.error("[Webhook] Supabase update by email failed:", error);
        } else {
          console.log("[Webhook] Successfully updated lead status by email:", clientEmail);
        }
      } else {
        console.log("[Webhook] Could not identify lead from payload. Email and lead_hash missing.");
      }
    }

    return NextResponse.json({ ok: true, received: true });
  } catch (error) {
    // Anything reaching here is unexpected (not a malformed-payload case —
    // that's handled above with its own 400) so HoneyBook's retry-on-5xx
    // behavior is what we want: surface it as a server error, not a
    // client-payload error, so a transient failure gets retried.
    console.error("[Webhook] Unexpected error processing HoneyBook webhook:", error);
    return NextResponse.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
