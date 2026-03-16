export type PostType = "post" | "announcement" | "knowledge" | "question";

export type Post = {
  id: string;
  profileId: string;
  type: PostType;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Comment = {
  id: string;
  postId: string;
  profileId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
