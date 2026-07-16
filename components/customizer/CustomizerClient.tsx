'use client';

import React, { useEffect, useState } from 'react';
import LivePreview from './LivePreview';
import content from '@/lib/content.json';
import { track } from '@/lib/track';
import { useCustomizer, STEPS } from './useCustomizer';
import { clearDraft } from '@/lib/draft';
import { coarsePointer, smallViewport, announce } from '@/lib/a11y';
import { Stepper } from '@/components/ui/Stepper';
import { ActionBar } from '@/components/ui/ActionBar';
import { ChoiceCard } from '@/components/ui/ChoiceCard';
import { Swatch } from '@/components/ui/Swatch';
import { Field } from '@/components/ui/Field';

type SubmitState = { phase: 'idle' } | { phase: 'sending' } | { phase: 'ok' } | { phase: 'error'; message: string };

export default function CustomizerClient({ leadId }: { leadId: string }) {
  const templates = (content as any).templates.filter((t: any) => !t.isFootnote);
  const palettes = (content as any).palettes;
  const cz = useCustomizer(leadId, templates, palettes);
  const [submit, setSubmit] = useState<SubmitState>({ phase: 'idle' });
  const [simple, setSimple] = useState(false);

  // Density defaults to Simple for touch / small screens; full view stays fully
  // accessible, so this is a comfort default, not a gate.
  useEffect(() => { setSimple(coarsePointer() || smallViewport()); }, []);

  async function finalize() {
    if (submit.phase === 'sending') return;
    setSubmit({ phase: 'sending' });
    track('selection_submit', {
      leadHash: leadId && leadId !== 'demo' ? leadId : undefined,
      meta: { templateId: cz.activeTemplate.id },
    });
    try {
      const res = await fetch('/api/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: cz.activeTemplate.id,
          templateName: cz.activeTemplate.name,
          layout: cz.activeLayout.format,
          names: cz.state.title || null,
          date: cz.state.subtitle || null,
          venue: cz.state.venue || null,
          fontFamily: cz.activeTemplate.font || null,
          notes: JSON.stringify({ layoutId: cz.state.layoutId, palette: cz.activePalette.key, textPosition: cz.state.textPosition }),
          lead: leadId && leadId !== 'demo' ? leadId : null,
          selectedAt: new Date().toISOString(),
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok) {
        clearDraft(leadId);
        setSubmit({ phase: 'ok' });
        announce('Design saved. We will take it from here.');
      } else {
        setSubmit({ phase: 'error', message: body?.error || "We couldn't record the design just now. Nothing was lost — please try again." });
      }
    } catch {
      setSubmit({ phase: 'error', message: "We couldn't reach the studio just now. Nothing was lost — please try again." });
    }
  }

  const preview = (
    <LivePreview
      template={cz.activeTemplate}
      layoutId={cz.state.layoutId}
      palette={cz.activePalette}
      title={cz.state.title}
      subtitle={cz.state.subtitle}
      venue={cz.state.venue}
      textPosition={cz.state.textPosition}
      simple={simple}
      proofText={cz.proofText}
    />
  );

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-[var(--color-katha-l0)]">
      {/* Preview — sticky top strip on mobile, right column on desktop */}
      <main className="order-first lg:order-last lg:flex-1 sticky top-0 lg:static z-10 bg-[var(--color-katha-l0)] border-b lg:border-b-0 lg:border-l border-[var(--color-katha-ln)] flex items-center justify-center p-4 lg:p-10 max-h-[38vh] lg:max-h-none">
        {preview}
      </main>

      {/* Controls */}
      <aside className="w-full lg:w-[440px] flex flex-col bg-[var(--color-katha-l1)]">
        <div className="p-5 lg:p-8 pb-4 flex items-center justify-between gap-4">
          <Stepper steps={STEPS as any} current={cz.step} onJump={cz.goTo} />
          <button
            type="button"
            onClick={() => setSimple((s) => !s)}
            aria-pressed={simple}
            className="text-[var(--color-katha-mut)] underline underline-offset-4 shrink-0 cursor-pointer"
            style={{ fontSize: 'var(--fs-meta)', minHeight: 'var(--touch)' }}
          >
            {simple ? 'Full view' : 'Simple view'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-4 space-y-6">
          {cz.step === 0 && (
            <fieldset>
              <legend className="text-[var(--color-katha-hi)] mb-4" style={{ fontSize: 'var(--fs-title)', fontFamily: 'Newsreader, Georgia, serif', fontWeight: 300 }}>
                Choose your plate.
              </legend>
              <div className={`grid gap-3 ${simple ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {templates.map((t: any) => (
                  <ChoiceCard key={t.id} selected={cz.state.templateId === t.id} title={t.name} sub={t.formatLabel}
                    onSelect={() => { cz.select('templateId', t.id); cz.select('layoutId', t.layout); }} />
                ))}
              </div>
            </fieldset>
          )}

          {cz.step === 1 && (
            <fieldset>
              <legend className="text-[var(--color-katha-hi)] mb-4" style={{ fontSize: 'var(--fs-title)', fontFamily: 'Newsreader, Georgia, serif', fontWeight: 300 }}>
                Pick your paper.
              </legend>
              <div role="listbox" aria-label="Paper and ink" className="space-y-2">
                {palettes.map((p: any) => (
                  <Swatch key={p.key} selected={cz.state.paletteKey === p.key} name={p.name} bg={p.bg} ink={p.text}
                    onSelect={() => cz.select('paletteKey', p.key)} />
                ))}
              </div>
            </fieldset>
          )}

          {cz.step === 2 && (
            <fieldset className="space-y-4">
              <legend className="text-[var(--color-katha-hi)] mb-2" style={{ fontSize: 'var(--fs-title)', fontFamily: 'Newsreader, Georgia, serif', fontWeight: 300 }}>
                Write the inscription.
              </legend>
              <Field id="cz-title" label="Names" value={cz.state.title} onChange={(v) => cz.setField('title', v)} placeholder="Amara & Sebastian" helper="Optional — leave blank to keep the sample." />
              <Field id="cz-subtitle" label="Date line" value={cz.state.subtitle} onChange={(v) => cz.setField('subtitle', v)} placeholder="October · Long Beach" />
              <Field id="cz-venue" label="Venue line" value={cz.state.venue} onChange={(v) => cz.setField('venue', v)} placeholder="Optional" />
              {!simple && (
                <details className="border-t border-[var(--color-katha-ln)] pt-4">
                  <summary className="text-[var(--color-katha-mut)] cursor-pointer" style={{ fontSize: 'var(--fs-body)', minHeight: 'var(--touch)' }}>More options</summary>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {(['bottom', 'top'] as const).map((pos) => (
                      <ChoiceCard key={pos} selected={cz.state.textPosition === pos} title={pos === 'bottom' ? 'Text at bottom' : 'Text at top'} onSelect={() => cz.select('textPosition', pos)} />
                    ))}
                  </div>
                </details>
              )}
            </fieldset>
          )}

          {cz.step === 3 && (
            <div className="space-y-4">
              <h2 className="text-[var(--color-katha-hi)]" style={{ fontSize: 'var(--fs-title)', fontFamily: 'Newsreader, Georgia, serif', fontWeight: 300 }}>
                Ready to finalize.
              </h2>
              <p className="text-[var(--color-katha-mut)]" style={{ fontSize: 'var(--fs-body)' }}>
                {cz.proofText.replace(/^Proof updated\.\s*/, 'Your print: ')} You can go back and change anything.
              </p>
              {submit.phase === 'error' && (
                <p role="alert" className="border-l-2 border-[var(--color-katha-gilt)] pl-3 text-[var(--color-katha-ink)]" style={{ fontSize: 'var(--fs-body)' }}>{submit.message}</p>
              )}
              {submit.phase === 'ok' && (
                <p className="border border-[var(--color-katha-gilt)] text-[var(--color-katha-gilt)] py-4 text-center" style={{ fontSize: 'var(--fs-body)' }}>
                  Design recorded — we&rsquo;ll take it from here.
                </p>
              )}
            </div>
          )}
        </div>

        {submit.phase !== 'ok' && (
          cz.step < 3 ? (
            <ActionBar onBack={cz.step > 0 ? cz.back : undefined} primaryLabel="Next" onPrimary={cz.next} />
          ) : (
            <ActionBar onBack={cz.back} primaryLabel={submit.phase === 'sending' ? 'Recording…' : 'Finalize design'} onPrimary={finalize} primaryDisabled={submit.phase === 'sending'} />
          )
        )}
      </aside>
    </div>
  );
}
