import { NextRequest, NextResponse } from "next/server";

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
  lead?: string | null;
  selectedAt: string;
};

const FORBIDDEN_WORDS = ["luxury", "premium", "stunning", "amazing"];

// ── Dispatch target #1: email via Resend ──────────────────────────────
async function dispatchEmail(s: Selection): Promise<{ ok: boolean; detail: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const toAddr = process.env.NOTIFICATION_EMAIL;
  const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";

  if (!apiKey || !toAddr) {
    return { ok: false, detail: "email not configured (missing RESEND_API_KEY or NOTIFICATION_EMAIL)" };
  }

  const subject = `Template chosen — ${s.names || "client"} · ${s.templateName}`;
  const lines = [
    `Template:   ${s.templateName}  (${s.templateId})`,
    `Layout:     ${s.layout}`,
    `Names:      ${s.names || "—"}`,
    `Date:       ${s.date || "—"}`,
    `Venue:      ${s.venue || "—"}`,
    s.lead ? `Lead token: ${s.lead}` : null,
    `Selected:   ${s.selectedAt}`,
  ].filter(Boolean).join("\n");

  const html = `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.6;color:#241E1A;background:#EAE2D5;padding:24px;border-radius:4px;">${lines}</pre>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromAddr, to: toAddr, subject, html, text: lines }),
    });
    if (!res.ok) return { ok: false, detail: `resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { ok: true, detail: "email sent" };
  } catch (err: any) {
    return { ok: false, detail: `email error: ${err?.message || err}` };
  }
}

// ── Dispatch target #2: HoneyBook contract sync (stub) ─────────────────
async function dispatchHoneyBook(_s: Selection): Promise<{ ok: boolean; detail: string }> {
  // Wire when HoneyBook API token (or Zapier catch-hook URL) is available.
  // Project PID: 679039857c7a9b001f4098a8
  if (!process.env.HONEYBOOK_API_KEY && !process.env.HONEYBOOK_WEBHOOK_URL) {
    return { ok: false, detail: "honeybook not configured (skipped)" };
  }
  return { ok: false, detail: "honeybook dispatch not implemented yet" };
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
    lead: body.lead ? String(body.lead).slice(0, 200) : null,
    selectedAt: new Date().toISOString(),
  };

  // Fan out to dispatch targets in parallel; report each result
  const results = await Promise.all([
    dispatchEmail(selection).then(r => ({ target: "email", ...r })),
    dispatchHoneyBook(selection).then(r => ({ target: "honeybook", ...r })),
  ]);

  const anyOk = results.some(r => r.ok);

  return NextResponse.json({
    ok: anyOk,
    selection,
    dispatch: results,
  }, { status: anyOk ? 200 : 202 }); // 202 = recorded, no dispatch yet (no env)
}
