'use client';
import React, { useState, useEffect, useRef } from 'react';

// --- 1. KATHA BRAND CANON: PALETTE ---
const COLORS = {
  pinaEcru: '#EAE2D5',
  obsidianWeave: '#111112',
  lokoRust: '#8C382A',
  ironBark: '#241E1A',
  champagneHeirloom: '#C4B59D',
  hammeredSequin: '#9C958A',
  knalumInk: '#1A1816',
  abelSlate: '#5A5D5A',
  ecruSafe70: '#5A564E',
};

// --- 2. TYPOGRAPHY SYSTEM ---
const fonts = {
  display: {
    fontFamily: '"Fraunces", serif',
    fontVariationSettings: '"SOFT" 100, "WONK" 1',
    fontWeight: 400,
    letterSpacing: '-0.015em',
  },
  body: {
    fontFamily: '"EB Garamond", serif',
    fontWeight: 400,
    lineHeight: 1.55,
  },
  meta: {
    fontFamily: '"JetBrains Mono", monospace',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  }
};

// --- 3. WABI-SABI PRIMITIVES ---

function KathaThread() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    path.style.strokeDasharray = `${L}`;
    path.style.strokeDashoffset = `${L}`;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const phi = Math.min(1, Math.max(0, window.scrollY / Math.max(1, max)));
      path.style.strokeDashoffset = `${L * (1 - phi)}`;
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Init
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-y-0 left-[20%] w-[100px] h-screen pointer-events-none z-[2] overflow-visible mix-blend-difference">
      <svg width="100%" height="400%" viewBox="0 0 100 400" preserveAspectRatio="none">
        <path 
          ref={pathRef}
          d="M 50 0 C 60 40, 40 80, 50 120 S 60 200, 50 240 S 40 320, 50 360 L 50 388 M 50 388 l 4 0 l 0 6 l -4 0 z M 56 388 l 6 0 m -3 0 l 0 6 M 66 388 l 0 6 m 0 -3 l 6 0 M 76 388 l 0 6 l 4 -6 l 0 6" 
          stroke={COLORS.pinaEcru} 
          strokeWidth="1" 
          fill="none" 
          className="transition-all duration-300 ease-out"
        />
      </svg>
    </div>
  );
}

function SequinCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Wabi-sabi noise field simulation
      ctx.fillStyle = COLORS.pinaEcru;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(17, 17, 18, 0.02)'; 
      for (let i = 0; i < 8000; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[-1]" />;
}

function DeckledCard({ children, variant = 'ecru', className = '' }: { children: React.ReactNode, variant?: 'ecru' | 'dark', className?: string }) {
  const isDark = variant === 'dark';
  // Synthetic deckled edge using clippath for preview compatibility
  return (
    <div 
      className={`relative p-8 md:p-12 ${className}`}
      style={{ 
        backgroundColor: isDark ? COLORS.ironBark : COLORS.pinaEcru,
        color: isDark ? COLORS.pinaEcru : COLORS.obsidianWeave,
        clipPath: 'polygon(1% 2%, 98% 1%, 99% 98%, 2% 99%)', // Rough fukinsei asymmetric box
        boxShadow: isDark ? 'none' : 'inset 0 0 0 1px rgba(196,181,157,0.2)'
      }}
    >
      <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: 'rgba(196, 181, 157, 0.3)' }}></div>
      <div className="absolute inset-5 border pointer-events-none" style={{ borderColor: 'rgba(196, 181, 157, 0.15)' }}></div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

// --- 4. HOMEPAGE ASSEMBLY ---

