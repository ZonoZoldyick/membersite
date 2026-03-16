import type { CommunityAuthor } from "./post";

export type Comment = {
  author: CommunityAuthor;
  content: string;
  created_at: string;
  id: string;
  likes_count?: number;
  post_id: string;
  replies?: Comment[];
};
