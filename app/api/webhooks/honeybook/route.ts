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

    const body = JSON.parse(rawBody);
    console.log("[Webhook] Received HoneyBook event:", JSON.stringify(body, null, 2));

    // Identify event type
    const eventType = body?.event?.type || body?.type || "unknown";
    
    // We are looking for payment and contract completions
    if (eventType === "payment_completed" || eventType === "contract_signed" || eventType === "project_booked") {
      
      // Attempt to find the client email or lead hash from the payload
      const clientEmail = body?.data?.client_email || body?.data?.email || body?.client?.email;
      const leadHash = body?.data?.lead_hash || body?.lead_hash;

      if (!supabaseAdmin) {
        console.error("[Webhook] Supabase admin not configured.");
        return NextResponse.json({ ok: false, error: "supabase not configured" }, { status: 500 });
      }

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
    console.error("[Webhook] Error parsing HoneyBook webhook:", error);
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }
}
