export const ACTIVITY_TYPES = {
  comment_created: "comment_created",
  event_created: "event_created",
  event_joined: "event_joined",
  like_created: "like_created",
  post_created: "post_created",
  product_created: "product_created",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export type Activity = {
  actor: {
    avatar_url?: string | null;
    id: string;
    name: string;
  };
  actor_id: string;
  created_at: string;
  entity_id: string;
  entity_type: string;
  id: string;
  metadata: Record<string, string>;
  type: ActivityType;
};
