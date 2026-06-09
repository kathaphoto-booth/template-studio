"use client";

import React from "react";
import Image from "next/image";

interface HeroSectionProps {
  variant?: "wood" | "white";
  children?: React.ReactNode;
}

export function HeroSection({ variant = "wood", children }: HeroSectionProps) {
  const bgImage = variant === "wood" 
    ? "/brand/wood-hero-nav.jpeg" 
    : "/brand/white-nav.jpeg";

  return (
    <section style={{ 
      position: "relative", 
      width: "100%", 
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* Absolute Background Image */}
      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <Image 
          src={bgImage}
          alt="Katha Booth Hero"
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
      </div>

      {/* Content overlay area built around the brand assets */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1440px", padding: "0 24px" }}>
        {children}
      </div>
    </section>
  );
}
