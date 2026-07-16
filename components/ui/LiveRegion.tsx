'use client';
import React, { useEffect, useState } from 'react';
import { registerAnnouncer } from '@/lib/a11y';

export function LiveRegion() {
  const [msg, setMsg] = useState('');
  useEffect(() => registerAnnouncer(setMsg), []);
  return (
    <div
      role="status"
      aria-live="polite"
      className="sr-only"
      style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
    >
      {msg}
    </div>
  );
}
