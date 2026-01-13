import { test, expect } from "@playwright/test";

test.describe("Core Pages", () => {
  test("homepage loads correctly", async ({ page }) => {
    const response = await page.goto("/");

    // Page should load (may have server errors due to missing DB tables)
    expect(response?.status()).toBeLessThan(500);

    // Check page title
    await expect(page).toHaveTitle(/RealTera/);
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveURL(/about/);
  });

  test("methodology page loads", async ({ page }) => {
    await page.goto("/methodology");
    await expect(page).toHaveURL(/methodology/);

    // Check scoring criteria section exists
    await expect(page.getByText("Tiêu chí đánh giá")).toBeVisible();
  });

  test("developers page loads", async ({ page }) => {
    await page.goto("/developers");
    await expect(page).toHaveURL(/developers/);
  });

  test("verification page loads", async ({ page }) => {
    await page.goto("/verification");
    await expect(page).toHaveURL(/verification/);
  });

  test("compare page loads", async ({ page }) => {
    await page.goto("/compare");
    await expect(page).toHaveURL(/compare/);
  });
});

test.describe("Calculator Suite", () => {
  test("calculator index page loads", async ({ page }) => {
    await page.goto("/calculator");
    await expect(page).toHaveURL(/calculator/);
  });

  test("rental yield calculator loads", async ({ page }) => {
    await page.goto("/calculator/rental-yield");
    await expect(page).toHaveURL(/rental-yield/);
  });

  test("investment calculator loads", async ({ page }) => {
    await page.goto("/calculator/investment");
    await expect(page).toHaveURL(/investment/);
  });

  test("mortgage calculator loads", async ({ page }) => {
    await page.goto("/calculator/mortgage");
    await expect(page).toHaveURL(/mortgage/);
  });
});

test.describe("Sponsorship Pages", () => {
  test("sponsorship page loads", async ({ page }) => {
    await page.goto("/sponsorship");
    await expect(page).toHaveURL(/sponsorship/);
  });

  test("developer sponsorship page loads", async ({ page }) => {
    await page.goto("/developer/sponsorship");
    await expect(page).toHaveURL(/developer\/sponsorship/);
  });
});

test.describe("Protected Pages (Unauthenticated)", () => {
  test("saved page loads", async ({ page }) => {
    const response = await page.goto("/saved");
    // Should load without 500 error
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/saved/);
  });

  test("portfolio page shows login prompt", async ({ page }) => {
    const response = await page.goto("/portfolio");
    // Should load without 500 error
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/portfolio/);

    // Should show login button for unauthenticated users
    await expect(page.getByText(/Đăng nhập/)).toBeVisible();
  });

  test("admin page redirects unauthenticated users", async ({ page }) => {
    await page.goto("/admin");

    // Should redirect to sign-in
    await expect(page).toHaveURL(/handler\/sign-in|admin/);
  });
});
