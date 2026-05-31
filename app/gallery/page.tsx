"use client";

// ----------------------------------------------------------------------
// CLIENT-FACING TEMPLATE GALLERY
// Vibe-first: clients browse text-free design thumbnails, pick a style,
// then personalize (names / date / venue). Reads from lib/templates —
// the SAME source the studio + export use, so what they pick == what
// gets produced. No design controls are exposed here.
// ----------------------------------------------------------------------

import React, { useState, useMemo } from "react";
import { PRESETS, renderDecorativeSvg, type PhotoboothPreset } from "@/lib/templates";

type TierFilter = "all" | "signature" | "classic";

const isSignature = (p: PhotoboothPreset) => p.id.startsWith("katha-");

// Dimensions per layout type, normalized to a 300px-tall tile.
function tileDims(type: PhotoboothPreset["type"]) {
  if (type === "strip") return { w: 100, h: 300, vb: "0 0 600 1800", slots: 3, dir: "col" as const };
  if (type === "postcard-vertical") return { w: 200, h: 300, vb: "0 0 1200 1800", slots: 2, dir: "col" as const };
  return { w: 200, h: 133, vb: "0 0 1800 1200", slots: 3, dir: "row" as const };
}

// A faithful, text-optional render of a template — mirrors the studio
// preview structure (full-bleed decoration SVG + padded photo slots).
function TemplateCanvas({
  preset,
  width,
  height,
  showText = false,
  names = "",
  date = "",
  venue = "",
}: {
  preset: PhotoboothPreset;
  width: number;
  height: number;
  showText?: boolean;
  names?: string;
  date?: string;
  venue?: string;
}) {
  const { vb, slots, dir } = tileDims(preset.type);
  const isCursive = preset.fontFamily.toLowerCase().includes("cursive");
  const svg = renderDecorativeSvg(preset.id, preset.type, preset.textColor, preset.secondaryColor, preset.borderColor, "bottom");

  return (
    <div
      style={{ width, height, backgroundColor: preset.backgroundColor }}
      className="relative overflow-hidden shadow-md ring-1 ring-black/5"
    >
      {/* Full-bleed decoration — single source of truth */}
      <svg
        viewBox={vb}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {/* Padded content area: photo slots + optional text */}
      <div className="absolute inset-0 flex flex-col" style={{ padding: "7%" }}>
        <div
          className="flex flex-1 min-h-0"
          style={{ flexDirection: dir === "row" ? "row" : "column", gap: "6%" }}
        >
          {Array.from({ length: slots }).map((_, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                backgroundColor: preset.slotBgColor,
                border: `1px solid ${preset.borderColor}`,
                borderRadius: preset.slotBorderRadius,
              }}
            />
          ))}
        </div>
        {showText && (
          <div className="text-center mt-[6%] shrink-0" style={{ color: preset.textColor }}>
            <div
              style={{ fontFamily: preset.fontFamily, fontSize: Math.max(11, width * 0.11), lineHeight: 1.05 }}
              className={isCursive ? "normal-case" : "uppercase tracking-wide"}
            >
              {names || "Your Names"}
            </div>
            {date && (
              <div style={{ color: preset.secondaryColor, fontSize: Math.max(7, width * 0.05) }} className="uppercase tracking-widest mt-1">
                {date}
              </div>
            )}
            {venue && (
              <div style={{ fontSize: Math.max(6, width * 0.042) }} className="uppercase tracking-widest mt-0.5 opacity-80">
                {venue}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [tier, setTier] = useState<TierFilter>("all");
  const [selected, setSelected] = useState<PhotoboothPreset | null>(null);

  // Personalization fields (stage 2)
  const [nameOne, setNameOne] = useState("");
  const [nameTwo, setNameTwo] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const filtered = useMemo(() => {
    if (tier === "signature") return PRESETS.filter(isSignature);
    if (tier === "classic") return PRESETS.filter((p) => !isSignature(p));
    return PRESETS;
  }, [tier]);

  const names = [nameOne.trim(), nameTwo.trim()].filter(Boolean).join("  &  ");

  const openTemplate = (p: PhotoboothPreset) => {
    setSelected(p);
    setNameOne("");
    setNameTwo("");
    setDate("");
    setVenue("");
    setConfirmed(false);
  };

  const confirmSelection = () => {
    if (!selected) return;
    const payload = {
      templateId: selected.id,
      templateName: selected.name,
      layout: selected.type,
      names: names || null,
      date: date.trim() || null,
      venue: venue.trim() || null,
      selectedAt: new Date().toISOString(),
    };
    // No backend yet — persist locally so the admin/studio can pick it up.
    // When Honeybook/Zapier is wired, POST this payload to /api/selection.
    try {
      const prev = JSON.parse(localStorage.getItem("katha_selections") || "[]");
      localStorage.setItem("katha_selections", JSON.stringify([payload, ...prev].slice(0, 50)));
    } catch {}
    setConfirmed(true);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EAE2D5", color: "#241E1A" }}>
      {/* Header */}
      <header className="px-6 md:px-12 py-10 text-center border-b" style={{ borderColor: "#C4B59D" }}>
        <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "#9C958A" }}>
          Katha Photo Booth
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.01em" }}>
          Choose your style
        </h1>
        <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: "#5A5D5A" }}>
          Browse our template library and choose the one that feels like you. We&apos;ll personalize the details together.
        </p>

        {/* Tier filter */}
        <div className="mt-7 inline-flex rounded-full p-1" style={{ backgroundColor: "#E0D7C7" }}>
          {([
            ["all", "All styles"],
            ["classic", "Classic"],
            ["signature", "Katha Signature"],
          ] as [TierFilter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTier(key)}
              className="px-4 py-1.5 text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer"
              style={
                tier === key
                  ? { backgroundColor: "#241E1A", color: "#EAE2D5" }
                  : { color: "#5A5D5A" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Gallery grid */}
      <section className="px-6 md:px-12 py-12">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {filtered.map((p) => {
            const d = tileDims(p.type);
            return (
              <button
                key={p.id}
                onClick={() => openTemplate(p)}
                className="group flex flex-col items-center cursor-pointer"
                style={{ width: 200 }}
              >
                <div className="h-[300px] flex items-end justify-center transition-transform duration-300 group-hover:-translate-y-1">
                  <TemplateCanvas preset={p} width={d.w} height={d.h} />
                </div>
                <div className="mt-4 text-center">
                  <div className="text-[13px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {p.name.replace("Katha Signature — ", "")}
                  </div>
                  {isSignature(p) && (
                    <div className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: "#8C382A" }}>
                      Katha Signature
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Personalization modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(26,24,22,0.55)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
            style={{ backgroundColor: "#FBF9F5" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-2xl leading-none cursor-pointer"
              style={{ color: "#5A5D5A" }}
              aria-label="Close"
            >
              ×
            </button>

            {confirmed ? (
              <div className="px-8 py-16 text-center">
                <div className="text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Thank you</div>
                <p className="mt-3 text-sm max-w-sm mx-auto" style={{ color: "#5A5D5A" }}>
                  Your choice of <strong>{selected.name.replace("Katha Signature — ", "")}</strong> has been saved.
                  Katha will reach out to finalize the details and send your proof.
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-8 px-6 py-2 text-xs uppercase tracking-widest rounded-full cursor-pointer"
                  style={{ backgroundColor: "#241E1A", color: "#EAE2D5" }}
                >
                  Back to gallery
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Live preview */}
                <div className="flex items-center justify-center">
                  <TemplateCanvas
                    preset={selected}
                    width={selected.type === "strip" ? 150 : 260}
                    height={selected.type === "strip" ? 450 : selected.type === "postcard-vertical" ? 390 : 173}
                    showText
                    names={names}
                    date={date}
                    venue={venue}
                  />
                </div>

                {/* Personalize form */}
                <div className="flex flex-col">
                  <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "#9C958A" }}>
                    {isSignature(selected) ? "Katha Signature" : "Classic Collection"}
                  </p>
                  <h2 className="mt-2 text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {selected.name.replace("Katha Signature — ", "")}
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#5A5D5A" }}>
                    {selected.designerExplanation}
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={nameOne} onChange={(e) => setNameOne(e.target.value)} placeholder="First name"
                        className="border px-3 py-2 text-sm rounded-sm bg-white focus:outline-none" style={{ borderColor: "#C4B59D" }} />
                      <input value={nameTwo} onChange={(e) => setNameTwo(e.target.value)} placeholder="Second name"
                        className="border px-3 py-2 text-sm rounded-sm bg-white focus:outline-none" style={{ borderColor: "#C4B59D" }} />
                    </div>
                    <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Event date (e.g. July 25, 2026)"
                      className="w-full border px-3 py-2 text-sm rounded-sm bg-white focus:outline-none" style={{ borderColor: "#C4B59D" }} />
                    <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue / location"
                      className="w-full border px-3 py-2 text-sm rounded-sm bg-white focus:outline-none" style={{ borderColor: "#C4B59D" }} />
                  </div>

                  <button
                    onClick={confirmSelection}
                    className="mt-6 w-full py-3 text-xs uppercase tracking-[0.2em] rounded-full cursor-pointer transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#8C382A", color: "#EAE2D5" }}
                  >
                    Choose this style
                  </button>
                  <p className="mt-3 text-[11px] text-center" style={{ color: "#9C958A" }}>
                    Details can be adjusted later — this just reserves your design.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
