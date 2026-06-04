import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

type Lead = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  event_date: string | null;
  lead_hash: string;
  status: string;
  created_at: string;
};

type Selection = {
  lead: string;
  template_name: string;
  template_id: string;
};

const STATUS_STYLES: Record<string, { background: string; color: string }> = {
  Inquired:   { background: "#C4B59D",           color: "#241E1A" },
  Selected:   { background: "#EAE2D5",           color: "#5A564E" },
  "In-Design":{ background: "rgba(140,56,42,0.15)", color: "#8C382A" },
  Approved:   { background: "#241E1A",           color: "#EAE2D5" },
};

async function getData() {
  if (!supabaseAdmin) return { leads: [], selections: [] };

  // Single-tenant today: every lead belongs to STUDIO_ID. When the schema gains a
  // studio_id column (SaaS multi-tenancy phase), restore `.eq("studio_id", STUDIO_ID)`.
  const { data: leadsRaw, error } = await supabaseAdmin
    .from("leads")
    .select("id, client_name, client_email, client_phone, event_date, lead_hash, status, created_at")
    .order("created_at", { ascending: false });
    // TODO(P2.4 - SaaS Phase): Implement pagination via standard SQL OFFSET + LIMIT 
    // to prevent performance degradation when thousands of leads exist.

  if (error) {
    throw new Error(error.message);
  }

  const leads: Lead[] = leadsRaw ?? [];

  const hashes = leads.map((l) => l.lead_hash);
  const selectionsRaw = hashes.length
    ? (await supabaseAdmin.from("selections").select("lead, template_name, template_id").in("lead", hashes)).data
    : [];

  const selections: Selection[] = selectionsRaw ?? [];
  return { leads, selections };
}

export default async function AdminPage() {
  try {
    const { leads, selections } = await getData();

    const selectionByLead = Object.fromEntries(selections.map((s) => [s.lead, s]));

    return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: 400, margin: 0, color: "#EAE2D5", letterSpacing: "-0.02em" }}>
          Leads
        </h1>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#9C958A" }}>
          {leads.length} {leads.length === 1 ? "inquiry" : "inquiries"}
        </span>
      </div>

      {leads.length === 0 ? (
        <p style={{ color: "#9C958A", fontStyle: "italic", fontSize: "15px" }}>
          No leads yet. Share the gallery link to get started.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(196,181,157,0.2)" }}>
              {["Client", "Email", "Phone", "Event Date", "Template", "Status", "Submitted"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0 16px 12px 0", fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#9C958A", fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const sel = selectionByLead[lead.lead_hash];
              const style = STATUS_STYLES[lead.status] ?? STATUS_STYLES["Inquired"];
              return (
                <tr key={lead.id} style={{ borderBottom: "1px solid rgba(196,181,157,0.08)" }}>
                  <td style={{ padding: "16px 16px 16px 0" }}>
                    <Link
                      href={`/admin/${lead.id}`}
                      style={{ color: "#EAE2D5", textDecoration: "none", fontWeight: 500 }}
                    >
                      {lead.client_name}
                    </Link>
                  </td>
                  <td style={{ padding: "16px 16px 16px 0", color: "#9C958A", fontSize: "13px" }}>
                    {lead.client_email}
                  </td>
                  <td style={{ padding: "16px 16px 16px 0", color: "#9C958A", fontSize: "13px" }}>
                    {lead.client_phone ?? "—"}
                  </td>
                  <td style={{ padding: "16px 16px 16px 0", color: "#C4B59D" }}>
                    {lead.event_date ?? "—"}
                  </td>
                  <td style={{ padding: "16px 16px 16px 0", color: "#9C958A", fontSize: "13px" }}>
                    {sel ? sel.template_name : <span style={{ color: "#9C958A", fontStyle: "italic" }}>not yet chosen</span>}
                  </td>
                  <td style={{ padding: "16px 16px 16px 0" }}>
                    <span style={{ ...style, fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", padding: "3px 10px", display: "inline-block" }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 0", color: "#9C958A", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                    {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
  } catch (err: any) {
    return (
      <div style={{ color: "#8C382A", padding: "40px", backgroundColor: "rgba(140,56,42,0.1)", border: "1px solid #8C382A", borderRadius: 0 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", margin: "0 0 16px 0" }}>Failed to load leads</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", margin: 0 }}>{err.message}</p>
      </div>
    );
  }
}
