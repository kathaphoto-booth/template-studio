import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('InquiryForm complies with design requirements', () => {
  const filePath = path.join(process.cwd(), 'components/inquire/InquiryForm.tsx');
  
  // Test will fail if file doesn't exist yet
  expect(fs.existsSync(filePath)).toBe(true);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  expect(content).toContain('Name');
  expect(content).toContain('Email');
  expect(content).toContain('Venue');
  
  // Fonts
  expect(content).toContain('Proxima Nova');
  expect(content).toContain('IvyMode');
  
  // High contrast button
  expect(content).toMatch(/bg-black|bg-gray-900/);
  expect(content).toMatch(/text-white/);
  
  // No magnetic/bouncy physics
  expect(content).not.toContain('framer-motion');
  expect(content).not.toContain('bounce');
  expect(content).not.toContain('spring');
});

test('submitInquiry server action works', async () => {
  const actionPath = path.join(process.cwd(), 'app/actions/submitInquiry.ts');
  expect(fs.existsSync(actionPath)).toBe(true);

  // Dynamic import to test the logic
  const { submitInquiry } = await import('../../../app/actions/submitInquiry');
  
  const formData = new FormData();
  formData.append('name', 'John Doe');
  formData.append('email', 'john@test.com');
  formData.append('venue', 'Atelier');
  
  const result = await submitInquiry(null, formData);
  expect(result.success).toBe(true);
});
