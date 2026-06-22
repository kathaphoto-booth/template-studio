# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/tier1-feature-coverage/f7_template_selection.spec.ts >> F7: Template Selection - Tier 1 Happy Path >> T1.3: opens the personalization modal when a template card is clicked
- Location: tests/e2e/tier1-feature-coverage/f7_template_selection.spec.ts:27:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').getByRole('button', { name: 'Close template preview' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('dialog').getByRole('button', { name: 'Close template preview' })

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
  3  | // F7: Template Selection — Tier 1 Happy Path
  4  | // Client gallery lives at /portal/[id]/template-design ("guest" = organic visitor).
  5  | // Every template tile is a <button> whose hover overlay carries "Explore Details".
  6  | 
  7  | test.describe('F7: Template Selection - Tier 1 Happy Path', () => {
  8  |   test.beforeEach(async ({ page }) => {
  9  |     await page.goto('/portal/guest/template-design');
  10 |   });
  11 | 
  12 |   test('T1.1: displays the gallery with collections and template cards', async ({ page }) => {
  13 |     await expect(page.getByRole('heading', { name: 'Choose your style' })).toBeVisible();
  14 |     await expect(page.getByRole('heading', { name: 'The Signature Collection' })).toBeVisible();
  15 | 
  16 |     const cards = page.getByRole('button', { name: /explore details/i });
  17 |     await expect(cards.first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test('T1.2: offers more than one template to browse, with a result count', async ({ page }) => {
  21 |     const cards = page.getByRole('button', { name: /explore details/i });
  22 |     await expect(cards.nth(1)).toBeVisible();
  23 | 
  24 |     await expect(page.getByText(/\d+ templates?/)).toBeVisible();
  25 |   });
  26 | 
  27 |   test('T1.3: opens the personalization modal when a template card is clicked', async ({ page }) => {
  28 |     await page.getByRole('button', { name: /explore details/i }).first().click();
  29 | 
  30 |     const modal = page.getByRole('dialog');
  31 |     await expect(modal).toBeVisible();
  32 |     // Modal title is the template name (aria-labelledby → h2).
  33 |     await expect(modal.getByRole('heading', { level: 2 })).toBeVisible();
> 34 |     await expect(modal.getByRole('button', { name: 'Close template preview' })).toBeVisible();
     |                                                                                 ^ Error: expect(locator).toBeVisible() failed
  35 |   });
  36 | 
  37 |   test('T1.4: submits a personalized design inquiry and shows the confirmation', async ({ page }) => {
  38 |     await page.getByRole('button', { name: /explore details/i }).first().click();
  39 | 
  40 |     const modal = page.getByRole('dialog');
  41 |     await expect(modal).toBeVisible();
  42 | 
  43 |     await modal.getByLabel('First name').fill('Ana');
  44 |     await modal.getByLabel('Email address').fill('ana.reyes@example.com');
  45 |     // New serviceTier gate: submit stays disabled until an installation is chosen.
  46 |     await expect(modal.getByRole('button', { name: 'Send Inquiry' })).toBeDisabled();
  47 |     await modal.getByRole('button', { name: /Signature Installation/i }).click();
  48 |     await modal.getByRole('button', { name: 'Send Inquiry' }).click();
  49 | 
  50 |     await expect(modal.getByText('Your design is saved')).toBeVisible();
  51 |     await expect(modal.getByRole('button', { name: 'Back to gallery' })).toBeVisible();
  52 |   });
  53 | 
  54 |   test('T1.5: filters the gallery to the Katha Signature tier', async ({ page }) => {
  55 |     const signatureFilter = page.getByRole('button', { name: 'Katha Signature' });
  56 |     await signatureFilter.click();
  57 | 
  58 |     await expect(signatureFilter).toHaveAttribute('aria-pressed', 'true');
  59 |     await expect(page.getByRole('button', { name: 'All styles' })).toHaveAttribute('aria-pressed', 'false');
  60 | 
  61 |     // Classic collection drops out of the gallery; Signature remains.
  62 |     await expect(page.getByRole('heading', { name: 'The Signature Collection' })).toBeVisible();
  63 |     await expect(page.getByRole('heading', { name: 'The Classic Atelier' })).not.toBeVisible();
  64 |   });
  65 | });
  66 | 
```