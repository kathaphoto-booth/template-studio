'use client';

import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { ChoiceCard } from '@/components/ui/ChoiceCard';
import { ActionBar } from '@/components/ui/ActionBar';
import { announce } from '@/lib/a11y';
import { GUEST_ESTIMATES } from '@/lib/requests';

const EVENT_TYPES = ['Wedding', 'Reception', 'Birthday', 'Corporate', 'Other'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A1 — legal-reviewed contract line, real numbers from the scraped agreement.
// ⚠️ LEGAL REVIEW GATE (spec r1.1 A1): this exact copy must NOT ship to
// production until Jed's legal read-through clears it. Committed locally only.
const CONTRACT_LINE =
  'The night is secured with a $99 retainer once we accept — non-refundable, with the balance due 14 days before your event. Date changes need 20 days’ notice.';

export function IntakeForm({
  date, slot, tier, onSubmitted,
}: { date: string; slot: 'afternoon' | 'evening'; tier: string; onSubmitted: (ref: string) => void }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', venue_city: '', event_type: '', guest_estimate: '', start_time: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) e.name = 'Please add your name.';
    if (!EMAIL.test(f.email.trim())) e.email = 'Enter an email we can reply to.';
    if (f.phone.trim().length < 7) e.phone = 'Enter a phone we can reach.';
    if (!f.venue_city.trim()) e.venue_city = 'Where is the night?';
    if (!f.event_type) e.event_type = 'Pick the kind of event.';
    if (!f.guest_estimate) e.guest_estimate = 'Roughly how many guests?';
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      // scrollIntoView is not implemented in jsdom — optional-chain the method
      // so the focus-first-gap behaviour degrades to a no-op under test.
      document.getElementById(first === 'event_type' || first === 'guest_estimate' ? `grp-${first}` : first)?.scrollIntoView?.({ block: 'center' });
      (document.getElementById(first) as HTMLElement | null)?.focus();
      announce(e[first]);
    }
    return !first;
  }

  async function submit() {
    if (sending) return;
    if (!validate()) return;
    setSending(true); setServerError('');
    try {
      const res = await fetch('/api/request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name, email: f.email, date, slot, tier,
          intake: {
            phone: f.phone, venue_city: f.venue_city, event_type: f.event_type, guest_estimate: f.guest_estimate,
            ...(f.start_time ? { start_time: f.start_time } : {}),
            ...(f.notes ? { notes: f.notes } : {}),
          },
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok) { onSubmitted(body.ref); return; }
      setServerError(body?.error || 'We couldn’t send that just now. Nothing was lost — please try again.');
    } catch {
      setServerError('We couldn’t reach the studio just now. Nothing was lost — please try again.');
    } finally { setSending(false); }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[var(--color-katha-l1)]">
      <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-6 space-y-5 max-w-[560px] w-full mx-auto">
        <header>
          <h2 className="text-[var(--color-katha-hi)]" style={{ fontSize: 'var(--fs-title)', fontFamily: 'Newsreader, Georgia, serif', fontWeight: 300 }}>
            Almost on the registry.
          </h2>
          <p className="text-[var(--color-katha-mut)] mt-1" style={{ fontSize: 'var(--fs-body)' }}>
            Six details so we can review your night.
          </p>
        </header>

        <Field id="name" label="Name" value={f.name} onChange={(v) => set('name', v)} error={errors.name} required />
        <Field id="email" label="Email" type="email" inputMode="email" value={f.email} onChange={(v) => set('email', v)} error={errors.email} required />
        <Field id="phone" label="Phone" type="tel" inputMode="tel" value={f.phone} onChange={(v) => set('phone', v)} helper="For confirming logistics — never marketing." error={errors.phone} required />
        <Field id="venue_city" label="Venue / city" value={f.venue_city} onChange={(v) => set('venue_city', v)} error={errors.venue_city} required />

        <fieldset id="grp-event_type">
          <legend className="text-[var(--color-katha-mut)] mb-2" style={{ fontSize: 'var(--fs-label)' }}>Event type</legend>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_TYPES.map((t) => (
              <ChoiceCard key={t} selected={f.event_type === t} title={t} onSelect={() => set('event_type', t)} />
            ))}
          </div>
          {errors.event_type && <p role="alert" className="text-[var(--color-katha-hi)] mt-1" style={{ fontSize: 'var(--fs-meta)' }}>{errors.event_type}</p>}
        </fieldset>

        <fieldset id="grp-guest_estimate">
          <legend className="text-[var(--color-katha-mut)] mb-2" style={{ fontSize: 'var(--fs-label)' }}>Guest estimate</legend>
          <div className="grid grid-cols-2 gap-2">
            {GUEST_ESTIMATES.map((g) => (
              <ChoiceCard key={g} selected={f.guest_estimate === g} title={g} onSelect={() => set('guest_estimate', g)} />
            ))}
          </div>
          {errors.guest_estimate && <p role="alert" className="text-[var(--color-katha-hi)] mt-1" style={{ fontSize: 'var(--fs-meta)' }}>{errors.guest_estimate}</p>}
        </fieldset>

        <details className="border-t border-[var(--color-katha-ln)] pt-4">
          <summary className="text-[var(--color-katha-mut)] cursor-pointer" style={{ fontSize: 'var(--fs-body)', minHeight: 'var(--touch)' }}>Add start time or notes (optional)</summary>
          <div className="space-y-4 mt-3">
            <Field id="start_time" label="Start time" value={f.start_time} onChange={(v) => set('start_time', v)} placeholder="Defaults to the slot window" />
            <Field id="notes" label="Notes" multiline value={f.notes} onChange={(v) => set('notes', v)} placeholder="Anything we should know — venue quirks, timing, the occasion." />
          </div>
        </details>

        <p className="border-l-2 border-[var(--color-katha-gilt)] pl-3 text-[var(--color-katha-mut)]" style={{ fontSize: 'var(--fs-meta)' }}>{CONTRACT_LINE}</p>
        {serverError && <p role="alert" className="text-[var(--color-katha-ink)]" style={{ fontSize: 'var(--fs-body)' }}>{serverError}</p>}
      </div>

      <ActionBar primaryLabel={sending ? 'Sending…' : 'Request the night'} onPrimary={submit} primaryDisabled={sending} />
    </div>
  );
}
