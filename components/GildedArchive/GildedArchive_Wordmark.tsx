import React from 'react';
import { WORDMARK_PATHS, WORDMARK_TRANSFORM, WORDMARK_VIEWBOX } from './brand-geometry';

/**
 * GildedArchive_Wordmark — canonical "katha" wordmark for The Gilded Archive.
 * Playfair-flow serif with swash k. Vector source lives in brand-geometry.ts
 * (potrace of wordmark-obsidian.png) and is shared with the ArchiveEntrance
 * WebGL scene. Pure vector — renders via currentColor and MUST never be
 * pixelated. Individual path IDs (katha-k / katha-a1 / katha-t / katha-h /
 * katha-a2) remain addressable for any per-letter treatment.
 */
export function KathaWordmark({ style, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      aria-label="katha"
      role="img"
      style={{ display: 'block', ...style }}
      {...props}
    >
      <g transform={WORDMARK_TRANSFORM}>
        {WORDMARK_PATHS.map((p) => (
          <path key={p.id} id={p.id} fill="currentColor" stroke="none" d={p.d} />
        ))}
      </g>
    </svg>
  );
}

export default KathaWordmark;
