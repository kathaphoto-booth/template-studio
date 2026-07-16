"use client";

import { motion, useReducedMotion } from "motion/react";
import { PlateThumb, plateAspect } from "./PlateThumb";

export function TemplateCard({ template, index }: { template: any; index: number }) {
  const reduce = useReducedMotion();

  if (template.isFootnote) {
    return null;
  }

  // Prefer the true canvas aspect from the layout registry; hand-typed
  // ratio is only the fallback for plates without a registered layout.
  const ratio =
    plateAspect(template) ??
    (template.ratio ? `${template.ratio.w} / ${template.ratio.h}` : "2 / 3");

  return (
    <motion.div
      // `initial` must NOT branch on useReducedMotion() — it is false during
      // SSR, so the server HTML and a reduce-enabled client disagree and React
      // reports a hydration mismatch. Keep initial stable; collapse the
      // transition to instant under reduce (content force-reveals in view).
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduce ? 0 : 1.25,
        delay: reduce ? 0 : (index % 4) * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="break-inside-avoid mb-6 relative group cursor-pointer"
    >
      <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3 transition-colors duration-500 ease-out hover:border-[color:var(--color-katha-gilt)]/30 hover:shadow-[0_20px_40px_var(--color-katha-shadow)]">
        <div
          className="w-full relative overflow-hidden bg-[var(--color-katha-l2)]"
          style={{ aspectRatio: ratio }}
        >
          {/* Faithful miniature: layout-registry geometry + the plate's own paint */}
          <PlateThumb template={template} />

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Plate ordinal + format, revealed on hover over the darkened base */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-katha-hi)]">
              {template.plate ? `Plate ${template.plate} — ` : ""}{template.formatLabel}
            </span>
          </div>

          {/* Gilded inner border on hover to signify the held standard */}
          <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--color-katha-gilt)]/20 transition-colors duration-700 z-20 pointer-events-none" />
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
