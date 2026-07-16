"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Print } from '@/components/Print';
import { KathaWordmark } from '@/components/marks/KathaWordmark';
import { formatLongDate, tierByKey, minSelectableISO, type Tier } from '@/lib/booking';
import { getEntrySource } from '@/lib/entry';

/* ── ThreadWire — floating hairline input, gilt intent on focus ── */
function ThreadWire({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value !== '';
  return (
    <div className="flex flex-col gap-1.5 relative pt-5">
      <label
        className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono tracking-[0.14em] uppercase ${
          active
            ? 'top-0 text-[9px] text-[var(--color-katha-ink)] font-bold'
            : 'top-5 text-[var(--color-katha-mut)] text-[12px]'
        }`}
      >
        {label}
        {required && <span className="text-[var(--color-katha-gilt)] ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-none text-[var(--color-katha-ink)] py-2 font-display text-[18px] outline-none"
      />
      <div className="h-[1px] bg-[var(--color-katha-ln)] absolute bottom-0 left-0 right-0">
        <div
          className="h-full bg-[var(--color-katha-gilt)] transition-[width] duration-400 ease-[cubic-bezier(0.19,1,0.22,1)]"
          style={{ width: focused ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}

/* ── Archive calendar — bound to real open dates only ──
   Open: piña digit + moss dot · Not open: capiz struck at 20% · Selected:
   gilt ring + gilt-low fill. Hue never carries the signal alone. */
function ArchiveCalendar({
  openDates,
  selectedDate,
  onSelectDate,
}: {
  openDates: string[];
  selectedDate: string;
  onSelectDate: (iso: string) => void;
}) {
  const openSet = useMemo(() => new Set(openDates), [openDates]);
  const anchorISO = selectedDate || openDates[0] || minSelectableISO();
  const [anchorY, anchorM] = anchorISO.split('-').map(Number);
  const [view, setView] = useState({ y: anchorY, m: anchorM - 1 });

  useEffect(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      setView({ y, m: m - 1 });
    }
  }, [selectedDate]);

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const monthName = new Date(view.y, view.m, 1)
    .toLocaleDateString('en-US', { month: 'long' })
    .toUpperCase();

  const nav = (delta: number) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`pad-${i}`} aria-hidden="true" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isOpen = openSet.has(iso);
    const isSelected = selectedDate === iso;
    cells.push(
      <button
        key={iso}
        type="button"
        disabled={!isOpen}
        aria-label={isOpen ? `Hold ${iso}` : `${iso} unavailable`}
        onClick={() => onSelectDate(iso)}
        className={`relative aspect-square min-h-[42px] flex items-center justify-center rounded-[2px] font-mono text-[12px] transition-all duration-300 ${
          isSelected
            ? 'bg-[var(--color-katha-gilt-low)] text-[var(--color-katha-gilt)] font-bold shadow-[inset_0_0_0_1px_var(--color-katha-gilt)]'
            : isOpen
              ? 'bg-[var(--color-katha-l2)] text-[var(--color-katha-ink)] cursor-pointer hover:bg-[var(--color-katha-l3)] hover:-translate-y-[1px]'
              : 'text-[var(--color-katha-fnt)] opacity-20 line-through cursor-not-allowed'
        }`}
      >
        {d}
        {isOpen && !isSelected && (
          <span
            className="absolute bottom-[5px] left-1/2 -ml-[2px] w-[4px] h-[4px] rounded-full bg-[var(--color-katha-moss)]"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  return (
    <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] rounded-[2px] p-5">
      <div className="flex justify-between items-center mb-4">
        <span className="font-display text-[18px] tracking-[0.02em] text-[var(--color-katha-ink)]">
          {monthName} {view.y}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => nav(-1)}
            aria-label="Previous month"
            className="w-9 h-9 border border-[var(--color-katha-ln2)] rounded-[2px] text-[var(--color-katha-mut)] hover:text-[var(--color-katha-ink)] hover:border-[var(--color-katha-ink)] transition-all flex items-center justify-center cursor-pointer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => nav(1)}
            aria-label="Next month"
            className="w-9 h-9 border border-[var(--color-katha-ln2)] rounded-[2px] text-[var(--color-katha-mut)] hover:text-[var(--color-katha-ink)] hover:border-[var(--color-katha-ink)] transition-all flex items-center justify-center cursor-pointer"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <span
            key={day}
            className="font-mono text-[7.5px] tracking-[0.14em] uppercase text-[var(--color-katha-fnt)] text-center py-1.5"
          >
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">{cells}</div>
      <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-[var(--color-katha-fnt)] mt-4">
        Open dates only · 7-day minimum notice · set by the studio
      </p>
    </div>
  );
}

/* ── The Vault Drawer ── */
export type DrawerSelection = {
  open: boolean;
  template: any | null;
  tierKey: string;
  date: string;
};

type VaultDrawerProps = {
  selection: DrawerSelection;
  openDates: string[];
  onClose: () => void;
};

export function VaultDrawer({ selection, openDates, onClose }: VaultDrawerProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [receipt, setReceipt] = useState<{ token: string; date: string; tier: string } | null>(null);

  const tier: Tier | undefined = tierByKey(selection.tierKey);
  const template = selection.template;

  // Adopt an incoming date (from the Date Gate) without clobbering a choice
  // the client already made inside the drawer.
  useEffect(() => {
    if (selection.open && selection.date) setDate(selection.date);
  }, [selection.open, selection.date]);

  // Deep z-depth: dim the page content, lock scroll.
  useEffect(() => {
    document.body.classList.toggle('drawer', selection.open);
    return () => document.body.classList.remove('drawer');
  }, [selection.open]);

  useEffect(() => {
    if (!selection.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [selection.open, onClose]);

  const canSubmit = name.trim().length >= 2 && email.includes('@') && date !== '' && !submitting;

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSendError(false);
    try {
      // Marketing attribution rides along when held for the session;
      // JSON.stringify drops the keys entirely when absent.
      const source = getEntrySource();
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: name.trim(),
          client_email: email.trim().toLowerCase(),
          event_date: date,
          tier_selected: tier?.name,
          source: source ?? undefined,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error('dispatch failed');
      const token = `KB-${crypto.randomUUID().slice(0, 7).toUpperCase()}`;
      setReceipt({ token, date, tier: tier?.name ?? 'Installation' });
    } catch {
      // Zero-loss law: state is preserved, the failure is stated plainly.
      setSendError(true);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, name, email, date, tier]);

  const resetForAnother = () => {
    setReceipt(null);
    setSendError(false);
  };

  const slide = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.01 },
      }
    : {
        initial: { x: '105%' },
        animate: { x: 0 },
        exit: { x: '105%' },
        transition: { type: 'spring' as const, stiffness: 240, damping: 32 },
      };

  return (
    <AnimatePresence>
      {selection.open && (
        <>
          <motion.button
            key="vault-backdrop"
            type="button"
            aria-label="Close the reservation drawer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/40 cursor-default"
          />
          <motion.aside
            key="vault-panel"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Reserve your date"
            {...slide}
            className="fixed inset-y-0 right-0 z-[60] w-full max-w-[540px] bg-[var(--color-katha-l1)] border-l border-[var(--color-katha-ln)] shadow-[-40px_0_120px_rgba(0,0,0,0.6)] flex flex-col outline-none"
          >
            {/* Registry header */}
            <div className="flex items-center justify-between px-7 py-6 border-b border-[var(--color-katha-ln)] shrink-0">
              <div>
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)]">
                  {'//'} Inquiry Registry Active
                </p>
                <h2 className="font-display text-[26px] font-light text-[var(--color-katha-hi)] mt-1.5">
                  {receipt ? 'The date is held.' : 'Secure your date.'}
                </h2>
              </div>
              <div className="flex items-center gap-5">
                <KathaWordmark size={20} swash={false} />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 border border-[var(--color-katha-ln2)] rounded-[2px] text-[var(--color-katha-mut)] hover:text-[var(--color-katha-ink)] hover:border-[var(--color-katha-ink)] transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 py-7 flex flex-col gap-7 [scrollbar-width:thin]">
              {receipt ? (
                /* ── Receipt — bone stock, kamagong ink ── */
                <div className="flex flex-col gap-6">
                  <div
                    className="relative px-8 pt-9 pb-7 rounded-[2px]"
                    style={{ backgroundColor: '#E9DFCC', color: '#110F0D' }}
                  >
                    <div
                      className="absolute inset-x-6 top-0 border-t-2 border-dashed"
                      style={{ borderColor: 'rgba(17,15,13,0.25)' }}
                      aria-hidden="true"
                    />
                    <p className="font-mono text-[9px] tracking-[0.24em] uppercase" style={{ color: '#5A5245' }}>
                      Katha Booth · Inquiry Registry
                    </p>
                    <p className="font-mono text-[30px] tracking-[0.08em] mt-4 mb-5">{receipt.token}</p>
                    <div className="border-t border-dashed pt-5 flex flex-col gap-2" style={{ borderColor: 'rgba(17,15,13,0.25)' }}>
                      <p className="font-display text-[20px] font-light" style={{ color: '#8A7350' }}>
                        {formatLongDate(receipt.date)}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: '#5A5245' }}>
                        {receipt.tier}
                      </p>
                    </div>
                    <p className="font-mono text-[9px] tracking-[0.1em] mt-6 break-all" style={{ color: '#5A5245' }}>
                      book.kathabooth.com/gallery?lead={receipt.token.replace('KB-', '')}
                    </p>
                    <div
                      className="absolute inset-x-6 bottom-0 border-b-2 border-dashed"
                      style={{ borderColor: 'rgba(17,15,13,0.25)' }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-body text-[17px] leading-relaxed text-[var(--color-katha-ink)]">
                    Received. Your date is held for 72 hours. A deposit invoice and
                    contract follow via HoneyBook — watch your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={resetForAnother}
                    className="self-start font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-katha-mut)] border-b border-[var(--color-katha-ln2)] pb-1 hover:text-[var(--color-katha-ink)] transition-colors cursor-pointer"
                  >
                    Hold another date
                  </button>
                </div>
              ) : (
                <>
                  {/* Selected plate or installation */}
                  {template && (
                    <div className="bg-[var(--color-katha-l2)] border border-[var(--color-katha-ln)] rounded-[2px] p-5 flex items-center gap-6">
                      <Print t={template} height={template.ratio?.h > template.ratio?.w ? 150 : 96} />
                      <div className="min-w-0">
                        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-katha-fnt)]">
                          Selected plate · {template.plate}
                        </p>
                        <p className="font-display text-[22px] font-light text-[var(--color-katha-hi)] mt-1">
                          {template.name}
                        </p>
                        <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--color-katha-mut)] mt-1">
                          {template.formatLabel}
                        </p>
                      </div>
                    </div>
                  )}

                  {tier && (
                    <div className="flex items-baseline justify-between border-b border-[var(--color-katha-ln)] pb-5">
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-katha-fnt)]">
                          Installation
                        </p>
                        <p className="font-display text-[22px] font-light text-[var(--color-katha-hi)] mt-1">
                          {tier.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-[28px] font-light text-[var(--color-katha-ink)]">
                          ${tier.price.toLocaleString()}
                        </p>
                        <p className="font-mono text-[8.5px] tracking-[0.12em] uppercase text-[var(--color-katha-fnt)]">
                          up to {tier.hours} hrs · ${tier.extraHourRate ?? 149} per add&rsquo;l hour
                        </p>
                      </div>
                    </div>
                  )}

                  <ArchiveCalendar openDates={openDates} selectedDate={date} onSelectDate={setDate} />

                  <div className="flex flex-col gap-4">
                    <ThreadWire label="Full name" value={name} onChange={setName} required />
                    <ThreadWire label="Email" type="email" value={email} onChange={setEmail} required />
                  </div>

                  {sendError && (
                    <div className="border-l-2 border-[var(--color-katha-hi)] px-5 py-4 bg-[var(--color-katha-l2)]">
                      <p className="font-body text-[16px] font-medium text-[var(--color-katha-ink)]">
                        That didn&rsquo;t send. Your selections are safe — try again.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* CTA footer */}
            {!receipt && (
              <div className="shrink-0 border-t border-[var(--color-katha-ln)] px-7 py-6 bg-[var(--color-katha-l1)]">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-katha-mut)]">
                    {date ? formatLongDate(date) : 'Select an open night'}
                  </span>
                  <span className="font-display text-[26px] font-light text-[var(--color-katha-ink)]">
                    ${(tier?.price ?? 0).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={submit}
                  className={`w-full py-4 rounded-[3px] font-mono text-[11px] tracking-[0.16em] uppercase transition-all duration-300 ${
                    canSubmit
                      ? 'bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] hover:brightness-105 cursor-pointer'
                      : 'bg-[var(--color-katha-l2)] text-[var(--color-katha-mut)] cursor-not-allowed opacity-60'
                  }`}
                >
                  {submitting ? 'Sealing the registry…' : 'Secure date & begin design'}
                </button>
                <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-[var(--color-katha-fnt)] mt-3 text-center">
                  Contract, invoice & payment follow via HoneyBook
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
