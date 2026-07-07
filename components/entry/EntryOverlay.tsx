'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DealtCard, CARD_COUNT } from './DealtCard';
import { LIFT_SPRING, PALETTE } from './motion';
import { Wordmark } from './Wordmark';
import type { TemplateCard } from './types';

const overlayVariants = {
  hidden: { opacity: 1 },
  set: { opacity: 1 },
  lifted: { opacity: 0, transition: { ...LIFT_SPRING, delay: 0.18 } },
} as const satisfies Variants;

interface EntryOverlayProps {
  /** Exactly 8 are dealt; extras are ignored. */
  templates: readonly TemplateCard[];
  /** The masonry gallery revealed when the overlay unmounts. */
  children: React.ReactNode;
  /** Pause after the last card settles, before the lift. */
  holdMs?: number;
  onRevealed?: () => void;
}

export function EntryOverlay({
  templates,
  children,
  holdMs = 700,
  onRevealed,
}: EntryOverlayProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(true);
  const settledCount = useRef(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cards = templates.slice(0, CARD_COUNT);

  useEffect(() => {
    if (reduceMotion) setOpen(false);
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, [reduceMotion]);

  const handleCardSettled = useCallback(() => {
    settledCount.current += 1;
    if (settledCount.current === cards.length) {
      holdTimer.current = setTimeout(() => setOpen(false), holdMs);
    }
  }, [cards.length, holdMs]);

  return (
    <>
      {children}
      <AnimatePresence onExitComplete={onRevealed}>
        {open && (
          <motion.div
            key="katha-entry"
            role="presentation"
            variants={overlayVariants}
            initial="hidden"
            animate="set"
            exit="lifted"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-16 overflow-hidden"
            style={{ backgroundColor: PALETTE.kamagong }}
          >
            <Wordmark />

            <div className="relative h-64 w-full max-w-4xl" aria-hidden="true">
              {cards.map((card, i) => (
                <DealtCard
                  key={card.id}
                  card={card}
                  index={i}
                  onSettled={handleCardSettled}
                />
              ))}
            </div>

            <motion.p
              variants={{
                hidden: { opacity: 0 },
                set: { opacity: 1, transition: { delay: 1.4 } },
                lifted: { opacity: 0 },
              }}
              className="text-[11px] uppercase"
              style={{ color: PALETTE.sage, letterSpacing: '0.34em' }}
            >
              The archive is opening
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
