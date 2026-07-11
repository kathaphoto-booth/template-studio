import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { requireStudioAuth } from "@/lib/crm";

// ──────────────────────────────────────────────────────────────────────
// /api/messages — outbound leg of the client inbox (HoneyBook messaging
// replacement, council verdict 2026-07-10 Gap A).
//
//   POST (studio auth) — send a message to a lead. Finds or creates the
//     thread, sends via Resend with reply_to reply+<reply_token>@<domain>
//     so the client's reply routes back through /api/webhooks/resend-inbound,
//     then records the message row.
//   GET  (studio auth) — list threads (?lead_id=) or messages (?thread_id=).
//
// Requires the verified kathabooth.com sender (verdict bottleneck #1):
// MESSAGING_FROM e.g. "Katha <hello@kathabooth.com>" and
// MESSAGING_REPLY_DOMAIN e.g. "kathabooth.com".
// ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const denied = requireStudioAuth(req);
  if (denied) return denied;

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  let body: { lead_id?: string; subject?: string; body_text?: string; body_html?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 }); }

  const { lead_id, subject, body_text, body_html } = body;
  if (!lead_id || !body_text) {
    return NextResponse.json({ ok: false, error: "lead_id and body_text are required" }, { status: 400 });
  }

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("id, client_name, client_email")
    .eq("id", lead_id)
    .single();
  if (leadError || !lead) {
    return NextResponse.json({ ok: false, error: "lead not found" }, { status: 404 });
  }

  // One thread per lead for v1; subject is set on first send.
  let { data: thread } = await supabaseAdmin
    .from("threads")
    .select("id, reply_token, subject")
    .eq("lead_id", lead_id)
    .maybeSingle();

  if (!thread) {
    const { data: created, error: threadError } = await supabaseAdmin
      .from("threads")
      .insert({ lead_id, subject: subject || "Your Katha booking" })
      .select("id, reply_token, subject")
      .single();
    if (threadError || !created) {
      return NextResponse.json({ ok: false, error: "could not create thread" }, { status: 500 });
    }
    thread = created;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "email not configured (missing RESEND_API_KEY)" }, { status: 500 });
  }
  const fromAddr = process.env.MESSAGING_FROM || process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";
  const replyDomain = process.env.MESSAGING_REPLY_DOMAIN || "kathabooth.com";
  const replyTo = `reply+${thread.reply_token}@${replyDomain}`;

  const resend = new Resend(apiKey);
  const { data: sent, error: sendError } = await resend.emails.send({
    from: fromAddr,
    to: lead.client_email,
    replyTo,
    subject: subject || thread.subject,
    text: body_text,
    ...(body_html ? { html: body_html } : {}),
  });
  if (sendError) {
    return NextResponse.json({ ok: false, error: sendError.message }, { status: 502 });
  }

  const now = new Date().toISOString();
  const { data: message, error: msgError } = await supabaseAdmin
    .from("messages")
    .insert({
      thread_id: thread.id,
      direction: "out",
      from_email: fromAddr,
      to_email: lead.client_email,
      subject: subject || thread.subject,
      body_text,
      body_html: body_html || null,
      resend_message_id: sent?.id || null,
    })
    .select("id")
    .single();
  if (msgError) {
    // Email left the building; surface the bookkeeping failure honestly.
    return NextResponse.json({ ok: false, error: "sent but not recorded: " + msgError.message }, { status: 500 });
  }

  await supabaseAdmin.from("threads").update({ last_message_at: now }).eq("id", thread.id);

  return NextResponse.json({ ok: true, thread_id: thread.id, message_id: message.id });
}

export async function GET(req: NextRequest) {
  const denied = requireStudioAuth(req);
  if (denied) return denied;

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const threadId = req.nextUrl.searchParams.get("thread_id");
  if (threadId) {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, messages: data });
  }

  const leadId = req.nextUrl.searchParams.get("lead_id");
  let query = supabaseAdmin
    .from("threads")
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false });
  if (leadId) query = query.eq("lead_id", leadId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, threads: data });
}
