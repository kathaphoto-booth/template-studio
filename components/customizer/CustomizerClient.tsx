"use client";

import React, { useState } from "react";
import LivePreview from "./LivePreview";
import content from "@/lib/content.json";
import { getLayout, layoutsForFormat } from "@/lib/layouts";

type SubmitState =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "ok" }
  | { phase: "error"; message: string };

export default function CustomizerClient({ leadId }: { leadId: string }) {
  const templates = content.templates;
  const palettes = content.palettes;

  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [activePalette, setActivePalette] = useState(palettes[0]);
  const [layoutId, setLayoutId] = useState<string>(templates[0].layout ?? "strip-3");
  const [textPosition, setTextPosition] = useState<"bottom" | "top">("bottom");
  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    venue: "",
  });
  const [submit, setSubmit] = useState<SubmitState>({ phase: "idle" });

  // The plate's registered layout anchors which format's variations we offer.
  const activeLayout = getLayout(activeTemplate.layout) ?? getLayout("strip-3")!;
  const availableLayouts = layoutsForFormat(activeLayout.format);

  async function finalize() {
    if (submit.phase === "sending") return;
    setSubmit({ phase: "sending" });
    try {
      const res = await fetch("/api/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: activeTemplate.id,
          templateName: activeTemplate.name,
          layout: activeLayout.format,
          names: formState.title || null,
          date: formState.subtitle || null,
          venue: formState.venue || null,
          fontFamily: activeTemplate.font || null,
          notes: JSON.stringify({
            layoutId,
            palette: activePalette.key,
            textPosition,
          }),
          lead: leadId && leadId !== "demo" ? leadId : null,
          selectedAt: new Date().toISOString(),
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok) {
        setSubmit({ phase: "ok" });
      } else {
        setSubmit({
          phase: "error",
          message:
            body?.error ||
            "We couldn't record the design just now. Nothing was lost — please try again.",
        });
      }
    } catch {
      setSubmit({
        phase: "error",
        message:
          "We couldn't reach the studio just now. Nothing was lost — please try again.",
      });
    }
  }

  const pickBtn = (active: boolean) =>
    `text-left p-3 border transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-[44px] ${
      active
        ? "border-[var(--color-katha-gilt)] bg-[var(--color-katha-l2)]"
        : "border-[var(--color-katha-ln)] hover:border-[var(--color-katha-mut)] hover:bg-[var(--color-katha-l2)]"
    }`;

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[var(--color-katha-l0)]">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[400px] flex-shrink-0 font-body bg-[var(--color-katha-l1)] border-r border-[var(--color-katha-ln)] overflow-y-auto z-10 flex flex-col relative">
        <div className="p-8 pb-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-katha-mut)] uppercase mb-2">
            {"// Studio Customizer"}
          </p>
          <h1 className="text-2xl font-light text-[var(--color-katha-hi)] mb-2 font-display">
            Design your print.
          </h1>
          <p className="text-sm text-[var(--color-katha-mut)]">
            Compose the inscription and pick a paper hue. The proof updates as
            you type.
          </p>
        </div>

        <div className="flex-1 p-8 space-y-10">
          {/* Template Selection */}
          <section>
            <h2 className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-katha-mut)] uppercase mb-4">
              Base plate
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {templates.filter((t: any) => !t.isFootnote).map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTemplate(t);
                    setLayoutId(t.layout);
                  }}
                  aria-pressed={activeTemplate.id === t.id}
                  className={pickBtn(activeTemplate.id === t.id)}
                >
                  <p className="text-xs text-[var(--color-katha-ink)] font-medium">{t.name}</p>
                  <p className="font-mono text-[10px] text-[var(--color-katha-mut)] mt-1">{t.formatLabel}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Layout Selection */}
          <section>
            <h2 className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-katha-mut)] uppercase mb-4">
              Layout variation
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {availableLayouts.map((l: any) => (
                <button
                  key={l.id}
                  onClick={() => setLayoutId(l.id)}
                  aria-pressed={layoutId === l.id}
                  className={pickBtn(layoutId === l.id)}
                >
                  <p className="text-xs text-[var(--color-katha-ink)] font-medium">{l.label}</p>
                  <p className="font-mono text-[10px] text-[var(--color-katha-mut)] mt-1">{l.slotCount} slots</p>
                </button>
              ))}
            </div>
          </section>

          {/* Inscription position */}
          <section>
            <h2 className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-katha-mut)] uppercase mb-4">
              Inscription position
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(["bottom", "top"] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setTextPosition(pos)}
                  aria-pressed={textPosition === pos}
                  className={pickBtn(textPosition === pos)}
                >
                  <p className="text-xs text-[var(--color-katha-ink)] font-medium capitalize">{pos}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Palette Selection */}
          <section>
            <h2 className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-katha-mut)] uppercase mb-4">
              Paper &amp; ink
            </h2>
            <div className="space-y-2">
              {palettes.map((p: any) => (
                <button
                  key={p.key}
                  onClick={() => setActivePalette(p)}
                  aria-pressed={activePalette.key === p.key}
                  className={`w-full flex items-center justify-between p-3 border transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-[44px] ${
                    activePalette.key === p.key
                      ? "border-[var(--color-katha-gilt)] bg-[var(--color-katha-l2)]"
                      : "border-[var(--color-katha-ln)] hover:border-[var(--color-katha-mut)] hover:bg-[var(--color-katha-l2)]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-5 h-5 border border-[var(--color-katha-ln2)]"
                      style={{ backgroundColor: p.bg }}
                      aria-hidden="true"
                    />
                    <span className="text-xs text-[var(--color-katha-ink)]">{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Text Controls — specimen examples come from the plate catalog */}
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-katha-mut)] uppercase mb-2">
              Inscription
            </h2>

            <div>
              <label htmlFor="cz-title" className="block font-mono text-[10px] text-[var(--color-katha-mut)] uppercase mb-1">
                Names
              </label>
              <input
                id="cz-title"
                type="text"
                placeholder="AMARA & SEBASTIAN"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full bg-transparent border-b border-[var(--color-katha-ln)] focus:border-[var(--color-katha-gilt)] py-2 text-sm text-[var(--color-katha-ink)] placeholder-[var(--color-katha-fnt)] outline-none transition-colors duration-500"
              />
            </div>

            <div>
              <label htmlFor="cz-subtitle" className="block font-mono text-[10px] text-[var(--color-katha-mut)] uppercase mb-1">
                Date line
              </label>
              <input
                id="cz-subtitle"
                type="text"
                placeholder="OCTOBER · LONG BEACH"
                value={formState.subtitle}
                onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                className="w-full bg-transparent border-b border-[var(--color-katha-ln)] focus:border-[var(--color-katha-gilt)] py-2 text-sm text-[var(--color-katha-ink)] placeholder-[var(--color-katha-fnt)] outline-none transition-colors duration-500"
              />
            </div>

            <div>
              <label htmlFor="cz-venue" className="block font-mono text-[10px] text-[var(--color-katha-mut)] uppercase mb-1">
                Venue line
              </label>
              <input
                id="cz-venue"
                type="text"
                placeholder="Optional"
                value={formState.venue}
                onChange={(e) => setFormState({ ...formState, venue: e.target.value })}
                className="w-full bg-transparent border-b border-[var(--color-katha-ln)] focus:border-[var(--color-katha-gilt)] py-2 text-sm text-[var(--color-katha-ink)] placeholder-[var(--color-katha-fnt)] outline-none transition-colors duration-500"
              />
            </div>
          </section>
        </div>

        <div className="p-8 pt-4 bg-[var(--color-katha-l1)] border-t border-[var(--color-katha-ln)]">
          {submit.phase === "error" && (
            <p
              role="alert"
              className="mb-4 border-l-2 border-[var(--color-katha-gilt)] pl-3 text-sm text-[var(--color-katha-ink)]"
            >
              {submit.message}
            </p>
          )}
          {submit.phase === "ok" ? (
            <p className="w-full border border-[var(--color-katha-gilt)] text-[var(--color-katha-gilt)] py-4 text-center font-mono text-xs tracking-[0.18em] uppercase">
              Design recorded — we&rsquo;ll take it from here
            </p>
          ) : (
            <button
              onClick={finalize}
              disabled={submit.phase === "sending"}
              className="w-full bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] py-4 font-mono text-xs font-semibold tracking-[0.18em] uppercase hover:bg-[var(--color-katha-champ)] transition-colors duration-500 disabled:opacity-60 min-h-[44px]"
            >
              {submit.phase === "sending" ? "Recording…" : "Finalize custom design"}
            </button>
          )}
        </div>
      </aside>

      {/* Live Preview Area */}
      <main className="flex-1 relative bg-[var(--color-katha-l0)] flex items-center justify-center p-8 overflow-hidden">
        {/* Subtle grid background for the studio environment */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjMyLCAyMjUsIDIxMSwgMC4wNSkiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />

        <LivePreview
          template={activeTemplate}
          layoutId={layoutId}
          palette={activePalette}
          title={formState.title}
          subtitle={formState.subtitle}
          venue={formState.venue}
          textPosition={textPosition}
        />
      </main>
    </div>
  );
}
