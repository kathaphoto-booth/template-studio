"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PRESETS, renderDecorativeSvg, type PhotoboothPreset, resolveLayout, VIEWBOX, LUXURY_FONTS, getModifiedLayout } from "@/lib/templates";
import { mapFontToVar } from "@/lib/font-mapper";
import { supabase } from "@/lib/supabase";
import { SERVICE_TIERS, getServiceTier } from "@/lib/serviceTiers";
import type { ServiceTierId } from "@/lib/serviceTiers";

import { TemplateGallery } from "@/components/booking/TemplateGallery";
import { ServiceTierCards } from "@/components/booking/ServiceTierCards";
import { ReviewScreen } from "@/components/booking/ReviewScreen";
import { ConfirmationScreen } from "@/components/booking/ConfirmationScreen";

function tileDims(type: PhotoboothPreset["type"]) {
  if (type === "strip") return { w: 100, h: 300, vb: "0 0 600 1800" };
  if (type === "postcard-vertical") return { w: 200, h: 300, vb: "0 0 1200 1800" };
  return { w: 200, h: 133, vb: "0 0 1800 1200" };
}

export const isSignature = (p: PhotoboothPreset) => p.name.includes("Katha Signature");

export function TemplateCanvas({
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
      className="relative overflow-hidden ring-1 ring-black/5"
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
      <svg
        viewBox={vb}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none z-10"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

export type ReferencePhoto = { preview: string; value: string };

// ── Stable field primitives (module-level so they never remount on keystroke) ──
function TextField({
  id, label, type = "text", value, onChange, placeholder = "", autoComplete,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs tracking-[0.18em] uppercase text-[#241E1A]" style={{ fontFamily: "var(--font-sans)" }}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-[#C4B59D] px-4 py-3 text-[#241E1A] placeholder:text-[#5A5D5A] focus:outline-none focus:ring-1 focus:ring-[#8C382A] focus:border-[#8C382A] transition-all"
        style={{ fontFamily: "var(--font-sans)", borderRadius: 0 }}
      />
    </div>
  );
}

function SelectField({
  id, label, value, onChange, options,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs tracking-[0.18em] uppercase text-[#241E1A]" style={{ fontFamily: "var(--font-sans)" }}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-[#C4B59D] px-4 py-3 text-[#241E1A] focus:outline-none focus:ring-1 focus:ring-[#8C382A] focus:border-[#8C382A] transition-all appearance-none"
        style={{ fontFamily: "var(--font-sans)", borderRadius: 0 }}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  );
}

type Step = "details" | "installation" | "references" | "review" | "confirmation";

const FONT_OPTIONS = ["Playfair Display (Serif)", "Hanken Grotesk (Sans)", "Inter (Mono)"];
const POSITION_OPTIONS = ["Bottom", "Top"];

export default function TemplateDesignClient({ id }: { id: string }) {
  const [selected, setSelected] = useState<PhotoboothPreset | null>(null);
  const [step, setStep] = useState<Step>("details");

  // ── Form state (full data contract expected by /api/selection) ──
  const [names, setNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const [textPosition, setTextPosition] = useState("Bottom");
  const [serviceTier, setServiceTier] = useState<ServiceTierId | null>(null);
  const [referencePhotos, setReferencePhotos] = useState<ReferencePhoto[]>([]);

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const objectUrls = useRef<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Revoke any object URLs we created when the component unmounts.
  useEffect(() => {
    const urls = objectUrls.current;
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)); };
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
    setStep("details");
  }, []);

  // Esc closes the panel; move focus into it on open.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, select, button, [tabindex]")?.focus();
    }, 50);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [selected, step, closeModal]);

  const resetForm = () => {
    setNames(""); setEmail(""); setPhone(""); setDate(""); setVenue(""); setAddress("");
    setNotes(""); setSelectedFont(""); setTextPosition("Bottom"); setServiceTier(null);
    objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrls.current.clear();
    setReferencePhotos([]); setErrorMsg("");
  };

  const onSelectTemplate = (preset: PhotoboothPreset) => {
    setSelected(preset);
    setStep("details");
  };

  // ── Reference photo upload — restored real presigned path + base64 fallback ──
  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => (typeof e.target?.result === "string" ? resolve(e.target.result) : reject(new Error("read failed")));
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
      const { error } = await supabase.storage.from("katha-references").uploadToSignedUrl(path, token, file);
      if (error) return null;
      return path;
    } catch {
      return null;
    }
  };

  const handleFiles = async (files: FileList) => {
    setErrorMsg("");
    const maxFiles = 3;
    const maxSize = 1.5 * 1024 * 1024; // 1.5MB per file

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

  const removePhoto = (index: number) => {
    setReferencePhotos((prev) => {
      const target = prev[index];
      if (target && target.preview.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview);
        objectUrls.current.delete(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  // ── Submit — full payload restored so /api/selection stops losing data ──
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
            event_venue: venue.trim() || undefined,
          }),
        });
        if (inqRes.ok) {
          const inqData = await inqRes.json();
          currentLead = inqData.lead_hash;
        }
      } catch { /* lead creation is best-effort */ }
    }

    const payload = {
      templateId: selected.id,
      templateName: selected.name,
      layout: selected.type,
      names: names || null,
      date: date.trim() || null,
      venue: venue.trim() || null,
      address: address.trim() || null,
      fontFamily: selectedFont ? mapFontToVar(selectedFont) : null,
      textPosition: textPosition.toLowerCase(),
      referencePhotos: referencePhotos.length > 0 ? referencePhotos.map((p) => p.value) : null,
      notes: notes.trim() || null,
      serviceTier,
      lead: currentLead,
      selectedAt: new Date().toISOString(),
      configuration: {
        customFont: selectedFont || selected.fontFamily,
        textPosition: textPosition.toLowerCase(),
        tier: isSignature(selected) ? "signature" : "classic",
        layoutId: selected.layoutId ?? null,
      },
    };

    try {
      const res = await fetch("/api/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok || res.status === 202) setStep("confirmation");
    } catch { /* swallow — UX falls back to staying on review */ } finally {
      setIsSubmitting(false);
    }
  };

  const canLeaveDetails = names.trim().length > 0 && /\S+@\S+\.\S+/.test(email);
  const tier = serviceTier ? getServiceTier(serviceTier) : undefined;

  // ── Step body ──
  const renderStep = () => {
    switch (step) {
      case "details":
        return (
          <div className="flex flex-col gap-10">
            <section className="flex flex-col gap-5">
              <h3 className="text-lg text-[#241E1A]" style={{ fontFamily: "var(--font-serif)" }}>Your details</h3>
              <TextField id="names" label="Full name" value={names} onChange={setNames} placeholder="E.g., Clara & Henry" autoComplete="name" />
              <TextField id="email" label="Email address" type="email" value={email} onChange={setEmail} placeholder="hello@example.com" autoComplete="email" />
              <TextField id="phone" label="Phone number" type="tel" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" autoComplete="tel" />
            </section>
            <section className="flex flex-col gap-5">
              <h3 className="text-lg text-[#241E1A]" style={{ fontFamily: "var(--font-serif)" }}>The event</h3>
              <TextField id="date" label="Event date" type="date" value={date} onChange={setDate} />
              <TextField id="venue" label="Venue name" value={venue} onChange={setVenue} placeholder="E.g., The Grand Oak Manor" />
              <TextField id="address" label="Venue address" value={address} onChange={setAddress} placeholder="City, State" />
            </section>
            <section className="flex flex-col gap-5">
              <h3 className="text-lg text-[#241E1A]" style={{ fontFamily: "var(--font-serif)" }}>Design preferences</h3>
              <SelectField id="font" label="Typography style" value={selectedFont} onChange={setSelectedFont} options={FONT_OPTIONS} />
              <SelectField id="position" label="Text position" value={textPosition} onChange={setTextPosition} options={POSITION_OPTIONS} />
              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-xs tracking-[0.18em] uppercase text-[#241E1A]" style={{ fontFamily: "var(--font-sans)" }}>Notes (optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Anything we should know about the room or the moment."
                  className="w-full bg-transparent border border-[#C4B59D] px-4 py-3 text-[#241E1A] placeholder:text-[#5A5D5A] focus:outline-none focus:ring-1 focus:ring-[#8C382A] focus:border-[#8C382A] transition-all resize-none"
                  style={{ fontFamily: "var(--font-sans)", borderRadius: 0 }}
                />
              </div>
            </section>
          </div>
        );
      case "installation":
        return (
          <div className="flex flex-col gap-6">
            <h3 className="text-lg text-[#241E1A]" style={{ fontFamily: "var(--font-serif)" }}>Choose your installation</h3>
            <ServiceTierCards selectedTierId={serviceTier} onSelectTier={setServiceTier} />
          </div>
        );
      case "references":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A564E]">Optional</span>
              <h3 className="text-lg text-[#241E1A]" style={{ fontFamily: "var(--font-serif)" }}>Reference photos</h3>
              <p className="text-sm text-[#5A564E]" style={{ fontFamily: "var(--font-sans)" }}>
                Upload inspiration or venue photos to guide the design direction.
              </p>
            </div>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              role="region"
              aria-label="Drop zone for reference photos"
              className={`relative border border-dashed p-10 text-center transition-all ${dragActive ? "border-[#241E1A] bg-[#C4B59D]/20" : "border-[#C4B59D] bg-[#EAE2D5] hover:bg-[#C4B59D]/10"}`}
            >
              <input
                id="katha-photo-upload"
                type="file"
                multiple
                accept="image/*"
                disabled={uploading}
                aria-label="Upload reference photos"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
                onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <svg className="w-8 h-8 mb-4 text-[#C4B59D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? (
                  <p className="text-sm text-[#5A564E]" style={{ fontFamily: "var(--font-sans)" }}>Reading files…</p>
                ) : (
                  <>
                    <p className="text-sm text-[#241E1A]" style={{ fontFamily: "var(--font-sans)" }}>
                      Drag photos here, or <span className="underline decoration-[#C4B59D] underline-offset-4">browse</span>
                    </p>
                    <p className="text-xs mt-3 text-[#5A564E]" style={{ fontFamily: "var(--font-sans)" }}>Max 3 files, 1.5MB each</p>
                  </>
                )}
              </div>
            </div>
            {errorMsg && <p role="alert" className="text-xs text-[#8C382A] text-center" style={{ fontFamily: "var(--font-sans)" }}>{errorMsg}</p>}
            {referencePhotos.length > 0 && (
              <div className="flex gap-4 flex-wrap" role="list" aria-label="Uploaded reference photos">
                {referencePhotos.map((photo, index) => (
                  <div key={index} role="listitem" className="relative w-24 h-24 border border-[#C4B59D] overflow-hidden bg-[#EAE2D5]">
                    <img src={photo.preview} alt={`Reference photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={`Remove reference photo ${index + 1}`}
                      className="absolute top-1 right-1 bg-[#1A1816]/80 hover:bg-[#1A1816] text-[#EAE2D5] text-xs w-6 h-6 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "review":
        return (
          <ReviewScreen
            data={{
              names,
              email,
              phone,
              date,
              venue,
              address,
              templateName: selected?.name ?? "",
              fontFamily: selectedFont || (selected?.fontFamily ?? ""),
              textPosition,
              tierName: tier?.name ?? "—",
              tierPrice: tier?.price,
              referencePhotos: referencePhotos.map((p) => p.preview),
            }}
            onEdit={(stepIndex) => {
              if (stepIndex <= 3) setStep("details");
              else if (stepIndex === 4) setStep("installation");
              else setStep("references");
            }}
            onBack={() => setStep("references")}
            onSubmit={confirmSelection}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  // ── Footer nav (review supplies its own; confirmation has none) ──
  const renderFooter = () => {
    if (step === "review") return null;
    const back: Record<Exclude<Step, "review" | "confirmation">, Step | null> = {
      details: null,
      installation: "details",
      references: "installation",
    };
    const next: Record<Exclude<Step, "review" | "confirmation">, Step> = {
      details: "installation",
      installation: "references",
      references: "review",
    };
    const s = step as Exclude<Step, "review" | "confirmation">;
    const blockedAtDetails = step === "details" && !canLeaveDetails;
    const blockedAtInstallation = step === "installation" && !serviceTier;
    const blocked = blockedAtDetails || blockedAtInstallation;
    return (
      <div className="flex justify-between items-center p-6 sm:p-8 border-t border-[#C4B59D] bg-[#EAE2D5] shrink-0">
        <button
          onClick={() => back[s] && setStep(back[s] as Step)}
          disabled={!back[s]}
          className={`border border-[#C4B59D] text-[#5A564E] px-6 py-3 text-xs tracking-[0.18em] uppercase transition-all hover:text-[#241E1A] hover:bg-[#C4B59D]/15 ${!back[s] ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          style={{ borderRadius: 0 }}
        >
          Back
        </button>
        <button
          onClick={() => setStep(next[s])}
          disabled={blocked}
          className="bg-[#8C382A] text-[#EAE2D5] px-8 py-4 text-xs tracking-[0.18em] uppercase hover:bg-[#7A2A1D] active:-translate-y-px transition-all disabled:opacity-50 disabled:bg-[#241E1A]"
          style={{ borderRadius: 0 }}
        >
          {step === "references" ? "Review inquiry" : "Continue"}
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#EAE2D5] text-[#241E1A] overflow-x-hidden">
      <TemplateGallery onSelectTemplate={onSelectTemplate} />

      {selected && step === "confirmation" && (
        <div className="fixed inset-0 z-50">
          <ConfirmationScreen onReturnHome={() => { resetForm(); closeModal(); }} />
        </div>
      )}

      {selected && step !== "confirmation" && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
          <div className="absolute inset-0 bg-[#1A1816]/70 backdrop-blur-sm" onClick={closeModal} aria-hidden="true" />

          <div
            ref={panelRef}
            className="relative w-full max-w-[640px] h-full bg-[#EAE2D5] border-l border-[#C4B59D] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 sm:p-8 border-b border-[#C4B59D] shrink-0">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#5A564E]" style={{ fontFamily: "var(--font-sans)" }}>
                  {step === "details" ? "Step 01 · Personalize"
                    : step === "installation" ? "Step 02 · Installation"
                    : step === "references" ? "Step 03 · References"
                    : "Step 04 · Review"}
                </span>
                <h2 id="booking-modal-title" className="text-xl sm:text-2xl text-[#241E1A] tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  {selected.name}
                </h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close and return to gallery"
                className="text-[#5A564E] hover:text-[#241E1A] transition-colors p-2 -mr-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {renderStep()}
            </div>

            {renderFooter()}
          </div>
        </div>
      )}
    </main>
  );
}
