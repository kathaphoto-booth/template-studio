import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Inquiry Received | Katha Booth',
  description: 'Your inquiry is received. Now choose your edition.',
};

// ──────────────────────────────────────────────────────────────────────
// /secured — HoneyBook custom-redirect landing (post-inquiry).
// The continuity bridge: every inquirer leaves with a path into the
// Template Designer. One Loko Rust CTA per viewport — this is it.
// Ma negative space; calado dots are the only rule line; sharp corners.
// ──────────────────────────────────────────────────────────────────────

export default function SecuredPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
      style={{ backgroundColor: '#EAE2D5', color: '#241E1A' }}
    >
      {/* Barong Weave L-Frame */}
      <div className="l-frame-top" />
      <div className="l-frame-left" />
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
            fontFamily: "'Fraunces', Georgia, serif",
            fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 96",
            letterSpacing: '-0.015em',
          }}
        >
          Your inquiry is received
        </h1>

        {/* Ma — the calado divider is replaced by negative space (wabi-sabi) */}
        <div className="mt-8" />

        <div
          className="mt-8 space-y-3 text-lg leading-relaxed"
          style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#5A564E' }}
        >
          <p>Your details are in the studio&apos;s hands. We respond within one business day.</p>
          <p style={{ color: '#241E1A' }}>Now choose your edition.</p>
        </div>

        <Link
          href="/template-design"
          className="mt-10 inline-block px-10 py-4 text-xs uppercase tracking-[0.2em] transition-transform hover:scale-[0.98] active:scale-95"
          style={{
            backgroundColor: '#8C382A',
            color: '#EAE2D5',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Begin shaping your edition
        </Link>

        <p
          className="mt-4 text-[12px]"
          style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#6E6A62' }}
        >
          Browse the template library and personalize the details — we attach your design to this inquiry.
        </p>
      </div>
    </main>
  );
}
