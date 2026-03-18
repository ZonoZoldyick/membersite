"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getProfile } from "@/lib/auth/getProfile";
import { canApproveMembers } from "@/lib/rbac/guards";
import { createClient } from "@/lib/supabase/server";

export type MemberApprovalState = {
  error: string;
  success: string;
};

export async function approveMember(
  _prevState: MemberApprovalState,
  formData: FormData,
): Promise<MemberApprovalState> {
  const profileId = String(formData.get("profileId") ?? "");

  if (!profileId) {
    return { error: "Missing profile id.", success: "" };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: "Not authenticated.", success: "" };
  }

  const currentProfile = await getProfile(currentUser.id);

  if (!currentProfile || !canApproveMembers({ role: currentProfile.role })) {
    return { error: "You do not have permission to approve members.", success: "" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", profileId)
    .eq("status", "pending");

  if (error) {
    return { error: error.message, success: "" };
  }

  revalidatePath("/members/approvals");
  revalidatePath("/members");

  return { error: "", success: "Member approved." };
}
