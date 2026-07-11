import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { requireStudioAuth } from "@/lib/crm";

// ──────────────────────────────────────────────────────────────────────
// /api/invoices/[id]/send — turn a draft invoice into money-in-motion.
//
//   POST (studio auth):
//     1. Create a Stripe Checkout Session (mode: 'payment',
//        client_reference_id: invoice.id) from the invoice line items.
//     2. Store the session id + hosted URL, mark the invoice 'sent'.
//     3. Email the client their /invoice/[view_token] page via Resend.
//
// Paid is NEVER set here or from a redirect — only by /api/webhooks/stripe
// on checkout.session.completed. Council verdict 2026-07-10 Gap B.
// ──────────────────────────────────────────────────────────────────────

type LineItem = { description: string; amount: number; quantity?: number };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireStudioAuth(req);
  if (denied) return denied;

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ ok: false, error: "payments not configured (missing STRIPE_SECRET_KEY)" }, { status: 500 });
  }

  const { id } = await params;

  const { data: invoice, error: invError } = await supabaseAdmin
    .from("invoices")
    .select("id, lead_id, number, line_items, amount_total, currency, status, view_token")
    .eq("id", id)
    .single();
  if (invError || !invoice) {
    return NextResponse.json({ ok: false, error: "invoice not found" }, { status: 404 });
  }
  if (invoice.status === "paid" || invoice.status === "void") {
    return NextResponse.json({ ok: false, error: `invoice is ${invoice.status}` }, { status: 409 });
  }

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("client_name, client_email")
    .eq("id", invoice.lead_id)
    .single();
  if (leadError || !lead) {
    return NextResponse.json({ ok: false, error: "lead not found for invoice" }, { status: 404 });
  }

  const appUrl = process.env.APP_URL || "https://kathabooth.com";
  const invoiceUrl = `${appUrl}/invoice/${invoice.view_token}`;

  const stripe = new Stripe(stripeKey);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: invoice.id,
      customer_email: lead.client_email,
      line_items: (invoice.line_items as LineItem[]).map((item) => ({
        quantity: item.quantity ?? 1,
        price_data: {
          currency: invoice.currency,
          unit_amount: item.amount,
          product_data: { name: item.description },
        },
      })),
      success_url: `${invoiceUrl}?paid=pending`,
      cancel_url: invoiceUrl,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: `stripe error: ${msg}` }, { status: 502 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("invoices")
    .update({
      status: "sent",
      stripe_checkout_session_id: session.id,
      stripe_checkout_url: session.url,
    })
    .eq("id", invoice.id);
  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const fromAddr = process.env.NOTIFICATION_FROM || "Katha <onboarding@resend.dev>";
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromAddr,
      to: lead.client_email,
      subject: `Invoice ${invoice.number} from Katha Booth`,
      text: [
        `Dear ${lead.client_name},`,
        ``,
        `Your invoice ${invoice.number} is ready.`,
        `View and pay here: ${invoiceUrl}`,
        ``,
        `Warmly,`,
        `The Katha Team`,
      ].join("\n"),
    });
  }

  return NextResponse.json({
    ok: true,
    invoice_id: invoice.id,
    checkout_url: session.url,
    invoice_url: invoiceUrl,
    emailed: Boolean(apiKey),
  });
}
