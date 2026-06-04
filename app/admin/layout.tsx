export const dynamic = "force-dynamic";

import type { ReactNode } from "react";

export const metadata = { title: "Katha Studio Admin" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111112", color: "#EAE2D5", fontFamily: "'EB Garamond', Georgia, serif" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(196,181,157,0.18)", padding: "20px 40px", display: "flex", alignItems: "baseline", gap: "24px" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#8C382A", fontWeight: 700 }}>
          Katha
        </span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: 400, color: "#EAE2D5", letterSpacing: "-0.01em" }}>
          Studio Admin
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#9C958A", marginLeft: "auto" }}>
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </span>
      </div>
      {/* Content */}
      <main style={{ padding: "40px" }}>
        {children}
      </main>

      {/* Decorative Piña Ecru L-shaped architectural bracket */}
      <div style={{
        position: "fixed",
        top: "20px", left: "20px", bottom: "20px", right: "20px",
        borderLeft: "1.5px solid rgba(234, 226, 213, 0.25)",
        borderBottom: "1.5px solid rgba(234, 226, 213, 0.25)",
        pointerEvents: "none",
        zIndex: 50
      }} />
    </div>
  );
}
