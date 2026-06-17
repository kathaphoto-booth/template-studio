import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";


// ──────────────────────────────────────────────────────────────────────
// /api/selection — receives a template pick from the client gallery
//
// Dispatch targets (pluggable; add new ones as the funnel grows):
//   #1  email   → Resend (active when RESEND_API_KEY is set)
//   #2  honeybook → HoneyBook contract sync (placeholder — add when API token available)
//   #3  supabase → record table  (placeholder — add when Supabase wired)
//
// Same payload, same endpoint — adding HoneyBook later is one function call.
// ──────────────────────────────────────────────────────────────────────

type Selection = {
  templateId: string;
  templateName: string;
  layout: "strip" | "postcard" | "postcard-vertical";
  names?: string | null;
  date?: string | null;
  venue?: string | null;
  fontFamily?: string | null;
  referencePhotos?: string[] | null;
  notes?: string | null;
  lead?: string | null;
  selectedAt: string;
  // Full interactive design state (font, text position, tier, future knobs).
  // Persisted as a single JSONB column — no per-knob schema churn.
  configuration?: Record<string, unknown> | null;
};

// Reference photos arrive either as Storage paths (refs/<uuid>.<ext>) or
// legacy inline base64 (data:image/...). Storage paths get short-lived
// signed URLs for the notification email; base64 passes through as-is.
async function resolveReferenceUrls(photos: string[] | null | undefined): Promise<string[]> {
  if (!photos || photos.length === 0) return [];
  const resolved: string[] = [];
  for (const p of photos) {
    if (p.startsWith("data:")) {
      resolved.push(p);
    } else if (supabaseAdmin) {
      const { data } = await supabaseAdmin.storage
        .from("katha-references")
        .createSignedUrl(p, 60 * 60 * 24 * 7); // 7 days
      if (data?.signedUrl) resolved.push(data.signedUrl);
    }
  }
  return resolved;
}

