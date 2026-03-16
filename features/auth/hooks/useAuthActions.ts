"use client";

import { createClient } from "@/lib/supabase/browser";

export function useAuthActions() {
  const supabase = createClient();

  return {
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
  };
}

