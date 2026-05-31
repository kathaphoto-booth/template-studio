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

export const metadata: Metadata = {
  title: 'Katha Template Studio',
  description: 'Photo strip and postcard template library and designer for Katha Photo Booth.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Aboreto&family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Great+Vibes&family=Montserrat:wght@100..900&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Sacramento&family=Rochester&family=Meie+Script&family=Italiana&family=La+Belle+Aurore&family=Parisienne&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
