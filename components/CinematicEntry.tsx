"use client";

import React from 'react';
import { EntryOverlay } from "./entry/EntryOverlay";
import type { TemplateCard } from "./entry/types";

// The hand dealt on entry — the hidden door from the Squarespace storefront
// into the atelier. Portraits only; the red-set plates are retired,
// and the archival monochrome treatment in DealtCard unifies whatever remains
// into the kamagong-and-gilt world before the gallery is revealed.
const EIGHT_TEMPLATES: TemplateCard[] = [
  { id: 'lumiere', src: '/assets/portfolio/lumiere.jpg', alt: 'A couple held in low editorial light' },
  { id: 'glam-portrait', src: '/assets/portfolio/glam-portrait.jpg', alt: 'A glam monochrome portrait' },
  { id: 'wildflower-wedding', src: '/assets/portfolio/wildflower-wedding.jpg', alt: 'A wedding party, mid-laugh' },
  { id: 'velour-floral', src: '/assets/portfolio/velour-floral.jpg', alt: 'A portrait against velour and florals' },
  { id: 'western-rich', src: '/assets/portfolio/western-rich.jpg', alt: 'A warm, richly lit couple' },
  { id: 'peachy', src: '/assets/portfolio/peachy.jpg', alt: 'A soft, close portrait' },
  { id: 'wildflower-wedding-2', src: '/assets/portfolio/wildflower-wedding.jpg', alt: 'Guests framed in the booth' },
  { id: 'glam-portrait-2', src: '/assets/portfolio/glam-portrait.jpg', alt: 'A held glance, high contrast' },
];

interface CinematicEntryProps {
  children: React.ReactNode;
}

export function CinematicEntry({ children }: CinematicEntryProps) {
  return (
    <EntryOverlay templates={EIGHT_TEMPLATES}>
      {children}
    </EntryOverlay>
  );
}
