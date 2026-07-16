import content from './content.json';

export type Tier = {
  key: string;
  name: string;
  badge?: string;
  price: number;
  hours: number;
  extraHourRate?: number;
  available: boolean;
  default?: boolean;
  blurb?: string;
  includes?: string[];
  optional?: string[];
  unavailableLabel?: string;
};

const catalog = (content as unknown as { tiers: Tier[] }).tiers;

export const TIERS_CATALOG: Tier[] = catalog;

export const DEFAULT_TIER_KEY: string =
  catalog.find((t) => t.default)?.key ??
  catalog.find((t) => t.available)?.key ??
  catalog[0].key;

export function tierByKey(key: string | null | undefined): Tier | undefined {
  return catalog.find((t) => t.key === key);
}

/** Open dates require 7 days' notice — the studio needs lead time to build. */
export const MIN_NOTICE_DAYS = 7;

export function minSelectableISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + MIN_NOTICE_DAYS);
  return d.toISOString().slice(0, 10);
}

/* Availability moved server-side: clients call /api/availability/v2; the
   Supabase client must never ride a client bundle (it cost 99kB gz on the
   gallery's first paint as dead code — removed 2026-07-14, WI#2). */

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "Friday, October 9, 2026" */
export function formatLongDate(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** { weekday: "FRI", day: "09", month: "OCT" } — ledger plate pieces */
export function ledgerParts(iso: string) {
  const d = parseISO(iso);
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  };
}
