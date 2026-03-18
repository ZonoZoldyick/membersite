import { redirect } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { ApproveMemberButton } from "@/features/members/components/ApproveMemberButton";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getProfile } from "@/lib/auth/getProfile";
import { canApproveMembers } from "@/lib/rbac/guards";
import { createClient } from "@/lib/supabase/server";

type PendingProfileRow = {
  created_at: string;
  display_name: string;
  email: string;
  id: string;
  membership_tiers: { name: string } | { name: string }[] | null;
  roles: { name: string } | { name: string }[] | null;
  status: string;
};

function getRelationName(
  relation: { name: string } | { name: string }[] | null,
) {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0]?.name ?? null;
  }

  return relation.name;
}

export default async function MemberApprovalsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const currentProfile = await getProfile(currentUser.id);

  if (!currentProfile || !canApproveMembers({ role: currentProfile.role })) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: pendingProfiles, error } = await supabase
    .from("profiles")
    .select("id, display_name, email, status, created_at, roles(name), membership_tiers(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .returns<PendingProfileRow[]>();

  return (
    <div>
      <PageIntro
        title="Member Approvals"
        description="Review pending signups and activate members who should access the community."
      />

      <Card
        title="Pending Members"
        description="Only team leaders and system administrators can approve new members."
      >
        {error ? (
          <p className="text-sm text-rose-600">{error.message}</p>
        ) : pendingProfiles && pendingProfiles.length > 0 ? (
          <div className="space-y-4">
            {pendingProfiles.map((profile) => {
              const roleName = getRelationName(profile.roles) ?? "member_normal";
              const tierName =
                getRelationName(profile.membership_tiers) ?? "normal";

              return (
                <div
                  key={profile.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-[var(--foreground)]">
                        {profile.display_name}
                      </p>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        {profile.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{profile.email}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                      <span>Role: {roleName}</span>
                      <span>Tier: {tierName}</span>
                      <span>Joined: {new Date(profile.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <ApproveMemberButton profileId={profile.id} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">No pending members right now</p>
        )}
      </Card>
    </div>
  );
}
