"use client";

// ----------------------------------------------------------------------
// CLIENT-FACING TEMPLATE GALLERY
// Vibe-first: clients browse text-free design thumbnails, pick a style,
// then personalize (names / date / venue). Reads from lib/templates —
// the SAME source the studio + export use, so what they pick == what
// gets produced. No design controls are exposed here.
// ----------------------------------------------------------------------

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from "react";
import { PRESETS, renderDecorativeSvg, type PhotoboothPreset, resolveLayout, VIEWBOX, LUXURY_FONTS, getModifiedLayout } from "@/lib/templates";
import { KNarrativeThread } from "@/components/shell/KNarrativeThread";
import { cn } from "@/lib/utils";

type TierFilter = "all" | "signature" | "classic";
type FormatFilter = "all" | "strip" | "postcard-vertical" | "postcard" | "postcard-square";

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
                {names && (
                  <div
                    style={{ fontFamily: activeFont, fontSize: Math.max(11, width * 0.11), lineHeight: 1.05 }}
                    className={isCursive ? "normal-case" : "uppercase tracking-wide"}
                  >
                    {names}
                  </div>
                )}
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
      {/* Full-bleed decoration overlay — rendered on top of slots to allow subtle overlaps */}
      <svg
        viewBox={vb}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none z-10"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

