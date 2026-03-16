export const ROLE_PERMISSIONS = {
  system_admin: ["manage_users", "approve_members", "manage_roles"],
  team_leader: ["approve_members"],
  member: ["basic_access"],
} as const;

export const MEMBERSHIP_TIER_PERMISSIONS = {
  normal: ["basic_learning"],
  gold: ["premium_learning"],
  platinum: ["all_learning"],
} as const;

export type AppRole = keyof typeof ROLE_PERMISSIONS;
export type RolePermission = (typeof ROLE_PERMISSIONS)[AppRole][number];

export type MembershipTier = keyof typeof MEMBERSHIP_TIER_PERMISSIONS;
export type MembershipTierPermission =
  (typeof MEMBERSHIP_TIER_PERMISSIONS)[MembershipTier][number];

const LEGACY_ROLE_TO_APP_ROLE = {
  member_normal: "member",
  member_gold: "member",
  member_platinum: "member",
  system_admin: "system_admin",
  team_leader: "team_leader",
  member: "member",
} as const;

export type SupportedRoleInput = keyof typeof LEGACY_ROLE_TO_APP_ROLE;

export function normalizeRole(role: string | null | undefined): AppRole | null {
  if (!role) {
    return null;
  }

  if (role in LEGACY_ROLE_TO_APP_ROLE) {
    return LEGACY_ROLE_TO_APP_ROLE[role as SupportedRoleInput];
  }

  return null;
}

export function normalizeMembershipTier(
  membershipTier: string | null | undefined,
): MembershipTier | null {
  if (!membershipTier) {
    return null;
  }

  if (membershipTier === "normal" || membershipTier === "gold" || membershipTier === "platinum") {
    return membershipTier;
  }

  return null;
}

export function getRolePermissions(role: string | null | undefined): RolePermission[] {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return [];
  }

  return [...ROLE_PERMISSIONS[normalizedRole]];
}

export function getMembershipTierPermissions(
  membershipTier: string | null | undefined,
): MembershipTierPermission[] {
  const normalizedMembershipTier = normalizeMembershipTier(membershipTier);

  if (!normalizedMembershipTier) {
    return [];
  }

  return [...MEMBERSHIP_TIER_PERMISSIONS[normalizedMembershipTier]];
}

