import type {Metadata} from 'next';

import './globals.css'; // Global styles

import { fontClassNames } from '@/lib/fonts';

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


        {/* Whisper Translucency Frame */}

        
        {children}
      </body>
    </html>
  );
}
