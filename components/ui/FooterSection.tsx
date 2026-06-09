"use client";

import React from "react";
import Image from "next/image";

interface FooterSectionProps {
  variant?: "textured" | "concept";
  children?: React.ReactNode;
}

export function FooterSection({ variant = "textured", children }: FooterSectionProps) {
  const bgImage = variant === "textured" 
    ? "/brand/white-footer-texture.jpeg" 
    : "/brand/footer-concept.jpeg";

  return (
    <footer style={{ 
      position: "relative", 
      width: "100%", 
      minHeight: "40vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end", // Align towards bottom for footer
      color: "#1A1A1A"
    }}>
      {/* Absolute Background Image */}
      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <Image 
          src={bgImage}
          alt="Katha Booth Footer"
          fill
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />
      </div>

      {/* Content Overlay */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1440px", padding: "48px 24px" }}>
        {children}
      </div>
    </footer>
  );
}
