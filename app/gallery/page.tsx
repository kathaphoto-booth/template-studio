"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TEMPLATES } from "@/lib/data";
import { Print } from "@/components/Print";
import { KathaWordmark } from "@/components/marks/KathaWordmark";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { DateGate } from "@/components/booking/DateGate";
import { VaultDrawer, type DrawerSelection } from "@/components/booking/VaultDrawer";
import { PricingTiers } from "@/components/booking/PricingTiers";
import { ParallaxFooter } from "@/components/booking/ParallaxFooter";
import { TIERS_CATALOG, DEFAULT_TIER_KEY, fetchOpenDates } from "@/lib/booking";
import { getEntryTierKey, tierKeyFromSlug } from "@/lib/entry";

const STYLES = ["All", "Signature", "Classic"];

function Tag({ style }: { style: string }) {
  if (style === "Signature") {
    return (
      <span className="bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[8.5px] font-bold px-2 py-0.5 rounded-[1px] tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
        ◆ Signature
      </span>
    );
  }
  return (
    <span className="border border-[var(--color-katha-ln2)] text-[var(--color-katha-mut)] font-mono text-[8.5px] px-2 py-0.5 rounded-[1px] tracking-[0.18em] uppercase">
      Classic
    </span>
  );
}

function GalleryCard({ t, onOpen }: { t: any; onOpen: (t: any) => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 90, damping: 24 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      onClick={() => onOpen(t)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(t);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Reserve with the ${t.name} plate`}
      className="titem cursor-pointer w-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="bg-[var(--color-katha-l2)] rounded-[2px] border-t border-[var(--color-katha-glass)] px-6 pt-10 pb-8 flex flex-col items-center gap-8 relative shadow-[0_24px_60px_var(--color-katha-shadow)] hover:-translate-y-2 transition-all duration-500 hover:border-[var(--color-katha-ln2)]"
      >
        <div className="absolute top-6 left-6 flex items-baseline gap-1.5">
          <span className="font-mono text-[10px] text-[var(--color-katha-mut)] tracking-widest">{t.plate}</span>
        </div>
        <div className="absolute top-6 right-6">
          <span className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--color-katha-mut)] border-b border-[var(--color-katha-ln)] pb-[2px]">{t.booth}</span>
        </div>

        <div className="mt-4" style={{ transform: "translateZ(25px)" }}>
          <Print t={t} height={t.ratio.h > t.ratio.w ? 280 : 180} />
        </div>

        <div className="text-center" style={{ transform: "translateZ(10px)" }}>
          <div className="mb-3"><Tag style={t.style} /></div>
          <h3 className="font-display text-[24px] lg:text-[28px] font-light text-[var(--color-katha-hi)] mt-1 mb-1.5">{t.name}</h3>
          <p className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-katha-mut)] uppercase">{t.formatLabel}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Gallery() {
  const searchParams = useSearchParams();
  const [styleF, setStyleF] = useState("All");

  /* ── Real availability ── */
  const [dates, setDates] = useState<string[] | null>(null);
  const [datesLoading, setDatesLoading] = useState(true);
  const [datesError, setDatesError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setDatesLoading(true);
    setDatesError(false);
    fetchOpenDates()
      .then((d) => {
        if (!alive) return;
        setDates(d);
        setDatesLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setDatesError(true);
        setDatesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retryKey]);

  /* ── The Vault Drawer ── */
  const [drawer, setDrawer] = useState<DrawerSelection>({
    open: false,
    template: null,
    tierKey: DEFAULT_TIER_KEY,
    date: "",
  });

  const openDrawer = useCallback(
    (patch: Partial<Omit<DrawerSelection, "open">> = {}) =>
      setDrawer((d) => ({ ...d, ...patch, open: true })),
    []
  );
  const closeDrawer = useCallback(() => setDrawer((d) => ({ ...d, open: false })), []);

  // Honor inbound deep links: ?template= (studio + enrichment emails) and
  // ?tier= (redirected legacy /reserve links, Squarespace CTAs — catalog keys
  // or marketing slugs). A tier held from an earlier entry preselects quietly
  // without opening the drawer; unrecognized values fall through in silence.
  useEffect(() => {
    const templateId = searchParams.get("template");
    const tierParam = searchParams.get("tier");
    const t = templateId ? TEMPLATES.find((tpl: any) => tpl.id === templateId) : null;
    const paramTierKey = tierParam
      ? TIERS_CATALOG.find((tr) => tr.key === tierParam && tr.available)?.key ??
        tierKeyFromSlug(tierParam)
      : null;
    const heldTierKey = paramTierKey ?? getEntryTierKey();
    if (t) openDrawer({ template: t, ...(heldTierKey ? { tierKey: heldTierKey } : {}) });
    else if (paramTierKey) openDrawer({ tierKey: paramTierKey });
    else if (heldTierKey) setDrawer((d) => ({ ...d, tierKey: heldTierKey }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(
    () =>
      TEMPLATES.filter((t: any) => {
        if (t.isFootnote && styleF !== "All") return false;
        if (!t.isFootnote && styleF !== "All" && t.style !== styleF) return false;
        return true;
      }),
    [styleF]
  );

  return (
    <div className="w-full relative min-h-screen">
      <div className="grain" aria-hidden="true" />

      {/* Page content — scrolls up over the fixed footer; dims under the drawer */}
      <div className="drawer-dim relative z-10 bg-[var(--color-katha-l0)] shadow-[0_80px_140px_rgba(0,0,0,0.65)]">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 lg:px-12 py-6 border-b border-[var(--color-katha-ln)]">
          <div className="flex items-baseline gap-6">
            <KathaWordmark size={24} swash={false} />
            <span className="hidden md:inline font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)]">
              Los Angeles &amp; Orange County
            </span>
          </div>
          <button
            type="button"
            onClick={() => openDrawer()}
            className="bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3 rounded-[3px] hover:brightness-105 transition-all cursor-pointer"
          >
            Reserve a date
          </button>
        </header>

        {/* ── Hero: the editorial headline + the Date Gate ── */}
        <section className="px-6 lg:px-12 pt-20 lg:pt-28 pb-16 lg:pb-24 max-w-[1280px] mx-auto">
          <p className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-[var(--color-katha-fnt)] mb-10">
            {'//'} Inquiry registry active · heritage photo-booth installations
          </p>
          <h1 className="font-display font-light text-[var(--color-katha-hi)] leading-[1.02] tracking-[-0.015em] text-[clamp(54px,8.5vw,124px)] mb-10">
            The frame
            <br />
            <span className="font-serif italic font-extralight text-[var(--color-katha-ink)] pl-[5vw]">
              your night
            </span>
            <br />
            lives in<span className="text-[var(--color-katha-gilt)]">.</span>
          </h1>
          <p
            className="text-[20px] leading-[1.6] text-[var(--color-katha-mut)] italic max-w-[520px] mb-16"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Weathered oak and modern ivory, framing quiet, high-contrast portraits.
          </p>

          <DateGate
            dates={dates}
            loading={datesLoading}
            error={datesError}
            onRetry={() => setRetryKey((k) => k + 1)}
            onSelectDate={(iso) => openDrawer({ date: iso })}
          />
        </section>

        {/* ── The plates: masonry gallery ── */}
        <section className="px-6 lg:px-12 pb-24 max-w-[1280px] mx-auto" aria-label="Print plate gallery">
          <div className="flex gap-8 items-baseline relative mb-12">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyleF(s)}
                className={`font-display relative pb-2 transition-colors duration-300 outline-none cursor-pointer ${
                  s === styleF
                    ? "text-[28px] lg:text-[36px] text-[var(--color-katha-hi)] font-light"
                    : "text-[20px] lg:text-[24px] text-[var(--color-katha-fnt)] hover:text-[var(--color-katha-mut)] font-light"
                }`}
              >
                {s}
                {s === styleF && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-katha-gilt)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="columns-1 md:columns-2 xl:columns-3 gap-8">
            {visible.map((t: any) => {
              if (t.isFootnote) {
                return (
                  <div key={t.id} className="w-full px-5 py-8 mb-8 break-inside-avoid">
                    <div className="w-10 h-[1px] bg-[var(--color-katha-gilt)] mb-6" />
                    <p className="font-body text-[20px] leading-[1.6] text-[var(--color-katha-mut)] italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                );
              }
              return (
                <div key={t.id} className="mb-8 break-inside-avoid">
                  <GalleryCard t={t} onOpen={(tpl) => openDrawer({ template: tpl })} />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── The investment ── */}
        <PricingTiers tiers={TIERS_CATALOG} onSelect={(tierKey) => openDrawer({ tierKey })} />
      </div>

      {/* Fixed underlay footer + its scroll spacer (outside the transformed wrapper) */}
      <ParallaxFooter onReserve={() => openDrawer()} />

      <VaultDrawer selection={drawer} openDates={dates ?? []} onClose={closeDrawer} />
    </div>
  );
}
