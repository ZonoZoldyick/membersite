export type Product = {
  id: string;
  profileId: string;
  title: string;
  description: string;
  price: number | null;
  url: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductInput = {
  title: string;
  description: string;
  price?: number | null;
  url?: string | null;
  tags?: string[];
};

