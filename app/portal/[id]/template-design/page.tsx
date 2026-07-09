import React from "react";
import CustomizerClient from "@/components/customizer/CustomizerClient";

export default function TemplateDesignPage({ params }: { params: { id: string } }) {
  // In a real app, fetch the lead/selection by ID here. 
  // We'll pass the ID to the client component.
  return (
    <div className="min-h-screen bg-[#110F0D] text-[#E8E1D3]">
      <CustomizerClient leadId={params.id} />
    </div>
  );
}
