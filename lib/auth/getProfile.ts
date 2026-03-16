import { createClient } from "@/lib/supabase/server";

export type AuthProfile = {
  membership_tier: string;
  profile_id: string;
  role: string;
  status: string;
};

type ProfileRow = {
  id: string;
  membership_tiers: { name: string } | { name: string }[] | null;
  roles: { name: string } | { name: string }[] | null;
  status: string;
};

function getRelationName(
  relation: { name: string } | { name: string }[] | null,
): string | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0]?.name ?? null;
  }

  return relation.name;
}

export async function getProfile(
  authUserId: string,
): Promise<AuthProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, status, roles(name), membership_tiers(name)")
    .eq("id", authUserId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw new Error("Failed to load authenticated profile");
  }

  if (!data) {
    return null;
  }

  const role = getRelationName(data.roles);
  const membershipTier = getRelationName(data.membership_tiers);

  if (!role || !membershipTier) {
    throw new Error("Authenticated profile is missing RBAC relations");
  }

  return {
    membership_tier: membershipTier,
    profile_id: data.id,
    role,
    status: data.status,
  };
}
