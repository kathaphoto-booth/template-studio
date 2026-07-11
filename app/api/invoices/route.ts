import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireStudioAuth } from "@/lib/crm";

// ──────────────────────────────────────────────────────────────────────
// /api/invoices — invoice records live here, not in Stripe (council
// verdict 2026-07-10 Gap B: Checkout Sessions, no Stripe Invoicing).
//
//   POST (studio auth) — create a draft invoice for a lead.
//     Deposit + balance = two invoice rows per booking.
//   GET  (studio auth) — list invoices (?lead_id= to filter).
//
// Money flow: draft → /api/invoices/[id]/send (Checkout link) → paid,
// set only by /api/webhooks/stripe on checkout.session.completed.
// ──────────────────────────────────────────────────────────────────────

type LineItem = { description: string; amount: number; quantity?: number };

export async function POST(req: NextRequest) {
  const denied = requireStudioAuth(req);
  if (denied) return denied;

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  let body: {
    lead_id?: string;
    line_items?: LineItem[];
    currency?: string;
    due_date?: string;
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 }); }

  const { lead_id, line_items, currency, due_date } = body;
  if (!lead_id || !Array.isArray(line_items) || line_items.length === 0) {
    return NextResponse.json({ ok: false, error: "lead_id and line_items are required" }, { status: 400 });
  }
  for (const item of line_items) {
    if (!item.description || !Number.isInteger(item.amount) || item.amount < 0) {
      return NextResponse.json(
        { ok: false, error: "each line item needs a description and a non-negative integer amount (cents)" },
        { status: 400 }
      );
    }
  }

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("id")
    .eq("id", lead_id)
    .single();
  if (leadError || !lead) {
    return NextResponse.json({ ok: false, error: "lead not found" }, { status: 404 });
  }

  const amountTotal = line_items.reduce(
    (sum, item) => sum + item.amount * (item.quantity ?? 1),
    0
  );

  // Human-readable, collision-safe enough for a one-operator studio:
  // KB-<year>-<count+1>, padded. Uniqueness is enforced by the DB.
  const year = new Date().getFullYear();
  const { count } = await supabaseAdmin
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .like("number", `KB-${year}-%`);
  const number = `KB-${year}-${String((count ?? 0) + 1).padStart(4, "0")}`;

  const { data: invoice, error } = await supabaseAdmin
    .from("invoices")
    .insert({
      lead_id,
      number,
      line_items,
      amount_total: amountTotal,
      currency: currency || "usd",
      due_date: due_date || null,
      status: "draft",
    })
    .select("id, number, view_token, amount_total, status")
    .single();
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, invoice });
}

export async function GET(req: NextRequest) {
  const denied = requireStudioAuth(req);
  if (denied) return denied;

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const leadId = req.nextUrl.searchParams.get("lead_id");
  let query = supabaseAdmin
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (leadId) query = query.eq("lead_id", leadId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, invoices: data });
}
