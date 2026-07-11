import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/lib/supabase";
import { claimWebhookEvent } from "@/lib/crm";

// ──────────────────────────────────────────────────────────────────────
// /api/webhooks/resend-inbound — inbound leg of the client inbox.
//
// Resend inbound routing on the verified domain delivers replies here.
// 1. Verify the Svix signature (svix-id / svix-timestamp / svix-signature)
//    against RESEND_INBOUND_WEBHOOK_SECRET.
// 2. Dedupe by svix-id via processed_webhook_events.
// 3. Resolve the thread from the reply+<reply_token>@<domain> recipient.
// 4. Insert the message (direction 'in') and bump the thread.
//
// Council verdict 2026-07-10 Gap A.
// ──────────────────────────────────────────────────────────────────────

const REPLY_TOKEN_REGEX = /^reply\+([0-9a-f-]{36})@/i;

type InboundPayload = {
  type?: string;
  data?: {
    from?: string;
    to?: string[];
    subject?: string;
    text?: string;
    html?: string;
    attachments?: unknown[];
    email_id?: string;
  };
};

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "webhook not configured" }, { status: 500 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ ok: false, error: "missing signature headers" }, { status: 400 });
  }

  const rawBody = await req.text();
  let payload: InboundPayload;
  try {
    payload = new Webhook(secret).verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as InboundPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  const claim = await claimWebhookEvent(svixId);
  if (claim === "duplicate") {
    return NextResponse.json({ ok: true, deduped: true });
  }
  if (claim === "error") {
    // 500 so the provider retries; the ledger insert is the idempotency gate.
    return NextResponse.json({ ok: false, error: "dedupe ledger unavailable" }, { status: 500 });
  }

  const data = payload.data;
  if (!data?.from || !data?.to?.length) {
    // Signed but unroutable — acknowledge so it is not retried forever.
    return NextResponse.json({ ok: true, ignored: "no routable recipient" });
  }

  const replyMatch = data.to
    .map((addr) => REPLY_TOKEN_REGEX.exec(addr.trim()))
    .find(Boolean);
  if (!replyMatch) {
    return NextResponse.json({ ok: true, ignored: "no reply token in recipients" });
  }
  const replyToken = replyMatch[1].toLowerCase();

  const { data: thread } = await supabaseAdmin
    .from("threads")
    .select("id")
    .eq("reply_token", replyToken)
    .maybeSingle();
  if (!thread) {
    return NextResponse.json({ ok: true, ignored: "unknown reply token" });
  }

  const now = new Date().toISOString();
  const { error: msgError } = await supabaseAdmin.from("messages").insert({
    thread_id: thread.id,
    direction: "in",
    from_email: data.from,
    to_email: data.to[0],
    subject: data.subject || null,
    body_text: data.text || null,
    body_html: data.html || null,
    resend_message_id: data.email_id || null,
    attachments: data.attachments?.length ? data.attachments : null,
  });
  if (msgError) {
    return NextResponse.json({ ok: false, error: msgError.message }, { status: 500 });
  }

  await supabaseAdmin.from("threads").update({ last_message_at: now }).eq("id", thread.id);

  // TODO(step 5, messaging inbox): fire /api/admin/notify so Jed hears about
  // the reply without watching the inbox.
  return NextResponse.json({ ok: true, thread_id: thread.id });
}
