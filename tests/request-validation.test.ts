import { describe, it, expect } from 'vitest';
import { validateRequestBody } from '@/app/api/request/validate';

const valid = {
  name: 'Ana Reyes',
  email: 'ana@example.com',
  date: '2026-08-14',
  slot: 'evening',
  tier: 'katha_booth',
  intake: {
    phone: '555-0100',
    venue_city: 'Oaxaca Hall, Fresno',
    event_type: 'Wedding',
    guest_estimate: '100–200',
    start_time: '6:00 PM',
    notes: '',
  },
};

describe('validateRequestBody', () => {
  it('accepts a complete valid body', () => {
    const r = validateRequestBody(valid);
    expect(r.ok).toBe(true);
  });

  it('rejects a bad slot', () => {
    expect(validateRequestBody({ ...valid, slot: 'midnight' }).ok).toBe(false);
  });

  it('rejects a non-ISO date (R6 — strings only)', () => {
    expect(validateRequestBody({ ...valid, date: '08/14/2026' }).ok).toBe(false);
  });

  it('rejects missing required intake fields (A4 — 6 required)', () => {
    const { phone, ...rest } = valid.intake;
    expect(validateRequestBody({ ...valid, intake: rest }).ok).toBe(false);
  });

  it('allows optional start_time and notes to be absent (A4 — 2 optional)', () => {
    const { start_time, notes, ...required } = valid.intake;
    expect(validateRequestBody({ ...valid, intake: required }).ok).toBe(true);
  });

  it('rejects bad email', () => {
    expect(validateRequestBody({ ...valid, email: 'nope' }).ok).toBe(false);
  });
});
