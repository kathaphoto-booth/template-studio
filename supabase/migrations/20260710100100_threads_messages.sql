-- Client messaging (replaces the HoneyBook inbox).
-- Outbound: /api/messages sends via Resend with reply_to
--   reply+<reply_token>@kathabooth.com and inserts a row here.
-- Inbound: Resend inbound webhook → /api/webhooks/resend-inbound resolves
--   the thread from the reply+<token> recipient and inserts direction 'in'.
-- Council verdict 2026-07-10 (replace-honeybook), Gap A.

CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id),
  subject TEXT NOT NULL,
  reply_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.threads(id),
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  resend_message_id TEXT,
  attachments JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

CREATE INDEX threads_lead_id_idx ON public.threads (lead_id);
CREATE INDEX messages_thread_id_idx ON public.messages (thread_id, created_at);

-- Service-role only: no anon policies. All access goes through token-checked
-- API routes using the admin client (verdict bottleneck #7).
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
