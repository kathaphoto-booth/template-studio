import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-katha-l0)] text-[var(--color-katha-ink)] flex items-center justify-center px-6">
      <div className="max-w-[480px] text-center">
        <p className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-[var(--color-katha-fnt)] mb-8">
          {'//'} Plate not on the registry
        </p>
        <h1 className="font-display font-light text-[clamp(56px,12vw,120px)] leading-none text-[var(--color-katha-hi)] mb-8">
          404
        </h1>
        <p
          className="text-[19px] leading-[1.6] text-[var(--color-katha-mut)] italic mb-10"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          This page isn&rsquo;t in the archive. Nothing was lost — the door simply
          opens elsewhere.
        </p>
        <Link
          href="/gallery"
          className="inline-block bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-3.5 rounded-[3px] hover:brightness-105 transition-all"
        >
          Return to the gallery →
        </Link>
      </div>
    </main>
  );
}
