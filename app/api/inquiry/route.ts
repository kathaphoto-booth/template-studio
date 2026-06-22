import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rateLimit";

type InquiryPayload = {
  client_name: string;
  client_email: string;
  client_phone?: string;
  event_date: string;
  venue?: string;
  event_type?: string;
  guest_count?: string;
  indoors_outdoors?: string;
  referral?: string;
  selected_package?: string;
  addons?: string[];
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
        venue: payload.venue || null,
        event_type: payload.event_type || null,
        guest_count: payload.guest_count || null,
        indoors_outdoors: payload.indoors_outdoors || null,
        referral: payload.referral || null,
        selected_package: payload.selected_package || null,
        addons: payload.addons || [],
        lead_hash: leadHash,
        status: "Inquired",
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

  const galleryLink = `${baseUrl}/portal/${leadHash}/template-design`;
  const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";

  const firstName = payload.client_name.split(" ")[0];
  const subject = `Your commission is recorded, ${firstName}.`;

  const textBody = `
Dear ${payload.client_name},

Your inquiry has been received and the details are held quietly on your behalf.

Event  — ${payload.event_date}
${payload.venue ? `Venue  — ${payload.venue}\n` : ""}Name   — ${payload.client_name}

A dedicated portal has been prepared. To choose the architectural blueprint for your portraits — backdrop, typography, print geometry — step through at your own pace:

${galleryLink}

No urgency. The portal holds your space.

Warmly,
The Katha Team
  `.trim();

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") console.log("[email:mock]", { to: payload.client_email, subject });
    return { ok: false, detail: "resend email not configured (skipped)" };
  }

  // ── Editorial Email HTML ──────────────────────────────────────────────────
  // Typography:
  //   Display header  → Playfair Display italic (IvyMode-class editorial serif)
  //   Narrative body  → Georgia (EB Garamond fallback for email clients)
  //   Body UI/labels  → Helvetica Neue / Arial (Proxima Nova system equivalent)
  //   Metadata lines  → Courier New mono (JetBrains Mono fallback)
  // Palette: Piña Ecru (#EAE2D5) base · Iron Bark (#241E1A) text · Loko Rust (#8C382A) CTA
  const venueRow = payload.venue
    ? `<tr style="line-height:2.6;">
        <td style="font-family:'Courier New',Courier,monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.22em;color:#9C958A;width:68px;vertical-align:top;">Venue</td>
        <td style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:300;font-size:19px;color:#241E1A;vertical-align:top;">${payload.venue}</td>
      </tr>`
    : "";

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${subject}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Hanken+Grotesk:wght@400;500&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width:600px){
      .container{width:100%!important;padding:32px 20px!important}
      .hero-num{font-size:72px!important}
      .hero-line{font-size:28px!important}
      .cta-btn{width:100%!important;display:block!important;text-align:center!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#E8E3D9;font-family:'Helvetica Neue',Arial,sans-serif;">

<div class="container" style="max-width:620px;margin:0 auto;padding:52px 44px;background-color:#EAE2D5;">

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:44px;">
    <tr>
      <td>
        <span style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:300;font-size:22px;color:#241E1A;letter-spacing:-0.02em;">katha</span>
      </td>
      <td align="right">
        <span style="font-family:'Courier New',Courier,monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#9C958A;">Commission Receipt</span>
      </td>
    </tr>
  </table>

  <div style="height:1px;background:linear-gradient(to right,rgba(36,30,26,0.22),transparent);margin-bottom:44px;"></div>

  <p class="hero-num" style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:300;font-size:88px;color:rgba(36,30,26,0.055);margin:0 0 -22px -3px;line-height:1;letter-spacing:-0.05em;">01</p>

  <h1 class="hero-line" style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:300;font-size:38px;color:#241E1A;letter-spacing:-0.025em;line-height:1.2;margin:0 0 32px 0;">
    Your commission<br>is on record.
  </h1>

  <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.8;color:#3A332D;margin:0 0 18px 0;">Dear ${payload.client_name},</p>

  <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.9;color:#3A332D;margin:0 0 28px 0;">
    We have received your inquiry and the details are held quietly on your behalf. A dedicated portal has been prepared — your architectural blueprint, where backdrop, typography, and print geometry are yours to shape at your own pace.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:36px 0;border-top:1px solid rgba(36,30,26,0.12);border-bottom:1px solid rgba(36,30,26,0.12);padding:22px 0;">
    <tr style="line-height:2.6;">
      <td style="font-family:'Courier New',Courier,monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.22em;color:#9C958A;width:68px;vertical-align:top;">Date</td>
      <td style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:300;font-size:19px;color:#241E1A;vertical-align:top;">${payload.event_date}</td>
    </tr>
    ${venueRow}
    <tr style="line-height:2.6;">
      <td style="font-family:'Courier New',Courier,monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.22em;color:#9C958A;width:68px;vertical-align:top;">Name</td>
      <td style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:300;font-size:19px;color:#241E1A;vertical-align:top;">${payload.client_name}</td>
    </tr>
  </table>

  <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.95;color:#5A564E;margin:0 0 44px 0;font-style:italic;">
    No urgency. The portal holds your space indefinitely — step through when the occasion calls.
  </p>

  <table cellpadding="0" cellspacing="0" style="margin-bottom:52px;">
    <tr>
      <td>
        <a class="cta-btn" href="${galleryLink}" style="display:inline-block;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:0.26em;background-color:#8C382A;color:#EAE2D5;padding:16px 40px;text-decoration:none;">
          Enter Your Portal
        </a>
      </td>
    </tr>
  </table>

  <div style="height:1px;background:linear-gradient(to right,rgba(36,30,26,0.18),transparent);margin-bottom:32px;"></div>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <p style="font-family:'Courier New',Courier,monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.18em;color:#9C958A;margin:0 0 5px 0;">The Katha Team</p>
        <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#9C958A;margin:0;line-height:1.6;">Editorial portrait installations &mdash; Southern California</p>
      </td>
      <td align="right" valign="bottom">
        <span style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:300;font-size:30px;color:rgba(36,30,26,0.07);letter-spacing:-0.03em;">katha</span>
      </td>
    </tr>
  </table>

</div>
</body>
</html>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddr,
      to: payload.client_email,
      subject,
      html: htmlBody,
      text: textBody,
    });

    if (error) {
      if (process.env.NODE_ENV !== "production") console.log("[email:mock]", { to: payload.client_email, subject });
      return { ok: false, detail: `email failed: ${error.message}` };
    }
    return { ok: true, detail: "enrichment email sent successfully" };
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") console.log("[email:mock]", { to: payload.client_email, subject });
    return { ok: false, detail: `email exception: ${err?.message || err}` };
  }
}

// ── POST API Handler ──
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const rateLimitResult = await checkRateLimit(`inquiry:${ipHash}`, 5, 3600);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { ok: false, error: "Too many inquiries. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": rateLimitResult.reset,
        },
      }
    );
  }

  const appUrl = process.env.APP_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = req.headers.get("host");
  const requestHost = forwardedHost || host;
  const baseUrl = requestHost ? `https://${requestHost}` : (appUrl || vercelUrl || 'http://localhost:3000');

  if (!appUrl && !vercelUrl && !requestHost && process.env.NODE_ENV === 'production') {
    return NextResponse.json({error:'Server configuration error'},{status:503});
  }

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

  // Generate unique cryptographic lead hash (16 bytes)
  const leadHash = crypto.randomBytes(16).toString("hex");

  const payload: InquiryPayload = {
    client_name: cleanName,
    client_email: cleanEmail,
    event_date: date,
    client_phone: phone || undefined,
    venue: body?.venue?.trim(),
    event_type: body?.event_type?.trim(),
    guest_count: body?.guest_count?.trim(),
    indoors_outdoors: body?.indoors_outdoors?.trim(),
    referral: body?.referral?.trim(),
    selected_package: body?.selected_package?.trim(),
    addons: body?.addons,
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
