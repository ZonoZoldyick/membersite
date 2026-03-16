import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";

export type ProductRecord = {
  author_id: string;
  author_name: string;
  created_at: string;
  id: string;
  title: string;
};

const mockProducts: ProductRecord[] = [];

export const productService = {
  async createProduct(input: {
    authorName?: string;
    title: string;
  }) {
    const product = {
      author_id: "current-user",
      author_name: input.authorName ?? "Current Member",
      created_at: "Just now",
      id: `product-${Date.now()}`,
      title: input.title,
    } satisfies ProductRecord;

    mockProducts.unshift(product);

    await activityService.createActivity({
      actor_id: product.author_id,
      actor_name: product.author_name,
      entity_id: product.id,
      entity_type: "product",
      metadata: {
        title: `created a new product: ${product.title}`,
      },
      type: ACTIVITY_TYPES.product_created,
    });

    return Promise.resolve(product);
  },

  async getProducts() {
    return Promise.resolve([...mockProducts]);
  },
};

