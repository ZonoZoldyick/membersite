import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  email: string | null;
  id: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    email: user.email ?? null,
    id: user.id,
  };
}

