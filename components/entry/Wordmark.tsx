'use client';

import { motion, type Variants } from 'motion/react';
import { LETTER_SPRING, LETTER_STAGGER, LIFT_SPRING, PALETTE } from './motion';

const wordVariants = {
  hidden: {},
  set: { transition: { delayChildren: 0.15, staggerChildren: LETTER_STAGGER } },
  lifted: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
} as const satisfies Variants;

const letterVariants = {
  hidden: { opacity: 0, y: 28, rotateX: 88 },
  set: { opacity: 1, y: 0, rotateX: 0, transition: LETTER_SPRING },
  lifted: { opacity: 0, y: -36, rotateX: -24, transition: LIFT_SPRING },
} as const satisfies Variants;

interface WordmarkProps {
  text?: string;
}

export function Wordmark({ text = 'KATHA' }: WordmarkProps) {
  return (
    <motion.h1
      variants={wordVariants}
      aria-label={text}
      className="flex select-none justify-center font-serif text-5xl font-light md:text-7xl"
      style={{
        color: PALETTE.bone,
        letterSpacing: '0.42em',
        // 0.42em tracking leaves a trailing gap after the last glyph — recenter
        marginRight: '-0.42em',
        perspective: 800,
      }}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden="true"
          variants={letterVariants}
          className="inline-block"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
