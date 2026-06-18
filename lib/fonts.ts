import {
  Aboreto,
  Alex_Brush,
  Bodoni_Moda,
  Cinzel,
  Great_Vibes,
  Hanken_Grotesk,
  Italiana,
  JetBrains_Mono,
  La_Belle_Aurore,
  Montserrat,
  Parisienne,
  Pinyon_Script,
  Playfair_Display,
  Rochester,
  Sacramento,
  Inter
} from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
// Vince-Alignment 2.1 — Hanken Grotesk leads portal CHROME body (free near-match for Proxima Nova)
export const hankenGrotesk = Hanken_Grotesk({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-hanken', display: 'swap' });
export const aboreto = Aboreto({ weight: "400", subsets: ['latin'], variable: '--font-aboreto', display: 'swap' });
export const alexBrush = Alex_Brush({ weight: "400", subsets: ['latin'], variable: '--font-alex-brush', display: 'swap' });
export const bodoniModa = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni', display: 'swap' });
export const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' });
export const greatVibes = Great_Vibes({ weight: "400", subsets: ['latin'], variable: '--font-great-vibes', display: 'swap' });
export const italiana = Italiana({ weight: "400", subsets: ['latin'], variable: '--font-italiana', display: 'swap' });
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });
export const laBelleAurore = La_Belle_Aurore({ weight: "400", subsets: ['latin'], variable: '--font-la-belle-aurore', display: 'swap' });
export const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });
export const parisienne = Parisienne({ weight: "400", subsets: ['latin'], variable: '--font-parisienne', display: 'swap' });
export const pinyonScript = Pinyon_Script({ weight: "400", subsets: ['latin'], variable: '--font-pinyon', display: 'swap' });
export const rochester = Rochester({ weight: "400", subsets: ['latin'], variable: '--font-rochester', display: 'swap' });
export const sacramento = Sacramento({ weight: "400", subsets: ['latin'], variable: '--font-sacramento', display: 'swap' });

export const fontClassNames = [
  inter.variable,
  playfair.variable,
  hankenGrotesk.variable,
  aboreto.variable,
  alexBrush.variable,
  bodoniModa.variable,
  cinzel.variable,
  greatVibes.variable,
  italiana.variable,
  jetbrainsMono.variable,
  laBelleAurore.variable,
  montserrat.variable,
  parisienne.variable,
  pinyonScript.variable,
  rochester.variable,
  sacramento.variable
].join(' ');
