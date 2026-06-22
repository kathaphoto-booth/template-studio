"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InquiryForm } from "./InquiryForm";

export function InquiryFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: null as Date | null,
    venue: "",
    name: "",
    email: "",
    phone: "",
    referral: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          event_date: formData.date ? formData.date.toISOString() : "TBD",
          event_venue: formData.venue,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: { opacity: 0, y: 10, filter: "blur(4px)" },
    center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as const } },
    exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.4 } }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-serif text-[#241E1A]">Inquiry submitted successfully.</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px] mx-auto px-6 py-20 md:py-32 relative">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex flex-col items-center text-center space-y-12"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 rounded-none border" style={{ borderColor: "#C4B59D", color: "#5A564E" }}>
                Step 01
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight [text-wrap:balance]" style={{ fontFamily: "var(--font-serif), serif", color: "#241E1A" }}>
                The Prelude
              </h2>
              <p className="max-w-[480px] mx-auto text-sm md:text-base leading-relaxed" style={{ color: "#5A564E", fontFamily: "var(--font-sans), sans-serif" }}>
                Every great celebration begins with intention. Tell us about your event, and we will begin crafting your bespoke photobooth experience.
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="group flex items-center justify-center px-10 py-4 text-xs uppercase tracking-[0.2em] transition-transform hover:scale-[0.98] active:scale-95 cursor-pointer rounded-none"
              style={{ backgroundColor: "#8C382A", color: "#EAE2D5", fontFamily: "var(--font-mono), monospace" }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex flex-col items-center text-center space-y-12"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 rounded-none border" style={{ borderColor: "#C4B59D", color: "#5A564E" }}>
                Step 02
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight [text-wrap:balance]" style={{ fontFamily: "var(--font-serif), serif", color: "#241E1A" }}>
                Client Details
              </h2>
            </div>
            
            <div className="w-full relative overflow-hidden ring-1 shadow-sm" style={{ backgroundColor: "#1A1816", color: "#EAE2D5", borderColor: "rgba(196, 181, 157, 0.2)" }}>
              <div className="relative z-10 px-8 py-12 md:px-14">
                <InquiryForm formData={formData} setFormData={setFormData} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <button 
                onClick={handlePrev}
                className="text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
                style={{ color: "#5A564E", fontFamily: "var(--font-mono), monospace" }}
              >
                Go Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group flex items-center justify-center px-10 py-4 text-xs uppercase tracking-[0.2em] transition-transform hover:scale-[0.98] active:scale-95 cursor-pointer rounded-none"
                style={{ backgroundColor: "#8C382A", color: "#EAE2D5", fontFamily: "var(--font-mono), monospace" }}
              >
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
