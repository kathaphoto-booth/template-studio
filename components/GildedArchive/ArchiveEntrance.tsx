'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

/**
 * ArchiveEntrance — host shell for the Foundry Plate entrance.
 *
 * Owns everything the WebGL scene must not: when to play at all, the
 * degradation ladder, and the dissolve into the page. Replaces the retired
 * GSAP GildedArchive_WordmarkEntrance (same onComplete contract).
 *
 * Degradation ladder:
 *  - prefers-reduced-motion or saveData → never plays; onComplete at once.
 *  - already played this browser session → skipped (first impressions are
 *    for first impressions; client-side wandering shouldn't replay it).
 *  - WebGL chunk not ready within LOAD_GRACE ms (slow connection / old GPU)
 *    → overlay fades, content wins. The site never waits on the ceremony.
 */

const VOID = '#161311';
const LOAD_GRACE_MS = 2600;
const FADE_MS = 750;
const SESSION_KEY = 'katha-entrance-played';

const Scene = dynamic(() => import('./ArchiveEntranceScene'), {
  ssr: false,
  loading: () => null,
});

export interface ArchiveEntranceProps {
  /** Fires when the entrance has fully resolved (or immediately when skipped). */
  onComplete?: () => void;
}

export function ArchiveEntrance({ onComplete }: ArchiveEntranceProps) {
  // 'boot' → decide; 'play' → scene mounted; 'fade' → dissolving; 'done' → unmounted.
  const [stage, setStage] = useState<'boot' | 'play' | 'fade' | 'done'>('boot');
  const ready = useRef(false);
  const completed = useRef(false);

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    onComplete?.();
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    type ConnNav = Navigator & { connection?: { saveData?: boolean } };
    const saveData = (navigator as ConnNav).connection?.saveData === true;
    // ?entrance=replay — demo/QA handle: always play, even mid-session.
    const replay = new URLSearchParams(window.location.search).get('entrance') === 'replay';
    let played = false;
    try {
      played = !replay && sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* storage unavailable — treat as unplayed */
    }

    if (reduce || saveData || played) {
      setStage('done');
      finish();
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* best-effort */
    }
    setStage('play');

    // The ceremony never blocks the archive: if the WebGL chunk hasn't
    // produced a frame in time, dissolve and hand over.
    const grace = window.setTimeout(() => {
      if (!ready.current) setStage('fade');
    }, LOAD_GRACE_MS);
    return () => window.clearTimeout(grace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== 'fade') return;
    const t = window.setTimeout(() => {
      setStage('done');
      finish();
    }, FADE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (stage === 'done' || stage === 'boot') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: VOID,
        opacity: stage === 'fade' ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: stage === 'fade' ? 'none' : 'auto',
      }}
    >
      <Scene
        onReady={() => {
          ready.current = true;
        }}
        onHandoff={() => setStage('fade')}
      />
    </div>
  );
}

export default ArchiveEntrance;
