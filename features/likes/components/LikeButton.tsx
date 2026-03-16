"use client";

import { Button } from "@/components/ui/Button";
import { useLikes } from "../hooks/useLikes";
import type { LikeEntityType } from "../types/like";

type LikeButtonProps = {
  ariaLabel: string;
  entityId: string;
  entityType: LikeEntityType;
  initialCount?: number;
};

export function LikeButton({
  ariaLabel,
  entityId,
  entityType,
  initialCount = 0,
}: LikeButtonProps) {
  const { likedByUser, likesCount, loading, toggleLike } = useLikes({
    entityId,
    entityType,
    initialCount,
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={ariaLabel}
      aria-pressed={likedByUser}
      disabled={loading}
      onClick={() => {
        void toggleLike();
      }}
      className={likedByUser ? "text-[var(--primary)]" : ""}
    >
      {likedByUser ? "❤️" : "♡"} {likesCount}
    </Button>
  );
}

