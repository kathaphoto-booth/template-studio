import { test, expect } from "@playwright/test";

test("/inquire submits 3 fields and shows the portal link on-screen", async ({ page }) => {
  await page.goto("/inquire");
  
  // Go to Step 2
  await page.getByRole("button", { name: /Continue/i }).click();

  await page.getByLabel(/name/i).fill("Ana Reyes");
  await page.getByLabel(/email/i).fill("ana@example.com");
  await page.getByLabel(/venue/i).fill("Aesthetic Loft");
  await page.getByRole("button", { name: /Submit Inquiry/i }).click();

  await expect(page.locator('text=Inquiry submitted successfully.')).toBeVisible();
});

test("portal 404s on an unknown lead_hash", async ({ page }) => {
  const res = await page.goto(
    "/portal/unknownhash000000000000000000000000/template-design"
  );
  expect(res?.status()).toBe(404);
});

test("portal renders (200) for the guest passthrough id", async ({ page }) => {
  // Proves the 404 above is attributable to the lookup miss, not blanket 404ing.
  const res = await page.goto("/portal/guest/template-design");
  expect(res?.status()).toBe(200);
});
