"use client";

import React from "react";

export default function InquirePage() {
  const honeybookFormUrl = "https://widget.honeybook.com/assets_users_production/companies/679039857c7a9b001f4098a8/widgets/contact-form/contact-form.html";

  return (
    <main
      className="min-h-screen text-[#F2E6D2] font-jost flex flex-col items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: "#0B0C10", // Obsidian
        fontFamily: "var(--font-jost), sans-serif",
        fontWeight: 300,
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

      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Title Block */}
        <div className="text-center border-b border-[#C4B59D]/10 pb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] font-mono" style={{ color: "#D4AF37" }}>
            Reservation Intake
          </p>
          <h1
            className="mt-3 text-3xl font-light tracking-tight text-[#EAE2D5]"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Commission Katha
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[#9C958A] font-serif">
            Initiate your event reservation. Fill out the form below to enter the Gilded Archive pipeline.
          </p>
        </div>

        {/* Framed HoneyBook Embed */}
        <div className="bg-[#17100A] p-1 border border-[#C4B59D]/10 relative min-h-[600px] flex flex-col">
          <iframe
            src={honeybookFormUrl}
            className="w-full flex-1 border-0 min-h-[600px] bg-transparent"
            title="Katha Photo Booth Reservation Inquiry Form"
            allow="payment"
          />
        </div>

        {/* Fallback Outbound Link Box */}
        <div className="p-5 border border-[#C4B59D]/10 bg-[#17100A]/30 text-center flex flex-col items-center gap-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#9C958A] font-mono">
            Form blocked by adblockers or not loading?
          </p>
          <a
            href={honeybookFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 text-[9px] uppercase tracking-[0.16em] font-bold bg-[#8C382A] text-[#EAE2D5] hover:bg-[#6E2C20] transition-colors"
            style={{ borderRadius: 0 }}
          >
            Open Form in New Tab
          </a>
        </div>
      </div>
    </main>
  );
}
