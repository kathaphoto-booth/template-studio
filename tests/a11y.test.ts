import { describe, it, expect } from 'vitest';
import { contrastRatio, meetsAA } from '@/lib/a11y';

describe('contrastRatio (WCAG 2.1)', () => {
  it('primary ink on the void is very high', () => {
    // Piña Ecru #F5EFE6 on Kamagong #110F0D
    expect(contrastRatio('#F5EFE6', '#110F0D')).toBeGreaterThan(12);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#A89C8A', '#181512')).toBeCloseTo(
      contrastRatio('#181512', '#A89C8A'), 5,
    );
  });

  it('Rattan secondary ink passes AA on the section surface', () => {
    // --color-katha-mut #A89C8A on --color-katha-l1 #181512  (~7:1)
    expect(meetsAA(contrastRatio('#A89C8A', '#181512'))).toBe(true);
  });

  it('catches the real risk: Capiz Slate meta FAILS AA on raised cards', () => {
    // --color-katha-fnt #857D71 on --color-katha-l3 #28221B  (~3.9:1)
    // This is why 'fnt' is documented "meta, base surfaces only" — the util
    // makes that rule enforceable instead of a comment.
    expect(meetsAA(contrastRatio('#857D71', '#28221B'))).toBe(false);
  });

  it('large-text threshold is 3:1', () => {
    const r = contrastRatio('#857D71', '#28221B'); // ~3.9
    expect(meetsAA(r, false)).toBe(false);
    expect(meetsAA(r, true)).toBe(true);
  });
});
