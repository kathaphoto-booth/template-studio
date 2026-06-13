import type {Metadata} from 'next';

import './globals.css'; // Global styles

import { fontClassNames } from '@/lib/fonts';


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
    <html lang="en" className={fontClassNames}>
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
        
        {/* Whisper Translucency Frame */}

        
        {children}
      </body>
    </html>
  );
}
