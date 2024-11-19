import { test, expect } from "@playwright/test";

test("clicking the tab opens the drawer", async ({ page }) => {
  await page.goto("http://localhost:3000/time");
  await page
    .getByRole("button", { name: "Open Magic Search", includeHidden: false })
    .click();
  await expect(
    page.getByText("I can help you find what you're looking for"),
  ).toBeVisible();
  await page.getByRole("button").first().click();
  await expect(
    page.getByText("I can help you find what you're looking for"),
  ).toBeHidden();
});

test("drawer has a search bar that we can use", async ({ page }) => {
  await page.goto("http://localhost:3000/time");
  await page
    .getByRole("button", { name: "Open Magic Search", includeHidden: false })
    .click();
  await page.getByRole("search", { includeHidden: false }).click();
  await page.getByRole("search", { includeHidden: false }).fill("Pie");
  await page.getByRole("search", { includeHidden: false }).press("Enter");
  await expect(page.getByText("Pie", { exact: true })).toBeVisible();
});

test("see more results button works", async ({ page }) => {
  await page.goto("http://localhost:3000/bgr");
  await page
    .getByRole("button", { name: "Open Magic Search", includeHidden: false })
    .click();
  await page.getByRole("search", { includeHidden: false }).click();
  await page.getByRole("search", { includeHidden: false }).fill("pie");
  await page.getByRole("search", { includeHidden: false }).press("Enter");
  await expect(
    page.getByRole("heading", { name: "pie", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "SEE MORE RESULTS" }).click();
  await expect(page.getByText("TOP RESULTS")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Navigate forward" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Navigate backward" }).click();
  await expect(
    page.getByText("I can help you find what you're looking for"),
  ).toBeVisible();
});

test("execute multiple searches", async ({ page }) => {
  await page.goto("http://localhost:3000/bgr");
  await page
    .getByRole("button", { name: "Open Magic Search", includeHidden: false })
    .click();
  await page.getByRole("search", { includeHidden: false }).click();
  await page.getByRole("search", { includeHidden: false }).fill("pie");
  await page.getByRole("search", { includeHidden: false }).press("Enter");
  await expect(
    page.getByRole("heading", { name: "pie", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "SEE MORE RESULTS" }).click();
  await expect(page.getByText("TOP RESULTS")).toBeVisible();
  await page.getByRole("search", { includeHidden: false }).click();
  await page.getByRole("search", { includeHidden: false }).fill("more pie");
  await page.getByRole("search", { includeHidden: false }).press("Enter");
  await expect(
    page.getByRole("heading", { name: "more pie", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Navigate forward" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Navigate backward" }).click();
  await expect(page.getByText("pie", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Navigate forward" }).click();
  await expect(page.getByText("more pie", { exact: true })).toBeVisible();
});
