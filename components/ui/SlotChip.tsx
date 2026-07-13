'use client';
import React from 'react';

export function SlotChip({
  slot, label, selected, disabled = false, onSelect,
}: {
  slot: 'afternoon' | 'evening'; label: string;
  selected: boolean; disabled?: boolean; onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      data-slot={slot}
      disabled={disabled}
      onClick={() => !disabled && onSelect()}
      className={`flex-1 px-4 border rounded-[2px] transition-colors duration-300 ${
        disabled ? 'border-[var(--color-katha-ln)] opacity-45 cursor-default'
                 : selected ? 'border-[var(--color-katha-gilt)] bg-[var(--color-katha-gilt-low)] text-[var(--color-katha-gilt)] cursor-pointer'
                            : 'border-[var(--color-katha-ln2)] text-[var(--color-katha-ink)] hover:border-[var(--color-katha-mut)] cursor-pointer'
      }`}
      style={{ minHeight: 'var(--touch)', fontSize: 'var(--fs-body)' }}
    >
      {label}
    </button>
  );
}
