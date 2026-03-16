import {
  getMembershipTierPermissions,
  getRolePermissions,
  normalizeMembershipTier,
  normalizeRole,
  type MembershipTier,
  type MembershipTierPermission,
  type RolePermission,
} from "./permissions";

type AccessSubject = {
  membershipTier?: string | null;
  role?: string | null;
};

export function hasRolePermission(
  role: string | null | undefined,
  permission: RolePermission,
) {
  return getRolePermissions(role).includes(permission);
}

export function hasMembershipTierPermission(
  membershipTier: string | null | undefined,
  permission: MembershipTierPermission,
) {
  return getMembershipTierPermissions(membershipTier).includes(permission);
}

export function isAdmin(role: string | null | undefined) {
  return normalizeRole(role) === "system_admin";
}

export function isLeader(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "team_leader" || normalizedRole === "system_admin";
}

export function isMember(role: string | null | undefined) {
  return normalizeRole(role) === "member";
}

export function canManageUsers(subject: AccessSubject) {
  return isAdmin(subject.role);
}

export function canApproveMembers(subject: AccessSubject) {
  return hasRolePermission(subject.role, "approve_members");
}

export function canManageRoles(subject: AccessSubject) {
  return hasRolePermission(subject.role, "manage_roles");
}

export function hasBasicAccess(subject: AccessSubject) {
  return hasRolePermission(subject.role, "basic_access") || isLeader(subject.role);
}

export function canAccessBasicLearning(
  membershipTier: string | null | undefined,
) {
  return normalizeMembershipTier(membershipTier) !== null;
}

export function canAccessPremiumLearning(
  membershipTier: string | null | undefined,
) {
  const normalizedTier = normalizeMembershipTier(membershipTier);
  return normalizedTier === "gold" || normalizedTier === "platinum";
}

export function canAccessAllLearning(
  membershipTier: string | null | undefined,
) {
  return normalizeMembershipTier(membershipTier) === "platinum";
}

export function hasRequiredMembershipTier(
  currentTier: string | null | undefined,
  requiredTier: MembershipTier,
) {
  const rank: Record<MembershipTier, number> = {
    normal: 1,
    gold: 2,
    platinum: 3,
  };

  const normalizedTier = normalizeMembershipTier(currentTier);

  if (!normalizedTier) {
    return false;
  }

  return rank[normalizedTier] >= rank[requiredTier];
}

