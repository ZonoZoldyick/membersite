export type LikeEntityType = "comment" | "post" | "product";

export type Like = {
  created_at: string;
  entity_id: string;
  entity_type: LikeEntityType;
  id: string;
  profile_id: string;
};

