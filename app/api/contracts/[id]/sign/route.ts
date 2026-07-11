import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { clientIp } from "@/lib/crm";

// ──────────────────────────────────────────────────────────────────────
// /api/contracts/[id]/sign — click-to-sign endpoint behind /sign/[token].
//
// Public but token-checked: the caller must present the contract's
// sign_token (a bearer credential mailed only to the client). ESIGN/UETA
// posture (council verdict 2026-07-10 Gap C):
//   - consent checkbox timestamp recorded (consent_given_at)
//   - typed-name signature + signer IP + user-agent captured
//   - content_sha256 recomputed server-side AND echoed by the client, so
//     nobody signs a document that mutated after send
//   - 'consented' + 'signed' appended to the contract_events audit trail
//
// Countersign + executed PDF land in step 3 (contracts build).
// ──────────────────────────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, error: "database not configured" }, { status: 500 });
  }

  const { id } = await params;

  let body: {
    sign_token?: string;
    signer_name?: string;
    signer_email?: string;
    consent?: boolean;
    content_sha256?: string;
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 }); }

  const { sign_token, signer_name, signer_email, consent, content_sha256 } = body;
  if (!sign_token || !signer_name?.trim()) {
    return NextResponse.json({ ok: false, error: "sign_token and signer_name are required" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json(
      { ok: false, error: "electronic-signing consent is required" },
      { status: 400 }
    );
  }

  const { data: contract, error: findError } = await supabaseAdmin
    .from("contracts")
    .select("id, status, sign_token, rendered_html, content_sha256")
    .eq("id", id)
    .single();
  if (findError || !contract) {
    return NextResponse.json({ ok: false, error: "contract not found" }, { status: 404 });
  }
  if (contract.sign_token !== sign_token) {
    return NextResponse.json({ ok: false, error: "invalid token" }, { status: 401 });
  }
  if (contract.status === "signed" || contract.status === "countersigned") {
    return NextResponse.json({ ok: false, error: "contract is already signed" }, { status: 409 });
  }
  if (contract.status === "draft") {
    return NextResponse.json({ ok: false, error: "contract has not been sent" }, { status: 409 });
  }

  // Tamper check: the stored document must still hash to the value frozen at
  // send, and the client must echo the hash of what it displayed.
  const serverHash = createHash("sha256").update(contract.rendered_html).digest("hex");
  if (serverHash !== contract.content_sha256 || content_sha256 !== contract.content_sha256) {
    return NextResponse.json(
      { ok: false, error: "document hash mismatch — signing refused" },
      { status: 409 }
    );
  }

  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent");
  const now = new Date().toISOString();

  const { error: updateError } = await supabaseAdmin
    .from("contracts")
    .update({
      status: "signed",
      signer_name: signer_name.trim().slice(0, 200),
      signer_email: signer_email?.trim().slice(0, 320) || null,
      signer_ip: ip,
      signer_user_agent: userAgent,
      consent_given_at: now,
      signed_at: now,
    })
    .eq("id", contract.id);
  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
  }

  await supabaseAdmin.from("contract_events").insert([
    { contract_id: contract.id, event: "consented", ip, user_agent: userAgent },
    { contract_id: contract.id, event: "signed", ip, user_agent: userAgent },
  ]);

  // TODO(step 3, contracts build): notify Jed to countersign, then issue the
  // deposit Checkout link — the signed contract gates the money.
  return NextResponse.json({ ok: true, contract_id: contract.id, signed_at: now });
}
