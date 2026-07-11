-- Invoices (replaces HoneyBook invoicing). pb-v3 owns the invoice record;
-- Stripe Checkout Sessions move the money (no Stripe Invoicing surcharge).
-- status transitions: draft → sent → paid | void. Deposit + balance are two
-- rows per booking. Paid is set ONLY by /api/webhooks/stripe on
-- checkout.session.completed — never from a redirect.
-- Council verdict 2026-07-10 (replace-honeybook), Gap B.

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id),
  number TEXT NOT NULL UNIQUE,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  amount_total INTEGER NOT NULL CHECK (amount_total >= 0), -- cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'paid', 'void')),
  due_date DATE,
  view_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(), -- /invoice/[token]
  stripe_checkout_session_id TEXT,
  stripe_checkout_url TEXT, -- hosted payment page; /invoice/[token] links here
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX invoices_lead_id_idx ON public.invoices (lead_id);
CREATE INDEX invoices_status_idx ON public.invoices (status);

-- Service-role only: money tables carry no anon policies.
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
