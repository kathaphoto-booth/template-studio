'use client';
import React from 'react';

export function ChoiceCard({
  selected, onSelect, disabled = false, title, sub, children,
}: {
  selected: boolean; onSelect: () => void; disabled?: boolean;
  title: string; sub?: string; children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onSelect()}
      className={`text-left p-4 border rounded-[2px] transition-colors duration-300 flex flex-col gap-1 ${
        disabled
          ? 'border-[var(--color-katha-ln)] opacity-45 cursor-default'
          : selected
            ? 'border-[var(--color-katha-gilt)] bg-[var(--color-katha-gilt-low)] cursor-pointer'
            : 'border-[var(--color-katha-ln2)] hover:border-[var(--color-katha-mut)] cursor-pointer'
      }`}
      style={{ minHeight: 'var(--touch-lg)' }}
    >
      <span className="text-[var(--color-katha-ink)]" style={{ fontSize: 'var(--fs-body)' }}>{title}</span>
      {sub && <span className="text-[var(--color-katha-mut)]" style={{ fontSize: 'var(--fs-meta)' }}>{sub}</span>}
      {children}
    </button>
  );
}
