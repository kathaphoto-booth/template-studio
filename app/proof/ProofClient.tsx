'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import LivePreview from '@/components/customizer/LivePreview';
import { Field } from '@/components/ui/Field';
import { Swatch } from '@/components/ui/Swatch';
import content from '@/lib/content.json';

/**
 * /proof — the wedge, demonstrated rather than claimed.
 *
 * Every LA/OC booth company surveyed designs the client's print after
 * booking (receipts: docs/superpowers/plans/2026-07-16-wedge-competitor-
 * receipts.md). This page puts the live customizer's proof plate directly
 * under the visitor's fingers before any booking exists. The page IS the
 * positioning: type your names, watch the plate take them.
 */

type Palette = {
  key: string;
  name: string;
  bg: string;
  text: string;
  sub: string;
  slot: string;
  stroke?: string;
};

const EYEBROW = 'font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--color-katha-fnt)]';

function Ledger({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-6 border-t border-[var(--color-katha-ln)] py-6 first:border-t-0">
      <span className="font-mono text-[13px] tracking-[0.18em] text-[var(--color-katha-fnt)] shrink-0" aria-hidden="true">
        {n}
      </span>
      <p className="font-body text-[var(--color-katha-ink)] max-w-[52ch]" style={{ fontSize: 'var(--fs-lede)' }}>
        {children}
      </p>
    </li>
  );
}

