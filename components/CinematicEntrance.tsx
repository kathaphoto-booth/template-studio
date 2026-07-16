"use client";

import { useEffect, useState } from 'react';
import { CinematicEntry } from './CinematicEntry';

const SESSION_KEY = 'katha-archive-entered';

/**
 * Session-guarded cinematic entrance. Plays the dealt-cards EntryOverlay once
 * per browser session; repeat navigations go straight to content. Renders an
 * opaque kamagong veil for the single undecided frame so neither path flashes.
 */
export function CinematicEntrance({ children }: { children: React.ReactNode }) {
  // null = undecided (SSR + hydration frame) · true = play · false = skip
  const [play, setPlay] = useState<boolean | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
      if (!seen) sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // storage unavailable (private mode) — play the entrance
    }
    setPlay(!seen);
  }, []);

  if (play === null) {
    return (
      <>
        {children}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50"
          style={{ backgroundColor: '#110F0D' }}
        />
      </>
    );
  }

  return play ? <CinematicEntry>{children}</CinematicEntry> : <>{children}</>;
}
