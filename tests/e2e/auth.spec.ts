import { expect, test, type Page } from "@playwright/test";
import { cleanupE2EContent } from "../support/test-data";
import {
  defaultTestUsers,
  deleteTestUserByEmail,
  ensureDefaultTestUsers,
} from "../support/test-users";

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

test.beforeAll(async () => {
  await ensureDefaultTestUsers();
  await cleanupE2EContent();
});

test("redirects unauthenticated users from dashboard to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

test("allows an active admin user to log in and access approvals", async ({ page }) => {
  const adminUser = defaultTestUsers.find((user) => user.role === "system_admin");

  if (!adminUser) {
    throw new Error("Missing admin test user");
  }

  await login(page, adminUser.email, adminUser.password);
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/members/approvals");
  await expect(page).toHaveURL(/\/members\/approvals/);
  await expect(page.getByText("Pending Members")).toBeVisible();
});

test("blocks a normal member from approvals", async ({ page }) => {
  const memberUser = defaultTestUsers.find((user) => user.email === "member_e2e@membersite.local");

  if (!memberUser) {
    throw new Error("Missing member test user");
  }

  await login(page, memberUser.email, memberUser.password);
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/members/approvals");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("redirects pending users to pending page after login", async ({ page }) => {
  const pendingUser = defaultTestUsers.find((user) => user.status === "pending");

  if (!pendingUser) {
    throw new Error("Missing pending test user");
  }

  await login(page, pendingUser.email, pendingUser.password);
  await expect(page).toHaveURL(/\/pending\?status=pending/);
  await expect(page.getByText("Account pending approval")).toBeVisible();
});

test("redirects suspended users to suspended pending page", async ({ page }) => {
  const suspendedUser = defaultTestUsers.find((user) => user.status === "suspended");

  if (!suspendedUser) {
    throw new Error("Missing suspended test user");
  }

  await login(page, suspendedUser.email, suspendedUser.password);
  await expect(page).toHaveURL(/\/pending\?status=suspended/);
  await expect(page.getByText("Account suspended")).toBeVisible();
});

test("allows a new user to sign up and land on pending", async ({ page }) => {
  const timestamp = Date.now();
  const email = `signup_e2e_${timestamp}@membersite.local`;
  const password = "Membersite123!";

  await page.goto("/signup");
  await page.getByLabel("Display name").fill("Signup E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page).toHaveURL(/\/pending\?status=pending/);
  await expect(page.getByText("Account pending approval")).toBeVisible();

  await deleteTestUserByEmail(email);
});
