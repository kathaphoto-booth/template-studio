import { describe, it, expect } from 'vitest';
import { deriveSlotStatus, laDateISO, GUEST_ESTIMATES } from '@/lib/requests';

describe('deriveSlotStatus', () => {
  const today = '2026-07-12';
  const open = { date: '2026-07-17', slot: 'evening' as const, status: 'open' as const };

  it('open slot, no pending → open', () => {
    expect(deriveSlotStatus(open, 0, today)).toBe('open');
  });

  it('open slot with ≥1 pending → under_request (derived, truthful M5)', () => {
    expect(deriveSlotStatus(open, 1, today)).toBe('under_request');
    expect(deriveSlotStatus(open, 5, today)).toBe('under_request');
  });

  it('booked slot → booked even with pending noise', () => {
    expect(deriveSlotStatus({ ...open, status: 'booked' }, 3, today)).toBe('booked');
  });

  it('past date → past regardless of status', () => {
    const past = { ...open, date: '2026-07-10' };
    expect(deriveSlotStatus(past, 0, today)).toBe('past');
    expect(deriveSlotStatus({ ...past, status: 'booked' }, 0, today)).toBe('past');
  });

  it('today is not past (string compare, R6)', () => {
    expect(deriveSlotStatus({ ...open, date: today }, 0, today)).toBe('open');
  });
});

describe('laDateISO (R6 — PT-anchored string math)', () => {
  it('returns YYYY-MM-DD', () => {
    expect(laDateISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('offset is chronological under string compare', () => {
    expect(laDateISO(7) > laDateISO(0)).toBe(true);
  });
});

describe('GUEST_ESTIMATES (A4 chips)', () => {
  it('matches the ratified four buckets', () => {
    expect([...GUEST_ESTIMATES]).toEqual(['Under 50', '50–100', '100–200', '200+']);
  });
});