export default function ProofClient() {
  const templates = (content as any).templates as any[];
  const palettes = (content as any).palettes as Palette[];

  // loom-oak carries real sample inscriptions ('AMARA & SEBASTIAN' ·
  // 'OCTOBER · LONG BEACH'), so the plate reads like a finished print even
  // before the visitor types — the generated plates sample as format labels.
  const template = useMemo(
    () => templates.find((t) => t.id === 'loom-oak') ?? templates[0],
    [templates],
  );

  const [names, setNames] = useState('');
  const [date, setDate] = useState('');
  const [paletteKey, setPaletteKey] = useState<string>(
    palettes.find((p: any) => (p as any).default)?.key ?? palettes[0].key,
  );
  const palette = palettes.find((p) => p.key === paletteKey) ?? palettes[0];

  return (
    <main className="min-h-screen bg-[var(--color-katha-l0)] text-[var(--color-katha-ink)]">
      {/* Wabi-sabi grain — same material layer as the gallery */}
      <div className="grain" aria-hidden="true" />

      {/* ── Hero — the claim, stated once, plainly ── */}
      <section className="relative px-6 md:px-16 pt-24 md:pt-36 pb-20 max-w-[1200px] mx-auto">
        {/* Registry annotation rail — the filing-cabinet voice, set on its
            spine along the hero's open right edge. Decorative; every fact it
            carries lives in accessible copy below. */}
        <p
          aria-hidden="true"
          className="hidden lg:block absolute right-16 top-40 font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--color-katha-fnt)] [writing-mode:vertical-rl]"
        >
          Plate {template.plate ?? '001'} · {template.name} — held for no one yet
        </p>
        <p className={`${EYEBROW} mb-10 weave`}>
          {'//'} The Proof · Los Angeles &amp; Orange County
        </p>
        <h1
          className="font-display font-light text-[var(--color-katha-hi)] leading-[1.02] tracking-[-0.01em] max-w-[16ch] weave d1"
          style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}
        >
          Your names on the print — before you ever book.
        </h1>
        <p
          className="font-body italic text-[var(--color-katha-mut)] max-w-[58ch] mt-10 weave d2"
          style={{ fontSize: 'var(--fs-lede)' }}
        >
          Around here, the print is designed after you pay. A proof arrives by
          email — thirty days out if you&rsquo;re early, five if you&rsquo;re
          not. We think you should see the thing you&rsquo;re buying first.
          So here it is.
        </p>
        <a
          href="#plate"
          className="inline-flex items-center gap-3 min-h-[var(--touch)] mt-12 font-mono text-[13px] tracking-[0.18em] uppercase text-[var(--color-katha-mut)] hover:text-[var(--color-katha-ink)] transition-colors weave d3"
        >
          <span aria-hidden="true" className="inline-block w-10 h-px bg-[var(--color-katha-ln2)]" />
          The plate is live below
        </a>
      </section>

      {/* ── The demonstration — the page does the arguing ── */}
      <section
        id="plate"
        aria-labelledby="proof-demo-heading"
        className="bg-[var(--color-katha-l1)] border-y border-[var(--color-katha-ln)] scroll-mt-6"
      >
        <div className="px-6 md:px-16 py-20 max-w-[1200px] mx-auto">
          <p className={`${EYEBROW} mb-4`}>{'//'} Plate {template.plate} · live</p>
          <h2
            id="proof-demo-heading"
            className="font-display font-light text-[var(--color-katha-hi)] mb-14 max-w-[20ch]"
            style={{ fontSize: 'var(--fs-display)' }}
          >
            Type. The plate takes your names.
          </h2>

          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-20 items-start">
            {/* The plate leads. On small screens it stays pinned while the
                fields scroll beneath — typing must never be blind. */}
            <div className="sticky top-0 z-10 h-[42vh] py-3 bg-[var(--color-katha-l1)] border-b border-[var(--color-katha-ln)] lg:order-2 lg:static lg:h-auto lg:py-0 lg:border-b-0">
              <div className="h-full lg:h-[600px]">
                <LivePreview
                  template={template}
                  layoutId={template.layout}
                  palette={palette}
                  title={names}
                  subtitle={date}
                  venue=""
                  proofText={
                    names || date
                      ? `Proof updated. ${names || template.sName} · ${date || template.sSub} on ${palette.name}.`
                      : undefined
                  }
                />
              </div>
              {/* Specimen label — the plate reads as a catalogued object. */}
              <p className="hidden lg:flex items-baseline justify-center gap-4 mt-6 font-mono text-[13px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)]">
                <span>Plate {template.plate ?? '—'} · {template.name}</span>
                <span aria-hidden="true" className="inline-block w-8 h-px bg-[var(--color-katha-ln)] relative -top-[4px]" />
                <span className="normal-case tracking-[0.06em] text-[var(--color-katha-mut)]">
                  the three frames print from your booth that night
                </span>
              </p>
            </div>

            <div className="space-y-8 max-w-[440px] lg:order-1">
              <Field
                id="proof-names"
                label="Your names"
                value={names}
                onChange={setNames}
                placeholder={template.sName}
                helper="Exactly as they should print."
              />
              <Field
                id="proof-date"
                label="Your date"
                value={date}
                onChange={setDate}
                placeholder={template.sSub}
                helper="A date, a month, a place — however the second line should read."
              />

              <div>
                <p id="proof-paper-label" className="font-body text-[var(--color-katha-ink)] mb-3" style={{ fontSize: 'var(--fs-label)' }}>
                  Paper
                </p>
                <div role="listbox" aria-labelledby="proof-paper-label" className="space-y-2">
                  {palettes.map((p) => (
                    <Swatch
                      key={p.key}
                      selected={p.key === paletteKey}
                      onSelect={() => setPaletteKey(p.key)}
                      name={p.name}
                      bg={p.bg}
                      ink={p.text}
                    />
                  ))}
                </div>
              </div>

              <p className="font-mono text-[13px] tracking-[0.06em] text-[var(--color-katha-mut)] max-w-[40ch]">
                No account. No deposit. Nothing to unlock — this is the same
                plate our clients finalize.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The market, as we found it ── */}
      <section aria-labelledby="market-heading" className="px-6 md:px-16 py-24 max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
          <div>
            <p className={`${EYEBROW} mb-4`}>{'//'} Everywhere else</p>
            <h2
              id="market-heading"
              className="font-display font-light text-[var(--color-katha-hi)] max-w-[14ch]"
              style={{ fontSize: 'var(--fs-display)' }}
            >
              How the market designs your print
            </h2>
            <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)] mt-8">
              Surveyed July 2026 · twelve companies, LA &amp; OC
            </p>
          </div>
          <div>
            <ol className="list-none">
              <Ledger n="01">
                Browse a template gallery. Every sample wears someone
                else&rsquo;s names.
              </Ledger>
              <Ledger n="02">
                Book and pay. A designer starts on your print thirty days out —
                sometimes five.
              </Ledger>
              <Ledger n="03">
                A proof lands by email. Two rounds of revisions, if you catch
                them in time.
              </Ledger>
            </ol>
            <p
              className="font-body text-[var(--color-katha-ink)] border-t border-[var(--color-katha-ln)] pt-8 mt-2 max-w-[52ch]"
              style={{ fontSize: 'var(--fs-lede)' }}
            >
              We surveyed the booth companies working Los Angeles and Orange
              County this July. Not one shows you your own print before
              you&rsquo;ve booked. It seemed worth building.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works here ── */}
      <section
        aria-labelledby="katha-heading"
        className="bg-[var(--color-katha-l1)] border-y border-[var(--color-katha-ln)]"
      >
        <div className="px-6 md:px-16 py-24 max-w-[1200px] mx-auto">
          <p className={`${EYEBROW} mb-4`}>{'//'} Here</p>
          <h2
            id="katha-heading"
            className="font-display font-light text-[var(--color-katha-hi)] mb-16 max-w-[16ch]"
            style={{ fontSize: 'var(--fs-display)' }}
          >
            The order of operations, reversed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-katha-ln)] border border-[var(--color-katha-ln)]">
            {[
              ['Plate', 'Choose from the Signature registry — each one drawn, named, and numbered.'],
              ['Paper', 'Five stocks. Ink only darkens paper; the plate answers each one differently.'],
              ['Inscription', 'Your names, your date — set live, exactly as they will print.'],
              ['The night', 'Reserve it only after the proof is yours. Not before.'],
            ].map(([t, d], i) => (
              <div key={t} className="bg-[var(--color-katha-l2)] p-8 min-h-[220px] flex flex-col gap-4">
                <span className="font-mono text-[13px] tracking-[0.18em] text-[var(--color-katha-fnt)]">
                  0{i + 1}
                </span>
                <h3
                  className="font-display font-light text-[var(--color-katha-hi)]"
                  style={{ fontSize: 'var(--fs-title)' }}
                >
                  {t}
                </h3>
                <p className="font-body text-[var(--color-katha-mut)]" style={{ fontSize: 'var(--fs-body)' }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The one gilt CTA — the closing plate ── */}
      <section className="px-6 md:px-16 py-28 max-w-[720px] mx-auto text-center border-t border-[var(--color-katha-ln)]">
        <p className={`${EYEBROW} mb-8`}>{'//'} The customizer is open</p>
        <p
          className="font-display font-light text-[var(--color-katha-hi)] max-w-[24ch] mx-auto mb-12"
          style={{ fontSize: 'var(--fs-display)' }}
        >
          Finish the plate you started above.
        </p>
        <Link
          href="/template-design"
          className="inline-flex items-center justify-center min-h-[var(--touch-lg)] px-10 bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[16px] tracking-[0.12em] uppercase rounded-[2px] hover:brightness-105 transition-all"
        >
          Design your print now →
        </Link>
        <p className="font-mono text-[13px] tracking-[0.06em] text-[var(--color-katha-mut)] mt-8">
          Los Angeles &amp; Orange County · the print is cut and dry the same night.
        </p>
      </section>
    </main>
  );
}
