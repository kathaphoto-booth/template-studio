import { describe, it, expect } from 'vitest';
import { contrastRatio, meetsAA } from '@/lib/a11y';

// Every (ink, surface) pair used for ESSENTIAL text must clear AA. This is the
// enforceable version of the "fnt = base surfaces only" comment: 'fnt' is
// deliberately absent from essential pairs because it fails on raised cards.
const ESSENTIAL: Array<[name: string, ink: string, surface: string]> = [
  ['ink on void',    '#F5EFE6', '#110F0D'],
  ['ink on l1',      '#F5EFE6', '#181512'],
  ['ink on l2',      '#F5EFE6', '#201B16'],
  ['ink on l3',      '#F5EFE6', '#28221B'],
  ['mut on l1',      '#A89C8A', '#181512'],
  ['mut on l2',      '#A89C8A', '#201B16'],
  ['gilt on void',   '#DCCBB5', '#110F0D'],
  ['gilt-text on l1','#DCCBB5', '#181512'],
];

describe('token contrast — essential text clears AA', () => {
  for (const [name, ink, surface] of ESSENTIAL) {
    it(name, () => {
      expect(meetsAA(contrastRatio(ink, surface))).toBe(true);
    });
  }

  it('documents the forbidden essential pair (fnt on raised card fails)', () => {
    expect(meetsAA(contrastRatio('#8C8477', '#28221B'))).toBe(false);
  });
});

// ── Composite gates (2026-07-13 hardening) ─────────────────────────────
// Alpha tokens never meet a surface raw — they composite over it. These
// gates check the RENDERED color, which is what WCAG actually measures.
type RGB = [number, number, number];
const rgb = (hex: string): RGB => [
  parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16),
];
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const composite = (fg: RGB, alpha: number, bg: RGB): string =>
  toHex(fg.map((v, i) => alpha * v + (1 - alpha) * bg[i]) as RGB);

const INK = rgb('#F5EFE6');
const GILT = rgb('#DCCBB5');
const SURFACES: Array<[string, string]> = [
  ['l0', '#110F0D'], ['l1', '#181512'], ['l2', '#201B16'], ['l3', '#28221B'],
];

describe('composite contrast — alpha tokens over the real surfaces', () => {
  // --color-katha-ln2 borders are the sole boundary of Fields/chips/cards:
  // WCAG 1.4.11 non-text contrast requires 3:1 against the adjacent surface.
  for (const [name, surface] of SURFACES) {
    it(`ln2 border (ink @ 0.38) composited over ${name} clears 3:1`, () => {
      expect(contrastRatio(composite(INK, 0.38, rgb(surface)), surface)).toBeGreaterThanOrEqual(3);
    });
  }

  // Gilt text sits ON the gilt-low selected wash — check against the blend.
  for (const [name, surface] of SURFACES.slice(1, 3)) {
    it(`gilt text on the gilt-low (0.12) wash over ${name} stays AA`, () => {
      const wash = composite(GILT, 0.12, rgb(surface));
      expect(meetsAA(contrastRatio('#DCCBB5', wash))).toBe(true);
    });
  }

  // The lifted Capiz Slate now clears AA on its permitted base surfaces —
  // and STILL fails on l3, so "base surfaces only" stays machine-enforced.
  it('fnt (lifted) passes AA on l0 and l1, its permitted surfaces', () => {
    expect(meetsAA(contrastRatio('#8C8477', '#110F0D'))).toBe(true);
    expect(meetsAA(contrastRatio('#8C8477', '#181512'))).toBe(true);
  });
});
