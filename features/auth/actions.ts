"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error: string;
  success: string;
};

async function getDefaultRoleId() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "member_normal")
    .single();

  if (error) {
    throw new Error("Failed to load default role");
  }

  return data.id as number;
}

async function getDefaultMembershipTierId() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("membership_tiers")
    .select("id")
    .eq("name", "normal")
    .single();

  if (error) {
    throw new Error("Failed to load default membership tier");
  }

  return data.id as number;
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, success: "" };
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "");

  const supabase = await createClient();
  const roleId = await getDefaultRoleId();
  const membershipTierId = await getDefaultMembershipTierId();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { error: error.message, success: "" };
  }

  if (data.user && data.session) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      display_name: displayName,
      role_id: roleId,
      membership_tier_id: membershipTierId,
      status: "pending",
    });

    if (profileError) {
      return { error: profileError.message, success: "" };
    }
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  _prevState: AuthActionState,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message, success: "" };
  }

  return { error: "", success: "Password reset email sent." };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData,
) {
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message, success: "" };
  }

  redirect("/dashboard");
}
