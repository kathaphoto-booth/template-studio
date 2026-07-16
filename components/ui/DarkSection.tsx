"use client";

import React from "react";
import Image from "next/image";

interface DarkSectionProps {
  children?: React.ReactNode;
}

export function DarkSection({ children }: DarkSectionProps) {
  return (
    <section style={{ 
      position: "relative", 
      width: "100%", 
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#FAFAFA" // Light text on dark obsidian background
    }}>
      {/* Absolute Background Image */}
      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <Image 
          src="/brand/velvet-obsidian-bg.jpeg"
          alt="Katha Booth Velvet Obsidian"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Content Overlay */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1440px", padding: "48px 24px" }}>
        {children}
      </div>
    </section>
  );
}
