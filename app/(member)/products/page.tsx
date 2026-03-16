"use client";

import { useState } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function ProductsPage() {
  const [title, setTitle] = useState("");
  const { createProduct, isCreating, products } = useProducts();

  async function handleCreateProduct() {
    const product = await createProduct(title);

    if (!product) {
      return;
    }

    setTitle("");
  }

  return (
    <div>
      <PageIntro
        title="Products"
        description="Browse products introduced by members in a clean card-based catalog."
      />
      <Card
        title="Create Product"
        description="Add a new product to the member catalog. This currently uses mocked data."
        className="mb-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Product title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Button
            disabled={!title.trim() || isCreating}
            onClick={() => void handleCreateProduct()}
          >
            {isCreating ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="h-full">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              {product.author_name}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--foreground)]">
              {product.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Mock product entry prepared for the upcoming repository connection.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-base font-semibold text-[var(--foreground)]">
                {product.created_at}
              </span>
              <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                View
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
