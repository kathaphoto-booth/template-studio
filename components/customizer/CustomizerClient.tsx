"use client";

import React, { useState } from "react";
import LivePreview from "./LivePreview";
import content from "@/lib/content.json";
import { LAYOUTS } from "@/lib/layouts";

export default function CustomizerClient({ leadId }: { leadId: string }) {
  const templates = content.templates;
  const palettes = content.palettes;

  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [activePalette, setActivePalette] = useState(palettes[0]);
  const [layoutId, setLayoutId] = useState(templates[0].layout);
  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    venue: "",
  });

  const availableLayouts = Object.values(LAYOUTS).filter(
    (l) => l.format === LAYOUTS[activeTemplate.layout].format
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#110F0D]">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[400px] flex-shrink-0 bg-[#1A1714] border-r border-[#241F1B] overflow-y-auto z-10 flex flex-col relative shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
        <div className="p-8 pb-4">
          <p className="text-xs tracking-widest text-[#A39B8E] uppercase mb-2">
            // Studio Customizer
          </p>
          <h1 className="text-2xl font-light text-[#E8E1D3] mb-2 font-display">
            Design Your Card.
          </h1>
          <p className="text-sm text-[#857D71]">
            Compose the text layers and pick a physical paper hue. Live proof updates instantly.
          </p>
        </div>

        <div className="flex-1 p-8 space-y-10">
          {/* Template Selection */}
          <section>
            <h2 className="text-[10px] tracking-widest text-[#A39B8E] uppercase mb-4">Base Template</h2>
            <div className="grid grid-cols-2 gap-3">
              {templates.filter(t => !t.isFootnote).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTemplate(t);
                    setLayoutId(t.layout);
                  }}
                  className={`text-left p-3 border transition-all duration-300 ${
                    activeTemplate.id === t.id
                      ? "border-[#DCCBB5] bg-[#241F1B]"
                      : "border-[#2E2722] hover:border-[#A39B8E] hover:bg-[#241F1B]"
                  }`}
                >
                  <p className="text-xs text-[#E8E1D3] font-medium">{t.name}</p>
                  <p className="text-[10px] text-[#857D71] mt-1">{t.formatLabel}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Layout Selection */}
          <section>
            <h2 className="text-[10px] tracking-widest text-[#A39B8E] uppercase mb-4">Layout Variation</h2>
            <div className="grid grid-cols-2 gap-3">
              {availableLayouts.map((l: any) => (
                <button
                  key={l.id}
                  onClick={() => setLayoutId(l.id)}
                  className={`text-left p-3 border transition-all duration-300 ${
                    layoutId === l.id
                      ? "border-[#DCCBB5] bg-[#241F1B]"
                      : "border-[#2E2722] hover:border-[#A39B8E] hover:bg-[#241F1B]"
                  }`}
                >
                  <p className="text-xs text-[#E8E1D3] font-medium">{l.label}</p>
                  <p className="text-[10px] text-[#857D71] mt-1">{l.slotCount} Slots</p>
                </button>
              ))}
            </div>
          </section>

          {/* Palette Selection */}
          <section>
            <h2 className="text-[10px] tracking-widest text-[#A39B8E] uppercase mb-4">Paper & Ink Palette</h2>
            <div className="space-y-2">
              {palettes.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActivePalette(p)}
                  className={`w-full flex items-center justify-between p-3 border transition-all duration-300 ${
                    activePalette.key === p.key
                      ? "border-[#DCCBB5] bg-[#241F1B]"
                      : "border-[#2E2722] hover:border-[#A39B8E] hover:bg-[#241F1B]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-5 h-5 rounded-full shadow-inner border border-black/20" 
                      style={{ backgroundColor: p.bg }}
                    />
                    <span className="text-xs text-[#E8E1D3]">{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Text Controls */}
          <section className="space-y-4">
            <h2 className="text-[10px] tracking-widest text-[#A39B8E] uppercase mb-2">Typography Setup</h2>
            
            <div>
              <label className="block text-[10px] text-[#A39B8E] uppercase mb-1">Primary Title</label>
              <input
                type="text"
                placeholder="e.g., LORENZO & CORAZON"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full bg-transparent border-b border-[#2E2722] focus:border-[#DCCBB5] py-2 text-sm text-[#E8E1D3] placeholder-[#857D71] outline-none transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#A39B8E] uppercase mb-1">Subtitle / Date</label>
              <input
                type="text"
                placeholder="e.g., OCTOBER 15, 2026"
                value={formState.subtitle}
                onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                className="w-full bg-transparent border-b border-[#2E2722] focus:border-[#DCCBB5] py-2 text-sm text-[#E8E1D3] placeholder-[#857D71] outline-none transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#A39B8E] uppercase mb-1">Venue / Location</label>
              <input
                type="text"
                placeholder="e.g., LOS ANGELES"
                value={formState.venue}
                onChange={(e) => setFormState({ ...formState, venue: e.target.value })}
                className="w-full bg-transparent border-b border-[#2E2722] focus:border-[#DCCBB5] py-2 text-sm text-[#E8E1D3] placeholder-[#857D71] outline-none transition-colors duration-300"
              />
            </div>
          </section>
        </div>

        <div className="p-8 pt-4 bg-[#1A1714] border-t border-[#241F1B]">
          <button className="w-full bg-[#E8E1D3] text-[#110F0D] py-4 text-xs font-semibold tracking-widest uppercase hover:bg-[#DCCBB5] transition-colors duration-300">
            Finalize Custom Design
          </button>
        </div>
      </aside>

      {/* Live Preview Area */}
      <main className="flex-1 relative bg-[#110F0D] flex items-center justify-center p-8 overflow-hidden">
        {/* Subtle grid background for the studio environment */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjMyLCAyMjUsIDIxMSwgMC4wNSkiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />
        
        <LivePreview
          template={activeTemplate}
          layoutId={layoutId}
          palette={activePalette}
          title={formState.title}
          subtitle={formState.subtitle}
          venue={formState.venue}
        />
      </main>
    </div>
  );
}