export default function GalleryPage() {
  const [tier, setTier] = useState<TierFilter>("all");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [selected, setSelected] = useState<PhotoboothPreset | null>(null);
  const [textPosition, setTextPosition] = useState<"bottom" | "top">("bottom");

  const COLLECTIONS = [
    {
      id: "signature",
      title: "The Signature Collection",
      description: "Our signature tier. Concepts reflecting ancestral Filipino heritage and Wabi-Sabi philosophy.",
      filterFn: (p: PhotoboothPreset) => isSignature(p)
    },
    {
      id: "classic",
      title: "The Classic Atelier",
      description: "Timeless designs, elegant typography, and traditional wedding details.",
      filterFn: (p: PhotoboothPreset) => !isSignature(p)
    }
  ];

  // Personalization fields (stage 2)
  const [nameOne, setNameOne] = useState("");
  const [nameTwo, setNameTwo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const [referencePhotos, setReferencePhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return PRESETS.filter((p) => {
      if (tier === "signature" && !isSignature(p)) return false;
      if (tier === "classic" && isSignature(p)) return false;
      // "postcard-square" maps to type=="postcard" with a square layoutId
      if (format === "postcard-square") {
        return p.type === "postcard" && (p.layoutId?.endsWith("-sq") ?? false);
      }
      if (format !== "all" && p.type !== format) return false;
      return true;
    });
  }, [tier, format]);

  const names = [nameOne.trim(), nameTwo.trim()].filter(Boolean).join("  &  ");

  const openTemplate = (p: PhotoboothPreset) => {
    setSelected(p);
    setNameOne("");
    setNameTwo("");
    setEmail("");
    setPhone("");
    setDate("");
    setVenue("");
    setSelectedFont(p.fontFamily);
    setTextPosition("bottom");
    setReferencePhotos([]);
    setNotes("");
    setErrorMsg("");
    setError("");
    setConfirmed(false);
    // Move focus into modal after render
    setTimeout(() => {
      const modal = document.getElementById("katha-modal");
      if (modal) (modal.querySelector("button, input, textarea, [tabindex]") as HTMLElement)?.focus();
    }, 50);
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
    let currentLead = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("lead")
      : null;

    // Organic Inquiry: If no lead exists but email is provided, ping Resend API
    if (!currentLead && email) {
      try {
        const inqRes = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_name: names || "Gallery Guest",
            client_email: email,
            client_phone: phone.trim() || undefined,
            event_date: date.trim() || "TBD",
          }),
        });
        if (inqRes.ok) {
          const inqData = await inqRes.json();
          currentLead = inqData.lead_hash;
        }
      } catch (e) {}
    }

    const payload = {
      templateId: selected.id,
      templateName: selected.name,
      layout: selected.type,
      names: names || null,
      date: date.trim() || null,
      venue: venue.trim() || null,
      fontFamily: selectedFont || null,
      textPosition: textPosition,
      referencePhotos: referencePhotos.length > 0 ? referencePhotos : null,
      notes: notes.trim() || null,
      lead: currentLead,
      selectedAt: new Date().toISOString(),
    };

    try {
      const prev = JSON.parse(localStorage.getItem("katha_selections") || "[]");
      localStorage.setItem("katha_selections", JSON.stringify([payload, ...prev].slice(0, 50)));
    } catch {}

    setError("");
    try {
      const res = await fetch("/api/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok || res.status === 202) {
        setConfirmed(true);
        return;
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Submission failed. Please try again.');
    }
  };

  // Close modal on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && selected) setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EAE2D5", color: "#241E1A" }}>
      {/* Header — asymmetric 7/5 (Fukinsei): title weights the loom-frame; filters drift to the right edge */}
      <header className="px-6 md:px-12 py-10" style={{ borderColor: "#C4B59D" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:items-end">
          {/* Left column — eyebrow + display H1 + lede */}
          <div className="md:col-span-7 text-center md:text-left">
            <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "#5A564E" }}>
              Katha Photo Booth
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl" style={{ fontFamily: "'Fraunces', Georgia, serif", fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 96", letterSpacing: "0.01em" }}>
              Choose your style
            </h1>
            <p className="mt-3 text-sm max-w-xl mx-auto md:mx-0" style={{ color: "#5A5D5A" }}>
              Browse our template library and choose the one that feels like you. We&apos;ll personalize the details together.
            </p>
          </div>

          {/* Right column — tier + format filters + result count, right-aligned on md+ */}
          <div className="md:col-span-5 flex flex-col items-center md:items-end gap-3">
            {/* Tier filter */}
            <div className="inline-flex p-1" style={{ backgroundColor: "#C4B59D" }}>
              {([
                ["all", "All styles"],
                ["classic", "Classic"],
                ["signature", "Katha Signature"],
              ] as [TierFilter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTier(key)}
                  className="px-4 py-1.5 text-xs uppercase tracking-widest transition-colors cursor-pointer"
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
            <div className="inline-flex flex-wrap justify-center md:justify-end p-1" style={{ backgroundColor: "#C4B59D" }}>
              {([
                ["all", "All formats"],
                ["strip", "2×6 Strip"],
                ["postcard-vertical", "4×6 Postcard"],
                ["postcard", "6×4 Landscape"],
                ["postcard-square", "6×4 Square"],
              ] as [FormatFilter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFormat(key)}
                  className="px-3.5 py-1.5 text-[11px] uppercase tracking-widest transition-colors cursor-pointer"
                  style={
                    format === key
                      ? { backgroundColor: "#241E1A", color: "#EAE2D5" }
                      : { color: "#5A5D5A" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#5A564E" }}>
              {filtered.length} {filtered.length === 1 ? "template" : "templates"}
            </p>
          </div>
        </div>
      </header>

      {/* Calado divider — drawn-thread openwork; the only rule line allowed */}
      <div
        aria-hidden
        className="mx-6 md:mx-12 h-[6px]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='6' viewBox='0 0 48 6'><circle cx='4' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='14' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='24' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='34' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='44' cy='3' r='0.9' fill='%23C4B59D'/></svg>\")",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center",
        }}
      />

      {/* Katha Editions Showcase — Bespoke Finalist Showcase */}
      <section className="px-6 md:px-12 py-16 border-b text-neutral-100" style={{ borderColor: "#332A24", backgroundColor: "#1A1816" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "#A35C44" }}>COMMISSIONED EDITIONS</p>
            <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "'Fraunces', Georgia, serif", fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 96" }}>Katha Editions</h2>
            <p className="mt-4 text-xs max-w-2xl mx-auto leading-relaxed opacity-80">
              Behold the studio&apos;s commissioned designs as personalized by our clients. These editions demonstrate our strict adherence to intentional margins, architectural alignment, and quiet restraint. Our studio executes every frame with precision to ensure your event&apos;s identity is presented flawlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Edition Card 1: Steven & Cristalyn */}
            {(() => {
              const p = PRESETS.find(pr => pr.id === "wedding-luxe-gold");
              if (!p) return null;
              const d = tileDims(p.type);
              return (
                <div className="flex flex-col md:flex-row gap-6 p-6 rounded-sm bg-neutral-900/60 backdrop-blur-sm shadow-xl group transition-all duration-300" style={{ border: "1px solid rgba(156,149,138,0.4)" }}>
                  <div className="flex justify-center items-center flex-none">
                    <div className="relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] bg-black p-1 rounded-[3px]">
                      <TemplateCanvas
                        preset={p}
                        width={d.w * 1.5}
                        height={d.h * 1.5}
                        showText
                        names="Steven & Cristalyn"
                        date="JULY 25, 2026"
                        venue="NAPA VALLEY, CALIFORNIA"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between py-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-amber-400">Style 1 — Classic Tier</span>
                      <h3 className="mt-1 text-xl font-medium text-neutral-100" style={{ fontFamily: "'Fraunces', serif" }}>Tradition Gold Luxe</h3>
                      <p className="mt-3 text-xs text-neutral-400 leading-relaxed font-light">
                        Designed for Steven & Cristalyn. Concentric rules in delicate gold-foil shimmer, featuring floating corner tie-ins that gently overlay the edges of your memories.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-neutral-300 font-mono">
                      <div><strong className="text-neutral-400 font-normal">FONT:</strong> Cinzel (Roman Serif)</div>
                      <div><strong className="text-neutral-400 font-normal">FORMAT:</strong> 2×6 Photostrip</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Edition Card 2: Tracy & Prince */}
            {(() => {
              const p = PRESETS.find(pr => pr.id === "katha-tracy-prince");
              if (!p) return null;
              const d = tileDims(p.type);
              return (
                <div className="flex flex-col md:flex-row gap-6 p-6 rounded-sm bg-neutral-900/60 backdrop-blur-sm shadow-xl group transition-all duration-300" style={{ border: "1px solid rgba(156,149,138,0.4)" }}>
                  <div className="flex justify-center items-center flex-none">
                    <div className="relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] bg-black p-1 rounded-[3px]">
                      <TemplateCanvas
                        preset={p}
                        width={d.w * 1.0}
                        height={d.h * 1.0}
                        showText
                        names="Tracy & Prince"
                        date=""
                        venue=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between py-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-rose-400">Katha Signature Tier</span>
                      <h3 className="mt-1 text-xl font-medium text-neutral-100" style={{ fontFamily: "'Fraunces', serif" }}>Tracy & Prince Signature</h3>
                      <p className="mt-3 text-xs text-neutral-400 leading-relaxed font-light">
                        Designed for Tracy & Prince. Features romantic Parisian calligraphy resting on a delicate branding pedestal, bounded by a dual-line concentric framework that gently draws the concentric borders over the image edges.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-neutral-300 font-mono">
                      <div><strong className="text-neutral-400 font-normal">FONT:</strong> Parisienne (Calligraphy)</div>
                      <div><strong className="text-neutral-400 font-normal">FORMAT:</strong> 4×6 Postcard</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Gallery collections */}
      <section className="py-8 md:py-16">
        {COLLECTIONS.map(collection => {
          const collectionPresets = filtered.filter(collection.filterFn);
          if (collectionPresets.length === 0) return null;

          return (
            <div key={collection.id} className="mb-20">
              <div className="px-6 md:px-12 mb-10 flex flex-col">
                <h2 className="text-3xl font-normal tracking-wide text-[#241E1A]" style={{ fontFamily: "'Fraunces', serif" }}>
                  {collection.title}
                </h2>
                <p className="text-[13px] mt-2 text-[#5A5D5A] max-w-lg font-light leading-relaxed">
                  {collection.description}
                </p>
              </div>
              
              {/* Horizontal Scroll Container */}
              <div 
                className="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-6 md:px-12 gap-x-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.flex::-webkit-scrollbar { display: none; }`}</style>
                {collectionPresets.map((p) => {
                  const d = tileDims(p.type);
                  return (
                    <button
                      key={p.id}
                      onClick={() => openTemplate(p)}
                      className="group flex-none flex flex-col items-center cursor-pointer snap-start relative focus:outline-none"
                      style={{ width: 220 }}
                    >
                      <div
                        className="h-[320px] w-full flex items-end justify-center transition-all duration-500 ease-out group-hover:-translate-y-2 group-focus:-translate-y-2 relative"
                      >
                        <TemplateCanvas preset={p} width={d.w} height={d.h} />
                        
                        {/* Interactive Flip & Reveal overlay */}
                        <div 
                          className="absolute inset-x-0 bottom-0 top-auto h-[0%] group-hover:h-full bg-gradient-to-t from-[#241E1A]/95 via-[#241E1A]/90 to-[#241E1A]/80 text-[#EAE2D5] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex flex-col justify-center items-center p-6 text-center z-10 overflow-hidden rounded-[2px]"
                        >
                           <span className="text-[9px] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#EAE2D5]/30">Explore Details</span>
                           <p className="text-[11.5px] leading-[1.6] font-light opacity-90">
                             {p.designerExplanation || "An elegant layout carefully balanced for your finest memories."}
                           </p>
                        </div>
                      </div>
                      <div className="mt-6 text-center w-full px-2 transition-opacity duration-300">
                        <div className="text-[14px] text-[#241E1A]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                          {p.name.replace("Katha Signature — ", "")}
                        </div>
                        {isSignature(p) && (
                          <div className="text-[9px] uppercase tracking-[0.25em] mt-2 text-[#8C382A]">
                            Signature
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Personalization modal */}
      {selected && (
        <div
          id="katha-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="katha-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(26,24,22,0.55)" }}
          onClick={() => setSelected(null)}
        >
          <div
            id="katha-modal"
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
            style={{ backgroundColor: confirmed ? "#B5B8A3" : "#EAE2D5" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-2xl leading-none cursor-pointer"
              style={{ color: "#5A5D5A" }}
              aria-label="Close template preview"
            >
              ×
            </button>

            {confirmed ? (
              <div className="px-8 py-16 text-center">
                <div className="text-3xl" style={{ fontFamily: "'Fraunces', serif", color: "#241E1A" }}>Thank you</div>
                <p className="mt-3 text-sm max-w-sm mx-auto" style={{ color: "#241E1A" }}>
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
                    textPosition={textPosition}
                  />
                </div>

                {/* Personalize form */}
                <div className="flex flex-col">
                  <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "#5A564E" }}>
                    {isSignature(selected) ? "Katha Signature" : "Classic Collection"}
                  </p>
                  <h2 id="katha-modal-title" className="mt-2 text-2xl" style={{ fontFamily: "'Fraunces', serif" }}>
                    {selected.name.replace("Katha Signature — ", "")}
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#5A5D5A" }}>
                    {selected.designerExplanation}
                  </p>

                  <KNarrativeThread
                    className="mt-6 mb-6"
                    items={[
                      {
                        label: "Client Details",
                        complete: Boolean(nameOne && email),
                        content: (
                          <div className="grid grid-cols-2 gap-3">
                            <label htmlFor="katha-name-one" className="sr-only">First name</label>
                            <input id="katha-name-one" value={nameOne} onChange={(e) => setNameOne(e.target.value)} placeholder="First name"
                              className="border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A]" style={{ borderColor: "#C4B59D" }} />
                            <label htmlFor="katha-name-two" className="sr-only">Second name</label>
                            <input id="katha-name-two" value={nameTwo} onChange={(e) => setNameTwo(e.target.value)} placeholder="Second name (Optional)"
                              className="border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A]" style={{ borderColor: "#C4B59D" }} />
                            <label htmlFor="katha-email" className="sr-only">Email address</label>
                            <div className="col-span-2">
                              <input id="katha-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
                                className="w-full border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A]" style={{ borderColor: "#C4B59D" }} />
                              {email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                                <p className="text-xs mt-1" style={{ color: '#8C382A' }}>Please enter a valid email address.</p>
                              )}
                            </div>
                            <label htmlFor="katha-phone" className="sr-only">Phone number</label>
                            <input id="katha-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (Optional)"
                              className="col-span-2 border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A]" style={{ borderColor: "#C4B59D" }} />
                          </div>
                        )
                      },
                      {
                        label: "The Event",
                        complete: Boolean(date && venue),
                        content: (
                          <div className="flex flex-col gap-3">
                            <label htmlFor="katha-event-date" className="sr-only">Event date</label>
                            <input id="katha-event-date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Event date (e.g. July 25, 2026)"
                              className="w-full border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A]" style={{ borderColor: "#C4B59D" }} />
                            <label htmlFor="katha-venue" className="sr-only">Venue or location</label>
                            <input id="katha-venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue / location"
                              className="w-full border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A]" style={{ borderColor: "#C4B59D" }} />
                          </div>
                        )
                      },
                      {
                        label: "Design Preferences",
                        complete: true,
                        content: (
                          <div className="flex flex-col gap-4">
                            {/* Personalized font picker */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="katha-font-selector" className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "#5A564E" }}>
                                Personalized Font
                              </label>
                              <select
                                id="katha-font-selector"
                                value={selectedFont}
                                onChange={(e) => setSelectedFont(e.target.value)}
                                className="w-full border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A] cursor-pointer transition-shadow"
                                style={{ borderColor: "#C4B59D", fontFamily: selectedFont }}
                              >
                                {LUXURY_FONTS.map((font) => (
                                  <option key={font.css} value={font.css} style={{ fontFamily: font.css }}>
                                    {font.name}
                                  </option>
                                ))}
                              </select>
                              {/* Live font preview swatch */}
                              <div
                                className="mt-1 px-3 py-3 rounded-sm text-center text-base"
                                style={{ fontFamily: selectedFont, color: "#241E1A", backgroundColor: "#EAE2D5", border: "1px solid #C4B59D" }}
                                aria-label={`Font preview: ${selectedFont}`}
                              >
                                {names || "Maria & Jose · July 2026"}
                              </div>
                            </div>

                            {/* Text Position toggle */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "#5A564E" }}>
                                Text Position
                              </span>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <button
                                  type="button"
                                  id="btn-gallery-text-bottom"
                                  onClick={() => setTextPosition("bottom")}
                                  className={cn(
                                    "text-[11px] py-2 font-bold rounded-xs border uppercase tracking-widest text-center cursor-pointer transition-all",
                                    textPosition === "bottom"
                                      ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                                      : "bg-white text-stone-600 border-[#C4B59D] hover:bg-stone-50"
                                  )}
                                >
                                  Bottom
                                </button>
                                <button
                                  type="button"
                                  id="btn-gallery-text-top"
                                  onClick={() => setTextPosition("top")}
                                  className={cn(
                                    "text-[11px] py-2 font-bold rounded-xs border uppercase tracking-widest text-center cursor-pointer transition-all",
                                    textPosition === "top"
                                      ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                                      : "bg-white text-stone-600 border-[#C4B59D] hover:bg-stone-50"
                                  )}
                                >
                                  Top
                                </button>
                              </div>
                            </div>
                            
                            {/* Additional Notes */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="katha-notes" className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "#5A564E" }}>
                                Additional Details
                              </label>
                              <textarea
                                id="katha-notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Anything specific we should know — colour accents, motifs, layout preferences?"
                                rows={2}
                                className="w-full border px-3 py-3 text-sm rounded-sm bg-[#EAE2D5]/30 focus:outline-none focus:ring-1 focus:ring-[#8C382A] transition-shadow"
                                style={{ borderColor: "#C4B59D", resize: "none" }}
                              />
                            </div>
                          </div>
                        )
                      },
                      {
                        label: "Reference Photos (Optional)",
                        complete: true,
                        content: (
                          <div className="flex flex-col gap-1">
                            <div
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              className={`relative border border-dashed rounded-sm p-4 text-center transition-all ${
                                dragActive ? "border-[#8C382A] bg-[#EAE2D5]" : "border-[#C4B59D] bg-[#EAE2D5]/30"
                              }`}
                              style={{ minHeight: "90px" }}
                              role="region"
                              aria-label="Drop zone for reference photos"
                            >
                              <input
                                id="katha-photo-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Upload reference photos"
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
                              <p role="alert" className="text-[11px] font-medium mt-1 text-[#8C382A]">
                                {errorMsg}
                              </p>
                            )}
    
                            {/* Thumbnail Preview Grid */}
                            {referencePhotos.length > 0 && (
                              <div className="flex gap-2 flex-wrap mt-2" role="list" aria-label="Uploaded reference photos">
                                {referencePhotos.map((photo, index) => (
                                  <div key={index} role="listitem" className="relative w-14 h-14 border rounded-sm overflow-hidden" style={{ borderColor: "#C4B59D" }}>
                                    <img src={photo} alt={`Reference photo ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setReferencePhotos(prev => prev.filter((_, i) => i !== index))}
                                      className="absolute top-0.5 right-0.5 bg-[#241E1A]/80 hover:bg-[#8C382A] text-[#EAE2D5] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors"
                                      aria-label={`Remove reference photo ${index + 1}`}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      }
                    ]}
                  />

                  <button
                    onClick={confirmSelection}
                    disabled={!nameOne.trim() || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
                    className="mt-6 w-full py-4 text-xs uppercase tracking-[0.2em] rounded-none transition-transform hover:scale-[0.98] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 cursor-pointer"
                    style={{ backgroundColor: "#111112", color: "#EAE2D5" }}
                  >
                    Submit Design Inquiry
                  </button>
                  {error && <p className="text-sm mt-2 text-center" style={{color:'#8C382A'}}>{error}</p>}
                  <div className="mt-4 text-center">
                    <p className="text-[11px] leading-relaxed" style={{ color: "#5A564E" }}>
                      <span className="font-semibold" style={{ color: "#8C382A", letterSpacing: "0.05em" }}>KATHA STUDIO DRAFT</span>
                      {" "}— This canvas is a preliminary layout designed to align our shared design direction. Your final piece will be meticulously finished by our studio team. Details, fonts, and structural elements are fully adjustable before we lock the final design for production.
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
