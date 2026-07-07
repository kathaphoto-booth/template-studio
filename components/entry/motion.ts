import type { Transition } from 'motion/react';

/**
 * Gilded Archive motion law — physics only, no timeline tweens.
 * Weight comes from mass; restraint comes from damping.
 */
export const DEAL_SPRING = {
  type: 'spring',
  mass: 1.6,
  stiffness: 120,
  damping: 19,
} as const satisfies Transition;

export const LETTER_SPRING = {
  type: 'spring',
  mass: 1.1,
  stiffness: 170,
  damping: 21,
} as const satisfies Transition;

export const LIFT_SPRING = {
  type: 'spring',
  mass: 1.2,
  stiffness: 140,
  damping: 26,
} as const satisfies Transition;

export const DEAL_BASE_DELAY = 0.55 as const;
export const DEAL_STAGGER = 0.09 as const;
export const LETTER_STAGGER = 0.07 as const;

export const PALETTE = {
  kamagong: '#110F0D',
  paper: '#181512',
  bone: '#E4DACA',
  sage: '#8FA283', // Lifted Moss — the only tint that speaks on kamagong
  gilt: '#DCCBB5', // Satin Champagne — the sacred accent
} as const;
