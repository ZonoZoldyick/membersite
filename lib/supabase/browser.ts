"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import { getSupabaseConfig } from "./config";

export function createClient() {
  const { supabaseAnonKey, supabaseUrl } = getSupabaseConfig();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
