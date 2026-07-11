-- Contract e-sign (replaces HoneyBook contracts). ESIGN/UETA posture:
-- content_sha256 is frozen at send and re-verified at sign so nobody signs a
-- mutated document; contract_events is the append-only audit trail (sent /
-- opened / consented / signed / countersigned) with IP + user-agent; the
-- signed contract gates the deposit Checkout link.
-- Council verdict 2026-07-10 (replace-honeybook), Gap C.

CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id),
  template_id TEXT,
  variables JSONB NOT NULL DEFAULT '{}'::jsonb,
  rendered_html TEXT NOT NULL,
  content_sha256 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'countersigned')),
  sign_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(), -- /sign/[token]
  signer_name TEXT,
  signer_email TEXT,
  signer_ip TEXT,
  signer_user_agent TEXT,
  consent_given_at TIMESTAMPTZ, -- ESIGN consent checkbox timestamp
  signed_at TIMESTAMPTZ,
  countersigned_at TIMESTAMPTZ,
  executed_pdf_path TEXT, -- private Storage bucket path
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Append-only audit trail. No UPDATE/DELETE path exists in the app; rows are
-- evidence, not state.
CREATE TABLE public.contract_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id),
  event TEXT NOT NULL
    CHECK (event IN ('sent', 'opened', 'consented', 'signed', 'countersigned')),
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX contracts_lead_id_idx ON public.contracts (lead_id);
CREATE INDEX contract_events_contract_id_idx
  ON public.contract_events (contract_id, created_at);

-- Service-role only: contract tables carry no anon policies.
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_events ENABLE ROW LEVEL SECURITY;
