import { test, expect } from "@playwright/test";

test("/inquire submits 3 fields and shows the portal link on-screen", async ({ page }) => {
  await page.route("**/api/inquiry", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, lead_hash: "deadbeefdeadbeefdeadbeefdeadbeef" }),
    })
  );

  await page.goto("/inquire");
  await page.getByLabel(/name/i).fill("Ana Reyes");
  await page.getByLabel(/email/i).fill("ana@example.com");
  await page.getByLabel(/event date/i).fill("2026-09-12");
  // The submit CTA is "Send Inquiry" (renamed late in Section D; the old
  // /commission|begin|continue/ regex never matched it).
  await page.getByRole("button", { name: /send inquiry/i }).click();

  const link = page.getByRole("link", { name: /template|design|continue/i });
  await expect(link).toHaveAttribute("href", /\/portal\/deadbeef.*\/template-design/);
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
