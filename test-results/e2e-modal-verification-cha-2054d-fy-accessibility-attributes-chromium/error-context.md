# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/modal-verification-challenger.spec.ts >> Challenger Modal Interaction & Accessibility Verification >> verify accessibility attributes
- Location: tests/e2e/modal-verification-challenger.spec.ts:82:3

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
- alert: Choose your style
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Challenger Modal Interaction & Accessibility Verification', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Set viewport to 375px mobile size
  6   |     await page.setViewportSize({ width: 375, height: 667 });
  7   |     await page.goto('/portal/guest/template-design');
  8   |     
  9   |     // Wait 5 seconds to let Next.js dev server stabilize and finish hot reloading
  10  |     await page.waitForTimeout(5000);
  11  |     
  12  |     // Ensure the explore details buttons are visible
  13  |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  14  |     await expect(exploreBtn).toBeVisible({ timeout: 15000 });
  15  |   });
  16  | 
  17  |   test('verify modal centering, scrollability, and close button clickability', async ({ page }) => {
  18  |     // 1. Open the modal
  19  |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  20  |     await exploreBtn.click();
  21  | 
  22  |     const modal = page.locator('#katha-modal');
  23  |     await expect(modal).toBeVisible({ timeout: 5000 });
  24  | 
  25  |     // 2. Verify Horizontal Centering
  26  |     const previewContainer = modal.locator('div.relative.flex.items-center.justify-center').first();
  27  |     await expect(previewContainer).toBeVisible();
  28  |     const previewBox = await previewContainer.boundingBox();
  29  |     if (previewBox) {
  30  |       const viewportWidth = 375;
  31  |       const previewCenter = previewBox.x + previewBox.width / 2;
  32  |       const expectedCenter = viewportWidth / 2;
  33  |       const centeringOffset = Math.abs(previewCenter - expectedCenter);
  34  |       console.log(`[VERIFICATION] Preview Center: ${previewCenter}px (offset: ${centeringOffset}px)`);
  35  |       expect(centeringOffset).toBeLessThan(15);
  36  |     }
  37  | 
  38  |     // 3. Verify bounds fit inside the viewport (responsive check)
  39  |     const modalBox = await modal.boundingBox();
  40  |     if (modalBox) {
  41  |       console.log(`[VERIFICATION] Modal bounds: x=${modalBox.x}, w=${modalBox.width}`);
  42  |       expect(modalBox.x).toBeGreaterThanOrEqual(0);
  43  |       expect(modalBox.x + modalBox.width).toBeLessThanOrEqual(375);
  44  |     }
  45  | 
  46  |     // 4. Verify scrollability
  47  |     const isScrollable = await modal.evaluate((el) => {
  48  |       return el.scrollHeight > el.clientHeight;
  49  |     });
  50  |     console.log(`[VERIFICATION] Modal is scrollable: ${isScrollable}`);
  51  |     // Since mobile viewport has limited height (667px) and form is long, it must be scrollable
  52  |     expect(isScrollable).toBe(true);
  53  | 
  54  |     // Scroll to the bottom to verify inputs at the bottom are scrollable/visible
  55  |     await modal.evaluate((el) => {
  56  |       el.scrollTop = el.scrollHeight;
  57  |     });
  58  |     await page.waitForTimeout(300);
  59  | 
  60  |     const notesInput = page.locator('#katha-notes');
  61  |     await expect(notesInput).toBeVisible();
  62  | 
  63  |     // 5. Verify close button clickability (ensure no click interception)
  64  |     const closeBtn = modal.locator('button[aria-label="Close template preview"]');
  65  |     await expect(closeBtn).toBeVisible();
  66  |     await closeBtn.click();
  67  |     await expect(modal).not.toBeVisible();
  68  |   });
  69  | 
  70  |   test('verify Escape close interaction', async ({ page }) => {
  71  |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  72  |     await exploreBtn.click();
  73  | 
  74  |     const modal = page.locator('#katha-modal');
  75  |     await expect(modal).toBeVisible();
  76  | 
  77  |     // Press Escape
  78  |     await page.keyboard.press('Escape');
  79  |     await expect(modal).not.toBeVisible();
  80  |   });
  81  | 
  82  |   test('verify accessibility attributes', async ({ page }) => {
  83  |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  84  |     await exploreBtn.click();
  85  | 
  86  |     const modal = page.locator('#katha-modal');
> 87  |     await expect(modal).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
  88  | 
  89  |     // dialog and modal attributes
  90  |     await expect(modal).toHaveAttribute('role', 'dialog');
  91  |     await expect(modal).toHaveAttribute('aria-modal', 'true');
  92  | 
  93  |     // aria-labelledby links to modal title
  94  |     const modalTitle = modal.locator('h2').first();
  95  |     const titleId = await modalTitle.getAttribute('id');
  96  |     expect(titleId).toBeTruthy();
  97  |     await expect(modal).toHaveAttribute('aria-labelledby', titleId!);
  98  | 
  99  |     // Two role="group" regions: Text Position toggle + Installation/service-tier picker
  100 |     const groups = modal.locator('[role="group"]');
  101 |     await expect(groups).toHaveCount(2);
  102 |     await expect(modal.locator('[role="group"][aria-labelledby="text-position-label"]')).toHaveCount(1);
  103 |     await expect(modal.locator('[role="group"][aria-labelledby="katha-service-tier-label"]')).toHaveCount(1);
  104 |   });
  105 | 
  106 |   test('verify focus trapping loop when submit button is DISABLED (initial state)', async ({ page }) => {
  107 |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  108 |     await exploreBtn.click();
  109 | 
  110 |     const modal = page.locator('#katha-modal');
  111 |     await expect(modal).toBeVisible();
  112 | 
  113 |     // Focus the Close button (first element)
  114 |     const closeBtn = modal.locator('button[aria-label="Close template preview"]');
  115 |     await closeBtn.focus();
  116 | 
  117 |     // Press Shift+Tab (should wrap backward to the last enabled element, e.g. upload or textarea, but NOT the disabled submit button)
  118 |     await page.keyboard.down('Shift');
  119 |     await page.keyboard.press('Tab');
  120 |     await page.keyboard.up('Shift');
  121 | 
  122 |     // Verify the currently active element is NOT the close button, nor the disabled submit button
  123 |     const activeTextContent = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
  124 |     const activeTagName = await page.evaluate(() => document.activeElement?.tagName || '');
  125 |     const activeElementId = await page.evaluate(() => document.activeElement?.id || '');
  126 |     const isDisabled = await page.evaluate(() => (document.activeElement as any)?.disabled || false);
  127 | 
  128 |     console.log(`[VERIFICATION-DISABLED] Shift+Tab active element: Tag=${activeTagName}, ID=${activeElementId}, Text="${activeTextContent}", disabled=${isDisabled}`);
  129 |     expect(isDisabled).toBe(false);
  130 |     expect(activeElementId).not.toBe('katha-submit-btn'); // Submit button is disabled, so focus should wrap to some enabled element.
  131 | 
  132 |     // Let's explicitly check forward tabbing wrap-around.
  133 |     // The last enabled element should be the file upload input or the notes textarea.
  134 |     // Let's focus the notes textarea and press Tab
  135 |     const notesInput = page.locator('#katha-notes');
  136 |     await notesInput.focus();
  137 |     
  138 |     // The photo upload is actually after notes. Let's tab from photo upload or notes.
  139 |     // Let's find all enabled focusable elements in the modal
  140 |     const focusableIds = await page.evaluate(() => {
  141 |       const modalEl = document.getElementById('katha-modal');
  142 |       if (!modalEl) return [];
  143 |       const els = Array.from(modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  144 |       return els.filter(el => !(el as any).disabled).map(el => el.id || el.tagName || el.getAttribute('aria-label') || el.textContent?.trim());
  145 |     });
  146 |     console.log(`[VERIFICATION-DISABLED] Focusable elements list (enabled only):`, focusableIds);
  147 | 
  148 |     // Let's focus the last element in that list and tab.
  149 |     // In our code: First name input, Second name, Email, Phone, Event date, Venue, Font selector, Bottom, Top, Notes, Photo upload input.
  150 |     // The last enabled element in the DOM is the photo upload input or notes. Let's focus #katha-notes and press Tab.
  151 |     // Wait, the input #katha-photo-upload is also an input:not([disabled]) and is after #katha-notes.
  152 |     // The photo upload is NOT last anymore: the service-tier group and the
  153 |     // venue-address input come after it. With submit disabled, the last enabled
  154 |     // focusable element is #katha-venue-address — Tab from it wraps to Close.
  155 |     const lastElement = page.locator('#katha-venue-address');
  156 |     await lastElement.focus();
  157 |     await page.keyboard.press('Tab');
  158 | 
  159 |     // It should wrap focus to the Close button
  160 |     const isCloseFocused = await page.evaluate(() => {
  161 |       const active = document.activeElement;
  162 |       return active?.getAttribute('aria-label') === 'Close template preview' || active?.textContent?.trim() === '×';
  163 |     });
  164 |     console.log(`[VERIFICATION-DISABLED] Tab on last enabled element focuses Close: ${isCloseFocused}`);
  165 |     expect(isCloseFocused).toBe(true);
  166 |   });
  167 | 
  168 |   test('verify focus trapping loop when submit button is ENABLED', async ({ page }) => {
  169 |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  170 |     await exploreBtn.click();
  171 | 
  172 |     const modal = page.locator('#katha-modal');
  173 |     await expect(modal).toBeVisible();
  174 | 
  175 |     // Fill in required fields to enable the submit button
  176 |     await modal.getByLabel('First name').fill('Ana');
  177 |     await modal.getByLabel('Email address').fill('ana.reyes@example.com');
  178 |     // Submit also requires a selected installation (serviceTier gate).
  179 |     await modal.getByRole('button', { name: /Signature Installation/i }).click();
  180 |     await page.waitForTimeout(200);
  181 | 
  182 |     // Verify the submit button is enabled (label is "Send Inquiry").
  183 |     const submitBtn = modal.getByRole('button', { name: /send inquiry/i });
  184 |     await expect(submitBtn).toBeVisible();
  185 |     await expect(submitBtn).not.toBeDisabled();
  186 | 
  187 |     // Focus the Close button (first element)
```