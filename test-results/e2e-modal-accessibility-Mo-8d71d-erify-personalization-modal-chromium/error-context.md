# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/modal-accessibility.spec.ts >> Modal Layout & Accessibility Verification >> verify personalization modal
- Location: tests/e2e/modal-accessibility.spec.ts:14:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#katha-modal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#katha-modal')

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
  1   | import { test, expect } from '@playwright/test';
  2   | import * as fs from 'fs';
  3   | import * as path from 'path';
  4   | 
  5   | test.describe('Modal Layout & Accessibility Verification', () => {
  6   |   const screenshotDir = '/Users/jedg./Desktop/kat_ha_pb/.agents/challenger_m2_2';
  7   | 
  8   |   test.beforeAll(() => {
  9   |     if (!fs.existsSync(screenshotDir)) {
  10  |       fs.mkdirSync(screenshotDir, { recursive: true });
  11  |     }
  12  |   });
  13  | 
  14  |   test('verify personalization modal', async ({ page }) => {
  15  |     // 1. Navigate
  16  |     await page.setViewportSize({ width: 375, height: 667 });
  17  |     await page.goto('/portal/guest/template-design');
  18  | 
  19  |     // 2. Open Modal
  20  |     const cards = page.getByRole('button', { name: /explore details/i });
  21  |     await expect(cards.first()).toBeVisible({ timeout: 10000 });
  22  |     await cards.first().click();
  23  | 
  24  |     const modal = page.locator('#katha-modal');
> 25  |     await expect(modal).toBeVisible({ timeout: 5000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  26  | 
  27  |     // 3. Screenshots (Top View)
  28  |     await page.screenshot({ path: path.join(screenshotDir, 'mobile-modal-top.png') });
  29  |     console.log("Screenshot: mobile-modal-top.png saved.");
  30  | 
  31  |     // 4. Layout: Centered preview card
  32  |     const previewContainer = modal.locator('div.relative.flex.items-center.justify-center').first();
  33  |     await expect(previewContainer).toBeVisible();
  34  |     
  35  |     const previewBox = await previewContainer.boundingBox();
  36  |     if (previewBox) {
  37  |       const viewportWidth = 375;
  38  |       const previewCenter = previewBox.x + previewBox.width / 2;
  39  |       const expectedCenter = viewportWidth / 2;
  40  |       const centeringOffset = Math.abs(previewCenter - expectedCenter);
  41  |       console.log(`Preview center: ${previewCenter}px (offset: ${centeringOffset}px)`);
  42  |       expect(centeringOffset).toBeLessThan(15);
  43  |     }
  44  | 
  45  |     // 5. Layout: Border cut-off check
  46  |     const modalBox = await modal.boundingBox();
  47  |     if (modalBox) {
  48  |       console.log(`Modal bounds: x=${modalBox.x}, w=${modalBox.width}`);
  49  |       expect(modalBox.x).toBeGreaterThanOrEqual(0);
  50  |       expect(modalBox.x + modalBox.width).toBeLessThanOrEqual(375);
  51  |     }
  52  | 
  53  |     // 6. Layout: Scroll check
  54  |     await modal.evaluate((el) => {
  55  |       el.scrollTop = el.scrollHeight;
  56  |     });
  57  |     await page.waitForTimeout(500);
  58  | 
  59  |     await page.screenshot({ path: path.join(screenshotDir, 'mobile-modal-scrolled.png') });
  60  |     console.log("Screenshot: mobile-modal-scrolled.png saved.");
  61  | 
  62  |     // Check if input is visible after scroll
  63  |     const firstInput = page.locator('#katha-name-one');
  64  |     await expect(firstInput).toBeVisible();
  65  | 
  66  |     // 7. Accessibility: Role attributes on modal
  67  |     await expect(modal).toHaveAttribute('role', 'dialog');
  68  |     await expect(modal).toHaveAttribute('aria-modal', 'true');
  69  |     
  70  |     const modalTitle = modal.locator('h2').first();
  71  |     const titleId = await modalTitle.getAttribute('id');
  72  |     await expect(modal).toHaveAttribute('aria-labelledby', titleId || '');
  73  | 
  74  |     // 8. Accessibility: role="group" on selectors
  75  |     const groups = modal.locator('[role="group"]');
  76  |     await expect(groups).toHaveCount(2);
  77  |     const textPositionGroup = modal.locator('[role="group"][aria-labelledby="text-position-label"]');
  78  |     await expect(textPositionGroup).toHaveCount(1);
  79  |     const serviceTierGroup = modal.locator('[role="group"][aria-labelledby="katha-service-tier-label"]');
  80  |     await expect(serviceTierGroup).toHaveCount(1);
  81  | 
  82  |     // Fill name and email to enable the submit button
  83  |     await modal.getByLabel('First name').fill('Ana');
  84  |     await modal.getByLabel('Email address').fill('ana.reyes@example.com');
  85  |     await page.waitForTimeout(200);
  86  | 
  87  |     // 9. Accessibility: Keyboard Focus Trap
  88  |     const closeBtn = modal.locator('button[aria-label="Close template preview"]');
  89  |     await closeBtn.focus();
  90  |     
  91  |     // Press Shift+Tab (wrap backward to last element)
  92  |     await page.keyboard.down('Shift');
  93  |     await page.keyboard.press('Tab');
  94  |     await page.keyboard.up('Shift');
  95  | 
  96  |     const activeLabelShiftTab = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
  97  |     console.log("Active element after Shift+Tab on close button:", activeLabelShiftTab);
  98  | 
  99  |     // Submit stays disabled until a service tier is picked, so the last ENABLED
  100 |     // focusable element is the venue-address input. Tab from it must wrap to Close.
  101 |     const lastEnabled = page.locator('#katha-venue-address');
  102 |     await lastEnabled.focus();
  103 |     
  104 |     await page.keyboard.press('Tab');
  105 |     
  106 |     const isCloseFocused = await page.evaluate(() => {
  107 |       const active = document.activeElement;
  108 |       return active?.getAttribute('aria-label') === 'Close template preview' || active?.textContent?.trim() === '×';
  109 |     });
  110 |     console.log("Is close button focused after Tab on last element:", isCloseFocused);
  111 |     expect(isCloseFocused).toBe(true);
  112 |   });
  113 | });
  114 | 
```