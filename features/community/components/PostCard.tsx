"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LikeButton } from "@/features/likes/components/LikeButton";
import type { Post } from "../types/post";
import { CommentThread } from "./CommentThread";
import { Button } from "@/components/ui/Button";

type PostCardProps = {
  currentUserName?: string;
  post: Post;
};

export function PostCard({ currentUserName, post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-4">
        <Avatar name={post.author.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {post.author.name}
              </p>
              <p className="text-xs text-[var(--muted)]">{post.created_at}</p>
            </div>
            <Badge>Community</Badge>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-7 text-[var(--foreground)]">{post.content}</p>
            {post.link_url ? (
              <a
                href={post.link_url}
                className="inline-flex rounded-2xl bg-[var(--secondary)] px-4 py-3 text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
              >
                {post.link_url}
              </a>
            ) : null}
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-[var(--border)] pt-4">
            <LikeButton
              ariaLabel={`Like post by ${post.author.name}`}
              entityId={post.id}
              entityType="post"
              initialCount={post.likes_count}
            />
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={showComments}
              aria-label={`Show comments for post by ${post.author.name}`}
              onClick={() => setShowComments((current) => !current)}
            >
              Comment {post.comments_count}
            </Button>
            <Button variant="ghost" size="sm" aria-label={`Share post by ${post.author.name}`}>
              Share
            </Button>
          </div>
          {showComments ? (
            <div className="mt-4">
              <CommentThread
                currentUserName={currentUserName}
                postId={post.id}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
