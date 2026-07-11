"use client";

import { mapFontToVar } from "@/lib/font-mapper";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo, useRef, useEffect } from "react";
import { PRESETS, renderDecorativeSvg, type PhotoboothPreset, resolveLayout, VIEWBOX, LUXURY_FONTS, getModifiedLayout } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { SERVICE_TIERS } from "@/lib/serviceTiers";

// Filter transitions glide smoothly when View Transitions API is available.
function withViewTransition(update: () => void) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(update);
  } else {
    update();
  }
}

type ReferencePhoto = { preview: string; value: string };
type TierFilter = "all" | "signature" | "classic";
type FormatFilter = "all" | "strip" | "postcard-vertical" | "postcard" | "postcard-square";

const isSignature = (p: PhotoboothPreset) => p.name.includes("Katha Signature");

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
      className="relative overflow-hidden ring-1 ring-white/10"
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
                    style={{ fontFamily: mapFontToVar(activeFont), fontSize: Math.max(11, width * 0.11), lineHeight: 1.05 }}
                    className={isCursive ? "normal-case" : "uppercase tracking-wide"}
                  >
                    {names}
                  </div>
                )}
                {date && (
                  <div style={{ color: preset.secondaryColor, fontSize: Math.max(7, width * 0.05) }} className="uppercase tracking-widest mt-1 font-mono">
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

export default function TemplateDesignClient({ id }: { id: string }) {
  // Configurator state
  const [tier, setTier] = useState<TierFilter>("all");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [selected, setSelected] = useState<PhotoboothPreset>(PRESETS[0]);
  const [textPosition, setTextPosition] = useState<"bottom" | "top">("bottom");
  const [showDimensions, setShowDimensions] = useState(false);

  // Personalization fields
  const [nameOne, setNameOne] = useState("");
  const [nameTwo, setNameTwo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [serviceTier, setServiceTier] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [selectedFont, setSelectedFont] = useState(PRESETS[0].fontFamily);
  const [referencePhotos, setReferencePhotos] = useState<ReferencePhoto[]>([]);
  const [notes, setNotes] = useState("");

  // UI state
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);

  // Candlelight cursor effect pos
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const objectUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Update default selected font when preset changes
  useEffect(() => {
    if (selected) {
      setSelectedFont(selected.fontFamily);
    }
  }, [selected]);

  const filtered = useMemo(() => {
    return PRESETS.filter((p) => {
      if (tier === "signature" && !isSignature(p)) return false;
      if (tier === "classic" && isSignature(p)) return false;
      if (format === "postcard-square") {
        return p.type === "postcard" && (p.layoutId?.endsWith("-sq") ?? false);
      }
      if (format !== "all" && p.type !== format) return false;
      return true;
    });
  }, [tier, format]);

  const names = [nameOne.trim(), nameTwo.trim()].filter(Boolean).join("  &  ");

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Upload/Storage files
  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        typeof e.target?.result === "string" ? resolve(e.target.result) : reject(new Error("read failed"));
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(file);
    });

  const uploadToStorage = async (file: File): Promise<string | null> => {
    try {
      if (!supabase) return null;
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
      });
      if (!res.ok) return null;
      const { path, token } = await res.json();
      if (!path || !token) return null;
      const { error } = await supabase.storage
        .from("katha-references")
        .uploadToSignedUrl(path, token, file);
      if (error) return null;
      return path;
    } catch {
      return null;
    }
  };

  const handleFiles = async (files: FileList) => {
    setErrorMsg("");
    const maxFiles = 3;
    const maxSize = 1.5 * 1024 * 1024;

    if (referencePhotos.length + files.length > maxFiles) {
      setErrorMsg(`You can upload a maximum of ${maxFiles} reference photos.`);
      return;
    }

    const targets = Array.from(files);
    for (const file of targets) {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Only image files (JPEG, PNG, WEBP) are supported.");
        return;
      }
      if (file.size > maxSize) {
        setErrorMsg(`Each file must be under 1.5MB. "${file.name}" is too large.`);
        return;
      }
    }
    if (targets.length === 0) return;

    setUploading(true);
    const added: ReferencePhoto[] = [];
    try {
      for (const file of targets) {
        const path = await uploadToStorage(file);
        if (path) {
          const previewUrl = URL.createObjectURL(file);
          objectUrls.current.add(previewUrl);
          added.push({ preview: previewUrl, value: path });
        } else {
          const dataUrl = await readAsDataUrl(file);
          added.push({ preview: dataUrl, value: dataUrl });
        }
      }
      setReferencePhotos((prev) => [...prev, ...added]);
    } catch {
      setErrorMsg("Failed to read one or more files.");
    } finally {
      setUploading(false);
    }
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
    setIsSubmitting(true);
    let currentLead = id === "guest" ? null : id;

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
      serviceTier: serviceTier,
      address: address.trim() || null,
      fontFamily: mapFontToVar(selectedFont) || null,
      textPosition: textPosition,
      referencePhotos: referencePhotos.length > 0 ? referencePhotos.map((p) => p.value) : null,
      notes: notes.trim() || null,
      lead: currentLead,
      selectedAt: new Date().toISOString(),
      configuration: {
        customFont: selectedFont || selected.fontFamily,
        textPosition,
        tier: isSignature(selected) ? "signature" : "classic",
        layoutId: selected.layoutId ?? null,
      },
    };

    try {
      const prev = JSON.parse(localStorage.getItem("katha_selections") || "[]");
      localStorage.setItem("katha_selections", JSON.stringify([payload, ...prev].slice(0, 50)));
    } catch {}

    setError("");
    setSaveWarning(null);
    try {
      const res = await fetch("/api/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok || res.status === 202) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 202 || data.ok === false) {
          setSaveWarning("We had trouble syncing the choice to our servers, but your design direction is saved locally in this browser.");
        }
        setConfirmed(true);
        setIsSubmitting(false);
        return;
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch {
      setError('Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectedDims = tileDims(selected.type);

  return (
    <main 
      className="min-h-screen text-[#F2E6D2] font-jost" 
      style={{ 
        backgroundColor: "#0B0C10", // Obsidian
        fontFamily: "var(--font-jost), sans-serif",
        fontWeight: 300
      }}
    >
      {/* Pure Client Film Grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {confirmed ? (
        /* SUCCESS SCREEN */
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] font-mono" style={{ color: "#D4AF37" }}>
            Commission Complete
          </p>
          <h1 
            className="mt-6 text-4xl md:text-5xl font-light tracking-tight text-[#EAE2D5]"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Your Design Direction Is Saved
          </h1>
          <p className="mt-6 text-sm max-w-md mx-auto leading-relaxed text-[#9C958A] font-serif">
            {saveWarning ? (
              <>
                <strong className="text-[#EAE2D5] font-normal">{selected.name.replace("Katha Signature — ", "")}</strong> is cached in your browser. {saveWarning}
              </>
            ) : (
              <>
                <strong className="text-[#EAE2D5] font-normal">{selected.name.replace("Katha Signature — ", "")}</strong> has been successfully attached to your inquiry.
                We have placed a temporary 72-hour hold on this design for your event date. Our studio will review your specifications, map the custom components, and provide a formal proof before final installation.
              </>
            )}
          </p>
          <button
            onClick={() => setConfirmed(false)}
            className="mt-12 px-8 py-3 text-xs uppercase tracking-widest cursor-pointer transition-colors border border-[#C4B59D]/30 text-[#EAE2D5] hover:bg-[#EAE2D5]/5"
            style={{ borderRadius: 0 }}
          >
            Adjust Specifications
          </button>
        </div>
      ) : (
        /* SPLIT SCREEN WORKBENCH */
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          
          {/* LEFT PANE: Sticky Preview Port */}
          <section 
            onMouseMove={handleMouseMove}
            className="lg:col-span-7 flex flex-col items-center justify-center p-8 lg:p-16 min-h-[50vh] lg:min-h-screen lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 border-[#C4B59D]/10 overflow-hidden relative"
            style={{ backgroundColor: "#0B0C10" }} // Obsidian
          >
            {/* Candlelight Mouse Glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light transition-opacity duration-300 hidden md:block"
              style={{
                background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.12), transparent 80%)`,
              }}
              aria-hidden="true"
            />

            {/* Viewport Marginalia */}
            <div className="absolute top-8 left-8 text-[9px] uppercase tracking-[0.2em] text-[#9C958A] select-none font-mono" aria-hidden="true">
              FIG. 04 — Live Preview
            </div>
            <div className="absolute bottom-8 left-8 text-[9px] uppercase tracking-[0.2em] text-[#9C958A] select-none font-mono" aria-hidden="true">
              {selected.name.replace("Katha Signature — ", "")}
            </div>
            <div className="absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.2em] text-[#9C958A] select-none font-mono" aria-hidden="true">
              {selected.type.replace("-", " ")}
            </div>

            {/* Configurator Badges / Toggles */}
            <div className="absolute top-8 right-8 flex gap-2 z-20">
              <button 
                onClick={() => setShowDimensions(!showDimensions)}
                aria-pressed={showDimensions}
                className={cn(
                  "px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors cursor-pointer select-none font-mono",
                  showDimensions 
                    ? "bg-[#D4AF37] border-[#D4AF37] text-[#0B0C10]" 
                    : "border-[#C4B59D]/20 text-[#9C958A] hover:border-[#C4B59D]/40"
                )}
                style={{ borderRadius: 0 }}
              >
                Dimensions
              </button>
            </div>

            {/* Template Canvas Container */}
            <div className="relative flex items-center justify-center p-8 bg-[#1A1816]/30 border border-[#C4B59D]/10">
              
              {/* Responsive scaling container */}
              <div className="origin-center scale-[0.8] sm:scale-100 transition-transform">
                <TemplateCanvas
                  preset={selected}
                  width={selected.type === "strip" ? 170 : 340}
                  height={selected.type === "strip" ? 510 : selected.type === "postcard-vertical" ? 510 : 226}
                  showText
                  names={names}
                  date={date}
                  venue={venue}
                  fontFamily={selectedFont}
                  textPosition={textPosition}
                />
              </div>

              {/* 2D Golden Dimensions Guide Overlay */}
              {showDimensions && (
                <div 
                  className="absolute inset-0 pointer-events-none border border-dashed border-[#D4AF37]/35 m-[-20px] transition-all"
                  style={{ animation: "fade-in 0.3s ease forwards" }}
                >
                  {/* Top size mark */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] text-[#D4AF37] uppercase tracking-widest bg-[#0B0C10] px-2 font-mono select-none">
                    {selected.type === "strip" ? "2.0 in" : selected.type === "postcard-vertical" ? "4.0 in" : "6.0 in"}
                  </div>
                  {/* Side size mark */}
                  <div className="absolute -right-14 top-1/2 -translate-y-1/2 text-[9px] text-[#D4AF37] uppercase tracking-widest bg-[#0B0C10] px-2 font-mono rotate-90 whitespace-nowrap select-none">
                    {selected.type === "strip" ? "6.0 in" : selected.type === "postcard-vertical" ? "6.0 in" : "4.0 in"}
                  </div>
                </div>
              )}
            </div>

          </section>

          {/* RIGHT PANE: Configurators & Fields Panel */}
          <section 
            className="lg:col-span-5 flex flex-col lg:h-screen overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#C4B59D]/10 relative z-10"
            style={{ backgroundColor: "#17100A" }} // Kamagong Panel
          >
            <div className="p-8 lg:p-12 flex flex-col gap-10">
              
              {/* Header Header */}
              <div className="border-b border-[#C4B59D]/10 pb-8">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono" style={{ color: "#D4AF37" }}>
                  Gilded Archive Customizer
                </span>
                <h1 
                  className="mt-3 text-3xl font-light tracking-tight text-[#EAE2D5]"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  Configure your edition.
                </h1>
                <p className="mt-3 text-xs leading-relaxed text-[#9C958A] font-serif">
                  Specify details, select layouts, and describe your installation. Customizer elements adhere to the clean-cut square rules of the Gilded Archive.
                </p>
              </div>

              {/* 01 — DESIGN PRESET SELECTION */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-baseline border-b border-[#C4B59D]/10 pb-2">
                  <span className="text-xs uppercase tracking-widest font-medium text-[#C4B59D]">01 — Design Preset</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#9C958A] font-mono">{filtered.length} versions</span>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-2">
                  {/* Tier filter */}
                  <div className="flex p-0.5 border border-[#C4B59D]/10">
                    {([
                      ["all", "All tiers"],
                      ["classic", "Classic Atelier"],
                      ["signature", "Katha Signature"],
                    ] as [TierFilter, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => withViewTransition(() => setTier(key))}
                        aria-pressed={tier === key}
                        className="flex-1 py-1.5 text-[9px] uppercase tracking-widest transition-colors cursor-pointer text-center font-mono"
                        style={
                          tier === key
                            ? { backgroundColor: "#D4AF37", color: "#0B0C10" }
                            : { color: "#9C958A" }
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Format filter */}
                  <div className="flex flex-wrap p-0.5 border border-[#C4B59D]/10">
                    {([
                      ["all", "All formats"],
                      ["strip", "Strip"],
                      ["postcard-vertical", "Postcard V"],
                      ["postcard", "Postcard H"],
                      ["postcard-square", "Square"],
                    ] as [FormatFilter, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => withViewTransition(() => setFormat(key))}
                        aria-pressed={format === key}
                        className="flex-1 py-1 text-[8.5px] uppercase tracking-widest transition-colors cursor-pointer text-center font-mono"
                        style={
                          format === key
                            ? { backgroundColor: "#D4AF37", color: "#0B0C10" }
                            : { color: "#9C958A" }
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numbered Preset Selector */}
                <div className="grid grid-cols-1 gap-1 max-h-[160px] overflow-y-auto pr-1 border border-[#C4B59D]/10">
                  {filtered.map((p) => {
                    const isSelected = selected.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelected(p)}
                        className={cn(
                          "w-full text-left py-2 px-3 text-[11px] uppercase tracking-wider transition-colors cursor-pointer font-mono flex items-center justify-between",
                          isSelected
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                            : "text-[#9C958A] hover:bg-white/5"
                        )}
                      >
                        <span>{p.name.replace("Katha Signature — ", "")}</span>
                        <span className="text-[9px] opacity-65">{p.type.replace("-", " ")}</span>
                      </button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="py-4 text-center text-xs text-[#5A564E] font-serif">
                      No matching presets found.
                    </div>
                  )}
                </div>
              </div>

              {/* 02 — PERSONALIZATION */}
              <div className="flex flex-col gap-4">
                <div className="border-b border-[#C4B59D]/10 pb-2">
                  <span className="text-xs uppercase tracking-widest font-medium text-[#C4B59D]">02 — Personalization</span>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Names Input */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="workbench-name-one" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                        First Name
                      </label>
                      <input 
                        id="workbench-name-one" 
                        maxLength={50} 
                        value={nameOne} 
                        onChange={(e) => setNameOne(e.target.value)} 
                        placeholder="e.g. Maria"
                        className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        style={{ borderColor: "#C4B59D", borderStyle: "solid", borderWidth: "1px", borderRadius: 0 }} 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="workbench-name-two" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                        Second Name (Optional)
                      </label>
                      <input 
                        id="workbench-name-two" 
                        maxLength={50} 
                        value={nameTwo} 
                        onChange={(e) => setNameTwo(e.target.value)} 
                        placeholder="e.g. Jose"
                        className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        style={{ borderColor: "#C4B59D", borderStyle: "solid", borderWidth: "1px", borderRadius: 0 }} 
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="workbench-email" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                        Email Address
                      </label>
                      <input 
                        id="workbench-email" 
                        type="email" 
                        maxLength={100} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="client@domain.com"
                        className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        style={{ borderColor: "#C4B59D", borderStyle: "solid", borderWidth: "1px", borderRadius: 0 }} 
                      />
                      {email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                        <p className="text-[10px] mt-0.5 text-[#8C382A]" role="alert">Enter a valid email.</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="workbench-phone" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                        Phone (Optional)
                      </label>
                      <input 
                        id="workbench-phone" 
                        type="tel" 
                        maxLength={20} 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="Contact number"
                        className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        style={{ borderColor: "#C4B59D", borderStyle: "solid", borderWidth: "1px", borderRadius: 0 }} 
                      />
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="workbench-date" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                        Event Date
                      </label>
                      <input 
                        id="workbench-date" 
                        maxLength={50} 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        placeholder="e.g. July 25, 2026"
                        className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        style={{ borderColor: "#C4B59D", borderStyle: "solid", borderWidth: "1px", borderRadius: 0 }} 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="workbench-venue" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                        Venue / Location
                      </label>
                      <input 
                        id="workbench-venue" 
                        maxLength={100} 
                        value={venue} 
                        onChange={(e) => setVenue(e.target.value)} 
                        placeholder="Venue location"
                        className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        style={{ borderColor: "#C4B59D", borderStyle: "solid", borderWidth: "1px", borderRadius: 0 }} 
                      />
                    </div>
                  </div>

                  {/* Font Selection */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="workbench-font" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                      Personalized Font
                    </label>
                    <select
                      id="workbench-font"
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                      style={{ borderColor: "#C4B59D", borderRadius: 0, fontFamily: mapFontToVar(selectedFont) }}
                    >
                      {LUXURY_FONTS.map((font) => (
                        <option key={font.css} value={font.css} style={{ fontFamily: font.css, backgroundColor: "#17100A", color: "#EAE2D5" }}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Text Position toggle */}
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                      Text Position
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setTextPosition("bottom")}
                        className={cn(
                          "text-[10px] py-1.5 uppercase tracking-widest border text-center cursor-pointer transition-all font-mono",
                          textPosition === "bottom"
                            ? "bg-[#D4AF37] text-[#0B0C10] border-[#D4AF37]"
                            : "bg-[#0B0C10]/40 text-[#9C958A] border-[#C4B59D]/20 hover:border-[#C4B59D]/40"
                        )}
                        style={{ borderRadius: 0 }}
                      >
                        Bottom
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextPosition("top")}
                        className={cn(
                          "text-[10px] py-1.5 uppercase tracking-widest border text-center cursor-pointer transition-all font-mono",
                          textPosition === "top"
                            ? "bg-[#D4AF37] text-[#0B0C10] border-[#D4AF37]"
                            : "bg-[#0B0C10]/40 text-[#9C958A] border-[#C4B59D]/20 hover:border-[#C4B59D]/40"
                        )}
                        style={{ borderRadius: 0 }}
                      >
                        Top
                      </button>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="flex flex-col gap-1 mt-1">
                    <label htmlFor="workbench-notes" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                      Additional Details / Custom Requests
                    </label>
                    <textarea
                      id="workbench-notes"
                      maxLength={500}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify custom requests — accent colors, layouts, or metadata changes."
                      rows={2}
                      className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                      style={{ borderColor: "#C4B59D", borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* 03 — REFERENCE PHOTOS */}
              <div className="flex flex-col gap-4">
                <div className="border-b border-[#C4B59D]/10 pb-2">
                  <span className="text-xs uppercase tracking-widest font-medium text-[#C4B59D]">03 — Reference Photos</span>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Dropzone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "relative border border-dashed p-4 text-center transition-colors flex items-center justify-center min-h-[80px]",
                      dragActive ? "border-[#D4AF37] bg-white/5" : "border-[#C4B59D]/20 bg-[#0B0C10]/10"
                    )}
                    style={{ borderRadius: 0 }}
                  >
                    <input
                      id="workbench-photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files) handleFiles(e.target.files);
                      }}
                      disabled={uploading}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      {uploading ? (
                        <p className="text-[10px] text-[#9C958A]">Reading files...</p>
                      ) : (
                        <>
                          <p className="text-[10px] text-[#9C958A] font-mono">
                            Drag references here or <span className="underline text-[#D4AF37] cursor-pointer">browse</span>
                          </p>
                          <p className="text-[9px] mt-0.5 text-[#5A564E] font-mono">
                            Max 3 photos (1.5MB each)
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Error message */}
                  {errorMsg && (
                    <p role="alert" className="text-[10px] text-[#8C382A] font-mono">
                      {errorMsg}
                    </p>
                  )}

                  {/* Thumbnail List */}
                  {referencePhotos.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-1" role="list">
                      {referencePhotos.map((photo, index) => (
                        <div key={index} role="listitem" className="relative w-12 h-12 border border-[#C4B59D]/20 overflow-hidden">
                          <img src={photo.preview} alt={`Reference photo ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setReferencePhotos(prev => prev.filter((_, i) => i !== index));
                              if (photo.preview.startsWith("blob:")) {
                                URL.revokeObjectURL(photo.preview);
                                objectUrls.current.delete(photo.preview);
                              }
                            }}
                            className="absolute top-0.5 right-0.5 bg-[#0B0C10]/80 hover:bg-[#0B0C10] text-[#EAE2D5] text-[9px] w-3.5 h-3.5 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 04 — THE INSTALLATION */}
              <div className="flex flex-col gap-4">
                <div className="border-b border-[#C4B59D]/10 pb-2">
                  <span className="text-xs uppercase tracking-widest font-medium text-[#C4B59D]">04 — The Installation</span>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                    Service Tiers
                  </span>
                  
                  {/* Service Tier Buttons */}
                  <div className="grid grid-cols-1 gap-2">
                    {SERVICE_TIERS.map((t) => {
                      const isSelected = serviceTier === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setServiceTier(t.id)}
                          className="flex flex-col p-3 text-left transition-all border cursor-pointer bg-[#0B0C10]/30 hover:bg-white/5"
                          style={{ 
                            borderColor: isSelected ? "#D4AF37" : "#C4B59D/20",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderRadius: 0 
                          }}
                        >
                          <span className="text-sm font-light text-[#EAE2D5]" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                            {t.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.16em] mt-0.5 text-[#D4AF37] font-mono">
                            {t.architecture} · ${t.price.toLocaleString()}
                          </span>
                          <span className="text-[11px] leading-relaxed text-[#9C958A] font-serif mt-1">
                            {t.narrative}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Venue address */}
                  <div className="flex flex-col gap-1 mt-2">
                    <label htmlFor="workbench-address" className="text-[9px] uppercase tracking-wider text-[#9C958A] font-mono">
                      Venue Address
                    </label>
                    <input
                      id="workbench-address"
                      maxLength={500}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, State — where we install"
                      className="border px-3 py-2 text-xs bg-[#0B0C10]/40 text-[#EAE2D5] focus:outline-none focus:border-[#D4AF37]"
                      style={{ borderColor: "#C4B59D", borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* 05 — SUBMIT INQUIRY */}
              <div className="border-t border-[#C4B59D]/10 pt-6 mt-4 flex flex-col gap-4">
                
                {/* Error messages */}
                {error && <p className="text-xs text-center text-[#8C382A]" role="alert">{error}</p>}
                
                {/* Submit button (Sacred CTA: Loko Rust) */}
                <button
                  onClick={confirmSelection}
                  disabled={isSubmitting || !nameOne.trim() || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !serviceTier}
                  className="w-full py-4 text-xs font-bold uppercase tracking-[0.16em] rounded-none transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-[#8C382A] hover:bg-[#6E2C20] text-[#EAE2D5]"
                >
                  {isSubmitting ? "Submitting Request..." : "Submit Design Inquiry"}
                </button>

                {!serviceTier && (
                  <p className="text-[9.5px] text-center text-[#5A564E] font-mono">
                    Select a service tier above to activate submittal.
                  </p>
                )}

                <div className="text-center mt-2">
                  <p className="text-[10px] leading-relaxed text-[#5A564E]">
                    <span className="font-semibold text-[#9C958A] tracking-wider">KATHA STUDIO DRAFT</span>
                    {" "}— Submitting places a temporary, copy-only 72-hour hold on this design for your date. Submissions are non-binding. We will reach out within 24 hours to confirm date releases, finalize physical layouts, and deliver formal proofs.
                  </p>
                </div>
              </div>

            </div>
          </section>

        </div>
      )}
    </main>
  );
}
