"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KathaWordmark } from "@/components/marks/KathaWordmark";
import { KathaGlyph } from "@/components/marks/KathaGlyph";

export interface Tier {
  id: string;
  name: string;
  booth: string;
  format: string;
  price: string;
  desc: string;
  flag: string | null;
  available?: boolean;
}

// Mock confirmed dates
const CONFIRMED: Record<string, number> = { "2026-07-05": 1, "2026-09-13": 1, "2026-10-18": 1, "2026-11-22": 1 };
const fmtLong = (d: string) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";

export function SidebarClient({ tiers }: { tiers: Tier[] }) {
  const router = useRouter();
  const [gateDate, setGateDate] = useState("");
  const [gateStatus, setGateStatus] = useState<"open" | "reserved" | null>(null);

  const checkDate = () => {
    if (!gateDate) return;
    setGateStatus(CONFIRMED[gateDate] ? "reserved" : "open");
  };

  return (
    <div className="w-full flex flex-col h-full text-[var(--color-katha-hi)]">
      <div className="flex flex-col items-center mb-16">
        <KathaWordmark size={32} swash={true} />
        <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)] mt-6 text-center">
          Southern California
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-10">
        {/* DATE GATE */}
        <div className="bg-[var(--color-katha-l1)] border border-[var(--color-katha-ln)] p-6 shadow-[0_24px_60px_var(--color-katha-shadow)]">
          {gateStatus !== "open" ? (
            <>
              <div className="flex flex-col gap-2 mb-6">
                <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-katha-fnt)]">
                  RESERVE YOUR DATE
                </p>
                {gateStatus === "reserved" && <span className="font-mono text-[9px] text-[var(--color-katha-ecru)] border-l-2 border-[var(--color-katha-hi)] pl-2">taken</span>}
              </div>
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <input type="date" value={gateDate} onChange={e => { setGateDate(e.target.value); setGateStatus(null); }}
                    className="w-full bg-transparent border-none text-[var(--color-katha-hi)] py-2 font-display text-lg outline-none" />
                  <div className={`h-[1px] absolute bottom-0 w-full ${gateStatus === "reserved" ? 'bg-[var(--color-katha-hi)]' : 'bg-[var(--color-katha-ln2)]'}`} />
                </div>
                <button onClick={checkDate} disabled={!gateDate} className={`w-full font-mono text-[10px] tracking-[0.16em] uppercase border pb-3 pt-3 text-center outline-none transition-colors ${gateDate ? 'text-[var(--color-katha-l0)] bg-[var(--color-katha-gilt)] border-[var(--color-katha-gilt)] hover:brightness-105' : 'text-[var(--color-katha-fnt)] border-[var(--color-katha-ln)]'}`}>
                  CHECK AVAILABILITY
                </button>
              </div>
              {gateStatus === "reserved" && (
                <p className="fin font-body text-[14px] italic text-[var(--color-katha-mut)] mt-5 leading-[1.5]">
                  {fmtLong(gateDate)} is taken — reach out, we sometimes hold a second booth.
                </p>
              )}
            </>
          ) : (
            <div className="fin">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[7px] h-[7px] rounded-full bg-[var(--color-katha-sage)]" />
                <p className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-[var(--color-katha-sage)]">
                  {fmtLong(gateDate)} · open
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/gallery" className="w-full font-mono text-[9.5px] tracking-[0.12em] uppercase text-[var(--color-katha-l0)] bg-[var(--color-katha-hi)] text-center py-3">
                  Reserve this night →
                </Link>
                <button onClick={() => { setGateStatus(null); setGateDate(""); }} className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-katha-fnt)] border-b border-transparent py-1 text-center">
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
            {tiers.map((tier) => (
              tier.available === false ? (
                <div key={tier.id} aria-disabled="true" className="text-left opacity-40 grayscale cursor-not-allowed">
                  <div className="font-display font-light text-lg text-[var(--color-katha-mut)]">
                    {tier.name}
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.16em] uppercase mt-1 text-[var(--color-katha-fnt)]">
                    {tier.flag ?? "Currently unavailable"}
                  </div>
                </div>
              ) : (
                <Link
                  key={tier.id}
                  href={`/gallery?tier=${tier.id}`}
                  scroll={false}
                  className="group text-left"
                >
                  <div className="font-display font-light text-lg text-[var(--color-katha-mut)] group-hover:text-[var(--color-katha-hi)] transition-colors">
                    {tier.name}
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.16em] uppercase mt-1 text-[var(--color-katha-fnt)]">
                    {tier.price} · {tier.format}
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>

      </div>

      <div className="mt-auto pt-8 border-t border-[var(--color-katha-ln)] flex flex-col gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <a href="mailto:kathabooth@gmail.com" className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-katha-gilt)] border-b border-[var(--color-katha-gilt)] self-start pb-0.5">Correspondence</a>
        <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-[var(--color-katha-fnt)] mt-4">© 2026 Katha Booth</p>
      </div>
    </div>
  );
}
