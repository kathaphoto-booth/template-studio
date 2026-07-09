'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { KathaWordmark } from './GildedArchive_Wordmark';

gsap.registerPlugin(useGSAP);

/**
 * GildedArchive_WordmarkEntrance
 * ------------------------------------------------------------------------
 * The Gilded Archive "katha" wordmark entrance — the letterSnap stroke-draw
 * + bridgeOut dissolve, extracted from app/page.tsx and DECOUPLED entirely
 * from the CinematicVoid background weave. It renders its own solid obsidian
 * ground and stands on its own; it does NOT import or depend on CinematicVoid.
 *
 * Timeline (identical to the original page bridge): the five wordmark paths
 * draw on as ecru strokes (letterSnap), fill solid, then the whole plate
 * dissolves up and out (bridgeOut). `onComplete` fires when the dissolve
 * finishes so the host can begin its content entrance.
 *
 * Reduced motion: skips the cinematic intro and calls `onComplete` at once.
 */

const VOID = '#161311'; // N.l0 — the obsidian ground
const ECRU = '#ECE7DB'; // N.hi — Piña Ecru ink

export interface GildedArchiveWordmarkEntranceProps {
  /** Fires when the entrance dissolve completes (or immediately under reduced motion). */
  onComplete?: () => void;
}

export function GildedArchiveWordmarkEntrance({ onComplete }: GildedArchiveWordmarkEntranceProps) {
  const plate = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const paths = ['#katha-k', '#katha-a1', '#katha-t', '#katha-h', '#katha-a2'];

      // Initial weaving-outline state (scale 0.1 → strokeWidth 20 renders as ~2px).
      gsap.set(paths, {
        stroke: ECRU,
        strokeWidth: 20,
        fill: 'rgba(236, 231, 219, 0)',
        strokeDasharray: 12000,
        strokeDashoffset: 12000,
      });
      gsap.set('.ga-entrance-wordmark', { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 });

      const tl = gsap.timeline();
      tl.to(paths, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut', stagger: 0.1 })
        .to(paths, { fill: ECRU, strokeWidth: 0, duration: 0.6, ease: 'power1.inOut', stagger: 0.05 }, '-=0.6')
        .to(
          '.ga-entrance-plate',
          {
            opacity: 0,
            filter: 'blur(20px)',
            scale: 1.08,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => onComplete?.(),
          },
          '+=0.2',
        );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Skip the cinematic intro entirely.
      onComplete?.();
    });

    return () => mm.revert();
  });

  return (
    <div
      ref={plate}
      className="ga-entrance-plate"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: VOID,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes letterSnap {
          0%   { opacity: 0; filter: blur(20px); transform: scale(1.1) translateY(10px); }
          60%  { opacity: 0.8; filter: blur(3px); }
          100% { opacity: 1; filter: blur(0px); transform: scale(1) translateY(0); }
        }
        @keyframes bridgeOut {
          0%   { opacity: 1; }
          70%  { opacity: 1; filter: blur(0px); transform: scale(1); }
          100% { opacity: 0; visibility: hidden; filter: blur(20px); transform: scale(1.08); }
        }
      `}</style>

      <div className="ga-entrance-wordmark" style={{ opacity: 0, position: 'relative', zIndex: 10 }}>
        <KathaWordmark style={{ height: 64, width: 'auto', color: ECRU }} />
      </div>
    </div>
  );
}

export default GildedArchiveWordmarkEntrance;
