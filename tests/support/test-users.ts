import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "./auth-admin";

type TestUserRole =
  | "member_normal"
  | "member_gold"
  | "member_platinum"
  | "system_admin"
  | "team_leader";

type TestUserTier = "gold" | "normal" | "platinum";
type TestUserStatus = "active" | "pending" | "suspended";

export type ManagedTestUser = {
  displayName: string;
  email: string;
  membershipTier: TestUserTier;
  password: string;
  role: TestUserRole;
  status: TestUserStatus;
};

export const defaultTestUsers: ManagedTestUser[] = [
  {
    displayName: "Admin E2E",
    email: "admin_e2e@membersite.local",
    membershipTier: "platinum",
    password: "Membersite123!",
    role: "system_admin",
    status: "active",
  },
  {
    displayName: "Leader E2E",
    email: "leader_e2e@membersite.local",
    membershipTier: "gold",
    password: "Membersite123!",
    role: "team_leader",
    status: "active",
  },
  {
    displayName: "Member E2E",
    email: "member_e2e@membersite.local",
    membershipTier: "normal",
    password: "Membersite123!",
    role: "member_normal",
    status: "active",
  },
  {
    displayName: "Pending E2E",
    email: "pending_e2e@membersite.local",
    membershipTier: "normal",
    password: "Membersite123!",
    role: "member_normal",
    status: "pending",
  },
  {
    displayName: "Suspended E2E",
    email: "suspended_e2e@membersite.local",
    membershipTier: "normal",
    password: "Membersite123!",
    role: "member_normal",
    status: "suspended",
  },
];

async function getRoleId(roleName: TestUserRole) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();

  if (error) {
    throw new Error(`Failed to load role id for ${roleName}: ${error.message}`);
  }

  return data.id;
}

async function getMembershipTierId(tierName: TestUserTier) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("membership_tiers")
    .select("id")
    .eq("name", tierName)
    .single();

  if (error) {
    throw new Error(
      `Failed to load membership tier id for ${tierName}: ${error.message}`,
    );
  }

  return data.id;
}

async function findUserByEmail(email: string): Promise<User | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }

  return data.users.find((user) => user.email === email) ?? null;
}

export async function ensureTestUser(testUser: ManagedTestUser) {
  const supabase = createAdminClient();
  const existingUser = await findUserByEmail(testUser.email);
  let userId = existingUser?.id ?? null;

  if (!existingUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: testUser.email,
      email_confirm: true,
      password: testUser.password,
      user_metadata: {
        display_name: testUser.displayName,
      },
    });

    if (error || !data.user) {
      throw new Error(`Failed to create test user: ${error?.message ?? "unknown"}`);
    }

    userId = data.user.id;
  } else {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email_confirm: true,
      password: testUser.password,
      user_metadata: {
        display_name: testUser.displayName,
      },
    });

    if (error) {
      throw new Error(`Failed to update test user: ${error.message}`);
    }
  }

  if (!userId) {
    throw new Error(`Missing user id for ${testUser.email}`);
  }

  const [roleId, membershipTierId] = await Promise.all([
    getRoleId(testUser.role),
    getMembershipTierId(testUser.membershipTier),
  ]);

  const { error: profileError } = await supabase.from("profiles").upsert({
    display_name: testUser.displayName,
    email: testUser.email,
    id: userId,
    membership_tier_id: membershipTierId,
    role_id: roleId,
    status: testUser.status,
  });

  if (profileError) {
    throw new Error(`Failed to upsert test profile: ${profileError.message}`);
  }

  return userId;
}

export async function ensureDefaultTestUsers() {
  for (const user of defaultTestUsers) {
    await ensureTestUser(user);
  }
}

export async function deleteTestUserByEmail(email: string) {
  const supabase = createAdminClient();
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    throw new Error(`Failed to delete test user ${email}: ${error.message}`);
  }
}
