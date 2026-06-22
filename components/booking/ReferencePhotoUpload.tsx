"use client";

import React from "react";

interface ReferencePhoto {
  preview: string;
  value: string;
}

interface ReferencePhotoUploadProps {
  referencePhotos: ReferencePhoto[];
  uploading: boolean;
  errorMsg: string;
  onFilesSelected: (files: FileList) => void;
  onRemovePhoto: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ReferencePhotoUpload({
  referencePhotos,
  uploading,
  errorMsg,
  onFilesSelected,
  onRemovePhoto,
  onNext,
  onBack
}: ReferencePhotoUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#EAE2D5] px-6 py-16">
      <div className="w-full max-w-3xl flex flex-col items-center bg-[#EAE2D5] border border-[#C4B59D] p-8 md:p-12 shadow-sm rounded-none">
        
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A564E] mb-2 block">Optional Step</span>
          <h2 className="text-3xl md:text-4xl text-[#241E1A] font-serif tracking-tight mb-3">Reference Photos</h2>
          <p className="text-[#5A564E] text-sm max-w-lg mx-auto font-sans leading-relaxed">
            Upload any inspiration or venue photos to guide our design direction.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border border-dashed p-8 md:p-12 text-center transition-all duration-300 ${
              dragActive ? "border-[#241E1A] bg-[#C4B59D]/20" : "border-[#C4B59D] bg-[#EAE2D5]/30 hover:bg-[#EAE2D5]/50"
            }`}
            style={{ minHeight: "200px" }}
            role="region"
            aria-label="Drop zone for reference photos"
          >
            <input
              id="katha-photo-upload"
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload reference photos"
              onChange={(e) => {
                if (e.target.files) onFilesSelected(e.target.files);
              }}
              disabled={uploading}
            />
          
            <div className="flex flex-col items-center justify-center h-full pointer-events-none">
              <svg className="w-8 h-8 mb-4 text-[#C4B59D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {uploading ? (
                <p className="text-sm text-[#5A564E] font-sans">Reading files...</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-[#241E1A] font-sans">
                    Drag reference photos here, or <span className="underline decoration-[#C4B59D] underline-offset-4">browse</span>
                  </p>
                  <p className="text-xs mt-3 text-[#5A564E] font-sans">
                    Max 3 files (1.5MB each, 2.5MB total)
                  </p>
                </>
              )}
            </div>
          </div>

          {errorMsg && (
            <p role="alert" className="text-xs font-medium mt-4 text-[#8C382A] text-center font-sans">
              {errorMsg}
            </p>
          )}

          {referencePhotos.length > 0 && (
            <div className="flex gap-4 flex-wrap mt-8 justify-center" role="list" aria-label="Uploaded reference photos">
              {referencePhotos.map((photo, index) => (
                <div key={index} role="listitem" className="relative w-24 h-24 border border-[#C4B59D] overflow-hidden group shadow-sm bg-white">
                  <img src={photo.preview} alt={`Reference photo ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <button
                    type="button"
                    onClick={() => onRemovePhoto(index)}
                    className="absolute top-1 right-1 bg-[#1A1816]/80 hover:bg-[#1A1816] text-[#EAE2D5] text-xs w-6 h-6 flex items-center justify-center transition-colors shadow-sm"
                    aria-label={`Remove reference photo ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center w-full mt-12 pt-8 border-t border-[#C4B59D]">
          <button
            onClick={onBack}
            className="border border-[#C4B59D] text-[#5A564E] hover:text-[#241E1A] hover:bg-[#C4B59D]/20 px-8 py-3 font-sans text-xs tracking-[0.18em] uppercase transition-all duration-300"
          >
            Back
          </button>
          
          <button
            onClick={onNext}
            className="bg-[#241E1A] text-[#EAE2D5] hover:bg-[#1A1816] px-8 py-3 font-sans text-xs tracking-[0.18em] uppercase transition-all duration-300 shadow-sm"
          >
            Continue to Review
          </button>
        </div>

      </div>
    </div>
  );
}
