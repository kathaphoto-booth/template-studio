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
    expect(meetsAA(contrastRatio('#857D71', '#28221B'))).toBe(false);
  });
});
