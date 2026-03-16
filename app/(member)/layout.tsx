import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { MemberSidebar } from "@/components/layout/MemberSidebar";
import { MemberTopbar } from "@/components/layout/MemberTopbar";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getProfile } from "@/lib/auth/getProfile";
import { createClient } from "@/lib/supabase/server";

type MemberLayoutProps = {
  children: ReactNode;
};

export default async function MemberLayout({ children }: MemberLayoutProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const profile = await getProfile(currentUser.id);

  if (!profile || profile.status !== "active") {
    redirect("/pending");
  }

  const supabase = await createClient();
  const { data: profileDetails } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", currentUser.id)
    .maybeSingle<{ display_name: string }>();

  const displayName = profileDetails?.display_name ?? currentUser.email ?? "Member";

  return (
    <div className="min-h-screen md:flex">
      <MemberSidebar role={profile.role} />
      <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <MemberTopbar displayName={displayName} email={currentUser.email} />
        <main>{children}</main>
      </div>
    </div>
  );
}
