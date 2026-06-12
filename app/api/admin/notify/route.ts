import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  const password = process.env.STUDIO_PASSWORD;
  if (password) {
    const authHeader = req.headers.get("authorization") ?? "";
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme !== "Basic" || !encoded) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const provided = decoded.split(":")[1];
    if (provided !== password) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  // TODO(P0.2 - SaaS Phase): Refactor admin routes to use lead.id (UUID) in the URL instead of lead_hash. 
  // The lead_hash acts as a bearer token and should only be resolved server-side for selection queries.

  let body: { lead_hash?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const { lead_hash, message } = body;
  if (!lead_hash) {
    return NextResponse.json({ ok: false, error: "lead_hash is required" }, { status: 400 });
  }
  const LEAD_HASH_REGEX = /^[a-f0-9]{32}$/;
  if (!LEAD_HASH_REGEX.test(lead_hash)) {
    return NextResponse.json({ ok: false, error: "Invalid identifier" }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .select("client_name, client_email")
    .eq("lead_hash", lead_hash)
    .single();

  if (error || !lead) {
    return NextResponse.json({ ok: false, error: "lead not found" }, { status: 404 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "email not configured (missing RESEND_API_KEY)" }, { status: 500 });
  }

  const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const { error: emailError } = await resend.emails.send({
    from: fromAddr,
    to: lead.client_email,
    subject: "Your Katha design is ready for your review",
    html: buildPreviewEmail(lead.client_name, message),
    text: `Dear ${lead.client_name},\n\n${message ? message + "\n\n" : ""}Your Katha design is ready. We will be in touch shortly.\n\nWarmly,\nThe Katha Team`,
  });

  if (emailError) {
    return NextResponse.json({ ok: false, error: emailError.message }, { status: 500 });
  }

  await supabaseAdmin
    .from("leads")
    .update({ preview_sent_at: new Date().toISOString() })
    .eq("lead_hash", lead_hash);

  return NextResponse.json({ ok: true });
}

function buildPreviewEmail(name: string, message?: string): string {
  return `
    <div style="font-family:'EB Garamond',Georgia,serif;max-width:600px;margin:0 auto;padding:40px 48px;background:#EAE2D5;color:#241E1A;line-height:1.65;">
      <p style="font-family:'Libre Franklin',sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;color:#8C382A;margin:0 0 32px;font-weight:600;">
        Katha Photo Booth
      </p>
      <h2 style="font-family:'Fraunces',serif;font-weight:400;font-size:22px;letter-spacing:-0.01em;color:#241E1A;margin:0 0 28px;border-bottom:1px solid #C4B59D;padding-bottom:14px;">
        Your design is ready.
      </h2>
      <p style="font-size:16px;margin:0 0 20px;">Dear ${name},</p>
      ${message
        ? `<p style="font-size:15px;font-style:italic;margin:0 0 28px;padding:16px 20px;border-top:1px dashed #C4B59D;background:rgba(196,181,157,0.12);">${escapeHtml(message)}</p>`
        : ""}
      <p style="font-size:15px;margin:0 0 32px;color:#3a3530;">
        We have finished crafting your photo booth design. Our team will reach out with the final file and any next steps for your event.
      </p>
      <p style="font-size:13px;color:#5A564E;border-top:1px dashed #C4B59D;padding-top:20px;margin:0 0 24px;font-style:italic;">
        A photo experience designed with intention.
      </p>
      <p style="font-family:'Libre Franklin',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#5A564E;margin:0;">
        Warmly,<br/>The Katha Team
      </p>
    </div>
  `;
}
