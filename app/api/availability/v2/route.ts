import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { deriveSlotStatus, laDateISO, type Slot } from '@/lib/requests';

// Slot-aware availability for the weekend strip. Fri/Sat/Sun only.
// "under request" is derived per R4 v1 fallback: rate-limited requests
// only (all rows in booking_requests passed the limit), and the calendar
// colors from EXISTENCE of pending requests, never counts.

const MIN_NOTICE_DAYS = 7;
const HORIZON_DAYS = 120;
const WEEKEND = new Set(['Fri', 'Sat', 'Sun']);

export const dynamic = 'force-dynamic';

// Weekday from an ISO string WITHOUT new Date(iso) midnight-UTC drift:
// anchor to noon UTC so the PT-rendered weekday is always correct.
function weekdayOf(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short', timeZone: 'America/Los_Angeles',
  });
}

export async function GET() {
  if (!supabase || !supabaseAdmin) {
    return NextResponse.json({ error: 'availability temporarily unavailable' }, { status: 503 });
  }

  const today = laDateISO(0);
  const [{ data: rows, error }, { data: pending, error: pendingError }] = await Promise.all([
    supabase.from('availability').select('date,slot,status')
      .gte('date', today).lte('date', laDateISO(HORIZON_DAYS))
      .order('date', { ascending: true }),
    supabaseAdmin.from('booking_requests').select('date,slot')
      .eq('status', 'pending').gte('date', today),
  ]);
  if (error || !rows || pendingError) {
    return NextResponse.json({ error: 'availability temporarily unavailable' }, { status: 503 });
  }

  const pendingKeys = new Set(
    (pending ?? []).map((r: { date: string; slot: string }) => `${r.date}:${r.slot}`),
  );
  const cutoff = laDateISO(MIN_NOTICE_DAYS);
  const byDate = new Map<string, { slot: Slot; status: string }[]>();

  for (const row of rows) {
    const weekday = weekdayOf(row.date);
    if (!WEEKEND.has(weekday)) continue;
    const status = deriveSlotStatus(
      row as { date: string; slot: Slot; status: 'open' | 'booked' },
      pendingKeys.has(`${row.date}:${row.slot}`) ? 1 : 0,
      cutoff > row.date ? '9999-12-31' : today, // inside notice window → render as past/unselectable
    );
    const list = byDate.get(row.date) ?? [];
    list.push({ slot: row.slot as Slot, status });
    byDate.set(row.date, list);
  }

  const days = [...byDate.entries()].map(([date, slots]) => ({
    date, weekday: weekdayOf(date), slots,
  }));

  return NextResponse.json({ days, minNoticeDays: MIN_NOTICE_DAYS });
}
