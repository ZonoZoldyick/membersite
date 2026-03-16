"use client";

import {
  getMembershipTierPermissions,
  normalizeMembershipTier,
  type MembershipTier,
  type MembershipTierPermission,
} from "./permissions";
import {
  canAccessAllLearning,
  canAccessBasicLearning,
  canAccessPremiumLearning,
  hasRequiredMembershipTier,
} from "./guards";

type UseMembershipTierOptions = {
  membershipTier?: string | null;
};

type UseMembershipTierResult = {
  canAccessAllLearning: boolean;
  canAccessBasicLearning: boolean;
  canAccessPremiumLearning: boolean;
  hasPermission: (permission: MembershipTierPermission) => boolean;
  hasRequiredTier: (requiredTier: MembershipTier) => boolean;
  membershipTier: MembershipTier | null;
  permissions: MembershipTierPermission[];
};

export function useMembershipTier({
  membershipTier,
}: UseMembershipTierOptions): UseMembershipTierResult {
  const normalizedMembershipTier = normalizeMembershipTier(membershipTier);
  const permissions = getMembershipTierPermissions(membershipTier);

  return {
    canAccessAllLearning: canAccessAllLearning(membershipTier),
    canAccessBasicLearning: canAccessBasicLearning(membershipTier),
    canAccessPremiumLearning: canAccessPremiumLearning(membershipTier),
    hasPermission: (permission: MembershipTierPermission) =>
      permissions.includes(permission),
    hasRequiredTier: (requiredTier: MembershipTier) =>
      hasRequiredMembershipTier(membershipTier, requiredTier),
    membershipTier: normalizedMembershipTier,
    permissions,
  };
}
