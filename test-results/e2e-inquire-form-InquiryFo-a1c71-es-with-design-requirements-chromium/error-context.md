# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/inquire/form.spec.ts >> InquiryForm complies with design requirements
- Location: tests/e2e/inquire/form.spec.ts:5:1

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Proxima Nova"
Received string:    "\"use client\"·
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitInquiry } from '../../app/actions/submitInquiry';·
function SubmitButton() {
  const { pending } = useFormStatus();·
  return (
    <button
      type=\"submit\"
      disabled={pending}
      className=\"w-full py-4 text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 mt-8\"
      style={{ backgroundColor: \"#8C382A\", color: \"#EAE2D5\", fontFamily: \"var(--font-mono), monospace\" }}
    >
      {pending ? 'Submitting...' : 'Submit Inquiry'}
    </button>
  );
}·
export function InquiryForm({ formData, setFormData }: { formData?: any, setFormData?: any }) {
  const [state, formAction] = useActionState(submitInquiry, null);·
  return (
    <div className=\"w-full max-w-md mx-auto p-6 bg-transparent\">
      {state?.success ? (
        <div className=\"p-4 text-center border\" style={{ borderColor: \"rgba(196, 181, 157, 0.3)\", color: \"#EAE2D5\", fontFamily: \"var(--font-mono), monospace\" }}>
          {state.message}
        </div>
      ) : (
        <form action={formAction} className=\"space-y-8\">
          <div>
            <label htmlFor=\"name\" className=\"block text-[11px] uppercase tracking-widest mb-2\" style={{ color: \"#9C958A\", fontFamily: \"var(--font-mono), monospace\" }}>Name</label>
            <input
              type=\"text\"
              id=\"name\"
              name=\"name\"
              required
              value={formData?.name || ''}
              onChange={(e) => setFormData?.((f: any) => ({ ...f, name: e.target.value }))}
              className=\"w-full border-b rounded-none px-0 py-2 bg-transparent focus:outline-none transition-colors\"
              style={{ borderColor: \"rgba(196, 181, 157, 0.3)\", color: \"#EAE2D5\", fontFamily: \"var(--font-serif), serif\", fontSize: \"1.125rem\" }}
            />
          </div>·
          <div>
            <label htmlFor=\"email\" className=\"block text-[11px] uppercase tracking-widest mb-2\" style={{ color: \"#9C958A\", fontFamily: \"var(--font-mono), monospace\" }}>Email</label>
            <input
              type=\"email\"
              id=\"email\"
              name=\"email\"
              required
              value={formData?.email || ''}
              onChange={(e) => setFormData?.((f: any) => ({ ...f, email: e.target.value }))}
              className=\"w-full border-b rounded-none px-0 py-2 bg-transparent focus:outline-none transition-colors\"
              style={{ borderColor: \"rgba(196, 181, 157, 0.3)\", color: \"#EAE2D5\", fontFamily: \"var(--font-serif), serif\", fontSize: \"1.125rem\" }}
            />
          </div>·
          <div>
            <label htmlFor=\"venue\" className=\"block text-[11px] uppercase tracking-widest mb-2\" style={{ color: \"#9C958A\", fontFamily: \"var(--font-mono), monospace\" }}>Venue</label>
            <input
              type=\"text\"
              id=\"venue\"
              name=\"venue\"
              required
              value={formData?.venue || ''}
              onChange={(e) => setFormData?.((f: any) => ({ ...f, venue: e.target.value }))}
              className=\"w-full border-b rounded-none px-0 py-2 bg-transparent focus:outline-none transition-colors\"
              style={{ borderColor: \"rgba(196, 181, 157, 0.3)\", color: \"#EAE2D5\", fontFamily: \"var(--font-serif), serif\", fontSize: \"1.125rem\" }}
            />
          </div>·
          {state?.success === false && (
            <div className=\"text-red-400 text-sm\" style={{ fontFamily: \"var(--font-mono), monospace\" }}>
              {state.message}
            </div>
          )}·
          {/* Hidden submit button since InquiryFlow handles submission now, but kept for form semantic action if needed */}
          <div className=\"hidden\">
            <SubmitButton />
          </div>
        </form>
      )}
    </div>
  );
}
"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import fs from 'fs';
  3  | import path from 'path';
  4  | 
  5  | test('InquiryForm complies with design requirements', () => {
  6  |   const filePath = path.join(process.cwd(), 'components/inquire/InquiryForm.tsx');
  7  |   
  8  |   // Test will fail if file doesn't exist yet
  9  |   expect(fs.existsSync(filePath)).toBe(true);
  10 |   
  11 |   const content = fs.readFileSync(filePath, 'utf-8');
  12 |   
  13 |   expect(content).toContain('Name');
  14 |   expect(content).toContain('Email');
  15 |   expect(content).toContain('Venue');
  16 |   
  17 |   // Fonts
> 18 |   expect(content).toContain('Proxima Nova');
     |                   ^ Error: expect(received).toContain(expected) // indexOf
  19 |   expect(content).toContain('IvyMode');
  20 |   
  21 |   // High contrast button
  22 |   expect(content).toMatch(/bg-black|bg-gray-900/);
  23 |   expect(content).toMatch(/text-white/);
  24 |   
  25 |   // No magnetic/bouncy physics
  26 |   expect(content).not.toContain('framer-motion');
  27 |   expect(content).not.toContain('bounce');
  28 |   expect(content).not.toContain('spring');
  29 | });
  30 | 
  31 | test('submitInquiry server action works', async () => {
  32 |   const actionPath = path.join(process.cwd(), 'app/actions/submitInquiry.ts');
  33 |   expect(fs.existsSync(actionPath)).toBe(true);
  34 | 
  35 |   // Dynamic import to test the logic
  36 |   const { submitInquiry } = await import('../../../app/actions/submitInquiry');
  37 |   
  38 |   const formData = new FormData();
  39 |   formData.append('name', 'John Doe');
  40 |   formData.append('email', 'john@test.com');
  41 |   formData.append('venue', 'Atelier');
  42 |   
  43 |   const result = await submitInquiry(null, formData);
  44 |   expect(result.success).toBe(true);
  45 | });
  46 | 
```