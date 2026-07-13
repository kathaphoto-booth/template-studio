"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import content from "@/lib/content.json";
const { templates: TEMPLATES } = content;
import { Print } from "@/components/Print";
import { KathaWordmark } from "@/components/marks/KathaWordmark";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { DateGate } from "@/components/booking/DateGate";
import { hasOpenSlot, type Day } from "@/components/booking/RegistryCalendar";
import { VaultDrawer, type DrawerSelection } from "@/components/booking/VaultDrawer";
import { PricingTiers } from "@/components/booking/PricingTiers";
import { ParallaxFooter } from "@/components/booking/ParallaxFooter";
import { TIERS_CATALOG, DEFAULT_TIER_KEY, ledgerParts } from "@/lib/booking";
import { getEntryTierKey, tierKeyFromSlug } from "@/lib/entry";
import { track } from "@/lib/track";

const STYLES = ["All", "Signature", "Classic"];

function Tag({ style }: { style: string }) {
  if (style === "Signature") {
    return (
      <span className="bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[11px] font-bold px-2 py-0.5 rounded-[1px] tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
        ◆ Signature
      </span>
    );
  }
  return (
    <span className="border border-[var(--color-katha-ln2)] text-[var(--color-katha-mut)] font-mono text-[11px] px-2 py-0.5 rounded-[1px] tracking-[0.18em] uppercase">
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
          <span className="font-mono text-[11px] text-[var(--color-katha-mut)] tracking-widest">{t.plate}</span>
        </div>
        <div className="absolute top-6 right-6">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-katha-mut)] border-b border-[var(--color-katha-ln)] pb-[2px]">{t.booth}</span>
        </div>

        <div className="mt-4" style={{ transform: "translateZ(25px)" }}>
          <Print t={t} height={t.ratio.h > t.ratio.w ? 280 : 180} />
        </div>

        <div className="text-center" style={{ transform: "translateZ(10px)" }}>
          <div className="mb-3"><Tag style={t.style} /></div>
          <h3 className="font-display text-[24px] lg:text-[28px] font-light text-[var(--color-katha-hi)] mt-1 mb-1.5">{t.name}</h3>
          <p className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-katha-mut)] uppercase">{t.formatLabel}</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── The work — real nights, real prints (ported from the retired root page) ── */
const WORK_FIGURES = [
  {
    src: "/portfolio/velour-floral.webp",
    alt: "Guests framed by a velour and floral installation, warm archival print tones",
    caption: "Velour floral — Oak booth",
    w: 1067, h: 1600, span: "md:col-span-7",
  },
  {
    src: "/portfolio/glam-portrait.webp",
    alt: "High-contrast monochrome glam portrait from the Glam Editorial installation",
    caption: "Glam editorial — monochrome",
    w: 1067, h: 1600, span: "md:col-span-5 md:mb-16",
  },
  {
    src: "/portfolio/wildflower-wedding.webp",
    alt: "Wedding guests at a wildflower-backed booth, archival paper texture",
    caption: "Wildflower wedding — archival stock",
    w: 1800, h: 2700, span: "md:col-span-5 md:col-start-2",
  },
  {
    src: "/portfolio/western-rich.webp",
    alt: "Western-styled installation with rich tonal backdrop and oak hardware",
    caption: "Western rich — Oak booth",
    w: 1067, h: 1600, span: "md:col-span-4 md:mb-24",
  },
  {
    src: "/portfolio/lumiere.webp",
    alt: "Three guests posing beside the oak booth, fresh prints on the case — high-contrast monochrome",
    caption: "Lumière — monochrome editorial",
    w: 1800, h: 2701, span: "md:col-span-6",
  },
  {
    src: "/portfolio/peachy.webp",
    alt: "Mirror booth installation framed by peach and ecru florals in an arched alcove",
    caption: "Peachy — mirror installation",
    w: 1800, h: 2700, span: "md:col-span-5 md:col-start-8 md:mb-12",
  },
];

function TheWork() {
  return (
    <section aria-label="Recent installations" className="px-6 lg:px-12 pb-24 max-w-[1280px] mx-auto">
      <div className="flex items-baseline justify-between border-t border-[var(--color-katha-ln)] pt-10 mb-10">
        <h2 className="font-display font-light text-3xl lg:text-4xl text-[var(--color-katha-hi)] tracking-tight">
          The work<span className="text-[var(--color-katha-gilt)]">.</span>
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-katha-fnt)]">
          {'//'} From recent installations
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {WORK_FIGURES.map((f) => (
          <figure key={f.src} className={f.span}>
            <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-3">
              <Image
                width={f.w}
                height={f.h}
                sizes="(max-width: 768px) 100vw, 50vw"
                src={f.src}
                alt={f.alt}
                className="w-full h-auto block"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-katha-mut)]">
              {f.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      {/* Neutral, factual trust line (Jed, 2026-07-12) — placeholder until a
          real client testimonial replaces it. No fabricated quotes, ever. */}
      <p className="mt-10 font-body text-[17px] leading-[1.6] italic text-[var(--color-katha-mut)] max-w-[560px]">
        Trusted by couples across Los Angeles &amp; Orange County — real
        events, real installations.
      </p>
    </section>
  );
}

