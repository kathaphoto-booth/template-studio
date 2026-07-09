"use client";

import React from "react";
import { LAYOUTS, VIEWBOX } from "@/lib/layouts";

interface LivePreviewProps {
  template: any;
  layoutId: string;
  palette: any;
  title: string;
  subtitle: string;
  venue: string;
}

export default function LivePreview({
  template,
  layoutId,
  palette,
  title,
  subtitle,
  venue,
}: LivePreviewProps) {
  // Resolve layout
  let layout = LAYOUTS[layoutId];
  if (!layout) {
    layout = LAYOUTS["strip-3"]; // fallback
  }

  const viewBoxDef = VIEWBOX[layout.format];
  if (!viewBoxDef) return null;

  const { w, h } = viewBoxDef;
  
  // Choose standard font stack mapping based on template.font if desired, 
  // or default to a nice display serif for title and sans-serif for subtitles.
  // Using generic fallbacks for safety if fonts aren't perfectly matched.
  const displayFont = template.font === "Fraunces" || template.font === "Cormorant Garamond" 
    ? `'${template.font}', serif` 
    : `'FH Ronaldson Display', 'Playfair Display', serif`;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="max-h-full max-w-full drop-shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: palette.bg,
          color: palette.text,
          aspectRatio: `${w} / ${h}`
        }}
      >
        {/* Subtle noise texture filter definition */}
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.05 0" />
          </filter>
        </defs>
        
        {/* Paper Background */}
        <rect width={w} height={h} fill={palette.bg} />
        
        {/* Subtle Grain Overlay */}
        <rect width={w} height={h} fill="none" style={{ filter: "url(#grain)" }} className="opacity-40 mix-blend-multiply pointer-events-none" />

        {/* Photo Slots */}
        {layout.slots.map((slot: any, i: number) => (
          <g key={i}>
            <rect
              x={slot.x}
              y={slot.y}
              width={slot.w}
              height={slot.h}
              fill={palette.slot}
              stroke={palette.stroke || palette.text}
              strokeWidth={template.style === "Classic" ? 2 : 0}
            />
            {/* Inner frame styling for some templates */}
            {template.style === "Signature" && (
              <rect
                x={slot.x - 4}
                y={slot.y - 4}
                width={slot.w + 8}
                height={slot.h + 8}
                fill="none"
                stroke={palette.stroke || palette.sub}
                strokeWidth={1}
                strokeOpacity={0.3}
              />
            )}
          </g>
        ))}

        {/* Text Zone Branding Pedestal */}
        {layout.textZone && (
          <g transform={`translate(${layout.textZone.x}, ${layout.textZone.y})`}>
            {/* The textZone rect itself is for positioning, not drawn, but we can visualize it for debug or bounding */}
            {/* <rect width={layout.textZone.w} height={layout.textZone.h} fill="rgba(255,0,0,0.1)" /> */}
            
            <text
              x={layout.textZone.w / 2}
              y={layout.textZone.h * 0.45}
              textAnchor="middle"
              fill={palette.text}
              fontFamily={displayFont}
              fontSize={layout.format === 'strip' ? 38 : 54}
              letterSpacing="0.08em"
              className="uppercase"
            >
              {title || template.sName}
            </text>
            
            <text
              x={layout.textZone.w / 2}
              y={layout.textZone.h * 0.65}
              textAnchor="middle"
              fill={palette.sub}
              fontFamily="'Outfit', sans-serif"
              fontSize={layout.format === 'strip' ? 16 : 22}
              letterSpacing="0.15em"
              className="uppercase"
            >
              {subtitle || template.sSub}
            </text>

            {(venue || (template.sSub && template.sSub.includes("·"))) && (
               <text
                 x={layout.textZone.w / 2}
                 y={layout.textZone.h * 0.8}
                 textAnchor="middle"
                 fill={palette.sub}
                 fontFamily="'Outfit', sans-serif"
                 fontSize={layout.format === 'strip' ? 14 : 18}
                 letterSpacing="0.1em"
                 className="uppercase opacity-70"
               >
                 {venue || "LOS ANGELES, CA"}
               </text>
            )}
            
            {/* Small decorative separator or line */}
            <line 
              x1={layout.textZone.w / 2 - 30} 
              y1={layout.textZone.h * 0.52} 
              x2={layout.textZone.w / 2 + 30} 
              y2={layout.textZone.h * 0.52} 
              stroke={palette.sub} 
              strokeWidth={1}
              strokeOpacity={0.4}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
