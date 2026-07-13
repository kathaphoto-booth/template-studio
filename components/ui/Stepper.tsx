'use client';
import React from 'react';

export function Stepper({
  steps, current, onJump,
}: { steps: { key: string; label: string }[]; current: number; onJump?: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-2" aria-label={`Step ${current + 1} of ${steps.length}`}>
      {steps.map((s, i) => {
        const active = i === current;
        const visited = i < current;
        const clickable = !!onJump && visited;
        return (
          <li key={s.key} aria-current={active ? 'step' : undefined} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onJump?.(i)}
              className={`flex items-center gap-2 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ minHeight: 'var(--touch)' }}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
                  active ? 'border-[var(--color-katha-gilt)] text-[var(--color-katha-gilt)]'
                         : visited ? 'border-[var(--color-katha-moss-hi)] text-[var(--color-katha-moss-hi)]'
                                   : 'border-[var(--color-katha-ln2)] text-[var(--color-katha-fnt)]'
                }`}
                style={{ fontSize: 'var(--fs-meta)' }}
              >
                {visited ? '✓' : i + 1}
              </span>
              <span
                className={active ? 'text-[var(--color-katha-ink)]' : 'text-[var(--color-katha-mut)]'}
                style={{ fontSize: 'var(--fs-meta)' }}
              >
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && <span aria-hidden="true" className="w-4 h-px bg-[var(--color-katha-ln2)]" />}
          </li>
        );
      })}
    </ol>
  );
}
