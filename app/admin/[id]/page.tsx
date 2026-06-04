import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPipeline } from "./StatusPipeline";
import { SendPreview } from "./SendPreview";

type Selection = {
  template_id: string;
  template_name: string;
  layout: string;
  names: string | null;
  date: string | null;
  venue: string | null;
  font_family: string | null;
  notes: string | null;
  reference_photos: string[] | null;
};

function buildStudioUrl(sel: Selection): string {
  const p = new URLSearchParams();
  p.set("preset", sel.template_id);
  p.set("layout", sel.layout);
  if (sel.names)       p.set("names",  sel.names);
  if (sel.date)        p.set("date",   sel.date);
  if (sel.venue)       p.set("venue",  sel.venue);
  if (sel.font_family) p.set("font",   sel.font_family);
  return `/?${p.toString()}`;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!supabaseAdmin) notFound();

    const { data: lead, error: leadError } = await supabaseAdmin.from("leads").select("*").eq("id", id).single();
    if (leadError) throw new Error(leadError.message);
    if (!lead) notFound();

    const { data: selection } = await supabaseAdmin.from("selections").select("*").eq("lead", lead.lead_hash).order("selected_at", { ascending: false }).limit(1).maybeSingle();

  const brief: [string, string][] = [
    ["Template", selection?.template_name ?? "—"],
    ["Layout",   selection?.layout ?? "—"],
    ["Names",    selection?.names ?? "—"],
    ["Event Date", selection?.date ?? "—"],
    ["Venue",    selection?.venue ?? "—"],
    ["Font",     selection?.font_family ?? "—"],
    ["Notes",    selection?.notes ?? "—"],
  ];

  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Breadcrumb */}
      <Link href="/admin" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#5A5D5A", textDecoration: "none", display: "inline-block", marginBottom: "32px" }}>
        ← All Leads
      </Link>

      {/* Header */}
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: 400, color: "#EAE2D5", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
        {lead.client_name}
      </h1>
      <p style={{ fontSize: "14px", color: "#9C958A", margin: "0 0 40px", fontFamily: "'Inter', sans-serif" }}>
        {lead.client_email}{lead.client_phone ? ` · ${lead.client_phone}` : ""}
      </p>

      {/* Status pipeline — Client Component */}
      <StatusPipeline
        currentStatus={lead.status}
        leadHash={lead.lead_hash}
        authToken={Buffer.from(`admin:${process.env.STUDIO_PASSWORD ?? ""}`).toString("base64")}
      />

      {/* Client brief */}
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.25em", color: "#5A5D5A", marginBottom: "20px" }}>
          Client Brief
        </p>

        {selection ? (
          <>
            <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 0, margin: 0 }}>
              {brief.map(([label, value]) => (
                <div key={label} style={{ display: "contents" }}>
                  <dt style={{ padding: "10px 0", fontFamily: "'Inter', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#5A5D5A", borderBottom: "1px dashed rgba(196,181,157,0.15)" }}>
                    {label}
                  </dt>
                  <dd style={{ padding: "10px 0 10px 16px", fontSize: "15px", color: "#EAE2D5", margin: 0, borderBottom: "1px dashed rgba(196,181,157,0.15)" }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Reference photos */}
            {selection.reference_photos && selection.reference_photos.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#5A5D5A", marginBottom: "12px" }}>
                  Reference Photos
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {selection.reference_photos.map((url: string, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt="" style={{ width: 180, height: 120, objectFit: "cover", border: "1px solid rgba(196,181,157,0.2)" }} />
                  ))}
                </div>
              </div>
            )}

            {/* Open in Studio CTA */}
            <div style={{ marginTop: "32px" }}>
              <a
                href={buildStudioUrl(selection)}
                style={{ display: "inline-block", backgroundColor: "#8C382A", color: "#EAE2D5", textDecoration: "none", padding: "12px 28px", fontFamily: "'Inter', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em" }}
              >
                Open in Studio →
              </a>
              <p style={{ marginTop: "10px", fontSize: "12px", color: "#5A5D5A", fontFamily: "'Inter', sans-serif" }}>
                Opens the template editor pre-filled with this client's specs.
              </p>
            </div>
          </>
        ) : (
          <p style={{ color: "#5A5D5A", fontStyle: "italic", fontSize: "15px" }}>
            Client has not yet chosen a template.
          </p>
        )}
      </div>

      {/* Send preview — Client Component */}
      <SendPreview leadHash={lead.lead_hash} />
    </div>
  );
  } catch (err: any) {
    return (
      <div style={{ maxWidth: "800px" }}>
        <Link href="/admin" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#5A5D5A", textDecoration: "none", display: "inline-block", marginBottom: "32px" }}>
          ← All Leads
        </Link>
        <div style={{ color: "#8C382A", padding: "40px", backgroundColor: "rgba(140,56,42,0.1)", border: "1px solid #8C382A", borderRadius: 0 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", margin: "0 0 16px 0" }}>Failed to load lead details</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", margin: 0 }}>{err.message}</p>
        </div>
      </div>
    );
  }
}
