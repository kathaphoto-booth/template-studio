import { getLayout, VIEWBOX } from "@/lib/layouts";

// Faithful miniature of a print plate. Geometry comes from the layout
// registry (the single source of slot math) positioned as percentages of
// the format viewBox; paint comes from the plate's own paper/slot/edge/
// accent values. Slots stay empty — they are where the client's booth
// photos will print. Thumbnails are text-free (PRD §7.3): a single accent
// thread marks the branding pedestal where the inscription will sit.

type Rect = { x: number; y: number; w: number; h: number };

type Plate = {
  layout: string;
  paper: string;
  slot: string;
  edge: string;
  accent: string;
};

// True plate aspect from the layout registry — the card must never trust a
// hand-typed ratio to agree with the 300-DPI canvas it miniaturizes.
export function plateAspect(template: { layout?: string }): string | null {
  const layout = template.layout ? getLayout(template.layout) : null;
  if (!layout) return null;
  const vb = VIEWBOX[layout.format as keyof typeof VIEWBOX];
  return vb ? `${vb.w} / ${vb.h}` : null;
}

export function PlateThumb({ template }: { template: Plate }) {
  const layout = getLayout(template.layout);
  if (!layout) return null;
  const vb = VIEWBOX[layout.format as keyof typeof VIEWBOX];
  if (!vb) return null;

  const pct = (r: Rect) => ({
    left: `${(r.x / vb.w) * 100}%`,
    top: `${(r.y / vb.h) * 100}%`,
    width: `${(r.w / vb.w) * 100}%`,
    height: `${(r.h / vb.h) * 100}%`,
  });

  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: template.paper }}
      aria-hidden="true"
    >
      {/* museum-matting hairline, inset like the press plate's frame */}
      <div
        className="absolute"
        style={{ inset: "3.5%", border: `1px solid ${template.edge}`, opacity: 0.5 }}
      />
      {layout.slots.map((s: Rect, i: number) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...pct(s),
            backgroundColor: template.slot,
            boxShadow: `inset 0 0 0 1px ${template.edge}73`,
          }}
        />
      ))}
      {/* branding pedestal — text-free; one thread of the plate's accent.
          On hover the thread draws wider, heavy deceleration, no bounce. */}
      <div className="absolute flex items-center justify-center" style={pct(layout.textZone)}>
        <div
          className="w-[38%] group-hover:w-[56%] transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: "1px", backgroundColor: template.accent, opacity: 0.9 }}
        />
      </div>
      {/* woven Binakul patina — the paper is textile, never flat pixel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "url(#katha-patina)", opacity: 0.5 }}
      />
    </div>
  );
}
