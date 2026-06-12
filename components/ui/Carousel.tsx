"use client";
import React, { useRef } from "react";

export function Carousel({ children, dark = false }: { children: React.ReactNode, dark?: boolean }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group w-full flex items-center">
      {/* Mechanical Arrows for mobile (always visible or prominent) & desktop */}
      <button 
        onClick={() => scroll("left")}
        className={`absolute left-0 z-10 w-12 h-12 flex items-center justify-center border transition-all shadow-sm active:translate-y-[1px] active:shadow-inner ${
          dark 
            ? "bg-[#1A1816] border-[#5A564E] text-[#EAE2D5] hover:bg-[#241E1A] hover:border-[#9C958A]" 
            : "bg-[#EAE2D5] border-[#C4B59D] text-[#241E1A] hover:bg-[#D5CDBD] hover:border-[#9C958A]"
        } -ml-2 md:-ml-6 rounded-none cursor-pointer`}
        aria-label="Scroll left"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="square" strokeLinejoin="miter" d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-8 py-4 scrollbar-hide items-stretch w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child) => (
          <div className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[400px] snap-center shrink-0 flex">
            {child}
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll("right")}
        className={`absolute right-0 z-10 w-12 h-12 flex items-center justify-center border transition-all shadow-sm active:translate-y-[1px] active:shadow-inner ${
          dark 
            ? "bg-[#1A1816] border-[#5A564E] text-[#EAE2D5] hover:bg-[#241E1A] hover:border-[#9C958A]" 
            : "bg-[#EAE2D5] border-[#C4B59D] text-[#241E1A] hover:bg-[#D5CDBD] hover:border-[#9C958A]"
        } -mr-2 md:-mr-6 rounded-none cursor-pointer`}
        aria-label="Scroll right"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="square" strokeLinejoin="miter" d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}
