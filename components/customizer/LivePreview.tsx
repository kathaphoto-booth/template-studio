"use client";

import React, { useRef, useEffect } from "react";
import { getLayout, getModifiedLayout, VIEWBOX } from "@/lib/layouts";
import { announce, prefersReducedData } from "@/lib/a11y";

interface LivePreviewProps {
  template: any;
  layoutId: string;
  palette: any;
  title: string;
  subtitle: string;
  venue: string;
  textPosition?: "bottom" | "top";
  simple?: boolean;
  proofText?: string;
}

const MAX_TILT_DEG = 5; // motion law ceiling is 6°
const RETURN_MS = 1200; // damped return floor

// Display-only truncation. The full inscription still rides in the finalize
// payload (CustomizerClient sends cz.state.*), so nothing is lost on submit.
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export default function LivePreview({
  template,
  layoutId,
  palette,
  title,
  subtitle,
  venue,
  textPosition = "bottom",
  simple = false,
  proofText,
}: LivePreviewProps) {
  const plateRef = useRef<HTMLDivElement>(null);

  // Announce the derived proof sentence, debounced, so a screen reader hears the
  // change without a burst on every keystroke. No-op until a LiveRegion mounts.
  useEffect(() => {
    if (!proofText) return;
    const id = setTimeout(() => announce(proofText), 300);
    return () => clearTimeout(id);
  }, [proofText]);

  // Grain is decorative texture, not legibility — gate it on the perf/comfort
  // signals (Simple view or reduced-data), never on the accessibility baseline.
  const showGrain = !simple && !prefersReducedData();

  // Resolve layout, then flip the text zone if the inscription sits on top.
  const base = getLayout(layoutId) ?? getLayout("strip-3")!;
  const layout = getModifiedLayout(base, textPosition);

  const viewBoxDef = VIEWBOX[layout.format as keyof typeof VIEWBOX];
  if (!viewBoxDef) return null;

  const { w, h } = viewBoxDef;

  const displayFont =
    template.font === "Fraunces" || template.font === "Cormorant Garamond"
      ? `'${template.font}', serif`
      : `'FH Ronaldson Display', 'Playfair Display', serif`;

  // 3D tilt within the Quiet-Luxury law: ≤5°, damped return ≥1.2s with the
  // extreme-deceleration curve, fully inert under prefers-reduced-motion.
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = plateRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const xc = (e.clientX - rect.left) / rect.width - 0.5;
    const yc = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = "none"; // live-follow while the pointer moves
    el.style.transform = `perspective(1100px) rotateX(${(-yc * MAX_TILT_DEG * 2).toFixed(2)}deg) rotateY(${(xc * MAX_TILT_DEG * 2).toFixed(2)}deg)`;
  }

  function onPointerLeave() {
    const el = plateRef.current;
    if (!el) return;
    el.style.transition = `transform ${RETURN_MS}ms cubic-bezier(0.16,1,0.3,1)`;
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8">
      <div
        ref={plateRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="max-h-full max-w-full will-change-transform"
        style={{ aspectRatio: `${w} / ${h}`, height: "100%" }}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="max-h-full max-w-full drop-shadow-2xl"
          style={{
            backgroundColor: palette.bg,
            color: palette.text,
            aspectRatio: `${w} / ${h}`,
          }}
          role="img"
          aria-label={`Live proof of ${template.name} on ${palette.name} paper`}
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

          {/* Subtle Grain Overlay — perf-gated (Simple view / reduced-data drop it) */}
          {showGrain && (
            <rect width={w} height={h} fill="none" style={{ filter: "url(#grain)" }} className="opacity-40 mix-blend-multiply pointer-events-none" />
          )}

          {/* Photo Slots — empty by design: this is where the night's booth
              photos will print. Never filled with stock. */}
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

          {/* Plate-registry stamp — the maker's mark of the archive */}
          {template.plate && (
            <text
              x={w - 24}
              y={h - 24}
              textAnchor="end"
              fill={palette.sub}
              fontFamily="'Courier Prime', monospace"
              fontSize={layout.format === "strip" ? 11 : 14}
              letterSpacing="0.18em"
              opacity={0.55}
              className="uppercase"
            >
              {`PLATE ${template.plate} · KTHA`}
            </text>
          )}

          {/* Text Zone Branding Pedestal */}
          {layout.textZone && (
            <g transform={`translate(${layout.textZone.x}, ${layout.textZone.y})`}>
              <text
                x={layout.textZone.w / 2}
                y={layout.textZone.h * 0.45}
                textAnchor="middle"
                fill={palette.text}
                fontFamily={displayFont}
                fontSize={layout.format === "strip" ? (simple ? 44 : 38) : (simple ? 62 : 54)}
                letterSpacing="0.08em"
                className="uppercase"
              >
                {clip(title || template.sName || "", 28)}
              </text>

              <text
                x={layout.textZone.w / 2}
                y={layout.textZone.h * 0.65}
                textAnchor="middle"
                fill={palette.sub}
                fontFamily="'Courier Prime', monospace"
                fontSize={layout.format === "strip" ? (simple ? 18 : 16) : (simple ? 25 : 22)}
                letterSpacing="0.15em"
                className="uppercase"
              >
                {clip(subtitle || template.sSub || "", 32)}
              </text>

              {venue && (
                <text
                  x={layout.textZone.w / 2}
                  y={layout.textZone.h * 0.8}
                  textAnchor="middle"
                  fill={palette.sub}
                  fontFamily="'Courier Prime', monospace"
                  fontSize={layout.format === "strip" ? 14 : 18}
                  letterSpacing="0.1em"
                  className="uppercase opacity-70"
                >
                  {clip(venue, 32)}
                </text>
              )}

              {/* Small decorative separator */}
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
    </div>
  );
}
