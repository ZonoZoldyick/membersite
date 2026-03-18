import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getProfile } from "@/lib/auth/getProfile";
import { createClient } from "@/lib/supabase/server";

type ProfileDetails = {
  avatar_url: string | null;
  bio: string | null;
  display_name: string;
  email: string;
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const authProfile = await getProfile(currentUser.id);
  const supabase = await createClient();

  const [{ data: profileDetails }, { data: products }, { data: events }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, email, bio, avatar_url")
        .eq("id", currentUser.id)
        .maybeSingle<ProfileDetails>(),
      supabase
        .from("products")
        .select("id, title, created_at")
        .eq("profile_id", currentUser.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("events")
        .select("id, title, event_date")
        .eq("profile_id", currentUser.id)
        .is("deleted_at", null)
        .order("event_date", { ascending: true })
        .limit(5),
    ]);

  return (
    <div>
      <PageIntro
        title="Profile"
        description="Manage your personal information, products, and event activity from one place."
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card
          title="Profile Information"
          description="Core member details and account status."
        >
          <div className="space-y-4 text-sm text-[var(--muted)]">
            <div className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
              <p className="font-medium text-[var(--foreground)]">
                {profileDetails?.display_name ?? "Member"}
              </p>
              <p className="mt-1">{profileDetails?.email ?? currentUser.email}</p>
            </div>
            <div className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
              <p className="font-medium text-[var(--foreground)]">Role</p>
              <p className="mt-1">{authProfile?.role ?? "Unknown"}</p>
            </div>
            <div className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
              <p className="font-medium text-[var(--foreground)]">Membership Tier</p>
              <p className="mt-1">{authProfile?.membership_tier ?? "Unknown"}</p>
            </div>
            <div className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
              <p className="font-medium text-[var(--foreground)]">Bio</p>
              <p className="mt-1">
                {profileDetails?.bio ?? "You have not added a bio yet."}
              </p>
            </div>
          </div>
        </Card>
        <div className="grid gap-6">
          <Card title="Products" description="Your submitted product items.">
            {products && products.length > 0 ? (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
                    <p className="font-medium text-[var(--foreground)]">{product.title}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {new Date(product.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No products connected yet.</p>
            )}
          </Card>
          <Card title="Events" description="Your upcoming events and participation history.">
            {events && events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
                    <p className="font-medium text-[var(--foreground)]">{event.title}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {new Date(event.event_date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No events connected yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
