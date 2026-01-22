import { expect, test } from "@playwright/test";

test("public trip share shows safe error", async ({ page }) => {
  await page.goto("/s/trip/invalid-token");
  await expect(page.getByText("Share link unavailable")).toBeVisible();
});

test("public profile share shows safe error", async ({ page }) => {
  await page.goto("/s/profile/invalid-token");
  await expect(page.getByText("Share link unavailable")).toBeVisible();
});
