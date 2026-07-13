'use client';

import { useState } from 'react';
import { SlotChip } from '@/components/ui/SlotChip';
import { announce } from '@/lib/a11y';

type Slot = 'afternoon' | 'evening';
type SlotStatus = 'open' | 'under_request' | 'booked' | 'past';
export type Day = { date: string; weekday: string; slots: { slot: Slot; status: SlotStatus }[] };

/** A night is still requestable when any of its slots is open or under request. */
export const hasOpenSlot = (day: Day): boolean =>
  day.slots.some((s) => s.status === 'open' || s.status === 'under_request');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Label from an ISO string — pure string math, never new Date(iso) (R6). */
function human(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}
const SLOT_LABEL: Record<Slot, string> = { afternoon: 'Afternoon', evening: 'Evening' };
function chipLabel(slot: Slot, status: SlotStatus): string {
  const base = SLOT_LABEL[slot];
  if (status === 'open') return `${base} · open`;
  if (status === 'under_request') return `${base} · under request — still open. First acceptance holds it.`;
  return `${base} · spoken for`;
}

export function RegistryCalendar({
  days, selected, onPick,
}: { days: Day[]; selected: { date: string; slot: Slot } | null; onPick: (date: string, slot: Slot) => void }) {
  // Shelves start collapsed (tap a night to open its times). `days` already
  // arrives nearest-open-weekend first (A2), so the top row is the soonest night.
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[600px]">
      <p className="text-[var(--color-katha-mut)] mb-4" style={{ fontSize: 'var(--fs-body)' }}>
        We install three nights a week. Pick a night, then a time.
      </p>
      <ul className="flex flex-col gap-2" aria-label="Open weekend nights">
        {days.map((day) => {
          const isOpen = open === day.date;
          const anyOpen = hasOpenSlot(day);
          const chosen = selected?.date === day.date;
          return (
            <li key={day.date} className="border border-[var(--color-katha-ln)] rounded-[2px] overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label={`${day.weekday} ${human(day.date)}${anyOpen ? '' : ' — fully booked'}`}
                onClick={() => setOpen(isOpen ? null : day.date)}
                disabled={!anyOpen}
                className={`w-full flex items-center justify-between px-4 transition-colors ${
                  chosen ? 'bg-[var(--color-katha-gilt-low)]' : 'hover:bg-[var(--color-katha-l2)]'
                } ${anyOpen ? 'cursor-pointer' : 'opacity-50 cursor-default'}`}
                style={{ minHeight: 'var(--touch-lg)' }}
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[var(--color-katha-fnt)]" style={{ fontSize: 'var(--fs-meta)' }}>{day.weekday}</span>
                  <span className="text-[var(--color-katha-ink)]" style={{ fontSize: 'var(--fs-lede)', fontFamily: 'Newsreader, Georgia, serif' }}>{human(day.date)}</span>
                </span>
                <span aria-hidden="true" className="text-[var(--color-katha-mut)]">{isOpen ? '–' : '+'}</span>
              </button>
              {isOpen && (
                <div role="radiogroup" aria-label={`Time on ${day.weekday} ${human(day.date)}`} className="flex gap-2 p-3 border-t border-[var(--color-katha-ln)]">
                  {day.slots.map(({ slot, status }) => (
                    <SlotChip
                      key={slot}
                      slot={slot}
                      label={chipLabel(slot, status)}
                      selected={selected?.date === day.date && selected?.slot === slot}
                      disabled={status === 'booked' || status === 'past'}
                      onSelect={() => { onPick(day.date, slot); announce(`${SLOT_LABEL[slot]} on ${day.weekday} ${human(day.date)} selected.`); }}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
