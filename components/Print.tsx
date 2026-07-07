"use client";

import { resolveLayout, VIEWBOX, FORMAT_MARGIN } from "@/lib/layouts";

function getCanonicalLayoutId(legacyId: string | undefined, format: string): string {
  if (!legacyId) return "";
  if (legacyId === "strip3") return "strip-3";
  if (legacyId === "strip4") return "strip-4";
  if (legacyId === "strip2") {
    return format === "strip" ? "strip-2" : "pv-2";
  }
  if (legacyId === "land2") return "pc-2-split";
  if (legacyId === "land3") return "pc-3-v";
  if (legacyId === "twinsq") return "pc-2-sq";
  return legacyId;
}

export function Print({ t, height = 200, overrides = {} }: { t: any, height?: number, overrides?: { layout?: string, name?: string, sub?: string, ratio?: {w: number, h: number}, ink?: string, paper?: string, slot?: string, edge?: string, accent?: string } }) {
  const ratio = overrides.ratio || t.ratio;
  const name = overrides.name !== undefined ? overrides.name : t.sName;
  const sub = overrides.sub !== undefined ? overrides.sub : t.sSub;
  const ink = overrides.ink !== undefined ? overrides.ink : t.ink;
  const paper = overrides.paper !== undefined ? overrides.paper : t.paper;
  const slot = overrides.slot !== undefined ? overrides.slot : t.slot;
  const edge = overrides.edge !== undefined ? overrides.edge : t.edge;
  const accent = overrides.accent !== undefined ? overrides.accent : t.accent;

  const w = ratio?.w || 1;
  const h = ratio?.h || 3;
  
  let format: "strip" | "postcard-vertical" | "postcard" = "strip";
  if (w > h) {
    format = "postcard";
  } else if (w === 2 && h === 3) {
    format = "postcard-vertical";
  }

  const viewBox = VIEWBOX[format] || { w: 600, h: 1800 };
  const H = height;
  const W = Math.round(H * viewBox.w / viewBox.h);
  const scale = H / viewBox.h;

  const layoutId = getCanonicalLayoutId(overrides.layout || t.layout, format);
  const resolvedLayout = resolveLayout(layoutId, format);
  
  const slots = resolvedLayout.slots.map((s: any) => ({
    x: s.x * scale,
    y: s.y * scale,
    w: s.w * scale,
    h: s.h * scale,
  }));

  const tz = resolvedLayout.textZone;
  const scaledTz = {
    x: tz.x * scale,
    y: tz.y * scale,
    w: tz.w * scale,
    h: tz.h * scale,
  };

  const margin = FORMAT_MARGIN[format] || 60;
  const scaledMargin = margin * scale;

  return (
    <div className="pw" style={{ 
      width: W, height: H, flexShrink: 0, background: paper, position: "relative", 
      boxShadow: "0 20px 50px rgba(0,0,0,0.75), 0 4px 12px rgba(0,0,0,0.45)", 
      transition: "box-shadow .45s cubic-bezier(.16,1,.3,1)" 
    }}>
      {/* Dynamic Sombra Twin shadow elements */}
      {t.id === "sombra-twin" && slots.map((s: any, i: number) => (
        <div key={`shadow-${i}`} style={{ 
          position: "absolute", 
          left: s.x + 3 * scale, 
          top: s.y + 3 * scale, 
          width: s.w, 
          height: s.h,
          background: "rgba(0,0,0,0.06)", 
          zIndex: 1,
          pointerEvents: "none"
        }}/>
      ))}

      {/* Dynamic Photo Slots */}
      {slots.map((s: any, i: number) => (
        <div key={i} style={{ 
          position: "absolute", 
          left: s.x, 
          top: s.y, 
          width: s.w, 
          height: s.h,
          backgroundColor: slot, 
          border: `1px solid ${edge}`,
          boxSizing: "border-box",
          zIndex: 2
        }}/>
      ))}

      {/* Double line Champagne Frame or Calado Piña borders */}
      {(t.id === "champagne-frame" || t.id === "calado-pina" || t.id === "katha-heirloom-pina" || t.id === "katha-heritage-frame") && (
        <>
          <div style={{ 
            position: "absolute", 
            left: scaledMargin / 3, 
            top: scaledMargin / 3, 
            width: W - (2 * scaledMargin / 3), 
            height: H - (2 * scaledMargin / 3), 
            border: `1px solid ${edge}`, 
            opacity: 0.65,
            pointerEvents: "none",
            zIndex: 3
          }}/>
          <div style={{ 
            position: "absolute", 
            left: (scaledMargin / 3) + (8 * scale), 
            top: (scaledMargin / 3) + (8 * scale), 
            width: W - (2 * scaledMargin / 3) - (16 * scale), 
            height: H - (2 * scaledMargin / 3) - (16 * scale), 
            border: `0.5px solid ${edge}`, 
            opacity: 0.35,
            pointerEvents: "none",
            zIndex: 3
          }}/>
        </>
      )}

      {/* Bituin Accent Line */}
      {t.id === "bituin" && (
        <div style={{ 
          position: "absolute", 
          left: scaledMargin, 
          width: W - 2 * scaledMargin, 
          top: scaledTz.y - 12 * scale, 
          height: `${Math.max(1, Math.round(1.5 * scale))}px`, 
          background: accent, 
          opacity: 0.8,
          zIndex: 3 
        }}/>
      )}

      {/* Centered Typography Zone */}
      {scaledTz.h > 0 && (
        <div style={{ 
          position: "absolute", 
          left: scaledTz.x, 
          top: scaledTz.y, 
          width: scaledTz.w, 
          height: scaledTz.h, 
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          transition: "all 0.3s ease",
          zIndex: 4,
          padding: `0 ${4 * scale}px`,
          boxSizing: "border-box"
        }}>
          <p style={{ 
            fontFamily: t.fontFamily || t.font || "var(--font-display)", 
            fontSize: `${Math.max(6, Math.round(scaledTz.h * 0.16))}px`, 
            color: ink, 
            letterSpacing: t.font === "Newsreader" ? "0.1em" : "0.04em", 
            fontStyle: t.font === "Cormorant" || t.font === "Cormorant Garamond" ? "italic" : "normal",
            lineHeight: "1.15",
            marginBottom: `${Math.max(2, Math.round(scaledTz.h * 0.05))}px`
          }}>{name}</p>
          <p style={{ 
            fontFamily: "var(--font-mono)", 
            fontSize: `${Math.max(4.5, Math.round(scaledTz.h * 0.085))}px`, 
            color: accent, 
            letterSpacing: "0.14em" 
          }}>{sub}</p>
        </div>
      )}
    </div>
  );
}
