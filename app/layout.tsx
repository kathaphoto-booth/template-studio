import type {Metadata} from 'next';
import { Newsreader, Cormorant, Courier_Prime } from 'next/font/google';
import './globals.css'; // Global styles

// next/font variables are set on <html>, which overrides the @theme :root
// values — so only claim the slots we actually want these faces to own.
// --font-display stays with the self-hosted FH Ronaldson from globals.css.
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
});

const cormorant = Cormorant({
  subsets: ['latin'],
  variable: '--font-body',
});

const courier = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CinematicEntrance } from '@/components/CinematicEntrance';
import { EntryCapture } from '@/components/entry/EntryCapture';

import { KathaThread } from '@/components/marks/KathaThread';
import JsonLd from '@/components/seo/JsonLd';

const SITE_DESCRIPTION =
  'Heritage photo-booth installations. Oak-wood DSLR capture, archival prints, quiet high-contrast portraits. Check open dates and reserve your night — Los Angeles & Orange County.';

export const metadata: Metadata = {
  metadataBase: new URL('https://book.kathabooth.com'),
  title: {
    default: 'Katha Booth — Check Availability & Reserve · Los Angeles & Orange County',
    template: '%s — Katha Booth',
  },
  description: SITE_DESCRIPTION,
  keywords: ['photo booth', 'Los Angeles', 'Orange County', 'wedding', 'editorial', 'archival prints'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Katha Booth — The Gilded Archive',
    description:
      'Photo-booth portraiture as a crafted installation. Real dates, real prints, real photography. Reserve your night.',
    type: 'website',
    url: 'https://book.kathabooth.com',
    siteName: 'Katha Booth',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Katha Booth — The Gilded Archive',
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${cormorant.variable} ${courier.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Aboreto&family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=Great+Vibes&family=Italiana&family=JetBrains+Mono:wght@400..700&family=La+Belle+Aurore&family=Montserrat:wght@100..900&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Rochester&family=Sacramento&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Marketing entry contract — holds ?src / ?tier for the session */}
        <EntryCapture />
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
        {/* Site-wide structured data (schema.org JSON-LD) */}
        <JsonLd />
        <KathaThread className="fixed inset-0 z-0 pointer-events-none" />
        <SmoothScrollProvider>
          <CinematicEntrance>
            <div id="app-wrapper">
              {children}
            </div>
          </CinematicEntrance>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
