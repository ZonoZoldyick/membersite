import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

type MemberRow = {
  avatar_url: string | null;
  bio: string | null;
  display_name: string;
  id: string;
};

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, display_name, bio, avatar_url")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .returns<MemberRow[]>();

  return (
    <div>
      <PageIntro
        title="Members"
        description="Browse the member directory and discover collaboration opportunities across the community."
      />
      {error ? <p className="mb-6 text-sm text-rose-600">{error.message}</p> : null}
      {members && members.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id}>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">
                {member.display_name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                {member.display_name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {member.bio ?? "This member has not added a bio yet."}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card title="Member Directory" description="Active members will appear here.">
          <p className="text-sm text-[var(--muted)]">No active members yet</p>
        </Card>
      )}
    </div>
  );
}
