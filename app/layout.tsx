import type {Metadata} from 'next';

import './globals.css'; // Global styles

import { fontClassNames } from '@/lib/fonts';
import JsonLd from '@/components/seo/JsonLd';

const SITE_DESCRIPTION =
  'Editorial DSLR portrait installations for weddings, celebrations, and corporate rooms across Southern California. Weathered oak and pearl-white hardware, studio strobe, archival cotton prints cut and dry the same night.';

const OG_IMAGE = '/products/editorial-installation.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://book.kathabooth.com'),
  title: {
    default: 'Katha Booth — Editorial Portrait Installations',
    template: '%s — Katha Booth',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://book.kathabooth.com',
    siteName: 'Katha Booth',
    title: 'Katha Booth — Editorial Portrait Installations',
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        alt: 'Katha Booth — editorial DSLR portrait installation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Katha Booth — Editorial Portrait Installations',
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const typekitId = process.env.NEXT_PUBLIC_ADOBE_FONTS_PROJECT_ID;

  return (
    <html lang="en" className={fontClassNames}>
      <head>
        {typekitId && <link rel="stylesheet" href={`https://use.typekit.net/${typekitId}.css`} />}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Site-wide structured data (schema.org JSON-LD) */}
        <JsonLd />

        {children}
      </body>
    </html>
  );
}
