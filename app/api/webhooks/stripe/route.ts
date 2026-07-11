import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { claimWebhookEvent } from "@/lib/crm";

// ──────────────────────────────────────────────────────────────────────
// /api/webhooks/stripe — the ONLY writer of invoice.status = 'paid'.
//
// 1. Verify the stripe-signature header against STRIPE_WEBHOOK_SECRET.
// 2. Dedupe by Stripe event id via processed_webhook_events.
// 3. checkout.session.completed → mark the invoice paid (matched by
//    client_reference_id), record the payment intent.
//
// Council verdict 2026-07-10 Gap B. Redirect pages never flip state.
// TODO(step 4, Stripe + invoices): on paid, flip the event's
// available_dates row to 'booked' and email a receipt.
// ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "webhook not configured" }, { status: 500 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(stripeKey);
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  const claim = await claimWebhookEvent(event.id);
  if (claim === "duplicate") {
    return NextResponse.json({ ok: true, deduped: true });
  }
  if (claim === "error") {
    // 500 so Stripe retries; the ledger insert is the idempotency gate.
    return NextResponse.json({ ok: false, error: "dedupe ledger unavailable" }, { status: 500 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const invoiceId = session.client_reference_id;
    if (!invoiceId) {
      return NextResponse.json({ ok: true, ignored: "no client_reference_id" });
    }

    const { error } = await supabaseAdmin
      .from("invoices")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
      })
      .eq("id", invoiceId)
      .neq("status", "void");
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, invoice_id: invoiceId, status: "paid" });
  }

  if (event.type === "checkout.session.expired") {
    // The stored checkout link is dead; the invoice stays 'sent' and
    // /api/invoices/[id]/send can mint a fresh session.
    return NextResponse.json({ ok: true, noted: "checkout session expired" });
  }

  return NextResponse.json({ ok: true, ignored: event.type });
}
