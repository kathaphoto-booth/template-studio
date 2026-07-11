'use client';

import Image from "next/image";
import { motion, type Variants } from 'motion/react';
import { DEAL_BASE_DELAY, DEAL_SPRING, DEAL_STAGGER, LIFT_SPRING, PALETTE } from './motion';
import type { TemplateCard } from './types';

export const CARD_WIDTH = 112;
export const CARD_COUNT = 8;

/** Deterministic per-card rotation scatter (degrees) — a dealer's hand, not a grid. */
const SCATTER = [-2.4, 1.8, -1.1, 2.6, -1.9, 0.8, -2.8, 1.4] as const;

const center = (CARD_COUNT - 1) / 2;

const cardVariants = {
  hidden: (i: number) => ({
    x: 0,
    y: 0,
    rotate: SCATTER[i % SCATTER.length] * 3,
    scale: 0.92,
    opacity: 0,
  }),
  set: (i: number) => ({
    x: (i - center) * 96,
    y: Math.abs(i - center) * 14,
    rotate: (i - center) * 4 + SCATTER[i % SCATTER.length],
    scale: 1,
    opacity: 1,
    transition: { ...DEAL_SPRING, delay: DEAL_BASE_DELAY + i * DEAL_STAGGER },
  }),
  lifted: (i: number) => ({
    y: -220,
    opacity: 0,
    transition: { ...LIFT_SPRING, delay: (CARD_COUNT - 1 - i) * 0.03 },
  }),
} as const satisfies Variants;

interface DealtCardProps {
  card: TemplateCard;
  index: number;
  onSettled: () => void;
}

export function DealtCard({ card, index, onSettled }: DealtCardProps) {
  const aspect = card.aspect ?? 2 / 3;

  return (
    <motion.figure
      custom={index}
      variants={cardVariants}
      onAnimationComplete={(definition) => {
        if (definition === 'set') onSettled();
      }}
      className="absolute left-1/2 top-1/2 overflow-hidden rounded-sm"
      style={{
        width: CARD_WIDTH,
        height: CARD_WIDTH / aspect,
        marginLeft: -CARD_WIDTH / 2,
        marginTop: -(CARD_WIDTH / aspect) / 2,
        zIndex: index,
        backgroundColor: PALETTE.paper,
        border: '1px solid rgba(232, 224, 212, 0.08)',
        boxShadow: '0 18px 40px -18px rgba(0, 0, 0, 0.7)',
        willChange: 'transform',
      }}
    >
      <Image
        src={card.src}
        alt={card.alt}
        fill
        sizes="420px"
        draggable={false}
        className="object-cover"
        style={{
          // Archival monochrome: warm the portraits into the kamagong/gilt world
          // and neutralize any stray colour so the dealt hand reads as one set.
          filter: 'grayscale(0.82) sepia(0.28) contrast(1.06) brightness(0.94)',
        }}
      />
      {/* Warm gilt veil — ties the whole hand to the accent, faint. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: 'rgba(220, 203, 181, 0.10)', mixBlendMode: 'overlay' }}
      />
    </motion.figure>
  );
}
