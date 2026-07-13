'use client';
import React from 'react';

export function ActionBar({
  onBack, backLabel = 'Back', primaryLabel, onPrimary, primaryDisabled = false,
}: {
  onBack?: () => void; backLabel?: string;
  primaryLabel: string; onPrimary: () => void; primaryDisabled?: boolean;
}) {
  return (
    <div
      className="sticky bottom-0 flex items-center gap-3 bg-[var(--color-katha-l1)] border-t border-[var(--color-katha-ln)] px-5 py-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-5 text-[var(--color-katha-mut)] border border-[var(--color-katha-ln2)] rounded-[2px] hover:text-[var(--color-katha-ink)] transition-colors cursor-pointer"
          style={{ minHeight: 'var(--touch-lg)', fontSize: 'var(--fs-body)' }}
        >
          {backLabel}
        </button>
      )}
      <button
        type="button"
        onClick={() => !primaryDisabled && onPrimary()}
        aria-disabled={primaryDisabled || undefined}
        className={`flex-1 rounded-[2px] font-medium transition-colors ${
          primaryDisabled
            ? 'bg-[var(--color-katha-l3)] text-[var(--color-katha-fnt)] cursor-default'
            : 'bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] hover:bg-[var(--color-katha-champ)] cursor-pointer'
        }`}
        style={{ minHeight: 'var(--touch-lg)', fontSize: 'var(--fs-body)' }}
      >
        {primaryLabel}
      </button>
    </div>
  );
}
