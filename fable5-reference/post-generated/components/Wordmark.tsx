import React from 'react';

export function Wordmark({ size = 26, color = "var(--color-katha-hi)", swash = true, animated = false }) {
  const letters = ['k', 'a', 't', 'h', 'a'];
  
  return (
    <span style={{ 
      display: "inline-flex", 
      alignItems: "baseline", 
      position: "relative",
      fontFamily: "var(--font-newsreader)", 
      fontWeight: 300, 
      fontSize: size, 
      color, 
      letterSpacing: "-0.01em", 
      lineHeight: 1 
    }}>
      {animated ? (
        <div style={{ display: "flex", gap: size * 0.1 }}>
          {letters.map((letter, i) => (
            <span key={i} className="katha-wordmark-letter" style={{
              opacity: 0,
              animation: `letterSnap 1.6s cubic-bezier(0.19, 1, 0.22, 1) ${0.2 + (i * 0.14)}s forwards`
            }}>
              {letter}
            </span>
          ))}
        </div>
      ) : (
        "katha"
      )}
      
      {swash && (
        <svg width={size*2.2} height={size*0.4} viewBox="0 0 74 14" style={{ position:"absolute", left:0, bottom:-size*0.18 }}>
          <path d="M2 9 C 18 13, 40 13, 56 5 C 62 2, 68 2, 72 6" fill="none" stroke="var(--color-katha-loko)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1" />
        </svg>
      )}
    </span>
  );
}
