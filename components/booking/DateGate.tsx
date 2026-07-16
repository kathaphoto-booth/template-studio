"use client";

import { ledgerParts } from '@/lib/booking';
import { track } from '@/lib/track';
import { RegistryCalendar, hasOpenSlot, type Day } from './RegistryCalendar';

type Slot = 'afternoon' | 'evening';
const SLOT_WORD: Record<Slot, string> = { afternoon: 'Afternoon', evening: 'Evening' };

type DateGateProps = {
  days: Day[] | null;
  loading: boolean;
  error: boolean;
  selected: { date: string; slot: Slot } | null;
  onRetry: () => void;
  onPick: (date: string, slot: Slot) => void;
};

/**
 * The Date Gate — the registry weekend strip, honest or silent. Open nights
 * come from the real slot-aware availability (Fri/Sat/Sun); picking a night +
 * time notes it on the registry and opens the archive below. Availability is
 * truthful or it is an error state; there is no pretend calendar here.
 */
export function DateGate({ days, loading, error, selected, onRetry, onPick }: DateGateProps) {
  const openNights = days ? days.filter(hasOpenSlot).length : 0;

  return (
    <div className="w-full">
      <p
        className="font-mono tracking-[0.22em] uppercase text-[var(--color-katha-fnt)] mb-8 flex items-baseline gap-3"
        style={{ fontSize: 'var(--fs-meta)' }}
      >
        The Date Gate
        <span className="h-[1px] w-10 bg-[var(--color-katha-ln)] inline-block relative -top-[3px]" />
        {openNights > 0 && (
          <span className="text-[var(--color-katha-mut)]">
            {openNights} open {openNights === 1 ? 'night' : 'nights'} on the registry
          </span>
        )}
      </p>

      {loading && (
        <div className="flex gap-3 overflow-hidden" aria-label="Checking open dates">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="gate-plate gate-skeleton w-[124px] h-[128px]"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="border-l-2 border-[var(--color-katha-hi)] bg-[var(--color-katha-l1)] px-6 py-5 max-w-[560px]">
          <p className="font-body text-[17px] text-[var(--color-katha-ink)] leading-relaxed">
            The registry didn&rsquo;t answer. Open dates can&rsquo;t be shown right now —
            try again, or write to{' '}
            <a href="mailto:hello@kathabooth.com" className="underline underline-offset-4">
              hello@kathabooth.com
            </a>{' '}
            with your date.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 font-mono tracking-[0.18em] uppercase text-[var(--color-katha-mut)] border border-[var(--color-katha-ln2)] px-4 py-2 hover:text-[var(--color-katha-ink)] hover:border-[var(--color-katha-ink)] transition-colors cursor-pointer"
            style={{ fontSize: 'var(--fs-meta)', minHeight: 'var(--touch)' }}
          >
            Check again
          </button>
        </div>
      )}

      {!loading && !error && days && openNights === 0 && (
        <div className="border-l-2 border-[var(--color-katha-hi)] bg-[var(--color-katha-l1)] px-6 py-5 max-w-[560px]">
          <p className="font-body text-[17px] text-[var(--color-katha-ink)] leading-relaxed">
            Every listed night is spoken for. Write to{' '}
            <a href="mailto:hello@kathabooth.com" className="underline underline-offset-4">
              hello@kathabooth.com
            </a>{' '}
            for off-calendar dates.
          </p>
        </div>
      )}

      {!loading && !error && days && openNights > 0 && (
        <>
          <RegistryCalendar
            days={days}
            selected={selected}
            onPick={(date, slot) => {
              track('date_check', { meta: { date, slot } });
              onPick(date, slot);
            }}
          />

          {/* The held night, confirmed in the registry voice — copy-only,
              no false hold is claimed (hold semantics are a pending call). */}
          <div aria-live="polite">
            {selected && (
              <p
                className="mt-8 flex items-center gap-3 font-mono tracking-[0.2em] uppercase"
                style={{ fontSize: 'var(--fs-meta)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--color-katha-moss-hi)] shadow-[0_0_8px_rgba(143,162,131,0.45)]"
                  aria-hidden="true"
                />
                <span className="text-[var(--color-katha-ink)]">
                  {ledgerParts(selected.date).weekday} · {ledgerParts(selected.date).month}{' '}
                  {ledgerParts(selected.date).day}, {SLOT_WORD[selected.slot]} — noted on your registry.
                </span>
                <span className="text-[var(--color-katha-mut)] normal-case tracking-normal font-body italic" style={{ fontSize: 'var(--fs-meta)' }}>
                  The archive is open below.
                </span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
