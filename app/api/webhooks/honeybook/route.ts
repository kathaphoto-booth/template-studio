import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
