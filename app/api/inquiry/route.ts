import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

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
  if (!apiKey) {
    return { ok: false, detail: "resend email not configured (skipped)" };
  }

  const galleryLink = `${baseUrl}/portal/${leadHash}/template-design`;
  const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";

  const subject = "Rooted by perseverance, crafted for generations — Katha Photo Booth";

  const textBody = `
Dear ${payload.client_name},

Thank you for reaching out to Katha. We have recorded your event inquiry for ${payload.event_date}.

A DSLR photo booth designed like a wooden loom, capturing portraits that feel less like prints and more like passed-down heirlooms.

To help us tailor the backdrop, typography, and print outlines to the narrative of your room, we invite you to explore our dynamic design catalog and choose your template:

${galleryLink}

You can select a style, add customized lettering, and upload up to three reference photos at your own pace.

Rooted by perseverance, crafted for generations.

Warmly,
The Katha Team
  `.trim();

  const htmlBody = `
    <div style="font-family:'EB Garamond', Georgia, serif; max-width:600px; margin:0 auto; padding:40px; background-color:#EAE2D5; color:#241E1A; line-height:1.6; border-radius: 4px;">
      <p style="font-family:'Inter', sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:0.25em; color:#5A564E; margin-bottom: 30px;">
        Katha Photo Booth
      </p>
      
      <h2 style="font-family:'Fraunces', serif; font-weight:400; font-size:24px; letter-spacing:-0.01em; margin-bottom: 24px; color:#241E1A;">
        Rooted by perseverance, crafted for generations.
      </h2>
      
      <p style="font-size:16px; margin-bottom:20px;">
        Dear ${payload.client_name},
      </p>
      
      <p style="font-size:16px; margin-bottom:20px;">
        Thank you for starting this dialogue with Katha. We have successfully recorded your event inquiry for the date of <strong>${payload.event_date}</strong>.
      </p>
      
      <p style="font-size:16px; margin-bottom:20px;">
        A Katha photo booth is built like a wooden loom. The abacá textile frames, the unbleached ecru fibers, and the hand-finished KTHA maker's mark exist for one purpose: to weave your shared memory directly into a passed-down heirloom.
      </p>
      
      <p style="font-size:16px; margin-bottom:30px;">
        To help us shape the backdrops, layout geometry, and typography for your event, we invite you to browse the template gallery and finalize your aesthetic blueprint:
      </p>
      
      <div style="margin-bottom:35px; text-align:center;">
        <a href="${galleryLink}" style="display:inline-block; font-family:'Inter', sans-serif; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; background-color:#8C382A; color:#EAE2D5; padding:16px 32px; text-decoration:none; border-radius:0;">
          Select Your Template Style
        </a>
      </div>
      
      <p style="font-size:14px; color:#5A564E; margin-top:40px; border-top:1px dashed #C4B59D; padding-top:20px; font-style:italic;">
        Details, fonts, and print outlines are fully adjustable. At your own pace, choose the blueprint that speaks to you.
      </p>
      
      <p style="margin-top:30px; font-family:'Inter', sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#5A564E;">
        Warmly,<br/>
        The Katha Team
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
  const appUrl = process.env.APP_URL;
  if (!appUrl && process.env.NODE_ENV === 'production') {
    return NextResponse.json({error:'Server configuration error'},{status:503});
  }
  const baseUrl = appUrl ?? 'http://localhost:3000';

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
