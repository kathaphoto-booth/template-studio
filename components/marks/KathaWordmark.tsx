export function KathaWordmark({ size = 26, color = "#ECE7DB", swash = true }: { size?: number; color?: string; swash?: boolean }) {
  return (
    <span style={{ 
      display: "inline-flex", alignItems: "baseline", position: "relative",
      fontFamily: "'Newsreader', serif", fontWeight: 300, fontSize: size, 
      color, letterSpacing: "-0.01em", lineHeight: 1 
    }}>
      katha
      {swash && (
        <svg 
          width={size * 2.2} 
          height={size * 0.4} 
          viewBox="0 0 74 14" 
          style={{ position: "absolute", left: 0, bottom: -size * 0.18 }}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 9C18 13 40 13 56 5c6-3 12-3 16 1" stroke="#DCCBB5" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1" />
        </svg>
      )}
    </span>
  );
}
