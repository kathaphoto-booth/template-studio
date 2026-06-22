"use client";

import { Check } from "lucide-react";
import { SERVICE_TIERS } from "@/lib/serviceTiers";
import type { ServiceTierId } from "@/lib/serviceTiers";

interface ServiceTierCardsProps {
  selectedTierId?: ServiceTierId | null;
  onSelectTier: (id: ServiceTierId) => void;
}

export function ServiceTierCards({
  selectedTierId,
  onSelectTier,
}: ServiceTierCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full max-w-5xl mx-auto">
      {SERVICE_TIERS.map((tier) => {
        const isSelected = selectedTierId === tier.id;
        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelectTier(tier.id)}
            className={`
              relative flex flex-col text-left p-6 md:p-8 transition-all duration-300
              bg-[#EAE2D5] border outline-none
              ${
                isSelected
                  ? "border-[#241E1A] ring-1 ring-[#241E1A]"
                  : "border-[#C4B59D] hover:border-[#241E1A]/40 focus:ring-2 focus:ring-[#241E1A] focus:border-[#241E1A]"
              }
            `}
            style={{ borderRadius: 0 }}
          >
            <div className="flex justify-between items-start w-full mb-3">
              <h3 className="text-xl md:text-2xl text-[#241E1A] font-serif tracking-tight pr-4">
                {tier.name}
              </h3>
              <span className="text-lg md:text-xl text-[#241E1A] font-serif shrink-0">
                ${tier.price}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="uppercase tracking-[0.18em] text-[10px] text-[#5A564E] font-sans">
                {tier.material} Hardware
              </span>
              {tier.id === "editorial-oak" && (
                <>
                  <span className="w-[3px] h-[3px] bg-[#C4B59D]" />
                  <span className="uppercase tracking-[0.18em] text-[10px] text-[#5A564E] font-sans font-medium">
                    Flagship
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-[#5A564E] font-sans leading-relaxed mb-8">
              {tier.narrative}
            </p>

            <ul className="space-y-3 mt-auto border-t border-[#C4B59D]/40 pt-6 w-full">
              {tier.inclusions.map((inclusion, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-xs text-[#5A564E] font-sans"
                >
                  <Check className="w-3 h-3 mr-3 mt-[2px] shrink-0 text-[#C4B59D]" strokeWidth={1.5} aria-hidden="true" />
                  <span className="leading-snug">{inclusion}</span>
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
