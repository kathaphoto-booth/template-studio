'use client';
import React from 'react';

export function Swatch({
  selected, onSelect, name, bg, ink,
}: { selected: boolean; onSelect: () => void; name: string; bg: string; ink: string }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-4 border rounded-[2px] transition-colors duration-300 cursor-pointer ${
        selected ? 'border-[var(--color-katha-gilt)] bg-[var(--color-katha-gilt-low)]'
                 : 'border-[var(--color-katha-ln2)] hover:border-[var(--color-katha-mut)]'
      }`}
      style={{ minHeight: 'var(--touch-lg)' }}
    >
      {/* Contrast sample painted in the palette's own paper+ink, not a bare chip */}
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-[2px] border border-[var(--color-katha-ln2)] shrink-0"
        style={{ backgroundColor: bg, color: ink, fontFamily: 'Fraunces, Georgia, serif' }}
        aria-hidden="true"
      >
        Aa
      </span>
      <span className="flex-1 text-left text-[var(--color-katha-ink)]" style={{ fontSize: 'var(--fs-body)' }}>{name}</span>
      {selected && <span aria-hidden="true" className="text-[var(--color-katha-gilt)]">✓</span>}
    </button>
  );
}
