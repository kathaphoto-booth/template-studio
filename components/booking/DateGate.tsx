"use client";

import { ledgerParts } from '@/lib/booking';
import { track } from '@/lib/track';
import { RegistryCalendar } from './RegistryCalendar';

type DateGateProps = {
  dates: string[] | null;
  loading: boolean;
  error: boolean;
  heldDate: string | null;
  onRetry: () => void;
  onSelectDate: (iso: string) => void;
};

/**
 * The Date Gate — the registry month, honest or silent. Open nights come
 * from the real allow-list; selecting one notes it on the registry and
 * opens the archive below. Availability is truthful or it is an error
 * state; there is no pretend calendar here.
 */
export function DateGate({ dates, loading, error, heldDate, onRetry, onSelectDate }: DateGateProps) {
  return (
    <div className="w-full">
      <p className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)] mb-8 flex items-baseline gap-3">
        The Date Gate
        <span className="h-[1px] w-10 bg-[var(--color-katha-ln)] inline-block relative -top-[3px]" />
        {dates && dates.length > 0 && (
          <span className="text-[var(--color-katha-mut)]">{dates.length} open nights on the registry</span>
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
            className="mt-4 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-katha-mut)] border border-[var(--color-katha-ln2)] px-4 py-2 hover:text-[var(--color-katha-ink)] hover:border-[var(--color-katha-ink)] transition-colors cursor-pointer"
          >
            Check again
          </button>
        </div>
      )}

      {!loading && !error && dates && dates.length === 0 && (
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

      {!loading && !error && dates && dates.length > 0 && (
        <>
          <RegistryCalendar
            dates={dates}
            heldDate={heldDate}
            onSelect={(iso) => {
              track('date_check', { meta: { date: iso } });
              onSelectDate(iso);
            }}
          />

          {/* The held night, confirmed in the registry voice — copy-only,
              no false hold is claimed (hold semantics are a pending call). */}
          <div aria-live="polite">
            {heldDate && (
              <p className="mt-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--color-katha-moss-hi)] shadow-[0_0_8px_rgba(143,162,131,0.45)]"
                  aria-hidden="true"
                />
                <span className="text-[var(--color-katha-ink)]">
                  {ledgerParts(heldDate).weekday} · {ledgerParts(heldDate).month}{' '}
                  {ledgerParts(heldDate).day} — noted on your registry.
                </span>
                <span className="text-[var(--color-katha-mut)] normal-case tracking-normal font-body text-[13px] italic">
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
