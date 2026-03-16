"use client";

import { useState } from "react";
import { productService, type ProductRecord } from "../services/productService";

const initialProducts = [
  {
    author_id: "seed-author-1",
    author_name: "Mika Ito",
    created_at: "Today",
    id: "seed-product-1",
    title: "Workshop Toolkit",
  },
  {
    author_id: "seed-author-2",
    author_name: "Koji Mori",
    created_at: "Today",
    id: "seed-product-2",
    title: "Launch Support Package",
  },
  {
    author_id: "seed-author-3",
    author_name: "Nina Park",
    created_at: "Today",
    id: "seed-product-3",
    title: "Partner Directory Access",
  },
] satisfies ProductRecord[];

export function useProducts() {
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts);
  const [isCreating, setIsCreating] = useState(false);

  async function createProduct(title: string) {
    setIsCreating(true);
    try {
      const product = await productService.createProduct({ title });
      setProducts((current) => [product, ...current]);
      return product;
    } finally {
      setIsCreating(false);
    }
  }

  return { createProduct, isCreating, products };
}
