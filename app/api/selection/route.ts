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
};

const FORBIDDEN_WORDS = ["luxury", "premium", "stunning", "amazing"];

// ── Dispatch target #1: email via Resend SDK ──────────────────────────
// Sender notes:
//   • from: 'onboarding@resend.dev' works out of the box (no domain verification)
//   • once kathabooth.com is verified with Resend, set NOTIFICATION_FROM to
//     e.g. "Katha <hello@kathabooth.com>"
//   • to: defaults to kathabooth@gmail.com if NOTIFICATION_EMAIL is unset
async function dispatchEmail(s: Selection): Promise<{ ok: boolean; detail: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, detail: "email not configured (missing RESEND_API_KEY)" };
  }

  const toAddr = process.env.NOTIFICATION_EMAIL || "kathabooth@gmail.com";
  const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";

  const subject = `Template chosen — ${s.names || "client"} · ${s.templateName}`;
  const lines = [
    `Template:    ${s.templateName}  (${s.templateId})`,
    `Layout:      ${s.layout}`,
    `Names:       ${s.names || "—"}`,
    `Date:        ${s.date || "—"}`,
    `Venue:       ${s.venue || "—"}`,
    `Font Family: ${s.fontFamily || "—"}`,
    s.notes ? `Notes:       ${s.notes}` : null,
    s.lead ? `Lead token:  ${s.lead}` : null,
    `Selected:    ${s.selectedAt}`,
  ].filter(Boolean).join("\n");

  let html = `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.6;color:#241E1A;background:#EAE2D5;padding:24px;border-radius:4px;">${lines}</pre>`;

  if (s.referencePhotos && s.referencePhotos.length > 0) {
    html += `
      <div style="margin-top:20px; font-family: sans-serif;">
        <h3 style="font-size:14px; color:#241E1A; margin-bottom: 12px; font-weight: 600;">Uploaded Reference Photos:</h3>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          ${s.referencePhotos.map((photo, idx) => `
            <div style="border: 1px solid #C4B59D; border-radius: 4px; padding: 4px; background: white;">
              <img src="${photo}" alt="Reference Photo ${idx + 1}" style="max-width:200px; max-height:200px; object-fit:cover; display:block; border-radius: 2px;" />
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
      text: lines + (s.referencePhotos && s.referencePhotos.length > 0 ? `\n\n[Attached reference photos: ${s.referencePhotos.length}]` : ""),
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
