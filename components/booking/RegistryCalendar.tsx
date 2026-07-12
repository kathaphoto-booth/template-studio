"use client";

import { useMemo, useState } from 'react';

type RegistryCalendarProps = {
  /** Open ISO dates (YYYY-MM-DD), ascending — the allow-list, already noticed-gated. */
  dates: string[];
  /** The night currently noted on the registry, if any. */
  heldDate: string | null;
  onSelect: (iso: string) => void;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** "2026-10" → { year: 2026, month: 10 } — pure string math, never new Date(iso). */
function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

/** Day-of-week for the 1st of a month, timezone-proof via UTC. */
function firstWeekday(year: number, month: number): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Weekend = Friday (5) or Saturday (6) — the nights that hold fast. */
function isWeekendISO(iso: string): boolean {
  const { y, m, d } = parts(iso);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return dow === 5 || dow === 6;
}

/**
 * The Registry Calendar — the month, laid out as the archive sees it.
 * Open nights carry a moss patina dot; everything else is struck. The
 * data is the real allow-list; there is no pretend availability here.
 */
export function RegistryCalendar({ dates, heldDate, onSelect }: RegistryCalendarProps) {
  const openSet = useMemo(() => new Set(dates), [dates]);

  // Months spanned by the registry window, in order.
  const months = useMemo(() => {
    const seen: string[] = [];
    for (const iso of dates) {
      const key = iso.slice(0, 7);
      if (!seen.includes(key)) seen.push(key);
    }
    return seen;
  }, [dates]);

  const [monthIdx, setMonthIdx] = useState(0);
  const monthKey = months[Math.min(monthIdx, months.length - 1)] ?? null;

  const grid = useMemo(() => {
    if (!monthKey) return null;
    const [year, month] = monthKey.split('-').map(Number);
    const lead = firstWeekday(year, month);
    const total = daysInMonth(year, month);
    const cells: Array<{ iso: string; day: number } | null> = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= total; d++) {
      cells.push({ iso: `${monthKey}-${String(d).padStart(2, '0')}`, day: d });
    }
    return { year, month, cells };
  }, [monthKey]);

  const weekendCount = useMemo(() => {
    if (!monthKey) return 0;
    return dates.filter((iso) => iso.startsWith(monthKey) && isWeekendISO(iso)).length;
  }, [dates, monthKey]);

  if (!grid) return null;

  const monthLabel = `${MONTH_NAMES[grid.month - 1]} ${grid.year}`;

  return (
    <div className="w-full max-w-[560px]">
      {/* Month bar — serif title, mono nav, honest weekend count */}
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-4">
          <h3 className="font-display font-light text-[26px] text-[var(--color-katha-hi)] tracking-tight">
            {monthLabel}
          </h3>
          <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-katha-fnt)]">
            {weekendCount > 0
              ? `${weekendCount} weekend night${weekendCount === 1 ? '' : 's'} open`
              : 'no open weekends'}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
            disabled={monthIdx === 0}
            aria-label="Previous month"
            className="font-mono text-[12px] w-9 h-9 border border-[var(--color-katha-ln)] text-[var(--color-katha-mut)] enabled:hover:border-[var(--color-katha-gilt)] enabled:hover:text-[var(--color-katha-ink)] disabled:opacity-25 transition-colors duration-300 cursor-pointer disabled:cursor-default"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setMonthIdx((i) => Math.min(months.length - 1, i + 1))}
            disabled={monthIdx >= months.length - 1}
            aria-label="Next month"
            className="font-mono text-[12px] w-9 h-9 border border-[var(--color-katha-ln)] text-[var(--color-katha-mut)] enabled:hover:border-[var(--color-katha-gilt)] enabled:hover:text-[var(--color-katha-ink)] disabled:opacity-25 transition-colors duration-300 cursor-pointer disabled:cursor-default"
          >
            →
          </button>
        </div>
      </div>

      {/* Weekday rail */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((w, i) => (
          <div
            key={`${w}-${i}`}
            className="text-center font-mono text-[9px] tracking-[0.2em] text-[var(--color-katha-fnt)] pb-2"
            aria-hidden="true"
          >
            {w}
          </div>
        ))}
      </div>

      {/* The month */}
      <div className="grid grid-cols-7" role="listbox" aria-label={`Open nights in ${monthLabel}`}>
        {grid.cells.map((cell, i) => {
          if (!cell) return <div key={`pad-${i}`} aria-hidden="true" />;
          const open = openSet.has(cell.iso);
          const held = heldDate === cell.iso;
          if (!open) {
            return (
              <div
                key={cell.iso}
                aria-hidden="true"
                className="aspect-square flex items-center justify-center font-display text-[17px] font-light text-[var(--color-katha-fnt)] opacity-30 select-none"
              >
                {cell.day}
              </div>
            );
          }
          return (
            <button
              key={cell.iso}
              type="button"
              role="option"
              aria-selected={held}
              onClick={() => onSelect(cell.iso)}
              aria-label={`Reserve ${monthLabel.split(' ')[0]} ${cell.day}`}
              className={`aspect-square flex flex-col items-center justify-center gap-1 border transition-all duration-500 ease-out cursor-pointer ${
                held
                  ? 'border-[var(--color-katha-gilt)] bg-[var(--color-katha-gilt-low)]'
                  : 'border-transparent hover:border-[var(--color-katha-ln2)]'
              }`}
            >
              <span
                className={`font-display text-[19px] font-light leading-none ${
                  held ? 'text-[var(--color-katha-gilt)]' : 'text-[var(--color-katha-ink)]'
                }`}
              >
                {cell.day}
              </span>
              <span
                className="w-1 h-1 rounded-full bg-[var(--color-katha-moss-hi)] shadow-[0_0_6px_rgba(143,162,131,0.4)]"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
