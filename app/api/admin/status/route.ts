import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const VALID_STATUSES = ["Inquired", "Selected", "In-Design", "Approved"] as const;

export async function PATCH(req: NextRequest) {
  let body: { lead_hash?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const { lead_hash, status } = body;
  if (!lead_hash || !status) {
    return NextResponse.json({ ok: false, error: "lead_hash and status are required" }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(status as any)) {
    return NextResponse.json({ ok: false, error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const { error } = await supabaseAdmin
    .from("leads")
    .update({ status })
    .eq("lead_hash", lead_hash);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status });
}
