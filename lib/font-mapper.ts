export function mapFontToVar(fontStr: string | null | undefined): string {
  if (!fontStr) return "var(--font-sans), sans-serif";
  const f = fontStr.toLowerCase();
  
  // Fraunces retired; use Playfair Display via Playfair mapping elsewhere
  if (f.includes('cinzel')) return "var(--font-cinzel), serif";
  if (f.includes('playfair')) return "var(--font-serif), serif";
  if (f.includes('bodoni')) return "var(--font-bodoni), serif";
  if (f.includes('eb garamond')) return "var(--font-hanken), sans-serif";
  if (f.includes('italiana')) return "var(--font-italiana), serif";
  if (f.includes('aboreto')) return "var(--font-aboreto), sans-serif";
  if (f.includes('great vibes')) return "var(--font-great-vibes), cursive";
  if (f.includes('alex brush')) return "var(--font-alex-brush), cursive";
  if (f.includes('pinyon')) return "var(--font-pinyon), cursive";
  if (f.includes('sacramento')) return "var(--font-sacramento), cursive";
  if (f.includes('rochester')) return "var(--font-rochester), cursive";
  if (f.includes('parisienne')) return "var(--font-parisienne), cursive";
  if (f.includes('la belle')) return "var(--font-la-belle-aurore), cursive";
  if (f.includes('montserrat')) return "var(--font-montserrat), sans-serif";
  if (f.includes('jetbrains')) return "var(--font-jetbrains), monospace";
  
  return fontStr; // Fallback to original
}
