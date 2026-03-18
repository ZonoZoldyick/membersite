import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

function getSafeRedirectPath(redirectTo: string | undefined) {
  if (!redirectTo || !redirectTo.startsWith("/")) {
    return "/dashboard";
  }

  return redirectTo;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") ?? ""));
  const { supabaseAnonKey, supabaseUrl } = getSupabaseConfig();
  const successUrl = new URL(redirectTo, request.url);

  const response = NextResponse.redirect(successUrl, {
    status: 303,
  });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", error.message);

    if (redirectTo !== "/dashboard") {
      loginUrl.searchParams.set("redirectedFrom", redirectTo);
    }

    return NextResponse.redirect(loginUrl, {
      status: 303,
    });
  }

  return response;
}
