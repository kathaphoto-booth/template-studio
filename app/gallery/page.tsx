"use client";

// ----------------------------------------------------------------------
// CLIENT-FACING TEMPLATE GALLERY
// Vibe-first: clients browse text-free design thumbnails, pick a style,
// then personalize (names / date / venue). Reads from lib/templates —
// the SAME source the studio + export use, so what they pick == what
// gets produced. No design controls are exposed here.
// ----------------------------------------------------------------------

import React, { useState, useMemo } from "react";
import { PRESETS, renderDecorativeSvg, type PhotoboothPreset, resolveLayout, VIEWBOX, LUXURY_FONTS } from "@/lib/templates";

type TierFilter = "all" | "signature" | "classic";
type FormatFilter = "all" | "strip" | "postcard-vertical" | "postcard";

// Use the public name as the signature signal — covers ids like
// "heirloom-pina-postcard" that don't start with "katha-" but still
// belong to the Signature tier.
const isSignature = (p: PhotoboothPreset) => p.name.includes("Katha Signature");

// Tile dimensions normalized to a 300px-tall tile (vertical) or 200px-wide (horizontal).
function tileDims(type: PhotoboothPreset["type"]) {
  if (type === "strip") return { w: 100, h: 300, vb: "0 0 600 1800" };
  if (type === "postcard-vertical") return { w: 200, h: 300, vb: "0 0 1200 1800" };
  return { w: 200, h: 133, vb: "0 0 1800 1200" };
}

