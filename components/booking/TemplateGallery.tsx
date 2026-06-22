"use client";

import { useState } from "react";
import { PRESETS, PhotoboothPreset } from "@/lib/templates";
import { TemplateCanvas } from "@/app/portal/[id]/template-design/TemplateDesignClient"; 

type TierFilter = "All styles" | "Classic" | "Katha Signature";
type FormatFilter = "All" | "Strip" | "Postcard";

interface TemplateGalleryProps {
  onSelectTemplate: (preset: PhotoboothPreset) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [tierFilter, setTierFilter] = useState<TierFilter>("All styles");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("All");

  const isSignature = (p: PhotoboothPreset) => p.name.includes("Signature");

  const filteredPresets = PRESETS.filter((p) => {
    if (tierFilter === "Classic" && isSignature(p)) return false;
    if (tierFilter === "Katha Signature" && !isSignature(p)) return false;
    if (formatFilter === "Strip" && p.type !== "strip") return false;
    if (formatFilter === "Postcard" && p.type === "strip") return false;
    return true;
  });

  return (
    <div className="min-h-[100dvh] w-full bg-[#EAE2D5] text-[#241E1A] font-sans selection:bg-[#8C382A] selection:text-[#EAE2D5]">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .living-specimen-group:hover .specimen-canvas > div > div:not([class]) {
            position: relative;
            overflow: hidden;
          }
          .living-specimen-group:hover .specimen-canvas > div > div:not([class])::after {
            content: '';
            position: absolute;
            top: 0; left: -150%; width: 100%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
            transform: skewX(-20deg);
            pointer-events: none;
            z-index: 10;
          }
          .living-specimen-group:hover .specimen-canvas > div > div:nth-child(1)::after {
            animation: shinePass 2.5s infinite;
            animation-delay: 0s;
          }
          .living-specimen-group:hover .specimen-canvas > div > div:nth-child(2)::after {
            animation: shinePass 2.5s infinite;
            animation-delay: 0.3s;
          }
          .living-specimen-group:hover .specimen-canvas > div > div:nth-child(3)::after {
            animation: shinePass 2.5s infinite;
            animation-delay: 0.6s;
          }
          .living-specimen-group:hover .specimen-canvas > div > div:nth-child(4)::after {
            animation: shinePass 2.5s infinite;
            animation-delay: 0.9s;
          }
          @keyframes shinePass {
            0% { left: -150%; }
            50% { left: 200%; }
            100% { left: 200%; }
          }
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 md:py-24 flex flex-col items-center">
        
        <header className="flex flex-col items-center mb-16 space-y-8 w-full">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-center text-[#241E1A]">
            Choose your style
          </h1>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-sans text-xs uppercase tracking-[0.18em] text-[#5A564E] mr-2">Tier</span>
              {(["All styles", "Classic", "Katha Signature"] as TierFilter[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  aria-pressed={tierFilter === t}
                  className={`px-4 py-2 font-sans text-xs uppercase tracking-[0.18em] transition-all duration-300 border ${
                    tierFilter === t 
                      ? "bg-[#C4B59D] text-[#241E1A] border-[#C4B59D]" 
                      : "bg-transparent text-[#5A564E] border-[#C4B59D] hover:bg-[#C4B59D]/20 hover:text-[#241E1A]"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-sans text-xs uppercase tracking-[0.18em] text-[#5A564E] mr-2">Format</span>
              {(["All", "Strip", "Postcard"] as FormatFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFormatFilter(f)}
                  aria-pressed={formatFilter === f}
                  className={`px-4 py-2 font-sans text-xs uppercase tracking-[0.18em] transition-all duration-300 border ${
                    formatFilter === f 
                      ? "bg-[#C4B59D] text-[#241E1A] border-[#C4B59D]" 
                      : "bg-transparent text-[#5A564E] border-[#C4B59D] hover:bg-[#C4B59D]/20 hover:text-[#241E1A]"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <div className="text-xs tracking-[0.18em] uppercase text-[#5A564E]">
              {filteredPresets.length} templates
            </div>
          </div>
        </header>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {tierFilter !== "Classic" && <h2 className="sr-only">The Signature Collection</h2>}
          {tierFilter !== "Katha Signature" && <h2 className="sr-only">The Classic Atelier</h2>}
          {filteredPresets.map((preset, idx) => {
            const signature = isSignature(preset);
            const w = preset.type === 'strip' ? 100 : preset.type === 'postcard-vertical' ? 160 : 240;
            const h = preset.type === 'strip' ? 300 : preset.type === 'postcard-vertical' ? 240 : 160;

            return (
              <div key={preset.id} className="flex flex-col group living-specimen-group">
                <button 
                  onClick={() => onSelectTemplate(preset)}
                  className="relative bg-transparent border-0 p-0 cursor-pointer w-full text-left"
                  aria-label="Explore details"
                >
                  <div className="relative w-full aspect-[2/3] bg-[#EAE2D5] flex items-center justify-center border border-[#C4B59D]/30 mb-6 overflow-hidden">
                    <div className="specimen-canvas transform scale-[0.6] sm:scale-[0.5] md:scale-[0.55] lg:scale-[0.6] origin-center transition-transform duration-700 ease-out group-hover:scale-[0.65]">
                      <TemplateCanvas
                        preset={preset}
                        width={w}
                        height={h}
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-[#EAE2D5]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#241E1A] border border-[#241E1A] px-6 py-3 bg-[#EAE2D5]">
                        Explore Details
                      </span>
                    </div>
                  </div>
                </button>

                <div className="flex flex-col border-t border-[#C4B59D]/50 pt-4 px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#5A564E] m-0 font-normal">
                      {signature ? "The Signature Collection" : "The Classic Atelier"}
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#5A564E]">
                      {preset.type.split("-")[0]}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif text-[#241E1A] tracking-tight truncate">
                    {preset.name}
                  </h3>
                  
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full shadow-inner border border-[#241E1A]/10" style={{ backgroundColor: preset.backgroundColor }} title="Background" />
                      <div className="w-3 h-3 rounded-full shadow-inner border border-[#241E1A]/10" style={{ backgroundColor: preset.slotBgColor }} title="Slot" />
                      <div className="w-3 h-3 rounded-full shadow-inner border border-[#241E1A]/10" style={{ backgroundColor: preset.textColor }} title="Text" />
                    </div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#5A564E]">
                      {preset.fontFamily.split(",")[0].replace(/['"]/g, '')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredPresets.length === 0 && (
          <div className="py-24 text-center border border-[#C4B59D] w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-[#241E1A] mb-4">No designs found</h3>
            <p className="text-[#5A564E] font-sans">
              Try adjusting your format or tier filters to see more options.
            </p>
            <button 
              onClick={() => { setTierFilter("All styles"); setFormatFilter("All"); }}
              className="mt-8 border border-[#241E1A] px-8 py-3 text-xs uppercase tracking-[0.18em] text-[#241E1A] hover:bg-[#241E1A] hover:text-[#EAE2D5] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
