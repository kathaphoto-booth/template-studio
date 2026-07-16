import { tierByKey } from './booking';

/**
 * Entry contract — marketing traffic from kathabooth.com (Squarespace)
 * arrives with ?src= (attribution slug) and optionally ?tier= (install
 * preselect). Recognized values are held in sessionStorage so they survive
 * internal navigation and ride along when the inquiry is submitted.
 * Unrecognized values pass silently — a marketing link never errors.
 */

const SRC_KEY = 'katha-entry-src';
const TIER_KEY = 'katha-entry-tier';

/** Attribution slugs minted on the marketing site's CTAs. */
const ENTRY_SOURCES = new Set([
  'ss-nav',
  'ss-hero',
  'ss-home-bridge',
  'ss-installations',
  'ss-founders',
  'ss-contact',
  'ss-footer',
  'ss-inquire',
]);

/**
 * Marketing tier slugs → catalog keys (lib/content.json `tiers[].key`),
 * matched on architecture + price against the ratified marketing lineup
 * (docs/superpowers/specs/2026-06-13-intake-funnel-v1-design.md):
 * signature-oak ($949, Oak) → editorial · editorial-oak ($1,149, Oak) →
 * glam_editorial · modernist-white ($749, White) → architectural ·
 * monochrome-white (B&W capture) → glam_editorial (monochrome photography).
 * Keys are revalidated against the live catalog before use.
 */
const TIER_SLUG_TO_KEY: Record<string, string> = {
  'signature-oak': 'editorial',
  'editorial-oak': 'glam_editorial',
  'modernist-white': 'architectural',
  'monochrome-white': 'glam_editorial',
};

function read(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null; // storage blocked — attribution is best-effort, never fatal
  }
}

function write(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // storage blocked — attribution is best-effort, never fatal
  }
}

/** A marketing ?tier= slug resolved to an available catalog tier key, or null. */
export function tierKeyFromSlug(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const key = TIER_SLUG_TO_KEY[slug];
  if (!key) return null;
  const tier = tierByKey(key);
  return tier && tier.available ? key : null;
}

/** Read ?src / ?tier from a query string and hold recognized values for the session. */
export function captureEntryParams(search: string): void {
  const params = new URLSearchParams(search);
  const src = params.get('src');
  if (src && ENTRY_SOURCES.has(src)) write(SRC_KEY, src);
  const tierKey = tierKeyFromSlug(params.get('tier'));
  if (tierKey) write(TIER_KEY, tierKey);
}

/** Attribution slug held for this session, if the visitor arrived from marketing. */
export function getEntrySource(): string | null {
  const src = read(SRC_KEY);
  return src && ENTRY_SOURCES.has(src) ? src : null;
}

/** Catalog tier key held for this session, revalidated against the live catalog. */
export function getEntryTierKey(): string | null {
  const key = read(TIER_KEY);
  if (!key) return null;
  const tier = tierByKey(key);
  return tier && tier.available ? key : null;
}
