import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
      style={{ backgroundColor: '#EAE2D5', color: '#241E1A' }}
    >
      <div className="max-w-xl mx-auto">
        <p
          className="text-[11px] uppercase tracking-[0.3em]"
          style={{ color: '#5A564E', fontFamily: "'Inter', sans-serif" }}
        >
          Katha Photo Booth
        </p>

        <h1
          className="mt-6 text-6xl md:text-8xl"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 96",
            letterSpacing: '-0.015em',
          }}
        >
          404
        </h1>

        <div className="mt-8" />

        <p
          className="mt-8 text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-body), Georgia, serif", color: '#5A564E' }}
        >
          This page isn&rsquo;t in the studio. Nothing was lost — the door simply opens elsewhere.
        </p>

        <Link
          href="/inquire"
          className="mt-10 inline-block px-10 py-4 text-xs uppercase tracking-[0.2em] transition-transform hover:scale-[0.98] active:scale-95"
          style={{
            backgroundColor: '#8C382A',
            color: '#EAE2D5',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Begin an inquiry
        </Link>
      </div>
    </main>
  );
}
