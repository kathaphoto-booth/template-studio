import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

import { LEAD_STATUSES } from "@/lib/constants";

export async function PATCH(req: NextRequest) {
  const password = process.env.STUDIO_PASSWORD;
  if (password) {
    const authHeader = req.headers.get("authorization") ?? "";
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme !== "Basic" || !encoded) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const provided = decoded.split(":")[1];
    if (provided !== password) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }
  
  // TODO(P0.3 - SaaS Phase): Status PATCH currently trusts middleware for auth. Add defense-in-depth
  // if middleware matcher ever drifts.
  
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
  const LEAD_HASH_REGEX = /^[a-f0-9]{32}$/;
  if (!LEAD_HASH_REGEX.test(lead_hash)) {
    return NextResponse.json({ ok: false, error: "Invalid identifier" }, { status: 400 });
  }
  if (!LEAD_STATUSES.includes(status as any)) {
    return NextResponse.json({ ok: false, error: `status must be one of: ${LEAD_STATUSES.join(", ")}` }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const { error } = await supabaseAdmin
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("lead_hash", lead_hash);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status });
}
