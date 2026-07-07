"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[var(--color-katha-l0)] text-[var(--color-katha-ink)] flex items-center justify-center px-6">
      <div className="max-w-[520px] text-center">
        <p className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-[var(--color-katha-fnt)] mb-8">
          {'//'} The registry stalled
        </p>
        <h1 className="font-display font-light text-[clamp(40px,7vw,72px)] leading-[1.05] text-[var(--color-katha-hi)] mb-8">
          Something didn&rsquo;t hold.
        </h1>
        {/* Error law: bone left-border + medium-weight ink, hue never sole signal */}
        <p className="font-body text-[18px] leading-relaxed text-[var(--color-katha-ink)] font-medium border-l-2 border-[var(--color-katha-hi)] pl-5 text-left mb-10 mx-auto max-w-[400px]">
          This step didn&rsquo;t complete. Your place in the archive is safe — try
          again, or write to{' '}
          <a href="mailto:kathabooth@gmail.com" className="underline underline-offset-4">
            kathabooth@gmail.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-block bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-3.5 rounded-[3px] hover:brightness-105 transition-all cursor-pointer"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
