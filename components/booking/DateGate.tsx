"use client";

import { ledgerParts } from '@/lib/booking';

type DateGateProps = {
  dates: string[] | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSelectDate: (iso: string) => void;
};

/**
 * The Date Gate ledger — real open nights rendered as archive plates.
 * Open = piña digit over a moss dot; selecting a plate opens the Vault
 * Drawer with the date already held. Availability is honest or it is
 * an error state; there is no pretend calendar here.
 */
export function DateGate({ dates, loading, error, onRetry, onSelectDate }: DateGateProps) {
  return (
    <div className="w-full">
      <p className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)] mb-5 flex items-baseline gap-3">
        01 · The Date Gate
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
            <a href="mailto:kathabooth@gmail.com" className="underline underline-offset-4">
              kathabooth@gmail.com
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
            <a href="mailto:kathabooth@gmail.com" className="underline underline-offset-4">
              kathabooth@gmail.com
            </a>{' '}
            for off-calendar dates.
          </p>
        </div>
      )}

      {!loading && !error && dates && dates.length > 0 && (
        <div
          className="flex gap-3 overflow-x-auto pb-4 -mb-4 [scrollbar-width:thin]"
          role="listbox"
          aria-label="Open dates — select one to reserve"
        >
          {dates.slice(0, 24).map((iso) => {
            const p = ledgerParts(iso);
            return (
              <button
                key={iso}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => onSelectDate(iso)}
                aria-label={`Reserve ${p.weekday} ${p.month} ${p.day}`}
                className="gate-plate w-[124px] px-4 py-5 text-center"
              >
                <span className="block font-mono text-[9px] tracking-[0.22em] text-[var(--color-katha-fnt)]">
                  {p.weekday}
                </span>
                <span className="block font-display text-[40px] font-light leading-[1.15] text-[var(--color-katha-ink)]">
                  {p.day}
                </span>
                <span className="block font-mono text-[9px] tracking-[0.22em] text-[var(--color-katha-mut)]">
                  {p.month}
                </span>
                <span
                  className="block w-1.5 h-1.5 rounded-full mx-auto mt-3 bg-[var(--color-katha-moss)] shadow-[0_0_8px_rgba(143,162,131,0.45)]"
                  aria-hidden="true"
                />
              </button>
            );
          })}
          {dates.length > 24 && (
            <div className="flex items-center px-4">
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-katha-fnt)] whitespace-nowrap">
                + {dates.length - 24} more in the drawer
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
