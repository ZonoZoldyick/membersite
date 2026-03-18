import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { hasBasicAccess, isAdmin, isLeader } from "@/lib/rbac/guards";
import { getSupabaseConfig } from "@/lib/supabase/config";

const protectedRoutes = [
  "/dashboard",
  "/community",
  "/products",
  "/events",
  "/learning",
  "/members",
  "/profile",
] as const;

const adminOnlyRoutes = [
  "/dashboard/admin",
  "/members/admin",
  "/settings/admin",
] as const;

const leaderRoutes = [
  "/dashboard/approvals",
  "/members/approvals",
  "/members/review",
] as const;

type MiddlewareProfile = {
  membership_tiers: { name: string } | { name: string }[] | null;
  roles: { name: string } | { name: string }[] | null;
  status: string;
};

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

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

export async function middleware(request: NextRequest) {
  const { supabaseAnonKey, supabaseUrl } = getSupabaseConfig();
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const isProtected = matchesRoute(pathname, protectedRoutes);
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", pathname);

      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  if (isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("status, roles(name), membership_tiers(name)")
    .eq("id", user.id)
    .maybeSingle<MiddlewareProfile>();

  if (error) {
    throw error;
  }

  if (!profile && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/pending";
    redirectUrl.searchParams.set("status", "missing_profile");

    return NextResponse.redirect(redirectUrl);
  }

  if (!profile) {
    return response;
  }

  if (profile.status !== "active" && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/pending";
    redirectUrl.searchParams.set("status", profile.status);

    return NextResponse.redirect(redirectUrl);
  }

  const role = getRelationName(profile.roles);
  const membershipTier = getRelationName(profile.membership_tiers);

  if (!role || !membershipTier) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/pending";
    redirectUrl.searchParams.set("status", "missing_rbac");

    return NextResponse.redirect(redirectUrl);
  }

  if (matchesRoute(pathname, adminOnlyRoutes) && !isAdmin(role)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  if (matchesRoute(pathname, leaderRoutes) && !isLeader(role)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  if (isProtected && !hasBasicAccess({ membershipTier, role })) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/community/:path*",
    "/products/:path*",
    "/events/:path*",
    "/learning/:path*",
    "/members/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};
