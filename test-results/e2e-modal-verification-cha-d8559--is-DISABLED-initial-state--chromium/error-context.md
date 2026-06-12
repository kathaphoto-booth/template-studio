# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/modal-verification-challenger.spec.ts >> Challenger Modal Interaction & Accessibility Verification >> verify focus trapping loop when submit button is DISABLED (initial state)
- Location: tests/e2e/modal-verification-challenger.spec.ts:105:3

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
- img
- main:
  - paragraph: Katha Photo Booth
  - heading "Choose your style" [level=1]
  - paragraph: Browse our template library and choose the one that feels like you. We'll personalize the details together.
  - button "All styles" [pressed]
  - button "Classic"
  - button "Katha Signature"
  - button "All formats" [pressed]
  - button "2×6 Strip"
  - button "4×6 Postcard"
  - button "6×4 Landscape"
  - button "6×4 Square"
  - paragraph: 63 templates
  - paragraph: COMMISSIONED EDITIONS
  - heading "Katha Editions" [level=2]
  - paragraph: Behold the studio's commissioned designs as personalized by our clients. These editions demonstrate our strict adherence to intentional margins, architectural alignment, and quiet restraint. Our studio executes every frame with precision to ensure your event's identity is presented flawlessly.
  - text: Steven & Cristalyn JULY 25, 2026 NAPA VALLEY, CALIFORNIA
  - img
  - text: Classic Tier
  - heading "Tradition Gold Luxe" [level=3]
  - paragraph: Concentric rules in delicate gold-foil shimmer with floating corner tie-ins.
  - text: Tracy & Prince
  - img
  - text: Signature Tier
  - heading "Tracy & Prince Signature" [level=3]
  - paragraph: Romantic Parisian calligraphy bounded by a dual-line concentric framework.
  - heading "The Signature Collection" [level=2]
  - paragraph: Our signature tier. Concepts reflecting ancestral Filipino heritage and Wabi-Sabi philosophy.
  - button "Scroll left":
    - img
  - button "Explore Details Unbleached piña-fiber ground with a fine calado openwork divider drawn in champagne thread. Iron-bark serif set with quiet restraint. Heirloom Piña Signature":
    - img
    - text: Explore Details
    - paragraph: Unbleached piña-fiber ground with a fine calado openwork divider drawn in champagne thread. Iron-bark serif set with quiet restraint.
    - text: Heirloom Piña Signature
  - button "Explore Details An uncompromising execution of Ma. Severe, clean photo strip layout floating on a massive expanse of Piña Ecru. For clients who want pure text, negative space, and absolute minimal decoration. The Editorial Void Signature":
    - img
    - text: Explore Details
    - paragraph: An uncompromising execution of Ma. Severe, clean photo strip layout floating on a massive expanse of Piña Ecru. For clients who want pure text, negative space, and absolute minimal decoration.
    - text: The Editorial Void Signature
  - button "Explore Details An uncompromising execution of Ma. Severe, clean vertical postcard layout floating on a massive expanse of Piña Ecru. The Editorial Void Postcard Signature":
    - img
    - text: Explore Details
    - paragraph: An uncompromising execution of Ma. Severe, clean vertical postcard layout floating on a massive expanse of Piña Ecru.
    - text: The Editorial Void Postcard Signature
  - button "Explore Details An uncompromising execution of Ma. Severe, clean landscape postcard layout floating on a massive expanse of Piña Ecru. The Editorial Void Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: An uncompromising execution of Ma. Severe, clean landscape postcard layout floating on a massive expanse of Piña Ecru.
    - text: The Editorial Void Landscape Signature
  - button "Explore Details Unbleached piña-fiber ground with a fine calado openwork divider. Landscape postcard variant. Heirloom Piña Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: Unbleached piña-fiber ground with a fine calado openwork divider. Landscape postcard variant.
    - text: Heirloom Piña Landscape Signature
  - button "Explore Details A loom-frame border of nested rules and corner cross-ties, echoing the hardwood frame that holds the warp threads taut. Loom Frame Signature":
    - img
    - text: Explore Details
    - paragraph: A loom-frame border of nested rules and corner cross-ties, echoing the hardwood frame that holds the warp threads taut.
    - text: Loom Frame Signature
  - button "Explore Details Loom-frame border in iron-bark serif. Postcard variant of the Loom Frame strip. Loom Frame Postcard Signature":
    - img
    - text: Explore Details
    - paragraph: Loom-frame border in iron-bark serif. Postcard variant of the Loom Frame strip.
    - text: Loom Frame Postcard Signature
  - button "Explore Details Loom-frame border in iron-bark serif. Landscape postcard variant for three-photo Katha events. Loom Frame Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: Loom-frame border in iron-bark serif. Landscape postcard variant for three-photo Katha events.
    - text: Loom Frame Landscape Signature
  - button "Explore Details T'nalak soil-black ground from the seven-day knalum boil. Raw-fiber ecru lettering with a single loko-root rust rule — the dreamweaver's tri-color. Knalum Night Signature":
    - img
    - text: Explore Details
    - paragraph: T'nalak soil-black ground from the seven-day knalum boil. Raw-fiber ecru lettering with a single loko-root rust rule — the dreamweaver's tri-color.
    - text: Knalum Night Signature
  - button "Explore Details T'nalak soil-black ground with raw-fiber ecru lettering and a single loko-root rust accent. 4×6 postcard variant. Knalum Night Postcard Signature":
    - img
    - text: Explore Details
    - paragraph: T'nalak soil-black ground with raw-fiber ecru lettering and a single loko-root rust accent. 4×6 postcard variant.
    - text: Knalum Night Postcard Signature
  - button "Explore Details T'nalak soil-black ground with raw-fiber ecru lettering and a single loko-root rust accent. Landscape postcard variant. Knalum Night Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: T'nalak soil-black ground with raw-fiber ecru lettering and a single loko-root rust accent. Landscape postcard variant.
    - text: Knalum Night Landscape Signature
  - button "Explore Details The brass ring offered when a finished cloth leaves the loom, drawn as a single loko-rust circle beneath the names. Permission, and blessing. Brass Ring Signature":
    - img
    - text: Explore Details
    - paragraph: The brass ring offered when a finished cloth leaves the loom, drawn as a single loko-rust circle beneath the names. Permission, and blessing.
    - text: Brass Ring Signature
  - button "Explore Details The brass ring permission seal, postcard-format. A single loko-rust ring beneath the names. Brass Ring Postcard Signature":
    - img
    - text: Explore Details
    - paragraph: The brass ring permission seal, postcard-format. A single loko-rust ring beneath the names.
    - text: Brass Ring Postcard Signature
  - button "Explore Details The brass ring permission seal, landscape postcard format. A single loko-rust ring beneath the names. Brass Ring Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: The brass ring permission seal, landscape postcard format. A single loko-rust ring beneath the names.
    - text: Brass Ring Landscape Signature
  - button "Explore Details Ilocos binakul optical weave at the corners — apotropaic geometry meant to confuse malevolent spirits, woven quietly at low contrast. Binakul Weave Signature":
    - img
    - text: Explore Details
    - paragraph: Ilocos binakul optical weave at the corners — apotropaic geometry meant to confuse malevolent spirits, woven quietly at low contrast.
    - text: Binakul Weave Signature
  - button "Explore Details Ilocos binakul optical weave at the corners. Apotropaic geometry for a 4x6 vertical postcard. Binakul Weave Postcard Signature":
    - img
    - text: Explore Details
    - paragraph: Ilocos binakul optical weave at the corners. Apotropaic geometry for a 4x6 vertical postcard.
    - text: Binakul Weave Postcard Signature
  - button "Explore Details Ilocos binakul optical weave at the corners. Landscape variant. Binakul Weave Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: Ilocos binakul optical weave at the corners. Landscape variant.
    - text: Binakul Weave Landscape Signature
  - button "Explore Details Capiz-shell windowpane lattice rendered in sage — the translucent pane that filters lowland light into a soft, even glow. Capiz Sage Signature":
    - img
    - text: Explore Details
    - paragraph: Capiz-shell windowpane lattice rendered in sage — the translucent pane that filters lowland light into a soft, even glow.
    - text: Capiz Sage Signature
  - button "Explore Details Capiz windowpane in sage green. 4×6 vertical postcard variant. Capiz Sage Postcard Signature":
    - img
    - text: Explore Details
    - paragraph: Capiz windowpane in sage green. 4×6 vertical postcard variant.
    - text: Capiz Sage Postcard Signature
  - button "Explore Details Capiz-shell windowpane in sage. Landscape postcard variant of the Capiz Sage signature. Capiz Sage Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: Capiz-shell windowpane in sage. Landscape postcard variant of the Capiz Sage signature.
    - text: Capiz Sage Landscape Signature
  - button "Explore Details Double fine-lined frame in Champagne Heirloom with Fraunces display set on a Piña Ecru ground. The Signature tier's quiet restraint for Tracy & Prince. Tracy & Prince Signature":
    - img
    - text: Explore Details
    - paragraph: Double fine-lined frame in Champagne Heirloom with Fraunces display set on a Piña Ecru ground. The Signature tier's quiet restraint for Tracy & Prince.
    - text: Tracy & Prince Signature
  - button "Explore Details Three photos trace an L on a piña-fiber ground, with the open corner cradling a champagne calado divider. Heirloom Piña L-Shape Signature":
    - img
    - text: Explore Details
    - paragraph: Three photos trace an L on a piña-fiber ground, with the open corner cradling a champagne calado divider.
    - text: Heirloom Piña L-Shape Signature
  - button "Explore Details Inverted-L arrangement framed by the loom-bark border. The open bottom-left becomes a quiet whitespace for the names. Loom Frame Γ-Shape Signature":
    - img
    - text: Explore Details
    - paragraph: Inverted-L arrangement framed by the loom-bark border. The open bottom-left becomes a quiet whitespace for the names.
    - text: Loom Frame Γ-Shape Signature
  - button "Explore Details Capiz windowpane in sage. Inverted-L photo arrangement with the open corner reserved for the names. Capiz Sage Γ-Shape Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: Capiz windowpane in sage. Inverted-L photo arrangement with the open corner reserved for the names.
    - text: Capiz Sage Γ-Shape Landscape Signature
  - button "Explore Details Piña-fiber ecru ground — two square photos balanced across the canvas. Heirloom Piña Landscape 2 Squares Signature":
    - img
    - text: Explore Details
    - paragraph: Piña-fiber ecru ground — two square photos balanced across the canvas.
    - text: Heirloom Piña Landscape 2 Squares Signature
  - button "Explore Details Piña-fiber ecru ground — three square photos in a row with champagne thread accents. Heirloom Piña Landscape 3 Squares Signature":
    - img
    - text: Explore Details
    - paragraph: Piña-fiber ecru ground — three square photos in a row with champagne thread accents.
    - text: Heirloom Piña Landscape 3 Squares Signature
  - button "Explore Details T’nalak soil-black — two square photos, ecru lettering with loko-root rust accent. Knalum Night Landscape 2 Squares Signature":
    - img
    - text: Explore Details
    - paragraph: T’nalak soil-black — two square photos, ecru lettering with loko-root rust accent.
    - text: Knalum Night Landscape 2 Squares Signature
  - button "Explore Details T’nalak soil-black — three square photos in a row, raw-fiber ecru lettering. Knalum Night Landscape 3 Squares Signature":
    - img
    - text: Explore Details
    - paragraph: T’nalak soil-black — three square photos in a row, raw-fiber ecru lettering.
    - text: Knalum Night Landscape 3 Squares Signature
  - button "Explore Details An uncompromising execution of Ma. Severe, clean side-by-side square photos layout floating on a massive expanse of Piña Ecru. The Editorial Void Landscape 2 Squares Signature":
    - img
    - text: Explore Details
    - paragraph: An uncompromising execution of Ma. Severe, clean side-by-side square photos layout floating on a massive expanse of Piña Ecru.
    - text: The Editorial Void Landscape 2 Squares Signature
  - button "Explore Details An uncompromising execution of Ma. Severe, clean three square photos layout floating on a massive expanse of Piña Ecru. The Editorial Void Landscape 3 Squares Signature":
    - img
    - text: Explore Details
    - paragraph: An uncompromising execution of Ma. Severe, clean three square photos layout floating on a massive expanse of Piña Ecru.
    - text: The Editorial Void Landscape 3 Squares Signature
  - button "Explore Details Generative signature theme representing pure unrefined structural thread paths running continuously. Features delicate threadlines that subtly overlay slots. Woven Silk Signature":
    - img
    - text: Explore Details
    - paragraph: Generative signature theme representing pure unrefined structural thread paths running continuously. Features delicate threadlines that subtly overlay slots.
    - text: Woven Silk Signature
  - button "Explore Details Generative signature theme representing structural thread paths in a 4x6 vertical postcard format. Woven Silk Postcard Signature":
    - img
    - text: Explore Details
    - paragraph: Generative signature theme representing structural thread paths in a 4x6 vertical postcard format.
    - text: Woven Silk Postcard Signature
  - button "Explore Details Generative signature theme representing structural thread paths in a 6x4 landscape postcard format. Woven Silk Landscape Signature":
    - img
    - text: Explore Details
    - paragraph: Generative signature theme representing structural thread paths in a 6x4 landscape postcard format.
    - text: Woven Silk Landscape Signature
  - button "Scroll right":
    - img
  - heading "The Classic Atelier" [level=2]
  - paragraph: Timeless designs, elegant typography, and traditional wedding details.
  - button "Scroll left":
    - img
  - button "Explore Details Double gold foil fine outline detailing around each slot. Clean Roman serif display, providing timeless heirloom appeal. Style 1 — Tradition Gold Luxe":
    - img
    - text: Explore Details
    - paragraph: Double gold foil fine outline detailing around each slot. Clean Roman serif display, providing timeless heirloom appeal.
    - text: Style 1 — Tradition Gold Luxe
  - button "Explore Details Double gold-foil hairline frame with crisp corner accents. A 4×6 postcard distillation of the Tradition Gold strip. Style 1 — Tradition Gold Postcard":
    - img
    - text: Explore Details
    - paragraph: Double gold-foil hairline frame with crisp corner accents. A 4×6 postcard distillation of the Tradition Gold strip.
    - text: Style 1 — Tradition Gold Postcard
  - 'button "Explore Details Tradition Gold rendered horizontal: gold-foil hairline frame, three photos in a row, formal Cinzel display. Style 1 — Tradition Gold Landscape"':
    - img
    - text: Explore Details
    - paragraph: "Tradition Gold rendered horizontal: gold-foil hairline frame, three photos in a row, formal Cinzel display."
    - text: Style 1 — Tradition Gold Landscape
  - button "Explore Details Deckled ivory paper backdrop adorned with a hand-sketched classic cream and white rose nested gracefully above the text. Style 2 — Minimal Linen Rose":
    - img
    - text: Explore Details
    - paragraph: Deckled ivory paper backdrop adorned with a hand-sketched classic cream and white rose nested gracefully above the text.
    - text: Style 2 — Minimal Linen Rose
  - button "Explore Details Deckled ivory paper backdrop adorned with a hand-sketched classic rose nested gracefully above the text. Postcard vertical format. Style 2 — Minimal Linen Rose Postcard":
    - img
    - text: Explore Details
    - paragraph: Deckled ivory paper backdrop adorned with a hand-sketched classic rose nested gracefully above the text. Postcard vertical format.
    - text: Style 2 — Minimal Linen Rose Postcard
  - button "Explore Details Linen-paper ground with a hand-sketched English rose. Landscape postcard variant — three stacked moments side by side. Style 2 — Linen Rose Landscape":
    - img
    - text: Explore Details
    - paragraph: Linen-paper ground with a hand-sketched English rose. Landscape postcard variant — three stacked moments side by side.
    - text: Style 2 — Linen Rose Landscape
  - button "Explore Details Bohemian dry terracotta sunset clay color. Accentuated by fine hairline gold rules and micro leafy contours. Style 4 — Earthen Clay Sunset":
    - img
    - text: Explore Details
    - paragraph: Bohemian dry terracotta sunset clay color. Accentuated by fine hairline gold rules and micro leafy contours.
    - text: Style 4 — Earthen Clay Sunset
  - button "Explore Details Bohemian dry terracotta sunset clay color. Accentuated by fine hairline gold rules and micro leafy contours. Postcard format. Style 4 — Earthen Clay Sunset Postcard":
    - img
    - text: Explore Details
    - paragraph: Bohemian dry terracotta sunset clay color. Accentuated by fine hairline gold rules and micro leafy contours. Postcard format.
    - text: Style 4 — Earthen Clay Sunset Postcard
  - button "Explore Details Bohemian dry terracotta sunset clay color. Accentuated by fine hairline gold rules and micro leafy contours. Landscape format. Style 4 — Earthen Clay Sunset Landscape":
    - img
    - text: Explore Details
    - paragraph: Bohemian dry terracotta sunset clay color. Accentuated by fine hairline gold rules and micro leafy contours. Landscape format.
    - text: Style 4 — Earthen Clay Sunset Landscape
  - button "Explore Details Gatsby-era black velvet base framing interlocking linear art-deco brass-yellow chevrons and tall typography. Style 5 — Gatsby Midnight Gold":
    - img
    - text: Explore Details
    - paragraph: Gatsby-era black velvet base framing interlocking linear art-deco brass-yellow chevrons and tall typography.
    - text: Style 5 — Gatsby Midnight Gold
  - button "Explore Details Gatsby-era black velvet base framing interlocking linear art-deco brass-yellow chevrons. Postcard vertical format. Style 5 — Gatsby Midnight Gold Postcard":
    - img
    - text: Explore Details
    - paragraph: Gatsby-era black velvet base framing interlocking linear art-deco brass-yellow chevrons. Postcard vertical format.
    - text: Style 5 — Gatsby Midnight Gold Postcard
  - button "Explore Details Gatsby-era black velvet base framing interlocking linear art-deco brass-yellow chevrons. Landscape postcard format. Style 5 — Gatsby Midnight Gold Landscape":
    - img
    - text: Explore Details
    - paragraph: Gatsby-era black velvet base framing interlocking linear art-deco brass-yellow chevrons. Landscape postcard format.
    - text: Style 5 — Gatsby Midnight Gold Landscape
  - button "Explore Details Extremely spacious high-fashion gallery margins and thin borders paired with tracked wide, clean-lined display fonts. Style 8 — Haute Gallery Editorial":
    - img
    - text: Explore Details
    - paragraph: Extremely spacious high-fashion gallery margins and thin borders paired with tracked wide, clean-lined display fonts.
    - text: Style 8 — Haute Gallery Editorial
  - button "Explore Details Generous gallery margins with a single hairline rule and wide-tracked Italiana display. Quiet, modernist. Style 8 — Editorial Postcard":
    - img
    - text: Explore Details
    - paragraph: Generous gallery margins with a single hairline rule and wide-tracked Italiana display. Quiet, modernist.
    - text: Style 8 — Editorial Postcard
  - button "Explore Details Editorial gallery margins, hairline rule, wide-tracked display. Landscape postcard for cinematic three-photo storytelling. Style 8 — Editorial Landscape":
    - img
    - text: Explore Details
    - paragraph: Editorial gallery margins, hairline rule, wide-tracked display. Landscape postcard for cinematic three-photo storytelling.
    - text: Style 8 — Editorial Landscape
  - button "Explore Details Fine Victorian scalloped curves and lace-like dotted alignments evoking elegant hand-crocheted silk ribbons. Style 10 — Victorian Cream Lace":
    - img
    - text: Explore Details
    - paragraph: Fine Victorian scalloped curves and lace-like dotted alignments evoking elegant hand-crocheted silk ribbons.
    - text: Style 10 — Victorian Cream Lace
  - button "Explore Details Fine Victorian scalloped curves and lace-like dotted alignments. Postcard vertical format. Style 10 — Victorian Cream Lace Postcard":
    - img
    - text: Explore Details
    - paragraph: Fine Victorian scalloped curves and lace-like dotted alignments. Postcard vertical format.
    - text: Style 10 — Victorian Cream Lace Postcard
  - button "Explore Details Fine Victorian scalloped curves and lace-like dotted alignments. Landscape format. Style 10 — Victorian Cream Lace Landscape":
    - img
    - text: Explore Details
    - paragraph: Fine Victorian scalloped curves and lace-like dotted alignments. Landscape format.
    - text: Style 10 — Victorian Cream Lace Landscape
  - button "Explore Details Nobility Stationery theme featuring royal gold borders and a stately circular dynamic seal design under the photo slots. Style 12 — Imperial Crest Seal":
    - img
    - text: Explore Details
    - paragraph: Nobility Stationery theme featuring royal gold borders and a stately circular dynamic seal design under the photo slots.
    - text: Style 12 — Imperial Crest Seal
  - button "Explore Details Nobility Stationery theme featuring royal gold borders and a stately circular dynamic seal. Postcard vertical format. Style 12 — Imperial Crest Postcard":
    - img
    - text: Explore Details
    - paragraph: Nobility Stationery theme featuring royal gold borders and a stately circular dynamic seal. Postcard vertical format.
    - text: Style 12 — Imperial Crest Postcard
  - button "Explore Details Nobility Stationery theme featuring royal gold borders and a stately circular dynamic seal. Landscape format. Style 12 — Imperial Crest Landscape":
    - img
    - text: Explore Details
    - paragraph: Nobility Stationery theme featuring royal gold borders and a stately circular dynamic seal. Landscape format.
    - text: Style 12 — Imperial Crest Landscape
  - button "Explore Details Canva style double fine-lined cathedral arch framing. Features high-curved slots and minimalist organic grass sprigs. Style 14 — Delicate Fine-Line Arch":
    - img
    - text: Explore Details
    - paragraph: Canva style double fine-lined cathedral arch framing. Features high-curved slots and minimalist organic grass sprigs.
    - text: Style 14 — Delicate Fine-Line Arch
  - button "Explore Details Double fine-lined cathedral arch framing wrapping vertical slots. Postcard vertical format. Style 14 — Delicate Fine-Line Arch Postcard":
    - img
    - text: Explore Details
    - paragraph: Double fine-lined cathedral arch framing wrapping vertical slots. Postcard vertical format.
    - text: Style 14 — Delicate Fine-Line Arch Postcard
  - button "Explore Details Double fine-lined cathedral arch crowning three photo slots. Landscape variant of the Delicate Fine-Line Arch. Style 14 — Botanical Arch Landscape":
    - img
    - text: Explore Details
    - paragraph: Double fine-lined cathedral arch crowning three photo slots. Landscape variant of the Delicate Fine-Line Arch.
    - text: Style 14 — Botanical Arch Landscape
  - button "Explore Details Etsy bestseller deckled-edge paper base carrying an intimate calligraphic handwriting signature and simulated copper wax-seal monogram. Style 19 — Deckled Wax Seal":
    - img
    - text: Explore Details
    - paragraph: Etsy bestseller deckled-edge paper base carrying an intimate calligraphic handwriting signature and simulated copper wax-seal monogram.
    - text: Style 19 — Deckled Wax Seal
  - button "Explore Details Etsy bestseller deckled-edge paper carrying calligraphic handwriting and simulated copper wax-seal. Postcard format. Style 19 — Deckled Wax Seal Postcard":
    - img
    - text: Explore Details
    - paragraph: Etsy bestseller deckled-edge paper carrying calligraphic handwriting and simulated copper wax-seal. Postcard format.
    - text: Style 19 — Deckled Wax Seal Postcard
  - button "Explore Details Etsy bestseller deckled-edge paper carrying calligraphic handwriting and simulated copper wax-seal. Landscape postcard format. Style 19 — Deckled Wax Seal Landscape":
    - img
    - text: Explore Details
    - paragraph: Etsy bestseller deckled-edge paper carrying calligraphic handwriting and simulated copper wax-seal. Landscape postcard format.
    - text: Style 19 — Deckled Wax Seal Landscape
  - button "Explore Details Three photos trace an L on a gallery-clean ground. Hairline rule, wide-tracked Italiana display. Style 8 — Editorial L-Shape Landscape":
    - img
    - text: Explore Details
    - paragraph: Three photos trace an L on a gallery-clean ground. Hairline rule, wide-tracked Italiana display.
    - text: Style 8 — Editorial L-Shape Landscape
  - button "Explore Details Tradition Gold — two square photos, gold-foil detail, formal Cinzel display. Style 1 — Tradition Gold Landscape 2 Squares":
    - img
    - text: Explore Details
    - paragraph: Tradition Gold — two square photos, gold-foil detail, formal Cinzel display.
    - text: Style 1 — Tradition Gold Landscape 2 Squares
  - button "Explore Details Tradition Gold — three square photos in a row, gold-foil hairline, formal Roman display. Style 1 — Tradition Gold Landscape 3 Squares":
    - img
    - text: Explore Details
    - paragraph: Tradition Gold — three square photos in a row, gold-foil hairline, formal Roman display.
    - text: Style 1 — Tradition Gold Landscape 3 Squares
  - button "Scroll right":
    - img
