import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

type InquiryPayload = {
  client_name: string;
  client_email: string;
  client_phone?: string;
  event_date: string;
  tier_selected?: string;
  source?: string;
};

// ── Outbound Dispatch targets ──

// 1. Database insert via Supabase
async function recordLead(payload: InquiryPayload, leadHash: string) {
  if (!supabaseAdmin) {
    return { ok: false, detail: "supabase not configured (skipped)" };
  }

  try {
    const { error } = await supabaseAdmin
      .from("leads")
      .insert({
        client_name: payload.client_name,
        client_email: payload.client_email,
        client_phone: payload.client_phone || null,
        event_date: payload.event_date,
        lead_hash: leadHash,
        status: "Inquired",
        // Attribution columns ride along only when present, so unattributed
        // inquiries insert exactly as before.
        ...(payload.tier_selected ? { tier_selected: payload.tier_selected } : {}),
        ...(payload.source ? { source: payload.source } : {}),
      });

    if (error) {
      return { ok: false, detail: `database error: ${error.message}` };
    }
    return { ok: true, detail: "lead recorded in database" };
  } catch (err: any) {
    return { ok: false, detail: `database exception: ${err?.message || err}` };
  }
}

// 2. HoneyBook Lead Ping
async function pingHoneyBook(payload: InquiryPayload, leadHash: string) {
  const webhookUrl = process.env.HONEYBOOK_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: false, detail: "honeybook webhook not configured (skipped)" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "katha_inquiry",
        project_id: "679039857c7a9b001f4098a8",
        client_name: payload.client_name,
        client_email: payload.client_email,
        client_phone: payload.client_phone || null,
        event_date: payload.event_date,
        lead_hash: leadHash,
        status: "Inquired",
        tier_selected: payload.tier_selected || null,
        // `source` above is the system marker; the marketing attribution
        // slug travels as `lead_source`.
        lead_source: payload.source || null,
      }),
    });

    if (!res.ok) {
      return { ok: false, detail: `honeybook webhook failed with status ${res.status}` };
    }
    return { ok: true, detail: "honeybook intake synced" };
  } catch (err: any) {
    return { ok: false, detail: `honeybook webhook exception: ${err?.message || err}` };
  }
}

// 3. Transactional Enrichment Email to Client via Resend
async function sendEnrichmentEmail(payload: InquiryPayload, leadHash: string, baseUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, detail: "resend email not configured (skipped)" };
  }

  const galleryLink = `${baseUrl}/gallery?lead=${leadHash}`;
  const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";

  const subject = "Your date is noted — Katha Booth";

  const textBody = `
Dear ${payload.client_name},

Your inquiry for ${payload.event_date} is on the registry. Nothing is confirmed until you choose your date and installation — this note simply holds your place in the conversation.

Katha is a studio, not a rental: a weathered oak booth, a trained operator on site, and archival prints made to be kept for decades.

When you're ready, open the design gallery to choose your date, your installation, and the plate your prints are set on:

${galleryLink}

Take your time. The details — stock, layout, lettering — are yours to shape.

— The studio at Katha Booth
  `.trim();

  const htmlBody = `
    <div style="font-family:Georgia, 'Times New Roman', serif; max-width:600px; margin:0 auto; padding:48px 44px; background-color:#F5EFE6; color:#241E1A; line-height:1.6;">
      <p style="font-family:'Courier New', monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.28em; color:#8A7350; margin:0 0 34px;">
        // Katha Booth · Inquiry Registry
      </p>

      <h2 style="font-family:Georgia, serif; font-weight:400; font-size:27px; line-height:1.25; letter-spacing:-0.01em; margin:0 0 26px; color:#1A1714;">
        Your date is noted.
      </h2>

      <p style="font-size:16px; margin:0 0 20px;">
        Dear ${payload.client_name},
      </p>

      <p style="font-size:16px; margin:0 0 20px;">
        Your inquiry for <strong>${payload.event_date}</strong> is on the registry. Nothing is confirmed yet — this note simply holds your place in the conversation.
      </p>

      <p style="font-size:16px; margin:0 0 30px;">
        Katha is a studio, not a rental: a weathered oak booth, a trained operator on site, and archival prints made to be kept for decades.
      </p>

      <div style="margin:0 0 38px;">
        <a href="${galleryLink}" style="display:inline-block; font-family:'Courier New', monospace; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; background-color:#110F0D; color:#DCCBB5; padding:17px 34px; text-decoration:none;">
          Open the design gallery →
        </a>
      </div>

      <p style="font-size:14px; color:#5A564E; margin:44px 0 0; border-top:1px dashed #DCCBB5; padding-top:22px; font-style:italic;">
        Take your time. The details — stock, layout, lettering — are yours to shape.
      </p>

      <p style="margin:26px 0 0; font-family:'Courier New', monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.14em; color:#8A7350;">
        — The studio at Katha Booth
      </p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddr,
      to: payload.client_email,
      subject,
      html: htmlBody,
      text: textBody,
    });

    if (error) return { ok: false, detail: `email failed: ${error.message}` };
    return { ok: true, detail: "enrichment email sent successfully" };
  } catch (err: any) {
    return { ok: false, detail: `email exception: ${err?.message || err}` };
  }
}

// ── POST API Handler ──
export async function POST(req: NextRequest) {
  // Explicit APP_URL wins (canonical domain); otherwise the request's own
  // origin is always available and correct in every environment.
  const baseUrl = process.env.APP_URL ?? req.nextUrl.origin;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Validate fields
  const name = body?.client_name;
  const email = body?.client_email;
  const date = body?.event_date?.trim();
  const phone = body?.client_phone?.trim();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || name.trim().length < 2) return NextResponse.json({error:'Name required (min 2 chars)'},{status:400});
  if (!email || !EMAIL_REGEX.test(email.trim())) return NextResponse.json({error:'Valid email required'},{status:400});
  if (!date) return NextResponse.json({error:'missing required fields (event_date)'},{status:400});
  
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Optional attribution from the marketing entry contract — never a reason
  // to reject an inquiry; malformed values are simply dropped.
  const tierSelected =
    typeof body?.tier_selected === "string" ? body.tier_selected.trim().slice(0, 120) : "";
  const source = typeof body?.source === "string" ? body.source.trim().slice(0, 64) : "";

  // Generate unique cryptographic lead hash (16 bytes)
  const leadHash = crypto.randomBytes(16).toString("hex");

  const payload: InquiryPayload = {
    client_name: cleanName,
    client_email: cleanEmail,
    event_date: date,
    client_phone: phone || undefined,
    tier_selected: tierSelected || undefined,
    source: source || undefined,
  };

  // Run database, HoneyBook, and transactional email dispatches in parallel
  const results = await Promise.all([
    recordLead(payload, leadHash).then((r) => ({ target: "database", ...r })),
    pingHoneyBook(payload, leadHash).then((r) => ({ target: "honeybook", ...r })),
    sendEnrichmentEmail(payload, leadHash, baseUrl).then((r) => ({ target: "email", ...r })),
  ]);

  const anyOk = results.some((r) => r.ok);

  return NextResponse.json(
    {
      ok: anyOk,
      lead_hash: leadHash,
      dispatch: results,
    },
    { status: anyOk ? 200 : 202 }
  );
}
