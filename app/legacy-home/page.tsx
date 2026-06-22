'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { PRESETS, resolveLayout, VIEWBOX, getModifiedLayout, type PhotoboothPreset } from '@/lib/templates';

// ─── CANONICAL PRESETS FOR THE COMMISSIONED EDITIONS SHOWCASE ────────────────
const SELECTED_PRESETS_IDS = [
  "katha-heirloom-pina",
  "katha-editorial-void",
  "katha-editorial-void-postcard",
  "katha-knalum-night",
  "wedding-luxe-gold",
  "wedding-classic-monogram",
  "wedding-vintage-lace",
  "wedding-editorial"
];

// Helper mapping function for Next.js optimized CSS variables
function mapFontToVar(fontStr: string | null | undefined): string {
  if (!fontStr) return "var(--font-sans), sans-serif";
  const f = fontStr.toLowerCase();
  if (f.includes('fraunces')) return "var(--font-serif), serif"; // Vince-Alignment: Fraunces retired → Playfair Display
  if (f.includes('cinzel')) return "var(--font-cinzel), serif";
  if (f.includes('playfair')) return "var(--font-serif), serif";
  if (f.includes('bodoni')) return "var(--font-bodoni), serif";
  if (f.includes('eb garamond')) return "var(--font-hanken), sans-serif"; // Vince-Alignment: EB Garamond retired → Hanken Grotesk
  if (f.includes('italiana')) return "var(--font-serif), serif";
  if (f.includes('aboreto')) return "var(--font-aboreto), sans-serif";
  if (f.includes('great vibes')) return "var(--font-great-vibes), cursive";
  if (f.includes('alex brush')) return "var(--font-alex-brush), cursive";
  if (f.includes('pinyon')) return "var(--font-pinyon), cursive";
  if (f.includes('sacramento')) return "var(--font-sacramento), cursive";
  if (f.includes('rochester')) return "var(--font-rochester), cursive";
  if (f.includes('parisienne')) return "var(--font-parisienne), cursive";
  if (f.includes('la belle')) return "var(--font-la-belle-aurore), cursive";
  if (f.includes('montserrat')) return "var(--font-montserrat), sans-serif";
  if (f.includes('jetbrains')) return "var(--font-jetbrains), monospace";
  return fontStr;
}

// Simplified high fidelity slot preview component
function TemplatePreview({ preset }: { preset: PhotoboothPreset }) {
  const rawLayout = resolveLayout(preset.layoutId, preset.type);
  const layout = getModifiedLayout(rawLayout, "bottom");
  const viewBoxSize = VIEWBOX[preset.type];

  return (
    <div
      style={{ backgroundColor: preset.backgroundColor, width: "100%", height: "100%" }}
      className="relative overflow-hidden w-full h-full"
    >
      {/* slots */}
      {layout.slots.map((s: any, i: number) => {
        const left = (s.x / viewBoxSize.w) * 100;
        const top = (s.y / viewBoxSize.h) * 100;
        const w = (s.w / viewBoxSize.w) * 100;
        const h = (s.h / viewBoxSize.h) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}%`,
              height: `${h}%`,
              backgroundColor: preset.slotBgColor || "#C4B59D",
              border: `1.5px solid ${preset.borderColor || "#241E1A"}`,
            }}
          />
        );
      })}
      {/* Text zone */}
      {(() => {
        const z = layout.textZone;
        const left = (z.x / viewBoxSize.w) * 100;
        const top = (z.y / viewBoxSize.h) * 100;
        const w = (z.w / viewBoxSize.w) * 100;
        const h = (z.h / viewBoxSize.h) * 100;
        return (
          <div
            className="absolute flex flex-col items-center justify-center text-center p-1 overflow-hidden"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}%`,
              height: `${h}%`,
              color: preset.textColor || "#241E1A",
            }}
          >
            <span 
              style={{ fontSize: "7.5%", lineHeight: 1.1, fontFamily: mapFontToVar(preset.fontFamily) }} 
              className="uppercase font-semibold tracking-wide block"
            >
              {preset.titleText || "Maria & Jose"}
            </span>
            <span style={{ fontSize: "5%", opacity: 0.8 }} className="block mt-0.5 tracking-widest font-mono">
              {preset.subTitleText || "2026"}
            </span>
          </div>
        );
      })()}
    </div>
  );
}

