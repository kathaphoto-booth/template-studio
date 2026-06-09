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

const KTHA_MARK_PATH =
  'M 40,0 L 40,12 M 40,6 L 46,0 M 40,6 L 46,12 ' + // K
  'M 50,0 L 56,0 M 53,0 L 53,12 ' + // T
  'M 60,0 L 60,12 M 60,6 L 66,6 M 66,0 L 66,12 ' + // H
  'M 70,12 L 73,0 L 76,12 M 71.5,8 L 74.5,8'; // A

export default function SecuredPage() {
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
            fontFamily: "'Fraunces', Georgia, serif",
            fontVariationSettings: "'SOFT' 100, 'WONK' 1, 'opsz' 96",
            letterSpacing: '-0.015em',
          }}
        >
          Your inquiry is received
        </h1>

        {/* Calado divider — drawn-thread openwork; the only rule line allowed */}
        <div
          aria-hidden
          className="calado-divider mx-auto mt-8 h-[6px] w-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='6' viewBox='0 0 48 6'><circle cx='4' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='14' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='24' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='34' cy='3' r='0.9' fill='%23C4B59D'/><circle cx='44' cy='3' r='0.9' fill='%23C4B59D'/></svg>\")",
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
          }}
        />

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

        {/* KTHA brass-ring closing stroke — permission to leave the loom */}
        <div className="mt-16 flex justify-center" aria-hidden>
          <svg width="120" height="40" viewBox="36 -4 44 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="ktha-draw"
              d={KTHA_MARK_PATH}
              stroke="#241E1A"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="sr-only" role="status">
          Katha maker&apos;s mark — complete
        </span>
      </div>

      {/* CSS-only draw of the maker's mark; reduced-motion shows it complete */}
      <style>{`
        .ktha-draw {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: ktha-stroke 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
        }
        @keyframes ktha-stroke {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ktha-draw { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>
    </main>
  );
}