export default function Gallery() {
  const searchParams = useSearchParams();
  const [styleF, setStyleF] = useState("All");
  const prefersReducedMotion = useReducedMotion();

  // Funnel step 1 — fire-and-forget beacon on mount, never blocks paint.
  useEffect(() => {
    track("gallery_view");
  }, []);

  /* ── Real availability (slot-aware weekend strip) ── */
  const [days, setDays] = useState<Day[] | null>(null);
  const [datesLoading, setDatesLoading] = useState(true);
  const [datesError, setDatesError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setDatesLoading(true);
    setDatesError(false);
    fetch("/api/availability/v2")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("availability"))))
      .then((body: { days?: Day[] }) => {
        if (!alive) return;
        setDays(Array.isArray(body?.days) ? body.days : []);
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

  // The open-date allow-list the drawer + deep-links still speak in: a night is
  // "open" when any of its slots can still be requested. Derived from the strip
  // so there is one source of truth (never a second fetch).
  const dates = useMemo(
    () => (days ? days.filter(hasOpenSlot).map((d) => d.date) : null),
    [days]
  );

  /* ── The velvet rope: date first, archive after ──
     A held night opens the archive. The rope is honest — one click, no
     contact info demanded — and it never strands anyone: browsing without
     a date is an explicit link away, and a failed availability check
     never locks the page. */
  const [heldDate, setHeldDate] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ date: string; slot: "afternoon" | "evening" } | null>(null);
  const [browseAll, setBrowseAll] = useState(false);
  const [plateTouched, setPlateTouched] = useState(false);
  const platesRef = useRef<HTMLElement | null>(null);

  const archiveOpen =
    !!heldDate || browseAll || datesError || (dates !== null && dates.length === 0);

  const holdDate = useCallback(
    (iso: string) => {
      const first = heldDate === null;
      setHeldDate(iso);
      track("date_held", { meta: { date: iso } });
      if (first) {
        // Let the gate's 1.4s glide start before drifting down to the plates.
        window.setTimeout(() => {
          platesRef.current?.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }, 450);
      }
    },
    [heldDate, prefersReducedMotion]
  );

  // Weekend strip → time shelf: remember the slot for the confirmation line and
  // bridge the date into the existing rope (holdDate opens the archive + HUD).
  // The slot ride-along to /api/request is the deferred RTN funnel join.
  const onPick = useCallback(
    (date: string, slot: "afternoon" | "evening") => {
      setSelected({ date, slot });
      holdDate(date);
    },
    [holdDate]
  );

  const openArchiveWithoutDate = useCallback(() => {
    setBrowseAll(true);
    track("browse_all");
  }, []);

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

  const openPlate = useCallback(
    (t: any) => {
      setPlateTouched(true);
      openDrawer({ template: t, ...(heldDate ? { date: heldDate } : {}) });
    },
    [openDrawer, heldDate]
  );

  // Honor inbound deep links: ?template= (studio + enrichment emails),
  // ?tier= (redirected legacy /reserve links, Squarespace CTAs — catalog keys
  // or marketing slugs), and ?date= (a registry-checked night in hand). A
  // held tier preselects quietly without opening the drawer; unrecognized
  // values fall through in silence. An inbound date also lifts the rope —
  // that visitor has already been through the gate. The drawer re-verifies
  // any inbound date against the open registry before adopting it — a URL
  // can suggest a date, never invent one.
  useEffect(() => {
    const templateId = searchParams.get("template");
    const tierParam = searchParams.get("tier");
    const dateParam = searchParams.get("date");
    const t = templateId ? TEMPLATES.find((tpl: any) => tpl.id === templateId) : null;
    const paramTierKey = tierParam
      ? TIERS_CATALOG.find((tr) => tr.key === tierParam && tr.available)?.key ??
        tierKeyFromSlug(tierParam)
      : null;
    const paramDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : null;
    const heldTierKey = paramTierKey ?? getEntryTierKey();
    const datePatch = paramDate ? { date: paramDate } : {};
    if (paramDate) setHeldDate(paramDate);
    if (t) {
      setPlateTouched(true);
      openDrawer({ template: t, ...datePatch, ...(heldTierKey ? { tierKey: heldTierKey } : {}) });
    } else if (paramTierKey) {
      setBrowseAll(true);
      openDrawer({ tierKey: paramTierKey, ...datePatch });
    } else if (heldTierKey) setDrawer((d) => ({ ...d, tierKey: heldTierKey }));
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

  const hudVisible = !!heldDate && !drawer.open;
  const held = heldDate ? ledgerParts(heldDate) : null;

  return (
    <div className="w-full relative min-h-screen">
      <div className="grain" aria-hidden="true" />

      {/* Page content — scrolls up over the fixed footer; dims under the drawer */}
      <div className="drawer-dim relative z-10 bg-[var(--color-katha-l0)] shadow-[0_80px_140px_rgba(0,0,0,0.65)]">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 lg:px-12 py-6 border-b border-[var(--color-katha-ln)]">
          <div className="flex items-baseline gap-6">
            <KathaWordmark size={24} swash={false} />
            <span className="hidden md:inline font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)]">
              Los Angeles &amp; Orange County
            </span>
          </div>
          <button
            type="button"
            onClick={() => openDrawer(heldDate ? { date: heldDate } : {})}
            className="bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[length:var(--fs-body)] tracking-[0.1em] uppercase px-5 py-3.5 min-h-[44px] rounded-[3px] hover:brightness-105 transition-all cursor-pointer"
          >
            Reserve a date
          </button>
        </header>

        {/* ── Hero: the editorial headline + the Date Gate ── */}
        <section className="px-6 lg:px-12 pt-20 lg:pt-28 pb-16 lg:pb-24 max-w-[1280px] mx-auto">
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--color-katha-fnt)] mb-10">
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
            days={days}
            loading={datesLoading}
            error={datesError}
            selected={selected}
            onRetry={() => setRetryKey((k) => k + 1)}
            onPick={onPick}
          />

          {!archiveOpen && !datesLoading && (
            <button
              type="button"
              onClick={openArchiveWithoutDate}
              className="mt-10 font-mono text-[length:var(--fs-body)] tracking-[0.12em] uppercase text-[var(--color-katha-fnt)] hover:text-[var(--color-katha-mut)] underline underline-offset-4 decoration-[var(--color-katha-ln2)] transition-colors cursor-pointer"
            >
              or browse the archive without a date →
            </button>
          )}
        </section>

        {/* ── The gated archive: plates + investment glide open together ── */}
        <div
          className={`act-gate ${archiveOpen ? "act-gate--open" : ""}`}
          inert={!archiveOpen ? true : undefined}
          aria-hidden={!archiveOpen}
        >
          {/* ── The plates: masonry gallery ── */}
          <section
            ref={platesRef}
            className="px-6 lg:px-12 pb-24 max-w-[1280px] mx-auto scroll-mt-10"
            aria-label="Print plate gallery"
          >
            <div className="flex gap-8 items-baseline relative mb-12">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyleF(s)}
                  className={`font-display relative px-2 pb-2 min-h-[44px] min-w-[44px] transition-colors duration-300 outline-none cursor-pointer ${
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
                    <GalleryCard t={t} onOpen={openPlate} />
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── The investment ── */}
          <PricingTiers tiers={TIERS_CATALOG} onSelect={(tierKey) => openDrawer({ tierKey, ...(heldDate ? { date: heldDate } : {}) })} />
        </div>

        {/* ── The work — proof outside the rope; real nights are always visible ── */}
        <TheWork />
      </div>

      {/* Fixed underlay footer + its scroll spacer (outside the transformed wrapper) */}
      <ParallaxFooter onReserve={() => openDrawer(heldDate ? { date: heldDate } : {})} />

      {/* ── The intent HUD — the registry's quiet next step, docked low ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hudVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
        aria-hidden={!hudVisible}
      >
        <div className="bg-[var(--color-katha-l1)]/95 backdrop-blur-sm border border-[var(--color-katha-ln)] shadow-[0_24px_60px_rgba(0,0,0,0.6)] px-6 py-4 flex items-center gap-8 max-w-full">
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-katha-fnt)]">
              Registry {held ? `· ${held.weekday} ${held.month} ${held.day}` : ""}
            </span>
            <span className="font-display font-light text-[18px] text-[var(--color-katha-hi)] truncate">
              {plateTouched ? "Review & secure your registry" : "Choose your plate"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              track("review_open");
              openDrawer(heldDate ? { date: heldDate } : {});
            }}
            className="bg-[var(--color-katha-gilt)] text-[var(--color-katha-l0)] font-mono text-[length:var(--fs-body)] tracking-[0.1em] uppercase px-5 py-3.5 min-h-[44px] rounded-[3px] hover:brightness-105 transition-all cursor-pointer whitespace-nowrap"
          >
            {plateTouched ? "Review" : "Reserve"}
          </button>
        </div>
      </div>

      <VaultDrawer selection={drawer} openDates={dates ?? []} onClose={closeDrawer} />
    </div>
  );
}
