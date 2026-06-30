'use client'

import React, { useState } from 'react'

export default function Page() {
  const [slots, setSlots] = useState<2|3|4>(3)
  const [templateName, setTemplateName] = useState('Classic')
  const [bgColor, setBgColor] = useState('#F3F4F6') // Tailwind slate-100 like
  const [caption, setCaption] = useState('Smile!')

  const slotOptions = [2, 3, 4] as const

  return (
    <main className="min-h-screen bg-white text-slate-900 p-6 sm:p-12">
      <header className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Photobooth Template Studio</h1>
            <p className="text-sm text-slate-500">Design symmetric, print-ready photo templates (2 / 3 / 4 slots).</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="px-3 py-1 rounded bg-slate-100 text-xs text-slate-700">Verified</span>
            <button className="inline-flex items-center gap-2 px-3 py-2 bg-rose-700 text-white rounded shadow-sm hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300">
              Export
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="col-span-1">
          <div className="space-y-6 bg-white border rounded-lg p-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700">Template name</label>
              <input
                aria-label="Template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="mt-2 w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Slots</label>
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Number of slots">
                {slotOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSlots(opt as 2|3|4)}
                    aria-pressed={slots === opt}
                    className={`px-3 py-2 rounded border text-sm ${slots === opt ? 'bg-rose-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Background</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  aria-label="Background color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-8 p-0 border rounded"
                />
                <span className="text-sm text-slate-500">Choose a gentle backing for print contrast</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Caption</label>
              <input
                aria-label="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-2 w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div className="pt-2">
              <button
                className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-rose-700 text-white rounded-md shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
                onClick={() => {
                  // simple download: generate SVG and prompt download
                  const svg = document.getElementById('template-preview')?.outerHTML
                  if (!svg) return
                  const blob = new Blob([svg], { type: 'image/svg+xml' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${templateName.replace(/\s+/g, '_') || 'template'}.svg`
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(url)
                }}
              >
                Download SVG
              </button>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            <p>Design rules:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>No forbidden hex: avoid #000, #fff, #F9F6F0</li>
              <li>Use Loko Rust (#8C382A) only for CTA accents</li>
              <li>Templates must be symmetric (choose 2/3/4 slots)</li>
            </ul>
          </div>
        </aside>

        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Live preview</h2>
              <div className="text-sm text-slate-500">Preview is vector SVG — ideal for print</div>
            </div>

            <div className="w-full flex justify-center">
              <div
                style={{ background: bgColor }}
                className="w-full max-w-3xl border border-slate-200 rounded-lg p-6 flex justify-center items-center"
                aria-hidden="false"
              >
                <svg
                  id="template-preview"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1000"
                  height="1400"
                  viewBox="0 0 1000 1400"
                  role="img"
                  aria-label={`Template preview: ${slots} slots`}
                >
                  <defs>
                    <style>{`.caption{font:24px sans-serif; fill:#111827;}`}</style>
                  </defs>

                  {/* Outer bleed safe area */}
                  <rect x="0" y="0" width="1000" height="1400" fill={bgColor} rx="0" />

                  {/* Header banner */}
                  <rect x="40" y="40" width="920" height="120" fill="#fff" stroke="#E6E7EA" strokeWidth="1" rx="8" />
                  <text x="70" y="110" fill="#111827" fontSize="32" fontFamily="Inter, sans-serif">{templateName}</text>

                  {/* Slots area */}
                  {renderSlots(slots)}

                  {/* Caption */}
                  <text x="500" y="1320" textAnchor="middle" className="caption">{caption}</text>
                </svg>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => alert('Applied template to print job (demo)')}
                className="px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Apply to job
              </button>

              <button
                onClick={() => navigator.clipboard?.writeText(JSON.stringify({ templateName, slots, bgColor, caption }))}
                className="px-4 py-2 rounded border bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto mt-10 text-center text-xs text-slate-400">
        <p>Photobooth Template Studio — print-ready templates. No external assets used.</p>
      </footer>
    </main>
  )
}

function renderSlots(slots: number) {
  // returns JSX elements for slot placeholders positioned symmetrically
  if (slots === 2) {
    return (
      <g>
        <rect x="150" y="220" width="320" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
        <rect x="530" y="220" width="320" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
      </g>
    )
  }

  if (slots === 3) {
    return (
      <g>
        <rect x="50" y="220" width="280" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
        <rect x="360" y="220" width="280" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
        <rect x="670" y="220" width="280" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
      </g>
    )
  }

  return (
    <g>
      <rect x="60" y="220" width="220" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
      <rect x="300" y="220" width="220" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
      <rect x="540" y="220" width="220" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
      <rect x="780" y="220" width="120" height="720" fill="#fff" stroke="#D1D5DB" rx="8" />
    </g>
  )
}

