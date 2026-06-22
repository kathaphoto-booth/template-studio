"use client"

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitInquiry } from '../../app/actions/submitInquiry';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 mt-8"
      style={{ backgroundColor: "#8C382A", color: "#EAE2D5", fontFamily: "var(--font-mono), monospace" }}
    >
      {pending ? 'Submitting...' : 'Submit Inquiry'}
    </button>
  );
}

export function InquiryForm({ formData, setFormData }: { formData?: any, setFormData?: any }) {
  const [state, formAction] = useActionState(submitInquiry, null);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-transparent">
      {state?.success ? (
        <div className="p-4 text-center border" style={{ borderColor: "rgba(196, 181, 157, 0.3)", color: "#EAE2D5", fontFamily: "var(--font-mono), monospace" }}>
          {state.message}
        </div>
      ) : (
        <form action={formAction} className="space-y-8">
          <div>
            <label htmlFor="name" className="block text-[11px] uppercase tracking-widest mb-2" style={{ color: "#9C958A", fontFamily: "var(--font-mono), monospace" }}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData?.name || ''}
              onChange={(e) => setFormData?.((f: any) => ({ ...f, name: e.target.value }))}
              className="w-full border-b rounded-none px-0 py-2 bg-transparent focus:outline-none transition-colors"
              style={{ borderColor: "rgba(196, 181, 157, 0.3)", color: "#EAE2D5", fontFamily: "var(--font-serif), serif", fontSize: "1.125rem" }}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] uppercase tracking-widest mb-2" style={{ color: "#9C958A", fontFamily: "var(--font-mono), monospace" }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData?.email || ''}
              onChange={(e) => setFormData?.((f: any) => ({ ...f, email: e.target.value }))}
              className="w-full border-b rounded-none px-0 py-2 bg-transparent focus:outline-none transition-colors"
              style={{ borderColor: "rgba(196, 181, 157, 0.3)", color: "#EAE2D5", fontFamily: "var(--font-serif), serif", fontSize: "1.125rem" }}
            />
          </div>

          <div>
            <label htmlFor="venue" className="block text-[11px] uppercase tracking-widest mb-2" style={{ color: "#9C958A", fontFamily: "var(--font-mono), monospace" }}>Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              required
              value={formData?.venue || ''}
              onChange={(e) => setFormData?.((f: any) => ({ ...f, venue: e.target.value }))}
              className="w-full border-b rounded-none px-0 py-2 bg-transparent focus:outline-none transition-colors"
              style={{ borderColor: "rgba(196, 181, 157, 0.3)", color: "#EAE2D5", fontFamily: "var(--font-serif), serif", fontSize: "1.125rem" }}
            />
          </div>

          {state?.success === false && (
            <div className="text-red-400 text-sm" style={{ fontFamily: "var(--font-mono), monospace" }}>
              {state.message}
            </div>
          )}

          {/* Hidden submit button since InquiryFlow handles submission now, but kept for form semantic action if needed */}
          <div className="hidden">
            <SubmitButton />
          </div>
        </form>
      )}
    </div>
  );
}