const FORBIDDEN_WORDS = ["luxury", "premium", "stunning", "amazing"];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Dispatch target #1: email via Resend SDK ──────────────────────────
// Sender notes:
//   • from: 'onboarding@resend.dev' works out of the box (no domain verification)
//   • once kathabooth.com is verified with Resend, set NOTIFICATION_FROM to
//     e.g. "Katha <hello@kathabooth.com>"
//   • to: defaults to jedgrepo@gmail.com if NOTIFICATION_EMAIL is unset
async function dispatchEmail(s: Selection): Promise<{ ok: boolean; detail: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, detail: "email not configured (missing RESEND_API_KEY)" };
  }

  const toAddr = process.env.NOTIFICATION_EMAIL || "jedgrepo@gmail.com";
  const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";
  const appUrl = process.env.APP_URL || "https://kathabooth.com";

  // Construct secure, dynamic query parameter link to auto-fill the admin room
  const customizeLink = `${appUrl}/studio?names=${encodeURIComponent(s.names || "")}&date=${encodeURIComponent(s.date || "")}&venue=${encodeURIComponent(s.venue || "")}&preset=${encodeURIComponent(s.templateId)}&layout=${encodeURIComponent(s.layout)}&font=${encodeURIComponent(s.fontFamily || "")}`;

  const subject = `Template Chosen — ${s.names || "Client"} · ${s.templateName}`;
  
  const textLines = [
    `Template:      ${s.templateName} (${s.templateId})`,
    `Layout Format: ${s.layout.toUpperCase()}`,
    `Names:         ${s.names || "—"}`,
    `Event Date:    ${s.date || "—"}`,
    `Venue/Notes:   ${s.venue || "—"}`,
    `Selected Font: ${s.fontFamily || "—"}`,
    s.notes ? `Client Notes:  ${s.notes}` : null,
    `Selected At:   ${s.selectedAt}`,
    `Direct Studio Customize Link: ${customizeLink}`
  ].filter(Boolean).join("\n");

  // Premium Wabi-Sabi styled HTML email matching Katha aesthetic
  let html = `
    <div style="font-family:'EB Garamond', Georgia, serif; max-width:600px; margin:0 auto; padding:40px; background-color:#FAF9F5; color:#241E1A; line-height:1.6; border: 1px solid #EAE2D5; border-radius:0;">
      <p style="font-family:'Libre Franklin', sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:0.2em; color:#8C382A; margin-bottom: 24px; font-weight:600;">
        Katha Template Studio Notification
      </p>
      
      <h2 style="font-family:'Fraunces', serif; font-weight:400; font-size:22px; letter-spacing:-0.01em; margin-bottom: 30px; color:#241E1A; border-bottom: 1px solid #C4B59D; padding-bottom: 12px;">
        New Template Selection
      </h2>
      
      <table style="width:100%; border-collapse:collapse; margin-bottom:30px; font-size:15px;">
        <tr style="border-bottom:1px dashed #EAE2D5;">
          <td style="padding:10px 0; font-weight:bold; width:30%; color:#5A564E;">Client Names</td>
          <td style="padding:10px 0; color:#241E1A;">${s.names ? escapeHtml(s.names) : "—"}</td>
        </tr>
        <tr style="border-bottom:1px dashed #EAE2D5;">
          <td style="padding:10px 0; font-weight:bold; color:#5A564E;">Template Chosen</td>
          <td style="padding:10px 0; color:#241E1A; font-family:monospace; font-size:13px;">${escapeHtml(s.templateName)} (${escapeHtml(s.templateId)})</td>
        </tr>
        <tr style="border-bottom:1px dashed #EAE2D5;">
          <td style="padding:10px 0; font-weight:bold; color:#5A564E;">Layout Format</td>
          <td style="padding:10px 0; color:#241E1A; text-transform:uppercase; font-size:13px; letter-spacing:0.05em;">${escapeHtml(s.layout)}</td>
        </tr>
        <tr style="border-bottom:1px dashed #EAE2D5;">
          <td style="padding:10px 0; font-weight:bold; color:#5A564E;">Event Date</td>
          <td style="padding:10px 0; color:#241E1A;">${s.date ? escapeHtml(s.date) : "—"}</td>
        </tr>
        <tr style="border-bottom:1px dashed #EAE2D5;">
          <td style="padding:10px 0; font-weight:bold; color:#5A564E;">Location / Venue</td>
          <td style="padding:10px 0; color:#241E1A;">${s.venue ? escapeHtml(s.venue) : "—"}</td>
        </tr>
        <tr style="border-bottom:1px dashed #EAE2D5;">
          <td style="padding:10px 0; font-weight:bold; color:#5A564E;">Selected Font</td>
          <td style="padding:10px 0; color:#241E1A; font-style:italic;">${s.fontFamily ? escapeHtml(s.fontFamily) : "—"}</td>
        </tr>
      </table>

      ${s.notes ? `
        <div style="background-color:#EAE2D5; padding:20px; margin-bottom:30px; border-top:1px dashed #C4B59D; font-size:14px; font-style:italic; color:#241E1A;">
          <strong>Client Notes:</strong><br/>
          "${s.notes ? escapeHtml(s.notes) : ""}"
        </div>
      ` : ""}

      <div style="margin-top:35px; margin-bottom:35px; text-align:center;">
        <a href="${customizeLink}" style="display:inline-block; font-family:'Libre Franklin', sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; background-color:#8C382A; color:#FAF9F5; padding:16px 32px; text-decoration:none; border-radius:0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          Open in Studio
        </a>
      </div>

      <p style="font-size:12px; color:#5A564E; text-align:center; border-top:1px dashed #C4B59D; padding-top:20px; margin-top:30px; font-style:italic;">
        Clicking the button will open the Admin Studio with the client's names, event date, venue, selected template, and chosen font pre-filled.
      </p>
    </div>
  `;

  const referenceUrls = await resolveReferenceUrls(s.referencePhotos);
  if (referenceUrls.length > 0) {
    html += `
      <div style="max-width:600px; margin:20px auto 0 auto; font-family: sans-serif; padding:0 10px;">
        <h3 style="font-size:14px; color:#241E1A; margin-bottom: 12px; font-weight: 600;">Uploaded Reference Photos:</h3>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          ${referenceUrls.map((photo, idx) => `
            <div style="border: 1px solid #C4B59D; padding: 4px; background: #EAE2D5; margin-bottom: 10px;">
              <img src="${photo}" alt="Reference Photo ${idx + 1}" style="max-width:180px; max-height:180px; object-fit:cover; display:block;" />
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromAddr,
      to: toAddr,
      subject,
      html,
      text: textLines + (s.referencePhotos && s.referencePhotos.length > 0 ? `\n\n[Attached reference photos: ${s.referencePhotos.length}]` : ""),
    });
    if (error) return { ok: false, detail: `resend error: ${error.message || JSON.stringify(error)}` };
    return { ok: true, detail: `email sent (id ${data?.id || "?"})` };
  } catch (err: any) {
    return { ok: false, detail: `email exception: ${err?.message || err}` };

  }
}

