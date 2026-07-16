import type { Metadata } from 'next';
import ProofClient from './ProofClient';

export const metadata: Metadata = {
  // The root layout's title template appends "— Katha Booth".
  title: 'The Proof · See Your Print Before You Book',
  description:
    'Every photo-booth company in Los Angeles and Orange County designs your print after you book. At Katha you set your names, date, and paper on the plate live — before reserving anything.',
  alternates: { canonical: '/proof' },
};

export default function ProofPage() {
  return <ProofClient />;
}
