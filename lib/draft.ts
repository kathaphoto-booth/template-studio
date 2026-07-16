export type DraftState = {
  templateId: string;
  paletteKey: string;
  layoutId: string;
  textPosition: 'top' | 'bottom';
  title: string;
  subtitle: string;
  venue: string;
};

const key = (leadId: string) => `katha:draft:${leadId}`;

export function saveDraft(leadId: string, d: DraftState): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key(leadId), JSON.stringify(d)); } catch { /* quota / private mode — non-fatal */ }
}

export function loadDraft(leadId: string): DraftState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key(leadId));
    return raw ? (JSON.parse(raw) as DraftState) : null;
  } catch { return null; }
}

export function clearDraft(leadId: string): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(key(leadId)); } catch { /* non-fatal */ }
}
