"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LikeButton } from "@/features/likes/components/LikeButton";
import { useComments } from "../hooks/useComments";
import type { Comment } from "../types/comment";

type CommentThreadProps = {
  currentUserName?: string;
  postId: string;
};

function CommentNode({
  comment,
  isReply = false,
}: {
  comment: Comment;
  isReply?: boolean;
}) {
  return (
    <div className={isReply ? "ml-8 border-l border-[var(--border)] pl-4" : ""}>
      <div className="flex items-start gap-3 rounded-2xl bg-[var(--surface)] p-4">
        <Avatar name={comment.author.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {comment.author.name}
            </p>
            <span className="text-xs text-[var(--muted)]">{comment.created_at}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{comment.content}</p>
          <div className="mt-3">
            <LikeButton
              ariaLabel={`Like comment by ${comment.author.name}`}
              entityId={comment.id}
              entityType="comment"
              initialCount={comment.likes_count ?? 0}
            />
          </div>
        </div>
      </div>
      {comment.replies?.length ? (
        <div className="mt-3 space-y-3">
          {comment.replies.slice(0, 1).map((reply) => (
            <CommentNode key={reply.id} comment={reply} isReply />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CommentThread({
  currentUserName = "Current Member",
  postId,
}: CommentThreadProps) {
  const [content, setContent] = useState("");
  const { comments, createComment, error } = useComments(postId);

  async function handleCommentSubmit() {
    const comment = await createComment(content, currentUserName);

    if (!comment) {
      return;
    }

    setContent("");
  }

  return (
    <div className="space-y-3 border-t border-[var(--border)] pt-4">
      <div className="rounded-2xl bg-[var(--surface)] p-4">
        <div className="flex items-center gap-3">
          <Input
            aria-label="Write a comment"
            className="py-2"
            placeholder="Write a comment..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <Button
            disabled={!content.trim()}
            size="sm"
            onClick={() => void handleCommentSubmit()}
          >
            Comment
          </Button>
        </div>
        {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
      </div>
      {comments.map((comment) => (
        <CommentNode key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
