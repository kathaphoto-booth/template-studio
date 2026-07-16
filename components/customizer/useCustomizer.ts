'use client';

import { useEffect, useMemo, useReducer } from 'react';
import { getLayout, layoutsForFormat } from '@/lib/layouts';
import { loadDraft, saveDraft, type DraftState } from '@/lib/draft';

export const STEPS = [
  { key: 'plate', label: 'Plate' },
  { key: 'paper', label: 'Paper' },
  { key: 'text', label: 'Inscription' },
  { key: 'done', label: 'Finalize' },
] as const;

type State = DraftState & { step: number };

type Action =
  | { t: 'field'; k: 'title' | 'subtitle' | 'venue'; v: string }
  | { t: 'select'; k: 'templateId' | 'paletteKey' | 'layoutId' | 'textPosition'; v: string }
  | { t: 'step'; v: number };

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case 'field': return { ...s, [a.k]: a.v };
    case 'select':
      // Selecting a plate re-anchors its default layout.
      if (a.k === 'templateId') return { ...s, templateId: a.v };
      return { ...s, [a.k]: a.v } as State;
    case 'step': return { ...s, step: Math.max(0, Math.min(STEPS.length - 1, a.v)) };
  }
}

export function useCustomizer(leadId: string, templates: any[], palettes: any[]) {
  const initial: State = useMemo(() => {
    const saved = loadDraft(leadId);
    const t0 = templates[0];
    return {
      step: 0,
      templateId: saved?.templateId ?? t0.id,
      paletteKey: saved?.paletteKey ?? palettes[0].key,
      layoutId: saved?.layoutId ?? t0.layout ?? 'strip-3',
      textPosition: saved?.textPosition ?? 'bottom',
      title: saved?.title ?? '',
      subtitle: saved?.subtitle ?? '',
      venue: saved?.venue ?? '',
    };
  }, [leadId, templates, palettes]);

  const [state, dispatch] = useReducer(reducer, initial);

  // Persist every change (draft restore only — no server sync).
  useEffect(() => {
    const { step, ...draft } = state;
    saveDraft(leadId, draft);
  }, [leadId, state]);

  const activeTemplate = templates.find((t) => t.id === state.templateId) ?? templates[0];
  const activePalette = palettes.find((p) => p.key === state.paletteKey) ?? palettes[0];
  const activeLayout = getLayout(state.layoutId) ?? getLayout(activeTemplate.layout) ?? getLayout('strip-3')!;
  const availableLayouts = layoutsForFormat(activeLayout.format);

  const proofText = useMemo(() => {
    const names = state.title || activeTemplate.sName || 'the names';
    const date = state.subtitle || activeTemplate.sSub || 'the date';
    return `Proof updated. ${names}; ${date}${state.venue ? `; ${state.venue}` : ''}; on ${activePalette.name} paper.`;
  }, [state.title, state.subtitle, state.venue, activeTemplate, activePalette]);

  return {
    state, step: state.step, steps: STEPS,
    activeTemplate, activePalette, activeLayout, availableLayouts,
    setField: (k: 'title' | 'subtitle' | 'venue', v: string) => dispatch({ t: 'field', k, v }),
    select: (k: 'templateId' | 'paletteKey' | 'layoutId' | 'textPosition', v: string) => dispatch({ t: 'select', k, v }),
    next: () => dispatch({ t: 'step', v: state.step + 1 }),
    back: () => dispatch({ t: 'step', v: state.step - 1 }),
    goTo: (i: number) => dispatch({ t: 'step', v: i }),
    proofText,
    canFinalize: true, // inscription is soft-recommended, never blocking (reconciliation)
  };
}
