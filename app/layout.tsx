/* eslint-disable @next/next/no-page-custom-font */
import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

import { KathaThread } from '@/components/marks/KathaThread';

export const metadata: Metadata = {
  metadataBase: new URL('https://book.kathabooth.com'),
  title: 'Katha Template Studio',
  description: 'Photo strip and postcard template library and designer for Katha Photo Booth.',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Aboreto&family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=Great+Vibes&family=Italiana&family=JetBrains+Mono:wght@400..700&family=La+Belle+Aurore&family=Montserrat:wght@100..900&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Rochester&family=Sacramento&display=swap" rel="stylesheet" />
      <body className="antialiased" suppressHydrationWarning>
        {/* Katha Wabi-Sabi patina — feTurbulence filter defs (BRAND_GENESIS_PLAN §V, Stage 3 H10) */}
        <svg
          aria-hidden="true"
          focusable="false"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        >
          <filter id="katha-patina">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              seed="7"
            />
            <feColorMatrix values="0 0 0 0 0.141  0 0 0 0 0.118  0 0 0 0 0.102  0 0 0 0.12 0" />
          </filter>
        </svg>
        <KathaThread className="fixed inset-0 z-0 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
