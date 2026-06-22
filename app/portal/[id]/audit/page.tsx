"use client";

import React from "react";
import { PRESETS, renderDecorativeSvg, resolveLayout, getModifiedLayout, VIEWBOX, PhotoboothPreset } from "@/lib/templates";

const AUDIT_IDS = [
  "katha-editorial-void",
  "katha-heirloom-pina",
  "katha-loom-frame",
  "katha-knalum-night",
  "katha-woven-silk",
  "katha-tracy-prince",
  "katha-binakul-weave",
  "katha-capiz-sage",
  "wedding-luxe-gold",
  "rose-whisper",
  "wedding-warm-terracotta",
  "wedding-art-deco",
  "wedding-editorial",
  "wedding-vintage-lace",
  "wedding-royal-crest",
  "wedding-botanical-arch",
  "wedding-decked-monogram"
];

function tileDims(type: PhotoboothPreset["type"]) {
  if (type === "strip") return { w: 100, h: 300, vb: "0 0 600 1800" };
  if (type === "postcard-vertical") return { w: 200, h: 300, vb: "0 0 1200 1800" };
  return { w: 200, h: 133, vb: "0 0 1800 1200" };
}

function TemplateCanvas({
  preset,
  width,
  height,
  showText = false,
  names = "",
  date = "",
  venue = "",
  fontFamily = "",
  textPosition = "bottom",
}: {
  preset: PhotoboothPreset;
  width: number;
  height: number;
  showText?: boolean;
  names?: string;
  date?: string;
  venue?: string;
  fontFamily?: string;
  textPosition?: "bottom" | "top";
}) {
  const { vb } = tileDims(preset.type);
  const activeFont = fontFamily || preset.fontFamily;
  const isCursive = activeFont.toLowerCase().includes("cursive");
  const svg = renderDecorativeSvg(preset.id, preset.type, preset.textColor, preset.secondaryColor, preset.borderColor, textPosition);
  const rawLayout = resolveLayout(preset.layoutId, preset.type);
  const layout = getModifiedLayout(rawLayout, textPosition);
  const viewBox = VIEWBOX[preset.type];

  return (
    <div
      style={{ width, height, backgroundColor: preset.backgroundColor }}
      className="relative overflow-hidden shadow-md ring-1 ring-black/5"
    >
      {layout.slots.map((s: { x: number; y: number; w: number; h: number }, i: number) => {
        const left = (s.x / viewBox.w) * 100;
        const top = (s.y / viewBox.h) * 100;
        const w = (s.w / viewBox.w) * 100;
        const h = (s.h / viewBox.h) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${left}%`, top: `${top}%`, width: `${w}%`, height: `${h}%`,
              backgroundColor: preset.slotBgColor, border: `1px solid ${preset.borderColor}`, borderRadius: preset.slotBorderRadius,
            }}
          />
        );
      })}
      {(() => {
        const z = layout.textZone;
        const left = (z.x / viewBox.w) * 100;
        const top = (z.y / viewBox.h) * 100;
        const w = (z.w / viewBox.w) * 100;
        const h = (z.h / viewBox.h) * 100;
        return (
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{ left: `${left}%`, top: `${top}%`, width: `${w}%`, height: `${h}%`, color: preset.textColor }}
          >
            {showText && (
              <>
                <div style={{ fontFamily: activeFont, fontSize: Math.max(11, width * 0.11), lineHeight: 1.05 }} className={isCursive ? "normal-case" : "uppercase tracking-wide"}>
                  {names}
                </div>
                <div style={{ color: preset.secondaryColor, fontSize: Math.max(7, width * 0.05) }} className="uppercase tracking-widest mt-1">
                  {date}
                </div>
              </>
            )}
          </div>
        );
      })()}
      <svg viewBox={vb} className="absolute inset-0 w-full h-full pointer-events-none" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}

export default function AuditPage() {
  const auditPresets = AUDIT_IDS.map(id => PRESETS.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F5F3ED] p-12">
      <h1 className="text-4xl font-serif text-[#241E1A] mb-8 text-center uppercase tracking-widest">
        16 Unique Designs Visual Audit
      </h1>
      <p className="text-center text-[#5A564E] mb-12 max-w-2xl mx-auto">
        A diagnostic view of the 16 unique structural designs rendering via the unified layout engine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {auditPresets.map((preset) => (
          <div key={preset!.id} className="flex flex-col items-center">
            <div className="h-[400px] w-full flex items-center justify-center bg-[#EAE2D5] p-8 shadow-sm rounded-sm">
              <TemplateCanvas
                preset={preset!}
                width={preset!.type === "strip" ? 120 : 240}
                height={preset!.type === "postcard" ? 160 : 360}
                showText={true}
                names={preset!.titleText}
                date={preset!.subTitleText}
              />
            </div>
            <div className="mt-6 text-center">
              <h3 className="font-serif text-lg text-[#241E1A]">{preset!.name}</h3>
              <p className="text-xs text-[#8C382A] uppercase tracking-widest mt-2">{preset!.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
