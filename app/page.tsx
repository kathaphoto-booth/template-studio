import content from "@/lib/content.json";
const { tiers: TIERS, templates: TEMPLATES } = content;
import { SidebarClient } from "@/components/SidebarClient";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";

export default function Home() {
  return (
      <main className="w-full h-screen bg-[var(--color-katha-l0)] text-[var(--color-katha-hi)] font-body grid grid-cols-1 md:grid-cols-[82fr_18fr] overflow-hidden">
        
        {/* 82% Main Stage - Gallery First */}
        <section className="relative px-6 md:px-10 lg:px-14 py-16 lg:py-24 border-r border-[var(--color-katha-ln)] overflow-y-auto h-screen custom-scrollbar">
          <header className="mb-20 max-w-[800px] mt-10">
            <h1 className="font-display font-light text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] mb-6">
              Katha. <span className="text-[var(--color-katha-mut)] italic">Heritage photo-booth installations.</span>
            </h1>
            <p className="font-body text-xl text-[var(--color-katha-mut)] leading-[1.6]">
              Eighty-two print plates in the archive, drawn by hand and held to one
              standard — twelve hang in tonight&rsquo;s gallery. Find the one that fits
              your night; we shape the details with you.
            </p>
          </header>

          {/* Masonry Gallery */}
          <MasonryGrid templates={TEMPLATES} />

          {/* The Work — real nights, real prints */}
          <section aria-label="Recent installations" className="pb-24">
            <div className="flex items-baseline justify-between border-t border-[var(--color-katha-ln)] pt-10 mb-10">
              <h2 className="font-display font-light text-3xl text-[var(--color-katha-hi)] tracking-tight">
                The work<span className="text-[var(--color-katha-gilt)]">.</span>
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--color-katha-fnt)]">
                // From recent installations
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <figure className="md:col-span-7">
                <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3">
                  <img
                    src="/portfolio/velour-floral.webp"
                    alt="Guests framed by a velour and floral installation, warm archival print tones"
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-katha-mut)]">
                  Velour floral — Oak booth
                </figcaption>
              </figure>
              <figure className="md:col-span-5 md:mb-16">
                <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3">
                  <img
                    src="/portfolio/glam-portrait.webp"
                    alt="High-contrast monochrome glam portrait from the Glam Editorial installation"
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-katha-mut)]">
                  Glam editorial — monochrome
                </figcaption>
              </figure>
              <figure className="md:col-span-5 md:col-start-2">
                <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3">
                  <img
                    src="/portfolio/wildflower-wedding.webp"
                    alt="Wedding guests at a wildflower-backed booth, archival paper texture"
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-katha-mut)]">
                  Wildflower wedding — archival stock
                </figcaption>
              </figure>
              <figure className="md:col-span-4 md:mb-24">
                <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3">
                  <img
                    src="/portfolio/western-rich.webp"
                    alt="Western-styled installation with rich tonal backdrop and oak hardware"
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-katha-mut)]">
                  Western rich — Oak booth
                </figcaption>
              </figure>
            </div>
            <p className="mt-12 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--color-katha-fnt)]">
              Plate No. 2026-CF · ©2026 Katha Booth
            </p>
          </section>

        </section>
        
        {/* 18% Totem Sidebar */}
        <aside className="h-screen overflow-y-auto custom-scrollbar bg-[var(--color-katha-l0)] flex flex-col pt-12 pb-8 px-6 lg:px-8 border-l border-[var(--color-katha-ln)] z-40 hidden md:flex">
          <SidebarClient tiers={TIERS} />
        </aside>

        {/* Mobile reserve bar — the sidebar is hidden under md; the booking
            moment must stay reachable (PRD §9.2, safe-area cleared). */}
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-katha-l1)] border-t border-[var(--color-katha-ln)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <a
            href="/gallery"
            className="flex items-center justify-between px-6 py-4 min-h-[44px]"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-katha-gilt)]">
              Reserve your date
            </span>
            <span aria-hidden="true" className="text-[var(--color-katha-gilt)]">
              →
            </span>
          </a>
        </div>
      </main>
  );
}
