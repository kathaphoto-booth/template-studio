import { describe, it, expect, beforeEach } from 'vitest';
import { saveDraft, loadDraft, clearDraft } from '@/lib/draft';

const sample = {
  templateId: 't1', paletteKey: 'pina', layoutId: 'strip-3',
  textPosition: 'bottom' as const, title: 'Ana & Sam', subtitle: 'Oct', venue: '',
};

describe('draft store', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips a draft per lead', () => {
    saveDraft('lead-1', sample);
    expect(loadDraft('lead-1')).toEqual(sample);
  });

  it('is isolated per lead and returns null when absent', () => {
    saveDraft('lead-1', sample);
    expect(loadDraft('lead-2')).toBeNull();
  });

  it('clears', () => {
    saveDraft('lead-1', sample);
    clearDraft('lead-1');
    expect(loadDraft('lead-1')).toBeNull();
  });
});
