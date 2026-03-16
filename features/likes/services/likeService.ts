import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";
import type { Like, LikeEntityType } from "../types/like";

const currentProfileId = "current-user";
const currentProfileName = "Current Member";

const mockLikes: Like[] = [
  {
    created_at: "Earlier",
    entity_id: "post-1",
    entity_type: "post",
    id: "like-1",
    profile_id: "member-11",
  },
  {
    created_at: "Earlier",
    entity_id: "post-1",
    entity_type: "post",
    id: "like-2",
    profile_id: "member-12",
  },
  {
    created_at: "Earlier",
    entity_id: "comment-1",
    entity_type: "comment",
    id: "like-3",
    profile_id: "member-13",
  },
];

function matchLike(entityType: LikeEntityType, entityId: string) {
  return (like: Like) =>
    like.entity_type === entityType && like.entity_id === entityId;
}

export const likeService = {
  async getLikesCount(entityType: LikeEntityType, entityId: string) {
    return Promise.resolve(
      mockLikes.filter(matchLike(entityType, entityId)).length,
    );
  },

  async hasLiked(entityType: LikeEntityType, entityId: string) {
    return Promise.resolve(
      mockLikes.some(
        (like) =>
          like.profile_id === currentProfileId &&
          like.entity_type === entityType &&
          like.entity_id === entityId,
      ),
    );
  },

  async likeEntity(entityType: LikeEntityType, entityId: string) {
    const existingLike = mockLikes.find(
      (like) =>
        like.profile_id === currentProfileId &&
        like.entity_type === entityType &&
        like.entity_id === entityId,
    );

    if (existingLike) {
      return Promise.resolve(existingLike);
    }

    const like = {
      created_at: "Just now",
      entity_id: entityId,
      entity_type: entityType,
      id: `like-${Date.now()}`,
      profile_id: currentProfileId,
    } satisfies Like;

    mockLikes.unshift(like);

    await activityService.createActivity({
      actor_id: currentProfileId,
      actor_name: currentProfileName,
      entity_id: like.id,
      entity_type: "like",
      metadata: {
        title: `liked a ${entityType}`,
      },
      type: ACTIVITY_TYPES.like_created,
    });

    return Promise.resolve(like);
  },

  async unlikeEntity(entityType: LikeEntityType, entityId: string) {
    const likeIndex = mockLikes.findIndex(
      (like) =>
        like.profile_id === currentProfileId &&
        like.entity_type === entityType &&
        like.entity_id === entityId,
    );

    if (likeIndex >= 0) {
      mockLikes.splice(likeIndex, 1);
    }

    return Promise.resolve();
  },
};

