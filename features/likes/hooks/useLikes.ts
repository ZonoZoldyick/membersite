"use client";

import { useEffect, useState } from "react";
import { likeService } from "../services/likeService";
import type { LikeEntityType } from "../types/like";

type UseLikesOptions = {
  entityId: string;
  entityType: LikeEntityType;
  initialCount?: number;
};

type UseLikesResult = {
  likedByUser: boolean;
  likesCount: number;
  loading: boolean;
  toggleLike: () => Promise<void>;
};

export function useLikes({
  entityId,
  entityType,
  initialCount = 0,
}: UseLikesOptions): UseLikesResult {
  const [likesCount, setLikesCount] = useState(initialCount);
  const [likedByUser, setLikedByUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLikes() {
      try {
        const [count, liked] = await Promise.all([
          likeService.getLikesCount(entityType, entityId),
          likeService.hasLiked(entityType, entityId),
        ]);

        if (!isMounted) {
          return;
        }

        setLikesCount(count || initialCount);
        setLikedByUser(liked);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadLikes();

    return () => {
      isMounted = false;
    };
  }, [entityId, entityType, initialCount]);

  async function toggleLike() {
    if (likedByUser) {
      await likeService.unlikeEntity(entityType, entityId);
      setLikedByUser(false);
      setLikesCount((count) => Math.max(0, count - 1));
      return;
    }

    await likeService.likeEntity(entityType, entityId);
    setLikedByUser(true);
    setLikesCount((count) => count + 1);
  }

  return {
    likedByUser,
    likesCount,
    loading,
    toggleLike,
  };
}

