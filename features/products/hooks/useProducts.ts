"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { Tables, TablesInsert } from "@/types/supabase";

export type ProductRecord = Pick<
  Tables<"products">,
  "created_at" | "description" | "id" | "profile_id" | "title"
>;

type UseProductsResult = {
  createError: string | null;
  createProduct: (title: string, description: string) => Promise<ProductRecord | null>;
  error: string | null;
  isCreating: boolean;
  isLoading: boolean;
  loadError: string | null;
  products: ProductRecord[];
};

export function useProducts(): UseProductsResult {
  const isMountedRef = useRef(true);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    async function loadProducts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("id, title, description, profile_id, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (!isMountedRef.current) {
        return;
      }

      if (error) {
        setLoadError(error.message);
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setProducts(data ?? []);
      setLoadError(null);
      setIsLoading(false);
    }

    void loadProducts();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  async function createProduct(title: string, description: string) {
    setIsCreating(true);
    setCreateError(null);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(profileError.message);
      }

      if (!profile) {
        throw new Error("Profile not found");
      }

      const insertPayload: TablesInsert<"products"> = {
        description,
        profile_id: user.id,
        title,
      };

      const { data, error } = await supabase
        .from("products")
        .insert(insertPayload)
        .select("id, title, description, profile_id, created_at")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from insert");
      }

      const product: ProductRecord = data;

      if (isMountedRef.current) {
        setProducts((current) =>
          [product, ...current].sort(
            (left, right) =>
              new Date(right.created_at).getTime() -
              new Date(left.created_at).getTime(),
          ),
        );
      }

      return product;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create product.";

      if (isMountedRef.current) {
        setCreateError(message);
      }

      return null;
    } finally {
      if (isMountedRef.current) {
        setIsCreating(false);
      }
    }
  }

  return {
    createError,
    createProduct,
    error: loadError ?? createError,
    isCreating,
    isLoading,
    loadError,
    products,
  };
}
