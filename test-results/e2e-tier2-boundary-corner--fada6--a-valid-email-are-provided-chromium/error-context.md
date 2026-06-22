# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/tier2-boundary-corner/f7_template_selection_boundary.spec.ts >> F7: Template Selection - Tier 2 Boundary/Corner >> T2.2: gates submission until a name and a valid email are provided
- Location: tests/e2e/tier2-boundary-corner/f7_template_selection_boundary.spec.ts:17:3

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: getByRole('dialog').getByRole('button', { name: 'Send Inquiry' })
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('dialog').getByRole('button', { name: 'Send Inquiry' })

```

```yaml
- main:
  - heading "Choose your style" [level=1]
  - text: Tier
  - button "All styles" [pressed]
  - button "Classic"
  - button "Katha Signature"
  - text: Format
  - button "All" [pressed]
  - button "Strip"
  - button "Postcard"
  - text: 61 templates
  - heading "The Signature Collection" [level=2]
  - heading "The Classic Atelier" [level=2]
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection strip
  - heading "Katha Signature — Heirloom Piña" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection strip
  - heading "Katha Signature — The Editorial Void" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — The Editorial Void Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — The Editorial Void Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Heirloom Piña Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection strip
  - heading "Katha Signature — Loom Frame" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Loom Frame Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Loom Frame Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection strip
  - heading "Katha Signature — Knalum Night" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Knalum Night Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Knalum Night Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection strip
  - heading "Katha Signature — Binakul Weave" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Binakul Weave Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Binakul Weave Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection strip
  - heading "Katha Signature — Capiz Sage" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Capiz Sage Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Capiz Sage Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Tracy & Prince" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 1 — Tradition Gold Luxe" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 1 — Tradition Gold Postcard" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 1 — Tradition Gold Landscape" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 2 — Minimal Linen Rose" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 2 — Minimal Linen Rose Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 2 — Linen Rose Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 4 — Earthen Clay Sunset" [level=3]
  - text: Hanken Grotesk
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 4 — Earthen Clay Sunset Postcard" [level=3]
  - text: Hanken Grotesk
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 4 — Earthen Clay Sunset Landscape" [level=3]
  - text: Hanken Grotesk
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 5 — Stepped Deco in Cream" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 5 — Stepped Deco in Cream Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 5 — Stepped Deco in Cream Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 8 — Haute Gallery Editorial" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 8 — Editorial Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 8 — Editorial Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 10 — Victorian Cream Lace" [level=3]
  - text: Rochester
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 10 — Victorian Cream Lace Postcard" [level=3]
  - text: Rochester
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 10 — Victorian Cream Lace Landscape" [level=3]
  - text: Rochester
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 12 — Imperial Crest Seal" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 12 — Imperial Crest Postcard" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 12 — Imperial Crest Landscape" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 14 — Delicate Fine-Line Arch" [level=3]
  - text: Hanken Grotesk
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 14 — Delicate Fine-Line Arch Postcard" [level=3]
  - text: Hanken Grotesk
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 14 — Botanical Arch Landscape" [level=3]
  - text: Hanken Grotesk
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier strip
  - heading "Style 19 — Deckled Wax Seal" [level=3]
  - text: Rochester
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 19 — Deckled Wax Seal Postcard" [level=3]
  - text: Rochester
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 19 — Deckled Wax Seal Landscape" [level=3]
  - text: Rochester
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Heirloom Piña L-Shape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Loom Frame Γ-Shape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 8 — Editorial L-Shape Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Capiz Sage Γ-Shape Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Heirloom Piña Landscape 2 Squares" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Heirloom Piña Landscape 3 Squares" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Knalum Night Landscape 2 Squares" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Knalum Night Landscape 3 Squares" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — The Editorial Void Landscape 2 Squares" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — The Editorial Void Landscape 3 Squares" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 1 — Tradition Gold Landscape 2 Squares" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Style 1 — Tradition Gold Landscape 3 Squares" [level=3]
  - text: Cinzel
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection strip
  - heading "Katha Signature — Woven Silk" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Woven Silk Postcard" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Signature Collection postcard
  - heading "Katha Signature — Woven Silk Landscape" [level=3]
  - text: Playfair Display
  - button "Explore details":
    - img
    - text: Explore Details
  - text: The Classic Atelier postcard
  - heading "Tracy & Prince" [level=3]
  - text: Parisienne
  - dialog "Katha Signature — Heirloom Piña":
    - text: Step 01 · Personalize
    - heading "Katha Signature — Heirloom Piña" [level=2]
    - button "Close and return to gallery":
      - img
    - heading "Your details" [level=3]
    - text: Full name
    - textbox "Full name":
      - /placeholder: E.g., Clara & Henry
    - text: Email address
    - textbox "Email address":
      - /placeholder: hello@example.com
    - text: Phone number
    - textbox "Phone number":
      - /placeholder: +1 (555) 000-0000
    - heading "The event" [level=3]
    - text: Event date
    - textbox "Event date":
      - /placeholder: ""
    - text: Venue name
    - textbox "Venue name":
      - /placeholder: E.g., The Grand Oak Manor
    - text: Venue address
    - textbox "Venue address":
      - /placeholder: City, State
    - heading "Design preferences" [level=3]
    - text: Typography style
    - combobox "Typography style":
      - option "Select an option" [disabled] [selected]
      - option "Playfair Display (Serif)"
      - option "Hanken Grotesk (Sans)"
      - option "Inter (Mono)"
    - text: Text position
    - combobox "Text position":
      - option "Select an option" [disabled]
      - option "Bottom" [selected]
      - option "Top"
    - text: Notes (optional)
    - textbox "Notes (optional)":
      - /placeholder: Anything we should know about the room or the moment.
    - button "Back" [disabled]
    - button "Continue" [disabled]
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // F7: Template Selection — Tier 2 Boundary / Corner
  4  | // No timing-based or load-state waits: every wait is a web-first assertion.
  5  | // Network failure is simulated with Playwright-native context.setOffline —
  6  | // the app's own APIs are never mocked.
  7  | 
  8  | test.describe('F7: Template Selection - Tier 2 Boundary/Corner', () => {
  9  |   test('T2.1: returns a 404 for an unknown portal id (no lead match)', async ({ page }) => {
  10 |     // Unknown ids call notFound() (app/portal/[id]/template-design/page.tsx),
  11 |     // consistent with the 404-on-unknown-lead contract in intake-funnel.spec.ts.
  12 |     const response = await page.goto('/portal/unknown-lead-9999/template-design');
  13 |     expect(response?.status()).toBe(404);
  14 |     await expect(page.getByRole('heading', { name: 'Choose your style' })).toHaveCount(0);
  15 |   });
  16 | 
  17 |   test('T2.2: gates submission until a name and a valid email are provided', async ({ page }) => {
  18 |     await page.goto('/portal/guest/template-design');
  19 |     await page.getByRole('button', { name: /explore details/i }).first().click();
  20 | 
  21 |     const modal = page.getByRole('dialog');
  22 |     await expect(modal).toBeVisible();
  23 | 
  24 |     const submit = modal.getByRole('button', { name: 'Send Inquiry' });
> 25 |     await expect(submit).toBeDisabled();
     |                          ^ Error: expect(locator).toBeDisabled() failed
  26 | 
  27 |     await modal.getByLabel('First name').fill('Ana');
  28 |     await modal.getByLabel('Email address').fill('not-an-email');
  29 | 
  30 |     await expect(modal.getByText('Please enter a valid email address.')).toBeVisible();
  31 |     await expect(submit).toBeDisabled();
  32 |   });
  33 | 
  34 |   test('T2.3: format filter toggles exclusively via aria-pressed', async ({ page }) => {
  35 |     await page.goto('/portal/guest/template-design');
  36 | 
  37 |     const stripFilter = page.getByRole('button', { name: '2×6 Strip' });
  38 |     await stripFilter.click();
  39 | 
  40 |     await expect(stripFilter).toHaveAttribute('aria-pressed', 'true');
  41 |     await expect(page.getByRole('button', { name: 'All formats' })).toHaveAttribute('aria-pressed', 'false');
  42 |     await expect(page.getByText(/\d+ templates?/)).toBeVisible();
  43 |   });
  44 | 
  45 |   test('T2.4: renders cards and opens the modal on a mobile viewport', async ({ page }) => {
  46 |     await page.setViewportSize({ width: 375, height: 667 });
  47 |     await page.goto('/portal/guest/template-design');
  48 | 
  49 |     const cards = page.getByRole('button', { name: /explore details/i });
  50 |     await expect(cards.first()).toBeVisible();
  51 | 
  52 |     await cards.first().click();
  53 |     await expect(page.getByRole('dialog')).toBeVisible();
  54 |   });
  55 | 
  56 |   test('T2.5: surfaces a submission error when the network drops', async ({ context, page }) => {
  57 |     await page.goto('/portal/guest/template-design');
  58 |     await page.getByRole('button', { name: /explore details/i }).first().click();
  59 | 
  60 |     const modal = page.getByRole('dialog');
  61 |     await expect(modal).toBeVisible();
  62 | 
  63 |     await modal.getByLabel('First name').fill('Ana');
  64 |     await modal.getByLabel('Email address').fill('ana.reyes@example.com');
  65 |     // Submit stays disabled until an installation is chosen (serviceTier gate).
  66 |     await modal.getByRole('button', { name: /Signature Installation/i }).click();
  67 | 
  68 |     // Playwright-native offline simulation — never mock our own API.
  69 |     await context.setOffline(true);
  70 |     await modal.getByRole('button', { name: 'Send Inquiry' }).click();
  71 | 
  72 |     await expect(modal.getByText('Submission failed. Please try again.')).toBeVisible();
  73 |   });
  74 | });
  75 | 
```