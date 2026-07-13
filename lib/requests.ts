// Request the Night — shared types + pure helpers (spec r1.1).
// Dates are PT-anchored ISO strings end-to-end; never new Date(iso) (R6).

export type Slot = 'afternoon' | 'evening';
export type SlotStatus = 'open' | 'under_request' | 'booked' | 'past';

export type RequestIntake = {
  phone: string;
  venue_city: string;
  event_type: string;
  guest_estimate: string;
  start_time?: string;
  notes?: string;
};

export const GUEST_ESTIMATES = ['Under 50', '50–100', '100–200', '200+'] as const;

export function laDateISO(offsetDays = 0): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString('en-CA', {
    timeZone: 'America/Los_Angeles',
  });
}

// "Under request" is DERIVED, never stored (truthful-urgency law M5):
// an open slot with ≥1 rate-limit-passing pending request.
export function deriveSlotStatus(
  row: { date: string; slot: Slot; status: 'open' | 'booked' },
  pendingCount: number,
  todayISO: string,
): SlotStatus {
  if (row.date < todayISO) return 'past';
  if (row.status === 'booked') return 'booked';
  return pendingCount > 0 ? 'under_request' : 'open';
}
