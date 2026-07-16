import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import CustomizerClient from "@/components/customizer/CustomizerClient";

export const dynamic = "force-dynamic";

// Lead-hash gate from the intake funnel: any id other than the passthrough
// ids must exist in leads.lead_hash or the page 404s. "guest" is the organic
// visitor entry; "demo" is the QA/a11y surface (CustomizerClient already
// treats it as no-lead). The surface behind the gate is the harvest
// customizer (Plate → Paper → Inscription → Finalize) — the single
// customizer; the legacy TemplateDesignClient retired with this merge.
const PASSTHROUGH_IDS = new Set(["guest", "demo"]);

export default async function TemplateDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!PASSTHROUGH_IDS.has(id)) {
    if (!supabaseAdmin) notFound();
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("lead_hash")
      .eq("lead_hash", id)
      .maybeSingle();
    if (error || !data) notFound();
  }
  return (
    <div className="min-h-screen bg-[var(--color-katha-l0)] text-[var(--color-katha-ink)]">
      <CustomizerClient leadId={id} />
    </div>
  );
}