// ── Dispatch target #2: HoneyBook contract sync (webhook or API) ─────────
async function dispatchHoneyBook(s: Selection): Promise<{ ok: boolean; detail: string }> {
  const webhookUrl = process.env.HONEYBOOK_WEBHOOK_URL;
  const apiKey = process.env.HONEYBOOK_API_KEY;

  if (!webhookUrl && !apiKey) {
    return { ok: false, detail: "honeybook not configured (skipped)" };
  }

  // 1. Webhook (Zapier catch-hook) dispatch
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "katha_gallery",
          project_id: "679039857c7a9b001f4098a8",
          lead: s.lead,
          template_id: s.templateId,
          template_name: s.templateName,
          layout: s.layout,
          names: s.names,
          date: s.date,
          venue: s.venue,
          notes: s.notes,
          selected_at: s.selectedAt,
          font_family: s.fontFamily,
          reference_photos: s.referencePhotos
        })
      });

      if (!res.ok) {
        return { ok: false, detail: `webhook failed with status ${res.status}` };
      }
      return { ok: true, detail: "honeybook webhook synced successfully" };
    } catch (err: any) {
      return { ok: false, detail: `webhook exception: ${err?.message || err}` };
    }
  }

  // 2. HoneyBook Native API dispatch (future upgrade slot)
  if (apiKey) {
    try {
      const res = await fetch("https://api.honeybook.com/v1/projects/679039857c7a9b001f4098a8/selections", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(s)
      });

      if (!res.ok) {
        return { ok: false, detail: `honeybook API failed with status ${res.status}` };
      }
      return { ok: true, detail: "honeybook API synced successfully" };
    } catch (err: any) {
      return { ok: false, detail: `honeybook API exception: ${err?.message || err}` };
    }
  }

  return { ok: false, detail: "honeybook integration misconfigured" };
}

// ── Dispatch target #3: database record via Supabase ───────────────────
async function dispatchSupabase(s: Selection): Promise<{ ok: boolean; detail: string }> {
  if (!supabaseAdmin) {
    return { ok: false, detail: "supabase not configured (skipped)" };
  }

  try {
    const { error } = await supabaseAdmin
      .from("selections")
      .insert({
        template_id: s.templateId,
        template_name: s.templateName,
        layout: s.layout,
        names: s.names,
        date: s.date,
        venue: s.venue,
        font_family: s.fontFamily,
        reference_photos: s.referencePhotos,
        notes: s.notes,
        lead: s.lead,
        selected_at: s.selectedAt,
        configuration: s.configuration ?? {},
      });

    if (error) {
      return { ok: false, detail: `supabase error: ${error.message || JSON.stringify(error)}` };
    }
    return { ok: true, detail: "recorded in supabase database successfully" };
  } catch (err: any) {
    return { ok: false, detail: `supabase exception: ${err?.message || err}` };
  }
}



// ── POST handler ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 }); }

  // Validate
  if (!body?.templateId || !body?.templateName || !body?.layout) {
    return NextResponse.json({ ok: false, error: "missing required fields" }, { status: 400 });
  }

  // Defensive: refuse selections whose copy carries any forbidden brand word
  // (would only happen if someone tampered with the gallery payload)
  const haystack = `${body.templateName} ${body.names || ""} ${body.venue || ""}`.toLowerCase();
  if (FORBIDDEN_WORDS.some(w => haystack.includes(w))) {
    return NextResponse.json({ ok: false, error: "payload rejected" }, { status: 400 });
  }

  const selection: Selection = {
    templateId: String(body.templateId).slice(0, 100),
    templateName: String(body.templateName).slice(0, 200),
    layout: body.layout,
    names: body.names ? String(body.names).slice(0, 200) : null,
    date: body.date ? String(body.date).slice(0, 100) : null,
    venue: body.venue ? String(body.venue).slice(0, 300) : null,
    fontFamily: body.fontFamily ? String(body.fontFamily).slice(0, 200) : null,
    referencePhotos: body.referencePhotos && Array.isArray(body.referencePhotos)
      ? body.referencePhotos.map((p: any) => String(p))
      : null,
    notes: body.notes ? String(body.notes).slice(0, 2000) : null,
    lead: body.lead ? String(body.lead).slice(0, 200) : null,
    selectedAt: new Date().toISOString(),
    configuration:
      body.configuration && typeof body.configuration === "object" && !Array.isArray(body.configuration)
        && JSON.stringify(body.configuration).length <= 10_000
        ? body.configuration
        : null,
  };

  // Fan out to dispatch targets in parallel; report each result
  const results = await Promise.all([
    dispatchEmail(selection).then(r => ({ target: "email", ...r })),
    dispatchHoneyBook(selection).then(r => ({ target: "honeybook", ...r })),
    dispatchSupabase(selection).then(r => ({ target: "supabase", ...r })),
  ]);


  const anyOk = results.some(r => r.ok);

  return NextResponse.json({
    ok: anyOk,
    selection,
    dispatch: results,
  }, { status: anyOk ? 200 : 202 }); // 202 = recorded, no dispatch yet (no env)
}
