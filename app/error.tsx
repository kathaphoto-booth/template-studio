"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
          className="mt-6 text-4xl md:text-5xl"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 96",
            letterSpacing: '-0.015em',
          }}
        >
          Something didn&rsquo;t hold
        </h1>

        <div className="mt-8" />

        <div
          className="mt-8 space-y-3 text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-body), Georgia, serif", color: '#5A564E' }}
        >
          <p>This step didn&rsquo;t complete. Your place in the studio&apos;s hands is safe — try again, or write to us directly.</p>
          <p style={{ color: '#241E1A' }}>
            <a href="mailto:kathabooth@gmail.com" className="underline underline-offset-4">
              kathabooth@gmail.com
            </a>
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-block px-10 py-4 text-xs uppercase tracking-[0.2em] transition-transform hover:scale-[0.98] active:scale-95"
          style={{
            backgroundColor: '#8C382A',
            color: '#EAE2D5',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
