import { createAdminClient } from "./auth-admin";
import { defaultTestUsers } from "./test-users";

export async function cleanupE2EContent() {
  const supabase = createAdminClient();
  const testEmails = defaultTestUsers.map((user) => user.email);

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id")
    .in("email", testEmails);

  if (error) {
    throw new Error(`Failed to load test profiles: ${error.message}`);
  }

  const profileIds = (profiles ?? []).map((profile) => profile.id);

  if (profileIds.length === 0) {
    return;
  }

  await supabase.from("comments").delete().in("profile_id", profileIds);
  await supabase.from("posts").delete().in("profile_id", profileIds);
  await supabase.from("products").delete().in("profile_id", profileIds);
  await supabase.from("event_participants").delete().in("profile_id", profileIds);
  await supabase.from("events").delete().in("profile_id", profileIds);
  await supabase.from("activities").delete().in("actor_id", profileIds);
}
