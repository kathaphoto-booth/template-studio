"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInquiry = handleInquiry;
const server_1 = require("next/server");
const crypto_1 = __importDefault(require("crypto"));
const record_lead_js_1 = require("./record-lead.js");
const ping_honeybook_js_1 = require("./ping-honeybook.js");
const send_enrichment_email_js_1 = require("./send-enrichment-email.js");
async function handleInquiry(req, supabaseAdmin, opts) {
    // `||` not `??`: an empty-string APP_URL (seen once in seeded Vercel env)
    // must fall through to VERCEL_URL, or email gallery links render relative.
    const appUrl = process.env.APP_URL || undefined;
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
    const baseUrl = appUrl ?? vercelUrl ?? req.nextUrl.origin;
    if (!appUrl && !vercelUrl && process.env.NODE_ENV === 'production') {
        console.error('[inquiry] No APP_URL or VERCEL_URL in production');
        return server_1.NextResponse.json({ error: 'Server configuration error' }, { status: 503 });
    }
    let body;
    try {
        body = await req.json();
    }
    catch {
        return server_1.NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
    }
    const b = body;
    const name = b?.client_name;
    const email = b?.client_email;
    const date = b?.event_date?.trim();
    const phone = b?.client_phone?.trim();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || name.trim().length < 2)
        return server_1.NextResponse.json({ error: 'Name required (min 2 chars)' }, { status: 400 });
    if (!email || !EMAIL_REGEX.test(email.trim()))
        return server_1.NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    if (!date)
        return server_1.NextResponse.json({ error: 'missing required fields (event_date)' }, { status: 400 });
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const tierSelected = typeof b?.tier_selected === 'string' ? b.tier_selected.trim().slice(0, 120) : undefined;
    const source = typeof b?.source === 'string' ? b.source.trim().slice(0, 64) : undefined;
    const payload = {
        client_name: cleanName,
        client_email: cleanEmail,
        event_date: date,
        client_phone: phone || undefined,
        tier_selected: tierSelected || undefined,
        source: source || undefined,
        venue: b?.venue?.trim(),
        event_type: b?.event_type?.trim(),
        guest_count: b?.guest_count?.trim(),
        indoors_outdoors: b?.indoors_outdoors?.trim(),
        referral: b?.referral?.trim(),
        selected_package: b?.selected_package?.trim(),
        addons: Array.isArray(b?.addons) ? b.addons : undefined,
    };
    const leadHash = crypto_1.default.randomBytes(16).toString('hex');
    const galleryLink = opts.buildGalleryLink(leadHash, baseUrl);
    // Durable capture FIRST — a lead must never depend on email delivery. The
    // database row is the source of truth; the HoneyBook ping and enrichment
    // email ride on top of it. If the DB write fails while Supabase is
    // configured, return 503 so the client retries rather than losing the lead.
    const dbSettled = await Promise.allSettled([(0, record_lead_js_1.recordLead)(supabaseAdmin, payload, leadHash)]);
    const dbResult = dbSettled[0].status === 'fulfilled'
        ? dbSettled[0].value
        : { target: 'database', ok: false, detail: `unexpected failure: ${String(dbSettled[0].reason)}` };
    const supabaseConfigured = !!supabaseAdmin;
    if (supabaseConfigured && !dbResult.ok) {
        console.error('[LEAD_CAPTURE_FAILED]', JSON.stringify({ payload, leadHash, detail: dbResult.detail }));
        return server_1.NextResponse.json({ ok: false, error: 'capture failed — please retry', lead_hash: leadHash, dispatch: [dbResult] }, { status: 503 });
    }
    // Truthful date status for the auto-reply — best-effort, never blocks.
    // Claims 'open' only when the available_dates allow-list confirms it.
    let dateStatus = 'unknown';
    if (supabaseAdmin) {
        try {
            const { data: dateRow } = await supabaseAdmin
                .from('available_dates')
                .select('status')
                .eq('date', date)
                .maybeSingle();
            if (dateRow?.status === 'open')
                dateStatus = 'open';
        }
        catch {
            // stays 'unknown' — the email then makes no availability claim
        }
    }
    // Notifications — best-effort, never block capture.
    const notifySettled = await Promise.allSettled([
        (0, ping_honeybook_js_1.pingHoneyBook)(payload, leadHash),
        (0, send_enrichment_email_js_1.sendEnrichmentEmail)(payload, leadHash, galleryLink, dateStatus),
    ]);
    const [honeybookResult, emailResult] = notifySettled.map((r, i) => r.status === 'fulfilled'
        ? r.value
        : { target: i === 0 ? 'honeybook' : 'email', ok: false, detail: `unexpected failure: ${String(r.reason)}` });
    const notified = honeybookResult.ok || emailResult.ok;
    const captured = supabaseConfigured ? dbResult.ok : notified;
    // A captured-but-unnotified lead must never look like a clean success.
    if (captured && !notified) {
        console.error('[UNNOTIFIED_LEAD]', JSON.stringify({
            leadHash, name: payload.client_name, email: payload.client_email, date: payload.event_date,
            honeybook: honeybookResult.detail, emailDetail: emailResult.detail,
        }));
    }
    const results = [dbResult, honeybookResult, emailResult];
    return server_1.NextResponse.json({ ok: captured, notified, lead_hash: leadHash, dispatch: results }, { status: captured ? 200 : 202 });
}
//# sourceMappingURL=handler.js.map