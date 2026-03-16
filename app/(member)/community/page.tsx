import { PageIntro } from "@/components/layout/PageIntro";
import { CommunityTimeline } from "@/features/community/components/CommunityTimeline";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function CommunityPage() {
  const currentUser = await getCurrentUser();

  return (
    <div>
      <PageIntro
        title="Community"
        description="The main community timeline for conversations, updates, and discussion that keep members engaged."
      />
      <CommunityTimeline currentUserName={currentUser?.email ?? "Member"} />
    </div>
  );
}
