import { expect, test, type Page } from "@playwright/test";
import { cleanupE2EContent } from "../support/test-data";
import { defaultTestUsers, ensureDefaultTestUsers } from "../support/test-users";

test.describe.configure({ timeout: 90_000 });

async function loginAsMember(page: Page) {
  const memberUser = defaultTestUsers.find(
    (user) => user.email === "member_e2e@membersite.local",
  );

  if (!memberUser) {
    throw new Error("Missing member test user");
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(memberUser.email);
  await page.getByLabel("Password").fill(memberUser.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 45_000 });
}

test.beforeAll(async () => {
  await ensureDefaultTestUsers();
  await cleanupE2EContent();
});

test("member can create a post and comment in community", async ({ page }) => {
  const stamp = Date.now();
  const postContent = `E2E post ${stamp}`;
  const commentContent = `E2E comment ${stamp}`;

  await loginAsMember(page);
  await page.goto("/community");

  await page.getByRole("button", { name: "What do you want to share?" }).click();
  await page.getByLabel("Create a new community post").fill(postContent);
  await page.getByRole("button", { name: "Post" }).click();

  const postCard = page.locator("div").filter({ hasText: postContent }).first();
  await expect(postCard.getByText(postContent)).toBeVisible();

  await postCard.getByRole("button", { name: /Show comments for post/i }).click();
  await postCard.getByLabel("Write a comment").fill(commentContent);
  await postCard.getByRole("button", { name: "Comment", exact: true }).click();

  await expect(postCard.getByText(commentContent)).toBeVisible();
});

test("member can create a product", async ({ page }) => {
  const stamp = Date.now();
  const title = `E2E Product ${stamp}`;
  const description = `E2E product description ${stamp}`;

  await loginAsMember(page);
  await page.goto("/products");

  await page.getByPlaceholder("Product title").fill(title);
  await page.getByPlaceholder("Short description").fill(description);
  await page.getByRole("button", { name: "Create Product" }).click();

  const productCard = page.locator("div").filter({ hasText: title }).first();
  await expect(productCard.getByText(title)).toBeVisible();
  await expect(productCard.getByText(description)).toBeVisible();
});

test("member can create and join an event", async ({ page }) => {
  const stamp = Date.now();
  const title = `E2E Event ${stamp}`;
  const location = `Tokyo ${stamp}`;

  await loginAsMember(page);
  await page.goto("/events");

  await page.getByPlaceholder("Event title").fill(title);
  await page.getByPlaceholder("Location").fill(location);
  await page.getByRole("button", { name: "Create Event" }).click();

  const eventCard = page.locator("div").filter({ hasText: title }).first();
  await expect(eventCard.getByRole("heading", { name: title })).toBeVisible();
  await expect(eventCard.getByText(location, { exact: true })).toBeVisible();
  await expect(eventCard.getByText("0 joined")).toBeVisible();

  await eventCard.getByRole("button", { name: "Join Event" }).click();
  await expect(eventCard.getByText("1 joined")).toBeVisible();
});
