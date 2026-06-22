"use client";

import React from "react";

export interface ReviewFormData {
  names: string;
  email: string;
  phone?: string;
  date: string;
  venue: string;
  address?: string;
  templateName: string;
  fontFamily: string;
  textPosition: string;
  tierName: string;
  tierPrice?: number | string;
  referencePhotos?: string[];
  templateThumbnailUrl?: string;
}

export interface ReviewScreenProps {
  data: ReviewFormData;
  onEdit: (stepIndex: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function ReviewScreen({
  data,
  onEdit,
  onSubmit,
  onBack,
  isSubmitting = false,
}: ReviewScreenProps) {
  // Renders a single summary row with an edit link
  const SummaryRow = ({
    label,
    value,
    stepIndex,
    isImageGrid = false,
    images = [],
  }: {
    label: string;
    value?: React.ReactNode;
    stepIndex: number;
    isImageGrid?: boolean;
    images?: string[];
  }) => (
    <div className="flex flex-col md:flex-row md:items-start justify-between py-5 border-b border-[#C4B59D] last:border-0 gap-3 md:gap-6">
      <div className="w-full md:w-[30%] flex items-center justify-between md:block shrink-0">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#5A564E] font-sans">
          {label}
        </span>
        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="md:hidden text-[10px] uppercase tracking-[0.18em] text-[#241E1A] underline decoration-[#C4B59D] underline-offset-[5px] hover:decoration-[#241E1A] transition-colors"
          aria-label={`Edit ${label}`}
        >
          Edit
        </button>
      </div>
      <div className="w-full md:w-[70%] flex items-start justify-between gap-6">
        <div className="text-[14px] text-[#241E1A] font-sans leading-relaxed">
          {isImageGrid && images.length > 0 ? (
            <div className="flex gap-4 flex-wrap mt-1">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-[#1A1816] ring-1 ring-[#C4B59D] flex-shrink-0"
                  style={{ borderRadius: 0 }}
                >
                  <img
                    src={src}
                    alt={`Reference ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            value || <span className="text-[#5A564E] italic font-light">Not provided</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="hidden md:block text-[10px] uppercase tracking-[0.18em] text-[#241E1A] underline decoration-[#C4B59D] underline-offset-[5px] hover:decoration-[#241E1A] transition-colors shrink-0 mt-1"
          aria-label={`Edit ${label}`}
        >
          Edit
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[720px] flex flex-col mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl text-[#241E1A]"
            style={{
              fontFamily: "var(--font-serif), serif",
              fontWeight: 400,
              letterSpacing: "-0.022em",
            }}
          >
            Review your inquiry
          </h2>
        </div>

        {/* Summary Card */}
        <div
          className="w-full bg-transparent border border-[#C4B59D] px-6 md:px-10 py-2 mb-12"
          style={{ borderRadius: 0 }}
        >
          {/* Step 1: Client Details */}
          <SummaryRow label="Names" value={data.names} stepIndex={1} />
          <SummaryRow label="Email" value={data.email} stepIndex={1} />
          <SummaryRow label="Phone" value={data.phone} stepIndex={1} />

          {/* Step 2: The Event */}
          <SummaryRow label="Event Date" value={data.date} stepIndex={2} />
          <SummaryRow label="Venue" value={data.venue} stepIndex={2} />
          <SummaryRow label="Address" value={data.address} stepIndex={2} />

          {/* Step 3: Design Preferences */}
          <SummaryRow
            label="Template"
            value={
              <div className="flex items-center gap-4">
                {data.templateThumbnailUrl && (
                  <div
                    className="w-12 h-16 bg-[#1A1816] ring-1 ring-[#C4B59D] shrink-0"
                    style={{ borderRadius: 0 }}
                  >
                    <img
                      src={data.templateThumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="font-serif italic text-[16px]">{data.templateName}</span>
              </div>
            }
            stepIndex={3}
          />
          <SummaryRow label="Font" value={data.fontFamily} stepIndex={3} />
          <SummaryRow
            label="Text Position"
            value={<span className="capitalize">{data.textPosition}</span>}
            stepIndex={3}
          />

          {/* Step 4: Installation Tier */}
          <SummaryRow
            label="Installation"
            value={
              <div className="flex items-center gap-2">
                <span>{data.tierName}</span>
                {data.tierPrice && (
                  <span className="text-[#5A564E] text-[13px] tracking-wide">
                    — ${data.tierPrice}
                  </span>
                )}
              </div>
            }
            stepIndex={4}
          />

          {/* Step 5: Reference Photos */}
          {(data.referencePhotos || []).length > 0 && (
            <SummaryRow
              label="References"
              isImageGrid
              images={data.referencePhotos}
              stepIndex={5}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-between border-t border-[#C4B59D]/30 pt-8">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-[11px] uppercase tracking-[0.18em] text-[#5A564E] hover:text-[#241E1A] transition-colors disabled:opacity-50"
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-10 py-4 text-[11px] font-sans uppercase tracking-[0.18em] text-[#EAE2D5] bg-[#8C382A] hover:bg-[#7a3125] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-inner transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ borderRadius: 0 }}
          >
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}
