// Pure request-body validation for POST /api/request (spec r1.1, A4 intake).
// Lives outside route.ts: Next 15 App Router rejects non-route exports from a
// route module, and the test imports validateRequestBody directly.

import { tierByKey } from '@/lib/booking';
import type { RequestIntake, Slot } from '@/lib/requests';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLOTS: Slot[] = ['afternoon', 'evening'];
const REQUIRED_INTAKE: (keyof RequestIntake)[] = ['phone', 'venue_city', 'event_type', 'guest_estimate'];

export type ParsedRequest = {
  name: string; email: string; date: string; slot: Slot; tier: string; intake: RequestIntake;
};

export function validateRequestBody(
  b: unknown,
): { ok: true; value: ParsedRequest } | { ok: false; error: string } {
  const o = b as Record<string, unknown>;
  const name = typeof o?.name === 'string' ? o.name.trim() : '';
  const email = typeof o?.email === 'string' ? o.email.trim().toLowerCase() : '';
  const date = typeof o?.date === 'string' ? o.date.trim() : '';
  const slot = o?.slot as Slot;
  const tier = typeof o?.tier === 'string' ? o.tier.trim() : '';
  const intake = o?.intake as Record<string, unknown> | undefined;

  if (name.length < 2) return { ok: false, error: 'Name required (min 2 chars)' };
  if (!EMAIL_REGEX.test(email)) return { ok: false, error: 'Valid email required' };
  if (!ISO_DATE.test(date)) return { ok: false, error: 'Date must be YYYY-MM-DD' };
  if (!SLOTS.includes(slot)) return { ok: false, error: 'Slot must be afternoon or evening' };
  if (!tier || !tierByKey(tier)) return { ok: false, error: 'Unknown tier' };
  if (!intake || typeof intake !== 'object') return { ok: false, error: 'Intake required' };
  for (const key of REQUIRED_INTAKE) {
    if (typeof intake[key] !== 'string' || !(intake[key] as string).trim()) {
      return { ok: false, error: `Missing intake field: ${key}` };
    }
  }

  const clean: RequestIntake = {
    phone: (intake.phone as string).trim().slice(0, 40),
    venue_city: (intake.venue_city as string).trim().slice(0, 160),
    event_type: (intake.event_type as string).trim().slice(0, 80),
    guest_estimate: (intake.guest_estimate as string).trim().slice(0, 20),
    ...(typeof intake.start_time === 'string' && intake.start_time.trim()
      ? { start_time: intake.start_time.trim().slice(0, 40) } : {}),
    ...(typeof intake.notes === 'string' && intake.notes.trim()
      ? { notes: intake.notes.trim().slice(0, 1000) } : {}),
  };
  return { ok: true, value: { name, email, date, slot, tier, intake: clean } };
}