- img "Impeccable live mode - agent not polling"
- button "Pick element":
  - img
  - text: Pick
- button "Insert new element":
  - img
  - text: Insert
- button "Detect anti-patterns":
  - img
  - text: Detect
- button "Toggle DESIGN.md panel": DESIGN.md
- textbox "Steer the page":
  - /placeholder: Steer…
- button "Voice input"
- button "Exit live mode":
  - img
- complementary:
  - text: DESIGN.md
  - button "Visual"
  - button "Raw"
  - button "Close panel": ✕
  - text: No design system data available.
- alert
```

# Test source

```ts
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
  87  |     await expect(modal).toBeVisible();
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
  99  |     // role="group" with aria-labelledby on selectors
  100 |     const textPositionGroup = modal.locator('[role="group"]');
  101 |     await expect(textPositionGroup).toHaveCount(1);
  102 |     await expect(textPositionGroup).toHaveAttribute('aria-labelledby', 'text-position-label');
  103 |   });
  104 | 
  105 |   test('verify focus trapping loop when submit button is DISABLED (initial state)', async ({ page }) => {
  106 |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  107 |     await exploreBtn.click();
  108 | 
  109 |     const modal = page.locator('#katha-modal');
> 110 |     await expect(modal).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
  111 | 
  112 |     // Focus the Close button (first element)
  113 |     const closeBtn = modal.locator('button[aria-label="Close template preview"]');
  114 |     await closeBtn.focus();
  115 | 
  116 |     // Press Shift+Tab (should wrap backward to the last enabled element, e.g. upload or textarea, but NOT the disabled submit button)
  117 |     await page.keyboard.down('Shift');
  118 |     await page.keyboard.press('Tab');
  119 |     await page.keyboard.up('Shift');
  120 | 
  121 |     // Verify the currently active element is NOT the close button, nor the disabled submit button
  122 |     const activeTextContent = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
  123 |     const activeTagName = await page.evaluate(() => document.activeElement?.tagName || '');
  124 |     const activeElementId = await page.evaluate(() => document.activeElement?.id || '');
  125 |     const isDisabled = await page.evaluate(() => (document.activeElement as any)?.disabled || false);
  126 | 
  127 |     console.log(`[VERIFICATION-DISABLED] Shift+Tab active element: Tag=${activeTagName}, ID=${activeElementId}, Text="${activeTextContent}", disabled=${isDisabled}`);
  128 |     expect(isDisabled).toBe(false);
  129 |     expect(activeElementId).not.toBe('katha-submit-btn'); // Submit button is disabled, so focus should wrap to some enabled element.
  130 | 
  131 |     // Let's explicitly check forward tabbing wrap-around.
  132 |     // The last enabled element should be the file upload input or the notes textarea.
  133 |     // Let's focus the notes textarea and press Tab
  134 |     const notesInput = page.locator('#katha-notes');
  135 |     await notesInput.focus();
  136 |     
  137 |     // The photo upload is actually after notes. Let's tab from photo upload or notes.
  138 |     // Let's find all enabled focusable elements in the modal
  139 |     const focusableIds = await page.evaluate(() => {
  140 |       const modalEl = document.getElementById('katha-modal');
  141 |       if (!modalEl) return [];
  142 |       const els = Array.from(modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  143 |       return els.filter(el => !(el as any).disabled).map(el => el.id || el.tagName || el.getAttribute('aria-label') || el.textContent?.trim());
  144 |     });
  145 |     console.log(`[VERIFICATION-DISABLED] Focusable elements list (enabled only):`, focusableIds);
  146 | 
  147 |     // Let's focus the last element in that list and tab.
  148 |     // In our code: First name input, Second name, Email, Phone, Event date, Venue, Font selector, Bottom, Top, Notes, Photo upload input.
  149 |     // The last enabled element in the DOM is the photo upload input or notes. Let's focus #katha-notes and press Tab.
  150 |     // Wait, the input #katha-photo-upload is also an input:not([disabled]) and is after #katha-notes.
  151 |     const lastElement = page.locator('#katha-photo-upload');
  152 |     await lastElement.focus();
  153 |     await page.keyboard.press('Tab');
  154 | 
  155 |     // It should wrap focus to the Close button
  156 |     const isCloseFocused = await page.evaluate(() => {
  157 |       const active = document.activeElement;
  158 |       return active?.getAttribute('aria-label') === 'Close template preview' || active?.textContent?.trim() === '×';
  159 |     });
  160 |     console.log(`[VERIFICATION-DISABLED] Tab on last enabled element focuses Close: ${isCloseFocused}`);
  161 |     expect(isCloseFocused).toBe(true);
  162 |   });
  163 | 
  164 |   test('verify focus trapping loop when submit button is ENABLED', async ({ page }) => {
  165 |     const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
  166 |     await exploreBtn.click();
  167 | 
  168 |     const modal = page.locator('#katha-modal');
  169 |     await expect(modal).toBeVisible();
  170 | 
  171 |     // Fill in required fields to enable the submit button
  172 |     await modal.getByLabel('First name').fill('Ana');
  173 |     await modal.getByLabel('Email address').fill('ana.reyes@example.com');
  174 |     await page.waitForTimeout(200);
  175 | 
  176 |     // Verify the submit button is enabled
  177 |     // Wait, the submit button has text "Submit Design Inquiry"
  178 |     const submitBtn = modal.getByRole('button', { name: /submit design inquiry/i });
  179 |     await expect(submitBtn).toBeVisible();
  180 |     await expect(submitBtn).not.toBeDisabled();
  181 | 
  182 |     // Focus the Close button (first element)
  183 |     const closeBtn = modal.locator('button[aria-label="Close template preview"]');
  184 |     await closeBtn.focus();
  185 | 
  186 |     // Press Shift+Tab (should wrap backward to the enabled submit button, which is now the last element)
  187 |     await page.keyboard.down('Shift');
  188 |     await page.keyboard.press('Tab');
  189 |     await page.keyboard.up('Shift');
  190 | 
  191 |     const activeTextContent = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
  192 |     console.log(`[VERIFICATION-ENABLED] Shift+Tab active element on close: "${activeTextContent}"`);
  193 |     expect(activeTextContent).toMatch(/submit design inquiry/i);
  194 | 
  195 |     // Focus the submit button and press Tab (should wrap forward to the Close button)
  196 |     await submitBtn.focus();
  197 |     await page.keyboard.press('Tab');
  198 | 
  199 |     const isCloseFocused = await page.evaluate(() => {
  200 |       const active = document.activeElement;
  201 |       return active?.getAttribute('aria-label') === 'Close template preview' || active?.textContent?.trim() === '×';
  202 |     });
  203 |     console.log(`[VERIFICATION-ENABLED] Tab on submit button focuses Close: ${isCloseFocused}`);
  204 |     expect(isCloseFocused).toBe(true);
  205 |   });
  206 | });
  207 | 
```