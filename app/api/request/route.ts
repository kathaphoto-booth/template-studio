import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { laDateISO } from '@/lib/requests';
import { validateRequestBody } from './validate';

// POST /api/request — booking_requests.pending intake (spec Phase 1).
// Rate-limited (requested-state must not be spammable), capture-first,
// email side-effects ride on top and never block (handleInquiry doctrine).

const RATE_MAX = 5;           // requests
const RATE_WINDOW_SECONDS = 3600; // per IP-hour

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: 'temporarily unavailable' }, { status: 503 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const parsed = validateRequestBody(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const { name, email, date, slot, tier, intake } = parsed.value;

  // Rate limit BEFORE any write (R4: only rate-limit-passing requests may
  // ever color the calendar). Fail-closed on RPC error.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { data: allowed, error: rlError } = await supabaseAdmin.rpc('check_rate_limit', {
    p_key: `request:${ip}`, p_max: RATE_MAX, p_window_seconds: RATE_WINDOW_SECONDS,
  });
  if (rlError || allowed !== true) {
    return NextResponse.json({ ok: false, error: 'too many requests — try again later' }, { status: 429 });
  }

  // Truthfulness guard: only accept requests for a slot that is open today.
  if (date < laDateISO(0)) {
    return NextResponse.json({ ok: false, error: 'date is in the past' }, { status: 400 });
  }
  const { data: slotRow } = await supabaseAdmin
    .from('availability').select('status').eq('date', date).eq('slot', slot).maybeSingle();
  if (!slotRow || slotRow.status !== 'open') {
    return NextResponse.json({ ok: false, error: 'that slot is no longer open' }, { status: 409 });
  }

  // Capture-first: lead row, then booking_request (durable before email).
  // Column set + hash format mirror @katha/core handleInquiry (status left to
  // the column default, as that proven path does).
  const { data: lead, error: leadError } = await supabaseAdmin
    .from('leads')
    .insert({
      client_name: name, client_email: email, client_phone: intake.phone,
      event_date: date, lead_hash: crypto.randomUUID().replace(/-/g, ''),
      tier_selected: tier, source: 'request-the-night',
    })
    .select('id')
    .single();
  if (leadError || !lead) {
    console.error('[RTN_LEAD_FAILED]', JSON.stringify({ email, date, slot, detail: leadError?.message }));
    return NextResponse.json({ ok: false, error: 'capture failed — please retry' }, { status: 503 });
  }

  const { data: request, error: reqError } = await supabaseAdmin
    .from('booking_requests')
    .insert({ lead_id: lead.id, date, slot, tier, intake, status: 'pending' })
    .select('id')
    .single();
  if (reqError || !request) {
    console.error('[RTN_REQUEST_FAILED]', JSON.stringify({ lead_id: lead.id, date, slot, detail: reqError?.message }));
    return NextResponse.json({ ok: false, error: 'capture failed — please retry' }, { status: 503 });
  }

  console.log('[FUNNEL]', JSON.stringify({
    event: 'request_submit', lead_hash: null,
    meta: { date, slot, tier }, at: new Date().toISOString(),
  }));

  return NextResponse.json(
    { ok: true, request_id: request.id, ref: `KATHA-${String(request.id).slice(0, 8)}` },
    { status: 201 },
  );
}
