'use client';

import { cn } from '@/lib/utils';

/**
 * KNarrativeThread — woven data list.
 *
 * Items are connected by a thin SVG path between circular indicators.
 * Each item shows a small dot:
 *   • Filled (Iron Bark) when `complete` is true
 *   • Outline-only when pending
 *
 * The connecting line uses Piña Ecru at stroke-width 1,
 * evoking the warp thread of a Piña loom.
 */

interface KNarrativeThreadItem {
  label: string;
  description?: string;
  content?: React.ReactNode;
  complete?: boolean;
}

interface KNarrativeThreadProps {
  items: KNarrativeThreadItem[];
  className?: string;
}

/** Vertical spacing between item centers in SVG units */
const ITEM_GAP = 56;
/** Radius of the indicator dot */
const DOT_RADIUS = 4;
/** Horizontal center of the indicator column */
const DOT_CX = 12;
/** Start Y for the first dot */
const DOT_START_Y = 12;

export function KNarrativeThread({ items, className }: KNarrativeThreadProps) {
  const completedCount = items.filter((item) => item.complete).length;

  return (
    <div
      className={cn('relative flex flex-col', className)}
      role="list"
      aria-label={`Narrative thread: ${completedCount} of ${items.length} steps complete`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="relative flex min-h-[56px]" role="listitem">
            {/* SVG Thread column */}
            <div className="relative flex-none w-6 flex flex-col items-center">
              {/* Dot */}
              <svg width="24" height="24" className="absolute top-1 z-10" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r={DOT_RADIUS}
                  fill={item.complete ? 'var(--katha-iron-bark)' : 'none'}
                  stroke="var(--katha-iron-bark)"
                  strokeWidth={1.5}
                />
              </svg>
              
              {/* Thread line (connects to next item) */}
              {!isLast && (
                <div className="absolute top-4 bottom-0 w-px" style={{ backgroundColor: 'var(--katha-pina-ecru)' }} />
              )}
              {isLast && (
                <div className="absolute top-4 bottom-4 w-px" style={{ backgroundColor: 'var(--katha-pina-ecru)' }} />
              )}
            </div>

            {/* Content column */}
            <div className="flex-1 pb-8 pl-4">
              <span
                className={cn(
                  'font-ui text-sm block leading-snug pt-1',
                  item.complete ? 'text-katha-iron-bark' : 'text-katha-iron-bark/50'
                )}
              >
                {item.label}
              </span>
              {item.description && (
                <span
                  className={cn(
                    'font-body text-xs block mt-1 leading-relaxed',
                    item.complete ? 'text-katha-iron-bark/70' : 'text-katha-iron-bark/50'
                  )}
                >
                  {item.description}
                </span>
              )}
              {item.content && (
                <div className="mt-4">
                  {item.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
