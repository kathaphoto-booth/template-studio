"use client";

import type { Tier } from '@/lib/booking';

type PricingTiersProps = {
  tiers: Tier[];
  onSelect: (tierKey: string) => void;
};

/**
 * The Investment — real catalog from content.json. Unavailable tiers stay
 * visible and legible (35% plate, capiz chip); the flagship carries a gilt
 * chip. Selecting an available installation opens the Vault Drawer.
 */
const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

export function PricingTiers({ tiers, onSelect }: PricingTiersProps) {
  // Truthful count (funnel-audit r1): the headline names how many
  // installations are OPEN — unavailable tiers stay visible below but
  // announce themselves, so the number never contradicts the cards.
  const openCount = tiers.filter((t) => t.available).length;
  const openWord = COUNT_WORDS[openCount] ?? String(openCount);
  return (
    <section className="px-6 lg:px-12 py-28 lg:py-36" aria-label="Installations and pricing">
      <div className="pricing-grid">
        <div className="oak-sticky">
          <p className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)] mb-6 flex items-baseline gap-3">
            The Investment
            <span className="h-[1px] w-10 bg-[var(--color-katha-ln)] inline-block relative -top-[3px]" />
          </p>
          <h2 className="font-display text-[36px] lg:text-[46px] leading-[1.1] font-light text-[var(--color-katha-hi)] mb-8">
            {openWord} installations open.
            <br />
            One operator.
            <br />
            Archival prints<span className="text-[var(--color-katha-gilt)]">.</span>
          </h2>
          <p
            className="text-[19px] leading-[1.65] text-[var(--color-katha-mut)] italic max-w-[380px]"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            Priced as line items, not mysteries — the oak booth, the trained
            operator, and the paper your guests keep.
          </p>
          <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)] mt-10">
            Contract, invoice &amp; payment stay in HoneyBook
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {tiers.map((tier) => {
            const off = !tier.available;
            const flagship = tier.key === 'glam_editorial';
            return (
              <div
                key={tier.key}
                role="button"
                tabIndex={off ? -1 : 0}
                aria-disabled={off}
                aria-label={off ? `${tier.name} — currently unavailable` : `Hold the ${tier.name}`}
                onClick={() => !off && onSelect(tier.key)}
                onKeyDown={(e) => {
                  if (!off && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelect(tier.key);
                  }
                }}
                className={`tier-card ${flagship ? 'tier-flag' : ''} ${off ? 'tier-off' : ''}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    {tier.badge && (
                      <span className="font-mono text-[8.5px] tracking-[0.18em] uppercase text-[var(--color-katha-mut)] border border-[var(--color-katha-ln)] px-2 py-0.5 rounded-[1px]">
                        {tier.badge}
                      </span>
                    )}
                    <h3 className="font-display text-[26px] font-light text-[var(--color-katha-hi)] mt-3">
                      {tier.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-[32px] font-light text-[var(--color-katha-ink)]">
                      ${tier.price.toLocaleString()}
                    </p>
                    <p className="font-mono text-[8.5px] tracking-[0.1em] uppercase text-[var(--color-katha-fnt)]">
                      up to {tier.hours} hrs
                    </p>
                  </div>
                </div>

                <p className="font-body text-[17px] leading-[1.55] text-[var(--color-katha-mut)]">
                  {tier.blurb}
                </p>

                {tier.includes && (
                  <ul className="flex flex-col gap-1.5 mt-1">
                    {tier.includes.slice(0, 4).map((line) => (
                      <li
                        key={line}
                        className="font-mono text-[9.5px] tracking-[0.08em] text-[var(--color-katha-mut)] flex gap-2.5"
                      >
                        <span className="text-[var(--color-katha-gilt)]" aria-hidden="true">·</span>
                        {line}
                      </li>
                    ))}
                    {tier.includes.length > 4 && (
                      <li className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--color-katha-fnt)] mt-1">
                        + {tier.includes.length - 4} more in the full brief
                      </li>
                    )}
                  </ul>
                )}

                {off ? (
                  <span className="self-start font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)] bg-[var(--color-katha-l0)] px-3 py-1.5 rounded-[1px]">
                    {tier.unavailableLabel ?? 'Currently unavailable'}
                  </span>
                ) : (
                  <span className="tier-cta">Hold this installation</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
