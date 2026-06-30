"use client";
import React, { useState } from "react";

export default function Home() {
  const [slots, setSlots] = useState<number>(3);
  const [presetName, setPresetName] = useState<string>("Classic Trio");

  const slotArray = Array.from({ length: slots }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 antialiased">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/icon.png" alt="Katha Photobooth" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="font-semibold text-xl">Katha Template Studio</h1>
            <p className="text-sm text-slate-600">Design symmetric photobooth templates (2 / 3 / 4 slots)</p>
          </div>
        </div>
        <nav>
          <a href="#studio" className="text-sm font-medium text-slate-700 hover:underline">Studio</a>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">Create beautiful, symmetric photobooth templates</h2>
            <p className="text-slate-700 mb-6">Select the slot layout, preview a responsive template, and export production-ready assets. Built to KATHA brand rules: symmetric layouts only, Loko Rust CTA, no rounded corners.</p>

            <div className="flex flex-wrap gap-3 items-center mb-6">
              <label className="sr-only">Slots</label>
              <div className="flex items-center gap-2" role="tablist" aria-label="Choose number of slots">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSlots(n)}
                    aria-pressed={slots === n}
                    className={`px-4 py-2 font-medium border border-slate-200 text-slate-800 ${slots === n ? "bg-slate-100" : "bg-white"}`}
                    style={{ WebkitAppearance: "none", appearance: "none" }}
                  >
                    {n} slots
                  </button>
                ))}
              </div>

              <div className="ml-4">
                <label htmlFor="preset" className="sr-only">Preset name</label>
                <input
                  id="preset"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="px-3 py-2 border border-slate-200 text-slate-800 bg-white"
                  placeholder="Preset name"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="px-5 py-3 font-semibold text-slate-50"
                style={{ backgroundColor: "#8C382A", border: "1px solid #8C382A", WebkitAppearance: "none", appearance: "none" }}
                onClick={() => alert(`Exporting preset: ${presetName} (${slots} slots)`)}
              >
                Export preset
              </button>

              <a
                href="#studio"
                className="px-5 py-3 font-medium text-slate-700 border border-slate-200 bg-white"
              >
                Open studio
              </a>
            </div>
          </div>

          <div aria-live="polite">
            <h3 className="text-sm font-medium text-slate-600 mb-3">Preview — {slots} slot{slots > 1 ? "s" : ""}</h3>

            <div className={`grid gap-2 ${slots === 2 ? "grid-cols-2" : slots === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
              {slotArray.map((i) => (
                <figure key={i} className="bg-white border border-slate-200 p-3 flex flex-col items-center justify-center" aria-label={`Slot ${i}`}>
                  <img src={`/studio/placeholder-${i % 3}.png`} alt={`Template slot ${i}`} className="w-full h-40 object-cover" />
                  <figcaption className="mt-3 text-sm text-slate-600">Slot {i}</figcaption>
                </figure>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-500">Responsive preview — exports produce PNGs and SVGs. No rounded corners are applied to templates.</p>
          </div>
        </div>
      </section>

      <section id="studio" className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 p-6">
          <h4 className="text-lg font-semibold mb-3">Studio controls</h4>
          <p className="text-sm text-slate-600 mb-4">Adjust spacing, background, and export settings below.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-slate-700 mb-2">Background</span>
              <select className="px-3 py-2 border border-slate-200 bg-white text-slate-800">
                <option>Classic Paper</option>
                <option>Dark Slate</option>
                <option>Photo Negative</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-slate-700 mb-2">Spacing</span>
              <input type="range" min={0} max={40} defaultValue={8} className="w-full" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-slate-700 mb-2">Export format</span>
              <select className="px-3 py-2 border border-slate-200 bg-white text-slate-800">
                <option>PNG (high res)</option>
                <option>SVG (vector)</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-500">
        © {new Date().getFullYear()} Katha Photobooth — Templates are symmetric (2 / 3 / 4). All brand rules applied.
      </footer>
    </main>
  );
}
