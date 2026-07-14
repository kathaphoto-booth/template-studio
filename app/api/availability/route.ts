import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ──────────────────────────────────────────────────────────────────────
// /api/availability — the allow-list model (PRD §7.5).
//
// The studio marks the dates it is OPEN in `available_dates`
// (admin-managed, public-read RLS). A date is selectable iff
// status = 'open' AND it is at least MIN_NOTICE_DAYS out.
//
// Failure contract: a fetch problem returns an honest 503 — never an
// empty-but-200 calendar. A client must never request a date the studio
// isn't open for because the real list silently failed to load.
// ──────────────────────────────────────────────────────────────────────

const MIN_NOTICE_DAYS = 7; // PRD §13-C default — one-constant swap
const HORIZON_DAYS = 120; // how far ahead the public calendar reaches

export const dynamic = "force-dynamic";

// Dates stay ISO `YYYY-MM-DD` strings end to end. Never `new Date(iso)`
// (midnight-UTC parsing renders Oct 15 as Oct 14 in PT). en-CA locale
// formats as YYYY-MM-DD, so string comparison is chronological.
function laDate(offsetDays = 0): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString(
    "en-CA",
    { timeZone: "America/Los_Angeles" },
  );
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "availability temporarily unavailable" },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("available_dates")
    .select("date,status")
    .gte("date", laDate(0))
    .lte("date", laDate(HORIZON_DAYS))
    .order("date", { ascending: true });

  if (error || !data) {
    return NextResponse.json(
      { error: "availability temporarily unavailable" },
      { status: 503 },
    );
  }

  const cutoff = laDate(MIN_NOTICE_DAYS);
  const dates = data.map((row: { date: string; status: string }) => ({
    date: row.date,
    status: row.status,
    selectable: row.status === "open" && row.date >= cutoff,
  }));

  return NextResponse.json({ dates, minNoticeDays: MIN_NOTICE_DAYS });
}
