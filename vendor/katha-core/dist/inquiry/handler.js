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
    const appUrl = process.env.APP_URL;
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
    const settledResults = await Promise.allSettled([
        (0, record_lead_js_1.recordLead)(supabaseAdmin, payload, leadHash),
        (0, ping_honeybook_js_1.pingHoneyBook)(payload, leadHash),
        (0, send_enrichment_email_js_1.sendEnrichmentEmail)(payload, leadHash, galleryLink),
    ]);
    const results = settledResults.map((r, i) => {
        if (r.status === 'fulfilled')
            return r.value;
        const target = i === 0 ? 'database' : i === 1 ? 'honeybook' : 'email';
        return { target, ok: false, detail: `unexpected failure: ${String(r.reason)}` };
    });
    const anyOk = results.some((r) => r.ok);
    return server_1.NextResponse.json({ ok: anyOk, lead_hash: leadHash, dispatch: results }, { status: anyOk ? 200 : 202 });
}
//# sourceMappingURL=handler.js.map