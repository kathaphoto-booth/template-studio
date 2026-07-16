'use client';

import React from 'react';

export type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  error?: string;
  type?: 'text' | 'tel' | 'email';
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
};

export function Field({
  id, label, value, onChange, helper, error,
  type = 'text', multiline = false, required = false, placeholder, inputMode,
}: FieldProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    value,
    placeholder,
    inputMode,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    'aria-required': required || undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className:
      'w-full bg-transparent border border-[var(--color-katha-ln2)] rounded-[2px] ' +
      'px-4 text-[var(--color-katha-ink)] placeholder-[var(--color-katha-fnt)] ' +
      'outline-none focus:border-[var(--color-katha-gilt)] transition-colors duration-300',
    style: {
      fontSize: 'var(--fs-body)',
      minHeight: multiline ? 'auto' : 'var(--field-h)',
    } as React.CSSProperties,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[var(--color-katha-mut)]" style={{ fontSize: 'var(--fs-label)' }}>
        {label}{required && <span aria-hidden="true" className="text-[var(--color-katha-gilt)]"> ·</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} style={{ ...shared.style, paddingTop: 12, paddingBottom: 12 }} />
      ) : (
        <input {...shared} type={type} />
      )}
      {helper && !error && (
        <p id={helperId} className="text-[var(--color-katha-fnt)]" style={{ fontSize: 'var(--fs-meta)' }}>{helper}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[var(--color-katha-hi)]" style={{ fontSize: 'var(--fs-meta)' }}>{error}</p>
      )}
    </div>
  );
}