export default function App() {
  return (
    <div className="k-patina min-h-screen w-full relative selection:bg-[#8C382A] selection:text-[#EAE2D5]">
      {/* Font Injections for Previewer */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..700,30..100,0..1&family=EB+Garamond:ital,wght@0,400..600;1,400..600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .k-patina::after {
          content: ""; position: fixed; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
          opacity: 0.6; z-index: 9999; mix-blend-mode: multiply;
        }
      `}</style>

      <SequinCanvas />
      <KathaThread />

      <main className="relative z-10 w-full" style={{ color: COLORS.obsidianWeave, ...fonts.body }}>
        
        {/* 1. HERO (8/4 Grid) */}
        <section className="min-h-[90vh] grid grid-cols-1 md:grid-cols-12 gap-6 pt-32 px-6 md:px-12 pb-24 max-w-[1440px] mx-auto">
          <div className="md:col-span-8 flex flex-col justify-end md:pr-24 pb-12">
            <h1 style={fonts.display} className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-12">
              Artefacts of<br />Presence.
            </h1>
            <p className="text-xl md:text-2xl max-w-md text-[#5A564E] leading-relaxed">
              Katha Photo Booth studio commissioned editions are designed for peer-executive 
              gatherings and intentional heritage events. We create functional artefacts 
              confirming output exists as physically tactile evidence.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end items-end relative w-full h-[50vh] md:h-auto">
            <DeckledCard variant="ecru" className="w-full h-full md:aspect-[3/4]">
                <div className="absolute inset-0 bg-[#D4AF37] opacity-5 blur-2xl"></div>
                <div className="w-full h-full border border-dashed border-[#C4B59D]/50 flex items-center justify-center">
                    <span style={fonts.meta} className="text-[#9C958A] text-xs">Physical Evidence</span>
                </div>
            </DeckledCard>
          </div>
        </section>

        {/* 2. PHILOSOPHY (7/5 Grid) */}
        <section className="py-32 md:py-48 px-6 md:px-12 relative" style={{ backgroundColor: COLORS.ironBark, color: COLORS.pinaEcru }}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-[1280px] mx-auto items-center">
            <div className="md:col-span-7 md:pr-24">
                <span style={{ ...fonts.meta, color: COLORS.champagneHeirloom }} className="text-xs">
                  THE LOOM
                </span>
                <h2 style={fonts.display} className="text-5xl md:text-6xl mt-6 mb-12 leading-tight">
                  Restraint<br />Over Splendor.
                </h2>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                  We reject the chaotic maximalism of standard photo booths. We embrace 
                  ‘Ma’ negative space, strictly controlled typography variations, and purposeful asymmetric grids. Every Katha edition 
                  demonstrates intentional restraint, architectural alignment, and respect 
                  for the image as evidence.
                </p>
            </div>
            <div className="md:col-span-5 flex flex-col gap-8 mt-12 md:mt-0">
                <div className="w-full h-64 border" style={{ borderColor: 'rgba(196, 181, 157, 0.2)' }}></div>
                <div className="w-4/5 h-48 border ml-auto -mt-24 md:-mt-32" style={{ borderColor: 'rgba(196, 181, 157, 0.4)' }}></div>
            </div>
          </div>
        </section>

        {/* 3. PROCESS (Asymmetric 8/4) */}
        <section className="py-32 md:py-48 px-6 md:px-12 max-w-[1440px] mx-auto">
            <div className="text-center mb-24 flex flex-col items-center">
                <span style={{ ...fonts.meta, color: COLORS.abelSlate }} className="text-xs">
                  OUR PROCESS
                </span>
                <h2 style={fonts.display} className="text-5xl md:text-6xl mt-6 mb-12">Commissioning Excellence.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4 md:mt-24">
                    <DeckledCard variant="dark" className="aspect-square md:aspect-[3/4]">
                        <span style={fonts.display} className="text-3xl">01. Discovery</span>
                        <p className="mt-4 opacity-80 text-base">We audit event goals and aesthetic requirements.</p>
                    </DeckledCard>
                </div>
                <div className="md:col-span-4">
                    <DeckledCard variant="dark" className="aspect-square md:aspect-[3/4]">
                        <span style={fonts.display} className="text-3xl">02. Design</span>
                        <p className="mt-4 opacity-80 text-base">Drafting functional architectural layouts.</p>
                    </DeckledCard>
                </div>
                 <div className="md:col-span-4 md:mt-24">
                    <DeckledCard variant="dark" className="aspect-square md:aspect-[3/4]">
                        <span style={fonts.display} className="text-3xl">03. Execution</span>
                        <p className="mt-4 opacity-80 text-base">Flawless generation and physical artefact output.</p>
                    </DeckledCard>
                </div>
            </div>
        </section>

        {/* 4. ACQUISITION FOOTER */}
        <footer className="py-32 px-6 md:px-12 mt-12 md:mt-24" style={{ backgroundColor: COLORS.obsidianWeave, color: COLORS.pinaEcru }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-[1440px] mx-auto">
                <div className="lg:col-span-7">
                    <h4 style={fonts.display} className="text-5xl md:text-7xl leading-tight">Commission<br /> KTHA Studio.</h4>
                    <p className="text-xl md:text-2xl mt-12 max-w-xl opacity-90">
                        Artefacts of presence confirming physical tactile evidence. 
                        Request console access to receive commissioned edition output.
                    </p>
                </div>
                <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-12 lg:gap-16 pt-6 lg:pt-12">
                   {/* MASTER CTA */}
                   <button 
                     className="py-6 px-12 border group overflow-hidden relative cursor-pointer"
                     style={{ backgroundColor: COLORS.lokoRust, borderColor: COLORS.lokoRust, color: COLORS.pinaEcru }}
                    >
                    <span style={fonts.meta} className="text-sm relative z-10">Reserve the evening</span>
                    <div className="absolute inset-0 bg-[#241E1A] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                   </button>
                   
                   <p style={fonts.meta} className="text-xs opacity-60 lg:text-right">
                    Katha Photo Booth © 2026. <br /> Los Angeles | NAPA VALLEY | CEBU
                   </p>
                </div>
            </div>
        </footer>

      </main>
    </div>
  );
}
