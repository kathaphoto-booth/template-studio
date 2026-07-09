import content from "@/lib/content.json";
const { tiers: TIERS, templates: TEMPLATES } = content;
import { SidebarClient } from "@/components/SidebarClient";

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
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-24">
            {TEMPLATES.filter(t => !t.isFootnote).map((template, i) => (
              <div key={i} className="break-inside-avoid mb-6 relative group cursor-pointer">
                <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_var(--color-katha-shadow)]">
                  <div 
                    className="w-full flex items-center justify-center relative overflow-hidden bg-[var(--color-katha-l2)]"
                    style={{ aspectRatio: template.ratio ? `${template.ratio.w} / ${template.ratio.h}` : "2 / 3" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex flex-col items-center justify-center opacity-30">
                      {/* Placeholder for actual generated images */}
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[var(--color-katha-fnt)]">{template.formatLabel}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-baseline px-1">
                    <span className="font-display text-xl text-[var(--color-katha-hi)]">{template.name}</span>
                    <span className="font-mono text-[9px] uppercase text-[var(--color-katha-fnt)] tracking-widest">{template.booth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* 18% Totem Sidebar */}
        <aside className="h-screen overflow-y-auto custom-scrollbar bg-[var(--color-katha-l0)] flex flex-col pt-12 pb-8 px-6 lg:px-8 border-l border-[var(--color-katha-ln)] z-40 hidden md:flex">
          <SidebarClient tiers={TIERS} />
        </aside>
      </main>
  );
}
