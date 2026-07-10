import React from "react";
import CustomizerClient from "@/components/customizer/CustomizerClient";

// Next 15: dynamic-route params arrive as a Promise.
export default async function TemplateDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-[var(--color-katha-l0)] text-[var(--color-katha-ink)]">
      <CustomizerClient leadId={id} />
    </div>
  );
}
