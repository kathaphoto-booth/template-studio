"use client";

import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * Osmo-style parallax reveal: the page content (z-10, opaque) scrolls up and
 * away to expose this footer, which sits fixed beneath it (z-0). The inner
 * block rises and brightens as the reveal progresses. The transparent spacer
 * rendered first provides the scroll room; keep it outside any transformed
 * ancestor or `fixed` breaks.
 */
export function ParallaxFooter({ onReserve }: { onReserve: () => void }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ['start end', 'end end'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [110, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.65, 1]);

  return (
    <>
      <div ref={spacerRef} className="h-[72vh]" aria-hidden="true" />
      <footer className="fixed bottom-0 inset-x-0 h-[72vh] z-0 overflow-hidden bg-[var(--color-katha-l0)]">
        <m.div
          style={reduceMotion ? undefined : { y, opacity }}
          className="h-full flex flex-col justify-between px-6 md:px-16 pt-14 pb-8"
        >
          <div className="flex items-baseline justify-between gap-6">
            <p className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)]">
              {"// The Studio"}
            </p>
            <button
              type="button"
              onClick={onReserve}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-katha-gilt)] py-4 min-h-[44px] hover:brightness-110 transition-all cursor-pointer [&>span]:border-b [&>span]:border-[var(--color-katha-gilt)] [&>span]:pb-1"
            >
              <span>Reserve your night →</span>
            </button>
          </div>

          <div className="select-none" aria-hidden="true">
            <span className="font-display font-light text-[var(--color-katha-hi)] leading-[0.9] text-[clamp(88px,17vw,260px)] tracking-[-0.02em]">
              Katha<span className="text-[var(--color-katha-gilt)]">.</span>
            </span>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[var(--color-katha-ln)] pt-8">
              <div>
                <p className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--color-katha-fnt)] mb-2.5">
                  Correspondence
                </p>
                <a
                  href="mailto:hello@kathabooth.com"
                  className="font-body text-[17px] text-[var(--color-katha-ink)] hover:text-[var(--color-katha-hi)] transition-colors inline-block py-3"
                >
                  hello@kathabooth.com
                </a>
              </div>
              <div>
                <p className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--color-katha-fnt)] mb-2.5">
                  Territory
                </p>
                <p className="font-body text-[17px] text-[var(--color-katha-mut)]">
                  Los Angeles &amp; Orange County · based in Carson
                </p>
              </div>
              <div>
                <p className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--color-katha-fnt)] mb-2.5">
                  Registry
                </p>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-katha-mut)]">
                  {'//'} The Gilded Archive · est. 2024
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-3 mt-8 pt-5 border-t border-[var(--color-katha-ln)]">
              <p className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[var(--color-katha-fnt)]">
                © 2026 Katha Booth
              </p>
              <p className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[var(--color-katha-fnt)]">
                Contract &amp; payment via HoneyBook
              </p>
            </div>
          </div>
        </m.div>
      </footer>
    </>
  );
}
