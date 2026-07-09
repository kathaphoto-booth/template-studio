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
              Eighty-two print plates, drawn by hand and held to one standard.
              Find the one that fits your night — we shape the details with you.
            </p>
          </header>
          
          {/* Masonry Gallery */}
          <MasonryGrid templates={TEMPLATES} />

        </section>
        
        {/* 18% Totem Sidebar */}
        <aside className="h-screen overflow-y-auto custom-scrollbar bg-[var(--color-katha-l0)] flex flex-col pt-12 pb-8 px-6 lg:px-8 border-l border-[var(--color-katha-ln)] z-40 hidden md:flex">
          <SidebarClient tiers={TIERS} />
        </aside>
      </main>
  );
}
