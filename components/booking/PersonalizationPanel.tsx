'use client';

import React, { useState } from 'react';

// Design tokens per CC_master_handoff.md
// Piña Ecru (Primary Light): #EAE2D5
// Knalum Ink (Backdrop): #1A1816
// Iron Bark (Primary Text): #241E1A
// Champagne Heirloom (Borders): #C4B59D
// Ecru-safe (Secondary Text): #5A564E
// Loko Rust (Primary CTA): #8C382A
// Abel Slate (Secondary Hover): #5A5D5A

export type PersonalizationStep = 'client' | 'event' | 'design';

export interface PersonalizationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  venue: string;
  address: string;
  font: string;
  position: string;
}

interface PersonalizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: PersonalizationData) => void;
  initialData?: Partial<PersonalizationData>;
}

export default function PersonalizationPanel({
  isOpen,
  onClose,
  onComplete,
  initialData
}: PersonalizationPanelProps) {
  const [currentStep, setCurrentStep] = useState<PersonalizationStep>('client');
  const [formData, setFormData] = useState<PersonalizationData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    date: initialData?.date || '',
    venue: initialData?.venue || '',
    address: initialData?.address || '',
    font: initialData?.font || '',
    position: initialData?.position || ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep === 'client') setCurrentStep('event');
    else if (currentStep === 'event') setCurrentStep('design');
    else onComplete(formData);
  };

  const handleBack = () => {
    if (currentStep === 'event') setCurrentStep('client');
    if (currentStep === 'design') setCurrentStep('event');
  };

  const InputField = ({ label, name, type = 'text', placeholder = '' }: any) => (
    <div className="flex flex-col gap-2 mb-6">
      <label 
        htmlFor={name}
        className="font-sans text-[#241E1A] tracking-[0.18em] uppercase text-xs"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full bg-transparent border border-[#C4B59D] rounded-none px-4 py-3
          text-[#241E1A] font-sans placeholder:text-[#5A5D5A]
          focus:outline-none focus:ring-1 focus:ring-[#8C382A] focus:border-[#8C382A]
          transition-all duration-200
        "
        style={{ fontFamily: 'var(--font-sans)' }}
      />
    </div>
  );

  const SelectField = ({ label, name, options }: any) => (
    <div className="flex flex-col gap-2 mb-6">
      <label 
        htmlFor={name}
        className="font-sans text-[#241E1A] tracking-[0.18em] uppercase text-xs"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="
          w-full bg-transparent border border-[#C4B59D] rounded-none px-4 py-3
          text-[#241E1A] font-sans focus:outline-none focus:ring-1 focus:ring-[#8C382A] focus:border-[#8C382A]
          transition-all duration-200 appearance-none
        "
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Knalum Ink Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1A1816]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel: Piña Ecru */}
      <div className="relative w-full max-w-md h-full bg-[#EAE2D5] border-l border-[#C4B59D] shadow-2xl flex flex-col transform transition-transform duration-500 ease-out">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-[#C4B59D]">
          <h2 className="text-2xl text-[#241E1A]" style={{ fontFamily: 'var(--font-serif)' }}>
            Personalize
          </h2>
          <button 
            onClick={onClose}
            className="text-[#5A564E] hover:text-[#241E1A] transition-colors"
            aria-label="Close panel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-10">
            {['client', 'event', 'design'].map((stepName, i) => (
              <React.Fragment key={stepName}>
                <div 
                  className={`
                    text-xs tracking-[0.18em] uppercase 
                    ${currentStep === stepName ? 'text-[#241E1A]' : 'text-[#5A5D5A]'}
                  `}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  0{i + 1}
                </div>
                {i < 2 && (
                  <div className={`h-[1px] flex-1 ${currentStep === stepName ? 'bg-[#241E1A]' : 'bg-[#C4B59D]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="animate-in fade-in slide-in-from-right-4 duration-500">
            {currentStep === 'client' && (
              <div className="space-y-2">
                <h3 className="text-xl text-[#241E1A] mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Client Details</h3>
                <InputField label="Full Name" name="name" placeholder="E.g., Clara & Henry" />
                <InputField label="Email Address" name="email" type="email" placeholder="hello@example.com" />
                <InputField label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            )}

            {currentStep === 'event' && (
              <div className="space-y-2">
                <h3 className="text-xl text-[#241E1A] mb-8" style={{ fontFamily: 'var(--font-serif)' }}>The Event</h3>
                <InputField label="Event Date" name="date" type="date" />
                <InputField label="Venue Name" name="venue" placeholder="E.g., The Plaza Hotel" />
                <InputField label="Venue Address" name="address" placeholder="City, State" />
              </div>
            )}

            {currentStep === 'design' && (
              <div className="space-y-2">
                <h3 className="text-xl text-[#241E1A] mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Design Preferences</h3>
                <SelectField 
                  label="Typography Style" 
                  name="font" 
                  options={['Playfair Display (Serif)', 'Hanken Grotesk (Sans)', 'Inter (Mono)']} 
                />
                <SelectField 
                  label="Print Position" 
                  name="position" 
                  options={['Centered Axis', 'Bottom Left Alignment', 'Top Right Minimal']} 
                />
              </div>
            )}
          </form>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-[#C4B59D] bg-[#EAE2D5]">
          <div className="flex justify-between items-center">
            {/* Secondary Button: Piña Ecru ghost with Champagne border */}
            <button
              onClick={handleBack}
              disabled={currentStep === 'client'}
              className={`
                border border-[#C4B59D] text-[#5A564E] px-6 py-4
                font-sans text-xs tracking-[0.18em] uppercase rounded-none
                hover:text-[#5A5D5A] hover:bg-black/5 active:shadow-inner
                transition-all duration-200
                ${currentStep === 'client' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Back
            </button>
            
            {/* Primary Button: Loko Rust, sharp corners, -1px active translation */}
            <button
              onClick={handleNext}
              className="
                bg-[#8C382A] text-[#EAE2D5] px-8 py-4
                font-sans text-sm tracking-[0.1em] uppercase rounded-none
                hover:bg-[#7A2A1D] active:-translate-y-px active:shadow-inner
                transition-all duration-200
              "
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {currentStep === 'design' ? 'Complete' : 'Continue'}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
