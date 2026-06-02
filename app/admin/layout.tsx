import type { ReactNode } from "react";

export const metadata = { title: "Katha Studio Admin" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111112", color: "#EAE2D5", fontFamily: "'EB Garamond', Georgia, serif" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(196,181,157,0.18)", padding: "20px 40px", display: "flex", alignItems: "baseline", gap: "24px" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#8C382A", fontWeight: 600 }}>
          Katha
        </span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: 400, color: "#EAE2D5", letterSpacing: "-0.01em" }}>
          Studio Admin
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#5A5D5A", marginLeft: "auto" }}>
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </span>
      </div>
      {/* Content */}
      <div style={{ padding: "40px" }}>
        {children}
      </div>
    </div>
  );
}
