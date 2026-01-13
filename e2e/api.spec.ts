import { test, expect } from "@playwright/test";

test.describe("API Health", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/api/v1/health");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe("ok");
  });
});

test.describe("Public API Endpoints", () => {
  test("projects endpoint returns list", async ({ request }) => {
    const response = await request.get("/api/v1/projects");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data).toHaveProperty("pagination");
  });

  test("developers endpoint returns list", async ({ request }) => {
    const response = await request.get("/api/v1/developers");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data).toHaveProperty("pagination");
  });

  test("search endpoint works", async ({ request }) => {
    const response = await request.get("/api/v1/search?q=test");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    // Search returns {projects, developers, query}
    expect(data).toHaveProperty("projects");
    expect(data).toHaveProperty("developers");
    expect(data).toHaveProperty("query");
  });

  test.skip("auctions endpoint returns list", async ({ request }) => {
    // Skip: requires SponsoredAuction table to exist in database
    const response = await request.get("/api/v1/auctions");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty("auctions");
    expect(Array.isArray(data.auctions)).toBeTruthy();
  });
});

test.describe("Protected API Endpoints (Unauthenticated)", () => {
  test("watchlist GET requires auth", async ({ request }) => {
    const response = await request.get("/api/v1/watchlist");
    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  test("watchlist POST requires auth", async ({ request }) => {
    const response = await request.post("/api/v1/watchlist", {
      data: { projectSlug: "test-project" },
    });
    expect(response.status()).toBe(401);
  });

  test("portfolio GET requires auth", async ({ request }) => {
    const response = await request.get("/api/v1/portfolio");
    expect(response.status()).toBe(401);
  });

  test("portfolio holdings POST requires auth", async ({ request }) => {
    const response = await request.post("/api/v1/portfolio/holdings", {
      data: { projectSlug: "test-project" },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("API Error Handling", () => {
  test("invalid project slug returns 404", async ({ request }) => {
    const response = await request.get("/api/v1/projects/non-existent-project-slug-12345");
    expect(response.status()).toBe(404);
  });

  test("invalid developer slug returns 404", async ({ request }) => {
    const response = await request.get("/api/v1/developers/non-existent-developer-12345");
    expect(response.status()).toBe(404);
  });
});
