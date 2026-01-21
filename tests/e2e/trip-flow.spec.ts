import { expect, test } from "@playwright/test";

test("sign-in screen loads", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByText("Welcome back")).toBeVisible();
});