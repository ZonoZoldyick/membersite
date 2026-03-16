"use client";

import {
  getRolePermissions,
  normalizeRole,
  type AppRole,
  type RolePermission,
} from "./permissions";
import {
  canApproveMembers,
  canManageRoles,
  canManageUsers,
  hasBasicAccess,
  isAdmin,
  isLeader,
  isMember,
} from "./guards";

type UseRoleOptions = {
  role?: string | null;
};

type UseRoleResult = {
  canApproveMembers: boolean;
  canManageRoles: boolean;
  canManageUsers: boolean;
  hasBasicAccess: boolean;
  hasPermission: (permission: RolePermission) => boolean;
  isAdmin: boolean;
  isLeader: boolean;
  isMember: boolean;
  permissions: RolePermission[];
  role: AppRole | null;
};

export function useRole({ role }: UseRoleOptions): UseRoleResult {
  const normalizedRole = normalizeRole(role);
  const permissions = getRolePermissions(role);

  return {
    canApproveMembers: canApproveMembers({ role }),
    canManageRoles: canManageRoles({ role }),
    canManageUsers: canManageUsers({ role }),
    hasBasicAccess: hasBasicAccess({ role }),
    hasPermission: (permission: RolePermission) => permissions.includes(permission),
    isAdmin: isAdmin(role),
    isLeader: isLeader(role),
    isMember: isMember(role),
    permissions,
    role: normalizedRole,
  };
}
