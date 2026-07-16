'use client';

import { useEffect } from 'react';
import { captureEntryParams } from '@/lib/entry';

/**
 * Reads ?src / ?tier once on arrival and holds recognized values for the
 * session (lib/entry.ts), so attribution survives internal navigation.
 * Renders nothing; unknown values pass silently.
 */
export function EntryCapture() {
  useEffect(() => {
    captureEntryParams(window.location.search);
  }, []);
  return null;
}
