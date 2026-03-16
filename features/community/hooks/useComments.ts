"use client";

import { useEffect, useState } from "react";
import { commentService } from "../services/commentService";
import type { Comment } from "../types/comment";

type UseCommentsResult = {
  comments: Comment[];
  createComment: (content: string, authorName?: string) => Promise<Comment | null>;
  error: string | null;
  loading: boolean;
};

export function useComments(postId: string): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      try {
        const result = await commentService.getCommentsByPostId(postId);

        if (!isMounted) {
          return;
        }

        setComments(result);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Failed to load comments.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadComments();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  async function createComment(content: string, authorName?: string) {
    try {
      const comment = await commentService.createComment({
        authorName,
        content,
        postId,
      });
      setComments((current) => [comment, ...current]);
      return comment;
    } catch {
      setError("Failed to create comment.");
      return null;
    }
  }

  return { comments, createComment, error, loading };
}