// A faithful, text-optional render of a template. Slot geometry comes from
// lib/layouts.js (the single source of truth) — supports any arrangement
// including L-shape and inverted-L without code changes.
function TemplateCanvas({
  preset,
  width,
  height,
  showText = false,
  names = "",
  date = "",
  venue = "",
  fontFamily = "",
}: {
  preset: PhotoboothPreset;
  width: number;
  height: number;
  showText?: boolean;
  names?: string;
  date?: string;
  venue?: string;
  fontFamily?: string;
}) {
  const { vb } = tileDims(preset.type);
  const activeFont = fontFamily || preset.fontFamily;
  const isCursive = activeFont.toLowerCase().includes("cursive");
  const svg = renderDecorativeSvg(preset.id, preset.type, preset.textColor, preset.secondaryColor, preset.borderColor, "bottom");
  const layout = resolveLayout(preset.layoutId, preset.type);
  const viewBox = VIEWBOX[preset.type];

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
      {/* Photo slots — absolute-positioned from layout data */}
      {layout.slots.map((s: { x: number; y: number; w: number; h: number }, i: number) => {
        const left = (s.x / viewBox.w) * 100;
        const top = (s.y / viewBox.h) * 100;
        const w = (s.w / viewBox.w) * 100;
        const h = (s.h / viewBox.h) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}%`,
              height: `${h}%`,
              backgroundColor: preset.slotBgColor,
              border: `1px solid ${preset.borderColor}`,
              borderRadius: preset.slotBorderRadius,
            }}
          />
        );
      })}
      {/* Text zone — absolute-positioned from layout data */}
      {(() => {
        const z = layout.textZone;
        const left = (z.x / viewBox.w) * 100;
        const top = (z.y / viewBox.h) * 100;
        const w = (z.w / viewBox.w) * 100;
        const h = (z.h / viewBox.h) * 100;
        return (
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}%`,
              height: `${h}%`,
              color: preset.textColor,
            }}
          >
            {showText ? (
              <>
                <div
                  style={{ fontFamily: activeFont, fontSize: Math.max(11, width * 0.11), lineHeight: 1.05 }}
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
              </>
            ) : (
              <div className="flex flex-col items-center gap-[3px]" style={{ opacity: 0.3 }}>
                <div style={{ width: "65%", height: Math.max(2, width * 0.025), backgroundColor: preset.textColor, borderRadius: 1 }} />
                <div style={{ width: "40%", height: Math.max(1.5, width * 0.015), backgroundColor: preset.secondaryColor, borderRadius: 1 }} />
                <div style={{ width: "50%", height: Math.max(1.5, width * 0.012), backgroundColor: preset.textColor, borderRadius: 1 }} />
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default function GalleryPage() {
  const [tier, setTier] = useState<TierFilter>("all");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [selected, setSelected] = useState<PhotoboothPreset | null>(null);

  // Personalization fields (stage 2)
  const [nameOne, setNameOne] = useState("");
  const [nameTwo, setNameTwo] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const [referencePhotos, setReferencePhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = useMemo(() => {
    return PRESETS.filter((p) => {
      if (tier === "signature" && !isSignature(p)) return false;
      if (tier === "classic" && isSignature(p)) return false;
      if (format !== "all" && p.type !== format) return false;
      return true;
    });
  }, [tier, format]);

  const names = [nameOne.trim(), nameTwo.trim()].filter(Boolean).join("  &  ");

  const openTemplate = (p: PhotoboothPreset) => {
    setSelected(p);
    setNameOne("");
    setNameTwo("");
    setDate("");
    setVenue("");
    setSelectedFont(p.fontFamily);
    setReferencePhotos([]);
    setNotes("");
    setErrorMsg("");
    setConfirmed(false);
  };

  const handleFiles = (files: FileList) => {
    setErrorMsg("");
    const maxFiles = 3;
    const maxSize = 1.5 * 1024 * 1024; // 1.5MB per file
    const maxTotalSize = 2.5 * 1024 * 1024; // 2.5MB total

    const newPhotos = [...referencePhotos];
    
    if (newPhotos.length + files.length > maxFiles) {
      setErrorMsg(`You can upload a maximum of ${maxFiles} reference photos.`);
      return;
    }

    let sizeSum = 0;
    newPhotos.forEach(p => {
      sizeSum += p.length * 0.75;
    });

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Only image files (JPEG, PNG, WEBP) are supported.");
        return;
      }
      if (file.size > maxSize) {
        setErrorMsg(`Each file must be under 1.5MB. "${file.name}" is too large.`);
        return;
      }
      sizeSum += file.size;
    });

    if (sizeSum > maxTotalSize) {
      setErrorMsg("Total upload size is limited to 2.5MB. Please choose smaller or compressed images.");
      return;
    }

    setUploading(true);
    let loaded = 0;
    const targets = Array.from(files);

    if (targets.length === 0) {
      setUploading(false);
      return;
    }

    targets.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          newPhotos.push(e.target.result);
        }
        loaded++;
        if (loaded === targets.length) {
          setReferencePhotos(newPhotos);
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setErrorMsg("Failed to read one or more files.");
        loaded++;
        if (loaded === targets.length) {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const confirmSelection = async () => {
    if (!selected) return;
    const lead = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("lead")
      : null;
    const payload = {
      templateId: selected.id,
      templateName: selected.name,
      layout: selected.type,
      names: names || null,
      date: date.trim() || null,
      venue: venue.trim() || null,
      fontFamily: selectedFont || null,
      referencePhotos: referencePhotos.length > 0 ? referencePhotos : null,
      notes: notes.trim() || null,
      lead,
      selectedAt: new Date().toISOString(),
    };

    try {
      const prev = JSON.parse(localStorage.getItem("katha_selections") || "[]");
      localStorage.setItem("katha_selections", JSON.stringify([payload, ...prev].slice(0, 50)));
    } catch {}

    try {
      const res = await fetch("/api/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok || res.status === 202) {
        setConfirmed(true);
        return;
      }
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

        {/* Format filter */}
        <div className="mt-4 inline-flex flex-wrap justify-center rounded-full p-1" style={{ backgroundColor: "#E0D7C7" }}>
          {([
            ["all", "All formats"],
            ["strip", "2×6 Strip"],
            ["postcard-vertical", "4×6 Postcard"],
            ["postcard", "6×4 Landscape"],
          ] as [FormatFilter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFormat(key)}
              className="px-3.5 py-1.5 text-[11px] uppercase tracking-widest rounded-full transition-colors cursor-pointer"
              style={
                format === key
                  ? { backgroundColor: "#8C382A", color: "#EAE2D5" }
                  : { color: "#5A5D5A" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: "#9C958A" }}>
          {filtered.length} {filtered.length === 1 ? "template" : "templates"}
        </p>
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
                    fontFamily={selectedFont}
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

                    {/* Dynamic luxury font gallery selector */}
                    <div className="flex flex-col gap-1 mt-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "#9C958A" }}>
                        Personalized Font
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full border px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#8C382A] cursor-pointer"
                        style={{ borderColor: "#C4B59D", fontFamily: selectedFont }}
                      >
                        {LUXURY_FONTS.map((font) => (
                          <option key={font.css} value={font.css} style={{ fontFamily: font.css }}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Drag & Drop Reference Photos Uploader */}
                    <div className="flex flex-col gap-1 mt-4">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "#9C958A" }}>
                        Reference Photos (Optional)
                      </label>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border border-dashed rounded-sm p-4 text-center transition-all ${
                          dragActive ? "border-[#8C382A] bg-[#F2ECE0]" : "border-[#C4B59D] bg-white/50"
                        }`}
                        style={{ minHeight: "90px" }}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files) handleFiles(e.target.files);
                          }}
                          disabled={uploading}
                        />
                        
                        <div className="flex flex-col items-center justify-center h-full pointer-events-none">
                          <svg className="w-5 h-5 mb-1 text-[#9C958A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {uploading ? (
                            <p className="text-[11px]" style={{ color: "#5A5D5A" }}>Reading files...</p>
                          ) : (
                            <>
                              <p className="text-[11px] font-medium" style={{ color: "#241E1A" }}>
                                Drag reference photos here, or <span className="underline text-[#8C382A]">browse</span>
                              </p>
                              <p className="text-[9px] mt-0.5" style={{ color: "#9C958A" }}>
                                Max 3 files (1.5MB each, 2.5MB total)
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Error message */}
                      {errorMsg && (
                        <p className="text-[11px] font-medium mt-1 text-[#8C382A]">
                          {errorMsg}
                        </p>
                      )}

                      {/* Thumbnail Preview Grid */}
                      {referencePhotos.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {referencePhotos.map((photo, index) => (
                            <div key={index} className="relative w-14 h-14 border rounded-sm overflow-hidden" style={{ borderColor: "#C4B59D" }}>
                              <img src={photo} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setReferencePhotos(prev => prev.filter((_, i) => i !== index))}
                                className="absolute top-0.5 right-0.5 bg-[#241E1A]/80 hover:bg-[#8C382A] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors"
                                title="Remove photo"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Additional Notes */}
                    <div className="flex flex-col gap-1 mt-4">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "#9C958A" }}>
                        Additional Details
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any specific requests or design details not covered?"
                        rows={2}
                        className="w-full border px-3 py-2 text-sm rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#8C382A]"
                        style={{ borderColor: "#C4B59D", resize: "none" }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={confirmSelection}
                    className="mt-6 w-full py-3 text-xs uppercase tracking-[0.2em] rounded-full cursor-pointer transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#8C382A", color: "#EAE2D5" }}
                  >
                    Choose this style
                  </button>
                  <div className="mt-4 text-center">
                    <p className="text-[11px] leading-relaxed" style={{ color: "#9C958A" }}>
                      Please note: This preview is a preliminary canvas—a general guide to visualize our shared vision. Your final heirloom design will be meticulously refined. Details can be adjusted later.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
