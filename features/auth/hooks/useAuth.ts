"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser";

type AuthState = {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    session: null,
    user: null,
  });

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getSession().then(({ data }) => {
      setAuthState({
        isLoading: false,
        session: data.session,
        user: data.session?.user ?? null,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        isLoading: false,
        session,
        user: session?.user ?? null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
}

