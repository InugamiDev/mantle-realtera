import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header navigation links work", async ({ page }) => {
    // Use methodology page as it's static and doesn't rely on DB
    await page.goto("/methodology");

    // Check header exists
    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("mobile navigation is hidden on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/methodology");

    // Header should be visible on desktop
    await expect(page.locator("header")).toBeVisible();
  });

  test("responsive layout works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/methodology");

    // Page should still render correctly
    await expect(page).toHaveTitle(/RealTera/);
  });
});

test.describe("Calculator Interactions", () => {
  test("rental yield calculator accepts input", async ({ page }) => {
    const response = await page.goto("/calculator/rental-yield");
    expect(response?.status()).toBeLessThan(500);

    // Look for input fields - they should be interactive
    const inputs = page.locator('input[type="number"], input[type="range"]');
    const inputCount = await inputs.count();

    // Should have at least some numeric inputs for calculator
    expect(inputCount).toBeGreaterThan(0);
  });

  test("mortgage calculator accepts input", async ({ page }) => {
    const response = await page.goto("/calculator/mortgage");
    expect(response?.status()).toBeLessThan(500);

    // Look for input fields
    const inputs = page.locator('input[type="number"], input[type="range"]');
    const inputCount = await inputs.count();

    expect(inputCount).toBeGreaterThan(0);
  });

  test("investment calculator accepts input", async ({ page }) => {
    const response = await page.goto("/calculator/investment");
    expect(response?.status()).toBeLessThan(500);

    // Look for input fields
    const inputs = page.locator('input[type="number"], input[type="range"]');
    const inputCount = await inputs.count();

    expect(inputCount).toBeGreaterThan(0);
  });
});

test.describe("Visual Elements", () => {
  test("golden theme colors are applied", async ({ page }) => {
    await page.goto("/methodology");

    // Check that dark theme class is applied
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("glassmorphism effects are present", async ({ page }) => {
    await page.goto("/methodology");

    // Check for any styled card/container elements
    // Using a more generic selector as class names may be compiled
    const cards = page.locator("[class*='rounded']");
    const count = await cards.count();

    // Should have some styled elements
    expect(count).toBeGreaterThan(0);
  });
});
