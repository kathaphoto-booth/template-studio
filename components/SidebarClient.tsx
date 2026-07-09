"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { KathaWordmark } from "@/components/marks/KathaWordmark";
import { fetchOpenDates, type Tier } from "@/lib/booking";

const fmtLong = (d: string) =>
  d
    ? new Date(d + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

type GateStatus = "open" | "closed" | "error" | null;

export function SidebarClient({ tiers }: { tiers: Tier[] }) {
  const [gateDate, setGateDate] = useState("");
  const [gateStatus, setGateStatus] = useState<GateStatus>(null);
  const [checking, setChecking] = useState(false);
  // One registry read per session — repeat checks are instant.
  const openDatesRef = useRef<string[] | null>(null);

  const checkDate = async () => {
    if (!gateDate || checking) return;
    setChecking(true);
    try {
      // Allow-list law (PRD §7.5): a night is available only if the studio
      // marked it open. Absence means "not open," never "assume free."
      const open = openDatesRef.current ?? (await fetchOpenDates());
      openDatesRef.current = open;
      setGateStatus(open.includes(gateDate) ? "open" : "closed");
    } catch {
      // Never fake availability — say the registry couldn't be reached.
      setGateStatus("error");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full text-[var(--color-katha-hi)]">
      <div className="flex flex-col items-center mb-16">
        <KathaWordmark size={32} swash={true} />
        <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)] mt-6 text-center">
          Los Angeles &amp; Orange County
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-10">
        {/* DATE GATE — bound to the real open-date registry */}
        <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-6 shadow-[0_24px_60px_var(--color-katha-shadow)]">
          {gateStatus !== "open" ? (
            <>
              <div className="flex flex-col gap-2 mb-6">
                <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)]">
                  RESERVE YOUR DATE
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <input
                    type="date"
                    value={gateDate}
                    aria-label="Event date"
                    onChange={(e) => {
                      setGateDate(e.target.value);
                      setGateStatus(null);
                    }}
                    className="w-full bg-transparent border-none text-[var(--color-katha-hi)] py-2 font-display text-lg outline-none"
                  />
                  <div className="h-[1px] absolute bottom-0 w-full bg-[var(--color-katha-ln2)]" />
                </div>
                <button
                  onClick={checkDate}
                  disabled={!gateDate || checking}
                  className={`w-full font-mono text-[10px] tracking-[0.16em] uppercase border pb-3 pt-3 text-center outline-none transition-colors ${
                    gateDate && !checking
                      ? "text-[var(--color-katha-l0)] bg-[var(--color-katha-gilt)] border-[var(--color-katha-gilt)] hover:brightness-105 cursor-pointer"
                      : "text-[var(--color-katha-fnt)] border-[var(--color-katha-ln)] cursor-not-allowed"
                  }`}
                >
                  {checking ? "CHECKING THE REGISTRY…" : "CHECK AVAILABILITY"}
                </button>
              </div>
              {gateStatus === "closed" && (
                <p className="fin font-body text-[14px] italic text-[var(--color-katha-mut)] mt-5 leading-[1.5]">
                  {fmtLong(gateDate)} isn&rsquo;t on the open registry — reach
                  out; we sometimes add nights.
                </p>
              )}
              {gateStatus === "error" && (
                <p className="fin font-body text-[14px] italic text-[var(--color-katha-mut)] mt-5 leading-[1.5]">
                  We couldn&rsquo;t reach the registry just now.{" "}
                  <a
                    href="mailto:kathabooth@gmail.com"
                    className="text-[var(--color-katha-hi)] border-b border-[var(--color-katha-ln2)]"
                  >
                    Email us
                  </a>{" "}
                  and we&rsquo;ll confirm by hand.
                </p>
              )}
            </>
          ) : (
            <div className="fin">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[7px] h-[7px] rounded-full bg-[var(--color-katha-moss-hi)]" />
                <p className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-[var(--color-katha-moss-hi)]">
                  {fmtLong(gateDate)} · open
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/gallery?date=${gateDate}`}
                  className="w-full font-mono text-[9.5px] tracking-[0.12em] uppercase text-[var(--color-katha-l0)] bg-[var(--color-katha-hi)] text-center py-3"
                >
                  Reserve this night →
                </Link>
                <button
                  onClick={() => {
                    setGateStatus(null);
                    setGateDate("");
                  }}
                  className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-katha-fnt)] border-b border-transparent py-1 text-center cursor-pointer"
                >
                  change date
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TIERS QUICK NAV */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)] border-b border-[var(--color-katha-ln)] pb-3">
            Choose an installation
          </p>
          <div className="flex flex-col gap-3">
            {tiers.map((tier) =>
              tier.available === false ? (
                <div
                  key={tier.key}
                  aria-disabled="true"
                  className="text-left opacity-40 grayscale cursor-not-allowed"
                >
                  <div className="font-display font-light text-lg text-[var(--color-katha-mut)]">
                    {tier.name}
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.16em] uppercase mt-1 text-[var(--color-katha-fnt)]">
                    {tier.unavailableLabel ?? "Currently unavailable"}
                  </div>
                </div>
              ) : (
                <Link
                  key={tier.key}
                  href={`/gallery?tier=${tier.key}`}
                  scroll={false}
                  className="group text-left"
                >
                  <div className="font-display font-light text-lg text-[var(--color-katha-mut)] group-hover:text-[var(--color-katha-hi)] transition-colors">
                    {tier.name}
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.16em] uppercase mt-1 text-[var(--color-katha-fnt)]">
                    ${tier.price.toLocaleString()} · up to {tier.hours} hrs
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-[var(--color-katha-ln)] flex flex-col gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <a
          href="mailto:kathabooth@gmail.com"
          className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-katha-gilt)] border-b border-[var(--color-katha-gilt)] self-start pb-0.5"
        >
          Correspondence
        </a>
        <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-[var(--color-katha-fnt)] mt-4">
          © 2026 Katha Booth
        </p>
      </div>
    </div>
  );
}
