"use client";

import { motion, useReducedMotion } from "motion/react";

export function TemplateCard({ template, index }: { template: any; index: number }) {
  const reduce = useReducedMotion();

  if (template.isFootnote) {
    return null;
  }

  const ratio = template.ratio ? `${template.ratio.w} / ${template.ratio.h}` : "2 / 3";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay: reduce ? 0 : (index % 4) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="break-inside-avoid mb-6 relative group cursor-pointer"
    >
      <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3 transition-colors duration-500 ease-out hover:border-[#DCCBB5]/30 hover:shadow-[0_20px_40px_var(--color-katha-shadow)]">
        <div
          className="w-full flex items-center justify-center relative overflow-hidden bg-[var(--color-katha-l2)]"
          style={{ aspectRatio: ratio }}
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-katha-hi)]">
              {template.formatLabel}
            </span>
          </div>

          {/* Gilded inner border on hover to signify premium editorial feel */}
          <div className="absolute inset-0 border border-transparent group-hover:border-[#DCCBB5]/20 transition-colors duration-700 z-20 pointer-events-none" />
        </div>
        
        <div className="mt-5 flex justify-between items-baseline px-1 pb-1">
          <h3 className="font-display text-xl text-[var(--color-katha-hi)] tracking-tight">
            {template.name}
          </h3>
          <span className="font-mono text-[9px] uppercase text-[var(--color-katha-mut)] tracking-[0.2em]">
            {template.booth}
          </span>
        </div>

        {/* Hover reveal text using CSS Grid */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
          <div className="overflow-hidden">
            <p className="font-body text-[13px] text-[var(--color-katha-mut)] leading-relaxed mt-2 px-1 pb-1">
              {template.desc}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
