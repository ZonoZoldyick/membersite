import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";

export type ProductRecord = {
  created_at: string;
  description: string;
  id: string;
  profile_id: string;
  title: string;
};

const mockProducts: ProductRecord[] = [];

export const productService = {
  async createProduct(input: {
    description?: string;
    title: string;
  }) {
    const product = {
      created_at: new Date().toISOString(),
      description: input.description ?? "",
      id: `product-${Date.now()}`,
      profile_id: "current-user",
      title: input.title,
    } satisfies ProductRecord;

    mockProducts.unshift(product);

    await activityService.createActivity({
      actor_id: product.profile_id,
      actor_name: "Current Member",
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
