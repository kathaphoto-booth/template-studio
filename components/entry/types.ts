export interface TemplateCard {
  id: string;
  src: string;
  alt: string;
  /** width / height — defaults to the 2×6 strip ratio */
  aspect?: number;
}

export type EntryPhase = 'dealing' | 'holding' | 'lifted';
