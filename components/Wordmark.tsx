import React from 'react';

/**
 * Katha wordmark — lowercase Newsreader with the calado-stitch swash.
 * The stitch (a dotted openwork seam, from piña calado embroidery) marks
 * the brand's handoff moments; here it underlines the name itself.
 *
 * `animated` letters ride the letterSnap keyframes (globals.css) with
 * `forwards` fill, so the global prefers-reduced-motion block collapses
 * the entrance to an instant reveal — nothing is ever trapped at opacity 0.
 */
export function Wordmark({
  size = 26,
  color = 'var(--color-katha-hi)',
  swash = true,
  animated = false,
}: {
  size?: number;
  color?: string;
  swash?: boolean;
  animated?: boolean;
}) {
  const letters = ['k', 'a', 't', 'h', 'a'];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        position: 'relative',
        fontFamily: 'var(--font-serif)',
        fontWeight: 300,
        fontSize: size,
        color,
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}
    >
      {animated ? (
        <span style={{ display: 'inline-flex' }} role="img" aria-label="katha">
          {letters.map((letter, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                opacity: 0,
                animation: `letterSnap 1.6s cubic-bezier(0.19, 1, 0.22, 1) ${0.2 + i * 0.14}s forwards`,
              }}
            >
              {letter}
            </span>
          ))}
        </span>
      ) : (
        'katha'
      )}

      {swash && (
        <svg
          width={size * 2.2}
          height={size * 0.4}
          viewBox="0 0 74 14"
          fill="none"
          aria-hidden="true"
          style={{ position: 'absolute', left: 0, bottom: -size * 0.18 }}
        >
          <path
            d="M2 9 C 18 13, 40 13, 56 5 C 62 2, 68 2, 72 6"
            stroke="var(--color-katha-gilt)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="1 3"
            style={
              animated
                ? { opacity: 0, animation: 'fadeIn 0.9s ease 1.1s forwards' }
                : undefined
            }
          />
        </svg>
      )}
    </span>
  );
}
