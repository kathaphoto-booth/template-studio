// RTN build gate — accept race (spec test plan item 1).
// Two concurrent accepts on the same (date,slot): exactly one 'accepted',
// loser gets outcome 'slot_taken', competitors auto-declined, DB never
// double-books. Run against a Supabase BRANCH only.
import { createClient } from '@supabase/supabase-js';

const url = process.env.RTN_TEST_SUPABASE_URL;
const key = process.env.RTN_TEST_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set RTN_TEST_SUPABASE_URL and RTN_TEST_SERVICE_ROLE_KEY (branch, never prod).');
  process.exit(2);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const DATE = '2027-01-15'; // far-future Friday, test-only
const SLOT = 'evening';
let failures = 0;
const assert = (cond, msg) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${msg}`);
  if (!cond) failures++;
};

// setup: clean slate, open slot, one lead, three pending requests
await db.from('booking_requests').delete().eq('date', DATE);
await db.from('availability').delete().eq('date', DATE);
await db.from('availability').insert({ date: DATE, slot: SLOT, status: 'open' });
const { data: lead } = await db.from('leads').insert({
  client_name: 'Race Test', client_email: 'race@test.invalid',
  event_date: DATE, lead_hash: `racetest${Date.now()}`,
}).select('id').single();

const mkReq = async () => (await db.from('booking_requests').insert({
  lead_id: lead.id, date: DATE, slot: SLOT, tier: 'signature',
  intake: { phone: 'x', venue_city: 'x', event_type: 'x', guest_estimate: 'Under 50' },
  status: 'pending',
}).select('id').single()).data.id;
const [reqA, reqB, reqC] = [await mkReq(), await mkReq(), await mkReq()];

// the race: brothers accept two different requests for the same slot at once
const [ra, rb] = await Promise.all([
  db.rpc('accept_booking_request', { p_request_id: reqA, p_decided_by: 'jed' }),
  db.rpc('accept_booking_request', { p_request_id: reqB, p_decided_by: 'brother' }),
]);
const outcomes = [ra.data?.outcome, rb.data?.outcome];
assert(outcomes.filter((o) => o === 'accepted').length === 1, `exactly one accepted (got ${JSON.stringify(outcomes)})`);
assert(outcomes.filter((o) => o === 'slot_taken').length === 1, 'loser sees slot_taken (zero-row guard)');

const { data: slotRow } = await db.from('availability').select('status').eq('date', DATE).eq('slot', SLOT).single();
assert(slotRow.status === 'booked', 'slot flipped to booked exactly once');

const { data: reqs } = await db.from('booking_requests').select('id,status,decided_by').eq('date', DATE).eq('slot', SLOT);
assert(reqs.filter((r) => r.status === 'accepted').length === 1, 'DB holds exactly one accepted request');
assert(reqs.filter((r) => r.status === 'declined').length === 2, 'both competitors auto-declined in the same transaction');
assert(reqs.every((r) => r.status === 'pending' ? false : !!r.decided_by), 'decided_by logged on every decided row');

// second wave: accepting the already-declined third request must not re-book
const rc = await db.rpc('accept_booking_request', { p_request_id: reqC, p_decided_by: 'jed' });
assert(rc.data?.outcome !== 'accepted', 'declined request cannot be accepted after the slot is booked');

// withdrawn state exists (R2)
const { error: wErr } = await db.from('booking_requests').update({ status: 'withdrawn' }).eq('id', reqC);
assert(!wErr, "status 'withdrawn' is accepted by the CHECK constraint");

// teardown
await db.from('booking_requests').delete().eq('date', DATE);
await db.from('availability').delete().eq('date', DATE);
await db.from('leads').delete().eq('id', lead.id);

console.log(failures === 0 ? '\nALL GREEN' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
