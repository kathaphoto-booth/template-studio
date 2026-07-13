// Accessibility helpers. Pure functions are unit-tested; the browser-signal
// helpers guard on typeof window so they are SSR-safe (return false on server).

function srgbToLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG 2.1 contrast ratio, 1–21. Order-independent. */
export function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexA);
  const lb = relativeLuminance(hexB);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** AA: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px bold). */
export function meetsAA(ratio: number, large = false): boolean {
  return ratio >= (large ? 3 : 4.5);
}

const mql = (q: string): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(q).matches
    : false;

export const coarsePointer = (): boolean => mql('(pointer: coarse)');
export const smallViewport = (): boolean => mql('(max-width: 767px)');
export const prefersReducedData = (): boolean => mql('(prefers-reduced-data: reduce)');
export const prefersReducedMotion = (): boolean => mql('(prefers-reduced-motion: reduce)');

// Shared live-region announcer. LiveRegion (Task 4) registers a sink here;
// until then announce() is a safe no-op so callers never crash.
let sink: ((msg: string) => void) | null = null;
export function registerAnnouncer(fn: (msg: string) => void): () => void {
  sink = fn;
  return () => { if (sink === fn) sink = null; };
}
export function announce(message: string): void {
  sink?.(message);
}