export default function Homepage() {
  const displayPresets = SELECTED_PRESETS_IDS.map(id => PRESETS.find(p => p.id === id)).filter(Boolean);

  useEffect(() => {
    // Add js class to trigger scroll animations
    document.documentElement.classList.add("js");

    const items = Array.from(document.querySelectorAll(".reveal"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduce.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => io.observe(el));

    // Hero image drift
    const drift = document.querySelector(".hero-drift") as HTMLElement | null;
    let pending = false;
    const updateDrift = () => {
      const y = window.scrollY;
      const h = drift?.parentElement ? drift.parentElement.offsetHeight : 1;
      const max = h * 0.08;
      const v = Math.min(y * 0.05, max);
      if (drift) {
        drift.style.transform = `translate3d(0, ${v}px, 0) scale(1.09)`;
      }
      pending = false;
    };

    const onScroll = () => {
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(updateDrift);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateDrift();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full selection:bg-[#8C382A] selection:text-[#EAE2D5] shading-light">
      
      {/* ─── CUSTOM STYLES & ZERO-JS FILTER TRIGGERS ──────────────────────── */}
      <style>{`
        :root {
          --obsidian: #111112;
          --ecru: #EAE2D5;
          --iron: #241E1A;
          --ink: #1A1816;
          --champagne: #C4B59D;
          --sequin: #9C958A;
          --rust: #8C382A;
          --terracotta: #A35C44;
          --slate: #5A5D5A;
          --sage: #B5B8A3;
          --ecru-mute: #5A564E;
          --ecru-soft: #6E6A62;
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          --katha-vince-cream: #F6F3EC;
          --katha-vince-beige: #ECE4DA;
          --katha-vince-taupe: #7B736B;
          --katha-vince-walnut: #574C3F;
          --katha-vince-near-black: #36302A;
        }

        /* Enforce absolute border-radius: 0 on all cards and images */
        img, .card, .plate, .frame, .moment, .paper, .edition-card, .aspect-ratio-wrapper, button, input, label {
          border-radius: 0px !important;
        }

        /* Typography posturing */
        .display, h1, h2, h3, h4 {
          font-family: var(--font-display), Georgia, serif;
          font-variation-settings: "SOFT" 100, "WONK" 1;
        }
        body, p, blockquote {
          font-family: var(--font-body), Georgia, serif;
        }
        .site-nav, .foot-nav, label, button, .u-link, .sacred-link {
          font-family: var(--font-sans), sans-serif;
        }
        .mono, .kicker, .stamp, .ord, .index, .cap, .foot-meta {
          font-family: var(--font-jetbrains), monospace;
        }

        /* Patina overlay */
        .patina {
          position: fixed;
          inset: 0;
          z-index: 90;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>");
        }

        /* Tactile Shading System */
        .shading-dark {
          position: relative;
          z-index: 1;
        }
        .shading-dark::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url("/brand/brand/velvet-obsidian-bg.jpeg");
          background-size: cover;
          background-position: center;
          mix-blend-mode: color-burn;
          opacity: 0.15;
          pointer-events: none;
        }
        .shading-dark::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url("/brand/brand/velvet-obsidian-bg.jpeg");
          background-size: cover;
          background-position: center;
          mix-blend-mode: color-burn;
          opacity: 0.15;
          pointer-events: none;
        }

        .shading-light {
          position: relative;
          z-index: 1;
        }
        .shading-light::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url("/brand/brand/white-footer-texture.jpeg");
          background-size: cover;
          background-position: center;
          mix-blend-mode: color-burn;
          opacity: 0.15;
          pointer-events: none;
        }
        .shading-light::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url("/brand/brand/white-footer-texture.jpeg");
          background-size: cover;
          background-position: center;
          mix-blend-mode: color-burn;
          opacity: 0.15;
          pointer-events: none;
        }

        /* Zero-JS Filter Controls Active States */
        #f-all:checked ~ * .f-all-btn { border-color: var(--champagne); background-color: rgba(196, 181, 157, 0.25); color: #EAE2D5; }
        #f-strip:checked ~ * .f-strip-btn { border-color: var(--champagne); background-color: rgba(196, 181, 157, 0.25); color: #EAE2D5; }
        #f-postcard:checked ~ * .f-postcard-btn { border-color: var(--champagne); background-color: rgba(196, 181, 157, 0.25); color: #EAE2D5; }

        #t-all:checked ~ * .t-all-btn { border-color: var(--champagne); background-color: rgba(196, 181, 157, 0.25); color: #EAE2D5; }
        #t-signature:checked ~ * .t-signature-btn { border-color: var(--champagne); background-color: rgba(196, 181, 157, 0.25); color: #EAE2D5; }
        #t-classic:checked ~ * .t-classic-btn { border-color: var(--champagne); background-color: rgba(196, 181, 157, 0.25); color: #EAE2D5; }

        /* Zero-JS Filter Controls Keyboard Focus States */
        #f-all:focus-visible ~ * .f-all-btn { outline: 2px solid var(--champagne); outline-offset: 2px; }
        #f-strip:focus-visible ~ * .f-strip-btn { outline: 2px solid var(--champagne); outline-offset: 2px; }
        #f-postcard:focus-visible ~ * .f-postcard-btn { outline: 2px solid var(--champagne); outline-offset: 2px; }

        #t-all:focus-visible ~ * .t-all-btn { outline: 2px solid var(--champagne); outline-offset: 2px; }
        #t-signature:focus-visible ~ * .t-signature-btn { outline: 2px solid var(--champagne); outline-offset: 2px; }
        #t-classic:focus-visible ~ * .t-classic-btn { outline: 2px solid var(--champagne); outline-offset: 2px; }

        /* Zero-JS Show/Hide filtering mechanics */
        .edition-card { display: block; }
        #f-strip:checked ~ * .edition-card:not(.fmt-strip) { display: none !important; }
        #f-postcard:checked ~ * .edition-card:not(.fmt-postcard) { display: none !important; }
        #t-signature:checked ~ * .edition-card:not(.tier-signature) { display: none !important; }
        #t-classic:checked ~ * .edition-card:not(.tier-classic) { display: none !important; }

        /* General layout styles adapted from index.html */
        .page { position: relative; z-index: 1; }
        .wrap { width: min(100% - clamp(40px, 8vw, 180px), 1720px); margin-inline: auto; }
        .kicker { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ecru-mute); }
        .dark .kicker { color: var(--sequin); }
        h2.display { font-size: clamp(2.1rem, 4.2vw, 3.8rem); font-weight: 400; max-width: 18ch; }
        h3.display { font-size: clamp(1.5rem, 2.4vw, 2.2rem); font-weight: 430; }
        .dark .display { color: var(--ecru); }
        .body-copy { max-width: 54ch; color: var(--ecru-mute); }
        .body-copy strong { font-weight: 500; color: var(--iron); }
        .u-link {
          font-size: 0.78rem; font-weight: 400;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--iron);
          padding-bottom: 0.25rem;
          background-image: linear-gradient(var(--champagne), var(--champagne));
          background-repeat: no-repeat; background-size: 0% 1px; background-position: left calc(100% - 1px);
          transition: background-size 600ms var(--ease);
        }
        .u-link:hover { background-size: 100% 1px; }
        .dark .u-link { color: var(--ecru); }
        
        .section { position: relative; padding-block: clamp(96px, 14vh, 200px); }
        .grid12 {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: clamp(18px, 2.6vw, 44px);
          row-gap: clamp(72px, 10vh, 150px);
          align-items: start;
        }
        .c-1-7 { grid-column: 1 / span 7; }
        .c-8-5 { grid-column: 8 / span 5; }
        .c-1-8 { grid-column: 1 / span 8; }
        .c-9-4 { grid-column: 9 / span 4; }
        .c-1-5 { grid-column: 1 / span 5; }
        .c-6-7 { grid-column: 6 / span 7; }
        .c-8-4 { grid-column: 8 / span 4; }
        .c-1-9 { grid-column: 1 / span 9; }
        .c-10-3 { grid-column: 10 / span 3; }
        .c-2-7 { grid-column: 2 / span 7; }
        .c-3-8 { grid-column: 3 / span 8; }
        .c-4-7 { grid-column: 4 / span 7; }
        .c-5-7 { grid-column: 5 / span 7; }
        .lift-s { margin-top: clamp(36px, 6vw, 96px); }
        .lift-m { margin-top: clamp(64px, 10vw, 160px); }
        .lift-l { margin-top: clamp(88px, 13vw, 210px); }

        .plate { position: relative; }
        .frame { position: relative; z-index: 1; overflow: hidden; background: var(--champagne); }
        .frame img { width: 100%; height: 100%; object-fit: cover; transition: transform 1200ms var(--ease); }
        .plate:hover .frame img { transform: scale(1.03); }
        .r45 { aspect-ratio: 4 / 5; }
        .r34 { aspect-ratio: 3 / 4; }
        .r32 { aspect-ratio: 3 / 2; }
        .r23 { aspect-ratio: 2 / 3; }
        .mat { position: relative; margin: 0 14px 14px 0; }
        .mat::before {
          content: ""; position: absolute; inset: 0;
          transform: translate(14px, 14px);
          background: var(--champagne);
        }
        .mat-iron::before { background: var(--iron); }
        .cap {
          font-size: 0.72rem; letter-spacing: 0.04em;
          color: var(--ecru-mute);
          margin-top: 0.95rem; padding-top: 0.6rem; max-width: 34ch;
          border-top: 1px solid rgba(196, 181, 157, 0.75);
        }
        .dark .cap { color: var(--sequin); border-top-color: rgba(196, 181, 157, 0.35); }

        /* Deckled edge masks */
        .deckle-a {
          clip-path: polygon(0.6% 1.1%, 6% 0.3%, 13% 1.6%, 21% 0.5%, 30% 1.8%, 39% 0.4%, 48% 1.5%, 58% 0.6%, 67% 1.9%, 77% 0.5%, 87% 1.7%, 96% 0.4%, 99.5% 2.2%, 98.7% 11%, 99.6% 22%, 98.5% 33%, 99.4% 45%, 98.6% 57%, 99.5% 68%, 98.4% 79%, 99.3% 90%, 98.6% 98.2%, 91% 99.4%, 81% 98.5%, 70% 99.6%, 59% 98.6%, 48% 99.5%, 37% 98.4%, 26% 99.5%, 16% 98.6%, 7% 99.4%, 1.4% 98.3%, 0.4% 90%, 1.5% 79%, 0.5% 68%, 1.6% 56%, 0.4% 44%, 1.5% 33%, 0.5% 22%, 1.4% 11%)
        }
        .deckle-b {
          clip-path: polygon(1.5% 0.4%, 9% 1.7%, 18% 0.5%, 28% 1.6%, 38% 0.3%, 49% 1.8%, 60% 0.6%, 71% 1.5%, 82% 0.4%, 92% 1.6%, 99.4% 0.7%, 98.5% 9%, 99.6% 19%, 98.4% 30%, 99.5% 42%, 98.5% 54%, 99.6% 65%, 98.4% 76%, 99.5% 87%, 98.3% 97.8%, 90% 99.5%, 79% 98.4%, 68% 99.6%, 56% 98.5%, 45% 99.4%, 34% 98.3%, 23% 99.5%, 13% 98.4%, 4% 99.6%, 0.5% 96%, 1.6% 86%, 0.4% 75%, 1.5% 63%, 0.5% 51%, 1.6% 39%, 0.4% 27%, 1.5% 16%, 0.6% 7%)
        }
        .stitch {
          width: 132px; height: 3px; margin-inline: auto;
          background-image: radial-gradient(circle, rgba(196, 181, 157, 0.95) 1.1px, rgba(196, 181, 157, 0) 1.45px);
          background-size: 11px 3px; background-repeat: repeat-x; background-position: left center;
        }
        .stitch-sage {
          background-image: radial-gradient(circle, rgba(181, 184, 163, 0.8) 1.1px, rgba(181, 184, 163, 0) 1.45px);
        }
        .marginalia {
          position: absolute; top: clamp(96px, 14vh, 200px); right: clamp(8px, 1.4vw, 26px);
          writing-mode: vertical-rl;
          font-size: 0.7rem; letter-spacing: 0.3em;
          color: var(--ecru-mute); text-transform: uppercase;
          pointer-events: none; display: none;
        }
        .stamp {
          font-size: 0.7rem; letter-spacing: 0.04em;
          text-transform: uppercase; color: var(--ecru-mute);
        }

        .hero { padding-top: clamp(64px, 9vh, 140px); }
        .hero-line {
          font-size: clamp(3rem, 8vw, 7.5rem);
          max-width: 11ch;
          margin-top: 1.4rem;
          margin-bottom: clamp(56px, 8vh, 120px);
        }
        .lede {
          margin-top: clamp(36px, 5vh, 72px);
          max-width: 38ch; color: var(--ecru-mute);
          font-size: 1.1rem;
        }

        .philosophy .inner { max-width: 62ch; margin-inline: auto; text-align: center; }
        .philosophy h2 { margin: 1.6rem auto 2.2rem; max-width: 14ch; }
        .philosophy .body-copy { margin-inline: auto; font-size: 1.15rem; }
        .philosophy .stamp { display: block; margin-top: 3rem; }
        .philosophy .stitch { display: block; margin-top: 3.2rem; }

        .install-copy h3 { margin-bottom: 1.3rem; }
        .install-copy .kicker { display: block; margin-bottom: 1.1rem; }
        .install-copy .body-copy { margin-bottom: 2.6rem; }
        .section-head { margin-bottom: clamp(56px, 9vh, 120px); }
        .section-head h2 { margin-top: 1.4rem; }
        .section-head .body-copy { margin-top: 1.4rem; }

        .steps { row-gap: clamp(48px, 7vh, 88px); }
        .step {
          border-top: 1px solid rgba(196, 181, 157, 0.75);
          padding-top: 1.5rem;
          display: grid; grid-template-columns: auto 1fr; column-gap: clamp(1.4rem, 3vw, 3rem);
          align-items: baseline;
        }
        .step .ord {
          font-size: 0.78rem; letter-spacing: 0.04em;
          color: var(--ecru-mute);
        }
        .step h3 { margin-bottom: 0.5rem; }
        .step .cap-line {
          font-size: 0.72rem; letter-spacing: 0.04em;
          color: var(--ecru-mute); margin-top: 0.9rem;
        }
        .seal { display: inline-flex; align-items: center; gap: 0.9rem; margin-top: 2.4rem; }
        .seal img { height: 34px; width: auto; }

        .dark {
          background-color: var(--ink);
          color: var(--ecru);
        }
        .vince-dark {
          background-color: var(--katha-vince-near-black);
          color: var(--katha-vince-cream);
        }
        .vince-dark .kicker, .vince-dark .cap, .vince-dark .body-copy { color: var(--katha-vince-taupe); }
        .vince-dark .display { color: var(--katha-vince-cream); }
        
        .section--barong {
          position: relative;
          background-color: #EAE2D5;
          color: var(--katha-vince-near-black);
          overflow: hidden;
        }
        .section--barong::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: url("/textures/barong-white-canonical.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          mix-blend-mode: multiply;
          opacity: 0.15;
          pointer-events: none;
        }
        .section--barong > * {
          position: relative;
          z-index: 1;
        }
        .section--barong .kicker, .section--barong .cap, .section--barong .body-copy { color: var(--katha-vince-near-black); }

        .voices {
          background-image: none; background-color: var(--ink);
        }
        .commissioned-editions {
          background-image: linear-gradient(rgba(26, 24, 22, 0.93), rgba(26, 24, 22, 0.965)), url("/brand/brand/katha-embroidery-bg.jpg");
          background-size: auto, 720px;
        }
        .voices .body-copy { color: var(--sequin); }
        .quote {
          position: relative;
          padding-left: clamp(1.6rem, 3vw, 2.8rem);
        }
        .quote::before {
          content: "“";
          position: absolute;
          left: 0;
          top: -0.2em;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(2.6rem, 4vw, 3.6rem);
          line-height: 1;
          color: var(--terracotta);
        }
        .quote p {
          font-style: italic; font-size: clamp(1.2rem, 1.9vw, 1.55rem); line-height: 1.5;
          max-width: 44ch; color: var(--ecru);
        }
        .quote footer {
          font-size: 0.72rem; letter-spacing: 0.1em;
          color: var(--sequin); margin-top: 1.3rem;
        }
        .voices .stamp { color: var(--sequin); display: block; margin-top: clamp(48px, 7vh, 80px); }
        .voices .stitch { margin-top: 2rem; margin-inline: 0; }

        .commission { text-align: center; padding-block: clamp(140px, 20vh, 280px); }
        .commission .inner { max-width: 60ch; margin-inline: auto; }
        .commission h2 { margin: 1.6rem auto 1.8rem; max-width: 12ch; }
        .commission .body-copy { margin-inline: auto; margin-bottom: clamp(48px, 7vh, 72px); }
        .sacred-link {
          display: inline-block;
          background-color: var(--rust);
          background-image: linear-gradient(rgba(17, 17, 18, 0), rgba(17, 17, 18, 0));
          color: var(--ecru);
          font-size: 0.85rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 1.2rem 2.8rem;
          transition: background-image 500ms var(--ease);
          border: none;
          cursor: pointer;
        }
        .sacred-link:hover {
          background-image: linear-gradient(rgba(17, 17, 18, 0.14), rgba(17, 17, 18, 0.14));
        }
        .ghost { display: inline-block; margin-top: 2.2rem; }
        .commission .stitch { margin-bottom: 3rem; }
        .seal-k { height: 38px; width: auto; display: block; margin: 0 auto 1.7rem; }

        header.site {
          position: relative; z-index: 2;
          border-bottom: 1px solid rgba(196, 181, 157, 0.5);
          padding-block: 1.35rem;
        }
        .site-row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
        .brand-mark img { height: 21px; width: auto; }
        nav.primary { display: flex; gap: clamp(0.9rem, 2.4vw, 2.3rem); flex-wrap: wrap; }

        footer.site {
          background-color: var(--ink);
          background-image: linear-gradient(rgba(17, 17, 18, 0.88), rgba(17, 17, 18, 0.94)), url("/brand/brand/velvet-obsidian-bg.jpeg"); /* replaced legacy OAX names */
          background-size: auto, cover;
          padding-block: clamp(80px, 11vh, 140px) clamp(48px, 6vh, 72px);
          color: var(--ecru);
        }
        .foot-grid { display: flex; justify-content: space-between; gap: 3rem; flex-wrap: wrap; align-items: flex-start; }
        .foot-brand img { height: 30px; width: auto; }
        .foot-links { display: flex; flex-direction: column; gap: 1.2rem; align-items: flex-start; }
        .foot-meta {
          font-size: 0.72rem; letter-spacing: 0.04em;
          color: var(--sequin);
        }
        .foot-bottom {
          margin-top: clamp(64px, 9vh, 110px);
          display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap;
        }

        /* Reveal transitions */
        html.js .reveal {
          opacity: 0; transform: translateY(24px);
          transition: opacity 1000ms var(--ease), transform 1000ms var(--ease);
        }
        html.js .reveal.in { opacity: 1; transform: translateY(0); }
        html.js .d2 { transition-delay: 140ms; }
        html.js .d3 { transition-delay: 280ms; }
        html.js .d4 { transition-delay: 420ms; }
        .hero-drift { will-change: transform; }

        @media (min-width: 1500px) {
          .marginalia { display: block; }
        }
        @media (max-width: 767px) {
          .grid12 { row-gap: 56px; }
          .grid12 > * { grid-column: 1 / -1; }
          .lift-s, .lift-m, .lift-l { margin-top: 0; }
          .hero-line { margin-bottom: 48px; }
          .mat { margin: 0 12px 12px 0; }
          .mat::before { transform: translate(12px, 12px); }
          .step { grid-template-columns: auto 1fr; }
        }
        @media (max-width: 639px) {
          .site-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          html.js .reveal { opacity: 1; transform: none; transition: none; }
          .frame img { transition: none; }
          .plate:hover .frame img { transform: none; }
          .u-link { transition: none; }
        }
      `}</style>

      <div className="patina" aria-hidden="true"></div>

      <div className="page">
        
        {/* ─── SITE HEADER ─────────────────────────────────────────────────── */}
        <header className="site">
          <div className="wrap site-row">
            <a className="brand-mark" href="#main" aria-label="Katha, top of page">
              <img src="/brand/brand/wordmark-obsidian.png" alt="Katha" width={1392} height={616} loading="eager" decoding="async" />
            </a>
            <nav className="primary" aria-label="Primary">
              <a className="u-link" href="#philosophy">Philosophy</a>
              <a className="u-link" href="#installations">Installations</a>
              <a className="u-link" href="#work">Work</a>
              <a className="u-link" href="#editions">Editions</a>
              <a className="u-link" href="#process">Process</a>
              <a className="u-link" href="/secured">Studio</a>
            </nav>
          </div>
        </header>

        {/* ─── MAIN LANDING PAGE CONTENT ───────────────────────────────────── */}
        <main id="main">

          {/* 1. HERO SECTION (8/4 Grid) */}
          <section className="section hero relative overflow-hidden vince-dark shading-dark" aria-labelledby="hero-h">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 mix-blend-luminosity"
            >
              <source src="/hero/hero-legacy.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#36302A]/80 via-[#36302A]/50 to-[#36302A] z-0"></div>
            
            <p className="marginalia relative z-10" aria-hidden="true" style={{ color: 'var(--katha-vince-taupe)' }}>KTHA · The portrait, composed · Southern California</p>
            <div className="wrap relative z-10">
              <h1 id="hero-h" className="sr-only">Katha Photo Booth</h1>
              <p className="kicker reveal">DSLR photo booth studio · Southern California</p>
              <p className="display hero-line reveal d2">The portrait, composed.</p>
              <div className="grid12">
                <figure className="plate c-1-7 reveal">
                  <div className="mat">
                    <div className="frame deckle-a r34">
                      <img className="hero-drift" src="/brand/photo/21_Peachy_Booth_Stock.jpg" alt="An unattended white photo booth with a white umbrella stands between two tall columns of peach and blush flowers against an ecru wall." width={1707} height={2560} loading="eager" fetchPriority="high" decoding="async" />
                    </div>
                  </div>
                  <figcaption className="cap">Pearl installation, peach columns.</figcaption>
                </figure>
                <div className="c-8-5 lift-m">
                  <figure className="plate reveal d2">
                    <div className="frame r34">
                      <img src="/brand/photo/22_Peachy_Booth_Stock.jpg" alt="A closeup of a white booth camera head under a white umbrella beside a dense column of peach and cream flowers." width={1707} height={2560} loading="lazy" decoding="async" />
                    </div>
                    <figcaption className="cap">Camera under the umbrella.</figcaption>
                  </figure>
                  <p className="lede reveal d3">Weddings, celebrations, and corporate rooms, photographed with studio discipline and printed before the last dance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. PHILOSOPHY SECTION (7/5 Grid) */}
          <section className="section philosophy section--barong" id="philosophy" aria-labelledby="philosophy-h">
            <div className="wrap inner">
              <p className="kicker reveal">01 · Philosophy</p>
              <h2 id="philosophy-h" className="display reveal d2">To compose a story.</h2>
              <p className="body-copy reveal d3">Katha is Tagalog. It means to compose, to weave, to make. We build the quietest instrument in the room: DSLR capture, studio strobe through a beauty dish, paper that outlasts the night. <strong>The booth is the instrument. The print is the work.</strong></p>
              <span className="stamp reveal d4">Archive note 01 · pina ecru ground · calado line</span>
              <div className="stitch reveal d4" aria-hidden="true"></div>
            </div>
          </section>

          {/* 3. INSTALLATIONS SECTION */}
          <section className="section" id="installations" aria-labelledby="installations-h">
            <div className="wrap">
              <div className="section-head">
                <p className="kicker reveal">02 · The installations</p>
                <h2 id="installations-h" className="display reveal d2">Two installations. One identity.</h2>
              </div>
              <div className="grid12">
                <figure className="plate c-1-7 reveal">
                  <div className="mat mat-iron">
                    <div className="frame deckle-b r34">
                      <img src="/brand/brand/product-editorial-installation.webp" alt="A weathered oak photo booth with a white beauty dish strobe stands in a string lit ballroom among dressed tables." width={800} height={1066} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <figcaption className="cap">Oak cabinet, ballroom posting.</figcaption>
                </figure>
                <div className="c-8-5 install-copy lift-s">
                  <span className="kicker reveal">Installation 01</span>
                  <h3 className="display reveal d2">Weathered oak. Raw iron.</h3>
                  <p className="body-copy reveal d3">Built to stand in a ballroom without asking for attention. Studio strobe through a beauty dish holds detail at a distance and keeps skin honest in low light.</p>
                  <figure className="plate reveal d3">
                    <div className="frame r34">
                      <img src="/brand/brand/product-glam-installation.webp" alt="Close detail of the oak cabinet print bay as a DNP printer delivers prints beside a pocket clock and ribbed glass." width={1652} height={2212} loading="lazy" decoding="async" />
                    </div>
                    <figcaption className="cap">The print bay, working.</figcaption>
                  </figure>
                </div>
                <div className="c-1-5 install-copy lift-s">
                  <span className="kicker reveal">Installation 02</span>
                  <h3 className="display reveal d2">Pearl white. Modern line.</h3>
                  <p className="body-copy reveal d3">A pale cabinet on a single stem, set for daylight rooms and brighter palettes. Same lens, same paper, same discipline. DNP dye sublimation prints, cut and dry in seconds, leave with your guests.</p>
                </div>
                <figure className="plate c-6-7 reveal d2">
                  <div className="mat">
                    <div className="frame deckle-a r45">
                      <img src="/brand/photo/6_Peachy_Booth_Stock.jpg" alt="A white photobooth with umbrella stands in a cream arched alcove between peach floral columns." width={1707} height={2560} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <figcaption className="cap">Pearl cabinet, arched alcove.</figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* 4. WORK SECTION (Selected evenings) */}
          <section className="section" id="work" aria-labelledby="work-h">
            <p className="marginalia" aria-hidden="true">Printed the same night · KTHA</p>
            <div className="wrap">
              <div className="section-head">
                <p className="kicker reveal">03 · Work</p>
                <h2 id="work-h" className="display reveal d2">Print is the proof.</h2>
                <p className="body-copy reveal d3">Eight frames from recent rooms across Southern California. The captions carry the rest.</p>
              </div>
              <div className="grid12">
                <figure className="plate c-1-8 reveal">
                  <div className="mat">
                    <div className="frame deckle-a r45">
                      <img src="/gallery/work-01-champagne-coupes.jpg" alt="A tower of filled champagne coupes stands on a black table against a soft plaster wall as a hand steadies a green bottle." width={3648} height={5472} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <figcaption className="cap">Coupes, stacked before toasts.</figcaption>
                </figure>
                <figure className="plate c-9-4 lift-m reveal d2">
                  <div className="frame r34">
                    <img src="/gallery/work-02-screen-cream-curtain.jpg" alt="An oval photobooth screen shows a filter preview in front of cream curtains." width={2667} height={4000} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="cap">The screen, cream curtain.</figcaption>
                </figure>

                <figure className="plate c-1-5 lift-s reveal">
                  <div className="frame r45">
                    <img src="/gallery/work-03-prints-cowhide.jpg" alt="Branded photo booth prints lie on a cowhide rug beside a bolo tie, a crystal glass of whiskey, and a ring." width={1067} height={1600} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="cap">Prints rest on cowhide.</figcaption>
                </figure>
                <figure className="plate c-6-7 reveal d2">
                  <div className="mat mat-iron">
                    <div className="frame deckle-b r45">
                      <img src="/gallery/work-04-oxblood-curtain.jpg" alt="A groom hugs a bride from behind in front of a deep brown curtain while a wooden photo booth and a black cowboy hat sit in the foreground." width={1067} height={1600} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <figcaption className="cap">Oxblood curtain, held close.</figcaption>
                </figure>

                <figure className="plate c-1-9 reveal">
                  <div className="frame r32">
                    <img src="/gallery/work-05-tap-screen.jpg" alt="A bride leans forward to tap a white booth while a smiling man in black stands behind her in a white draped room." width={2560} height={1707} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="cap">She taps the screen.</figcaption>
                </figure>
                <figure className="plate c-10-3 lift-l reveal d2">
                  <div className="frame r23">
                    <img src="/gallery/work-06-formal-black.jpg" alt="A couple in black formalwear embraces quietly against a softly lit white wall." width={1067} height={1600} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="cap">Formal black, soft wall.</figcaption>
                </figure>

                <figure className="plate c-1-7 reveal">
                  <div className="mat">
                    <div className="frame deckle-a r45">
                      <img src="/gallery/work-07-champagne-pleats.jpg" alt="A woman in a champagne pleated dress smiles downward in front of a mottled green wall." width={3491} height={5236} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <figcaption className="cap">Champagne pleats, green wall.</figcaption>
                </figure>
                <figure className="plate c-8-5 lift-m reveal d2">
                  <div className="frame r34">
                    <img src="/gallery/work-08-prints-silver-tray.jpg" alt="Three branded photobooth prints of a group of friends rest on a polished silver tray." width={2667} height={4000} loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="cap">Three prints, silver tray.</figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* 5. COMMISSIONED EDITIONS SECTION (Black Barong Physical Texture & Zero-JS CSS Filters) */}
          <section className="section dark shading-dark commissioned-editions" id="editions" aria-labelledby="editions-h">
            <div className="wrap">
              <header className="sec-head">
                <p className="kicker reveal">04 · Editions</p>
                <h2 id="editions-h" className="display reveal d2" style={{ color: '#EAE2D5' }}>Commissioned Editions.</h2>
                <p className="body-copy reveal d3" style={{ color: '#9C958A', marginTop: '1rem' }}>
                  Explore our collection of finished templates. Designed with strict layout math, unbleached Pina textures, and quiet typography restraint.
                </p>
              </header>

              {/* Zero-JS CSS filtering system */}
              <div className="filter-system mt-12">
                {/* Hidden Radio Inputs serving as CSS triggers */}
                <input type="radio" id="f-all" name="format-filter" defaultChecked className="sr-only" />
                <input type="radio" id="f-strip" name="format-filter" className="sr-only" />
                <input type="radio" id="f-postcard" name="format-filter" className="sr-only" />

                <input type="radio" id="t-all" name="tier-filter" defaultChecked className="sr-only" />
                <input type="radio" id="t-signature" name="tier-filter" className="sr-only" />
                <input type="radio" id="t-classic" name="tier-filter" className="sr-only" />

                {/* Filter selectors container */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 border-b border-[#C4B59D]/20 pb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase text-[#9C958A] tracking-widest mr-2">Format:</span>
                    <label htmlFor="f-all" className="f-all-btn cursor-pointer text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[#C4B59D]/30 transition-all text-[#9C958A]">All</label>
                    <label htmlFor="f-strip" className="f-strip-btn cursor-pointer text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[#C4B59D]/30 transition-all text-[#9C958A]">2×6 strip</label>
                    <label htmlFor="f-postcard" className="f-postcard-btn cursor-pointer text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[#C4B59D]/30 transition-all text-[#9C958A]">4×6 postcard</label>
                  </div>
                  <div className="flex items-center gap-3 md:ml-auto">
                    <span className="text-[10px] font-mono uppercase text-[#9C958A] tracking-widest mr-2">Tier:</span>
                    <label htmlFor="t-all" className="t-all-btn cursor-pointer text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[#C4B59D]/30 transition-all text-[#9C958A]">All</label>
                    <label htmlFor="t-signature" className="t-signature-btn cursor-pointer text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[#C4B59D]/30 transition-all text-[#9C958A]">Signature</label>
                    <label htmlFor="t-classic" className="t-classic-btn cursor-pointer text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[#C4B59D]/30 transition-all text-[#9C958A]">Classic</label>
                  </div>
                </div>

                {/* Cards Library Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" id="library">
                  {displayPresets.map((preset: any) => {
                    const isSignature = preset.name.includes("Katha Signature");
                    const isStrip = preset.type === "strip";
                    const isPostcardVert = preset.type === "postcard-vertical";
                    return (
                      <article 
                        key={preset.id}
                        className={`edition-card bg-[#EAE2D5] p-3 text-[#241E1A] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between ${isStrip ? 'fmt-strip' : 'fmt-postcard'} ${isSignature ? 'tier-signature' : 'tier-classic'}`}
                      >
                        <div>
                          <div className="aspect-ratio-wrapper mb-4 relative overflow-hidden bg-[#EAE2D5] border border-[#C4B59D] p-4" style={{ aspectRatio: isStrip ? '2/6' : isPostcardVert ? '4/6' : '6/4' }}>
                            <TemplatePreview preset={preset} />
                          </div>
                          <h4 className="font-serif text-lg font-normal text-[#241E1A]">{preset.name.replace("Katha Signature — ", "").replace("Katha Classic — ", "")}</h4>
                          <p className="text-[10px] font-mono tracking-widest text-[#5A564E] mt-1 uppercase">
                            {isStrip ? '2×6 strip' : '4×6 postcard'} · {isSignature ? 'Signature' : 'Classic'}
                          </p>
                          <p className="text-xs text-[#5A564E] mt-2 font-serif leading-relaxed line-clamp-3">{preset.designerExplanation}</p>
                        </div>
                        <a className="u-link text-[10px] uppercase tracking-widest mt-6 inline-block font-sans hover:text-[#241E1A] font-medium border-b border-[#C4B59D]/50 w-fit" href={`mailto:kathabooth@gmail.com?subject=Template Selection: ${preset.id}`}>
                          Select this template
                        </a>
                      </article>
                    );
                  })}
                </div>

              </div>

            </div>
          </section>

          {/* 6. PROCESS SECTION */}
          <section className="section" id="process" aria-labelledby="process-h">
            <div className="wrap">
              <div className="section-head">
                <p className="kicker reveal">05 · Process</p>
                <h2 id="process-h" className="display reveal d2">Four quiet steps.</h2>
              </div>
              <ol className="grid12 steps">
                <li className="step c-2-7 reveal">
                  <span className="ord">01</span>
                  <div>
                    <h3 className="display">Inquire</h3>
                    <p className="body-copy">Write with the date and the room. We answer plainly.</p>
                    <p className="cap-line">Dates, venue, scope.</p>
                  </div>
                </li>
                <li className="step c-3-8 reveal d2">
                  <span className="ord">02</span>
                  <div>
                    <h3 className="display">Consult</h3>
                    <p className="body-copy">Terms, timing, and one recommendation for your floor plan.</p>
                    <p className="cap-line">One conversation. Clear terms.</p>
                  </div>
                </li>
                <li className="step c-4-7 reveal d3">
                  <span className="ord">03</span>
                  <div>
                    <h3 className="display">Install</h3>
                    <p className="body-copy">Load in before your guests notice the doors are open.</p>
                    <p className="cap-line">We arrive early, quietly.</p>
                  </div>
                </li>
                <li className="step c-5-7 reveal d4">
                  <span className="ord">04</span>
                  <div>
                    <h3 className="display">Deliver</h3>
                    <p className="body-copy">Dye sublimation prints, sleeved and handed over the same night.</p>
                    <p className="cap-line">Prints leave with guests.</p>
                  </div>
                </li>
              </ol>
              <span className="seal reveal">
                <img src="/brand/brand/logo-paint.png" alt="" width={188} height={232} loading="lazy" decoding="async" />
                <span className="stamp">KTHA · process seal</span>
              </span>
            </div>
          </section>

          {/* 7. TESTIMONIALS SECTION (Voices) */}
          <section className="section dark voices" id="voices" aria-labelledby="voices-h">
            <div className="wrap">
              <div className="section-head">
                <p className="kicker reveal">06 · Voices</p>
                <h2 id="voices-h" className="display reveal d2">Three voices.</h2>
              </div>
              <div className="grid12">
                <blockquote className="quote c-1-7 reveal">
                  <p>From selection to installation, Katha was attentive, professional, and a refined presence during our reception.</p>
                  <footer>VIVIAN V.</footer>
                </blockquote>
                <blockquote className="quote c-6-7 reveal d2">
                  <p>Everyone at my wedding was delighted. The team is so friendly. We highly recommend them.</p>
                  <footer>SCARLETH B.</footer>
                </blockquote>
                <blockquote className="quote c-3-8 reveal d3">
                  <p>The images are simply on another level. The smoothing is subtle and luminous. Everyone looked like the best version of themselves.</p>
                  <footer>GLADYS G.</footer>
                </blockquote>
              </div>
              <span className="stamp reveal">Plate 02 · barong embroidery, calado openwork</span>
              <div className="stitch stitch-sage reveal" aria-hidden="true"></div>
            </div>
          </section>

          {/* 8. ACQUISITION SECTION (Begin the Commission) */}
          <section className="section commission" id="commission" aria-labelledby="commission-h">
            <div className="wrap inner">
              <div className="stitch reveal" aria-hidden="true"></div>
              <p className="kicker reveal">07 · Inquiry</p>
              <img className="seal-k reveal d2" src="/brand/brand/logo-paint.png" alt="" width={188} height={232} loading="lazy" decoding="async" />
              <h2 id="commission-h" className="display reveal d2">Begin your inquiry.</h2>
              <p className="body-copy reveal d3">Tell us the date and the room. We will compose the rest.</p>
              
              {/* MASTER CTA: EXACTLY ONE LOKO RUST SACRED CTA IN THE PORT */}
              <a
                className="sacred-link cta-sacred reveal d3"
                href="mailto:kathabooth@gmail.com?subject=Proposal%20Inquiry"
                style={{ backgroundColor: '#8C382A' }}
              >
                Begin Your Inquiry
              </a>
              
              <br />
              <a className="u-link ghost reveal d4" href="/secured">View the template gallery</a>
            </div>
          </section>

        </main>

        {/* ─── SITE FOOTER ─────────────────────────────────────────────────── */}
        <footer className="site dark shading-dark">
          <div className="wrap">
            <div className="foot-grid">
              <a className="foot-brand" href="#main" aria-label="Katha, top of page">
                <img src="/brand/brand/wordmark-ecru.png" alt="Katha" width={1392} height={616} loading="lazy" decoding="async" />
              </a>
              <div className="foot-links">
                <a className="u-link text-xs tracking-widest text-[#EAE2D5] font-medium" href="/secured">View the template gallery</a>
                <a className="u-link text-xs tracking-widest text-[#EAE2D5] font-medium mt-2" href="mailto:kathabooth@gmail.com?subject=Proposal%20Inquiry">kathabooth@gmail.com</a>
                <span className="foot-meta mt-4 block text-[#9C958A]">Southern California</span>
              </div>
            </div>
            <div className="foot-bottom">
              <span className="foot-meta text-[#9C958A]">© 2026 Katha Photo Booth</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
