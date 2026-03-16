export type ProfileStatus = "pending" | "active" | "suspended";

export type RoleName =
  | "system_admin"
  | "team_leader"
  | "member_normal"
  | "member_gold"
  | "member_platinum";

export type MembershipTierName = "normal" | "gold" | "platinum";

export type Role = {
  id: number;
  name: RoleName;
  description: string | null;
  createdAt: string;
};

export type MembershipTier = {
  id: number;
  name: MembershipTierName;
  description: string | null;
  createdAt: string;
};

export type Profile = {
  id: string;
  email: string;
  displayName: string;
  roleId: number;
  membershipTierId: number;
  status: ProfileStatus;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProfileWithAccess = Profile & {
  role: Role;
  membershipTier: MembershipTier;
};

