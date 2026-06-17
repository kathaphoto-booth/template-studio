import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import TemplateDesignClient from "./TemplateDesignClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "guest") {
    if (!supabaseAdmin) notFound();
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("lead_hash")
      .eq("lead_hash", id)
      .maybeSingle();
    if (error || !data) notFound();
  }
  return <TemplateDesignClient id={id} />;
}
