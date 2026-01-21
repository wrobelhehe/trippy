import { expect, test } from "@playwright/test";

test("share link settings requires auth", async ({ page }) => {
  await page.goto("/settings");
  await expect(page).toHaveURL(/sign-in/);
  await expect(page.getByText("Welcome back")).toBeVisible();
});