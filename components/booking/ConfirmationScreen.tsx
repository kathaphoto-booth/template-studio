"use client";

import React from "react";

interface ConfirmationScreenProps {
  onReturnHome?: () => void;
}

export function ConfirmationScreen({ onReturnHome }: ConfirmationScreenProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#111112] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle Woven-Textile Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-[720px] w-full px-6 text-center">
        {/* Wordmark + Thread (Resting State) */}
        <div className="flex items-center justify-center w-full max-w-[400px] mb-12">
          {/* Left Thread */}
          <div className="h-px bg-[#C4B59D] flex-1 opacity-70" />
          
          {/* Wordmark */}
          <h1 
            className="px-6 text-3xl md:text-4xl tracking-tight lowercase text-[#EAE2D5]"
            style={{ fontFamily: "var(--font-serif), serif", fontWeight: 400 }}
          >
            katha
          </h1>
          
          {/* Right Thread */}
          <div className="h-px bg-[#C4B59D] flex-1 opacity-70" />
        </div>

        {/* Confirmation Message */}
        <h2 
          className="text-2xl md:text-3xl mb-6 tracking-tight text-[#EAE2D5]"
          style={{ fontFamily: "var(--font-serif), serif", fontWeight: 400 }}
        >
          Your inquiry is received.
        </h2>
        
        {/* Next Steps */}
        <div 
          className="space-y-4 text-[#EAE2D5]/80 max-w-[480px] mx-auto text-base md:text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          <p>
            We will review your requested date and details to ensure our availability.
          </p>
          <p>
            You can expect a response with a detailed proposal within the next two business days.
          </p>
        </div>

        {/* Optional Return Action */}
        {onReturnHome && (
          <button
            onClick={onReturnHome}
            className="mt-16 group flex items-center justify-center gap-2 text-sm tracking-[0.18em] uppercase text-[#B5B8A3] hover:text-[#5A5D5A] transition-colors duration-300"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          >
            <span className="border-b border-[#C4B59D]/30 pb-1 group-hover:border-[#5A5D5A]/50 transition-colors">
              Return Home
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
