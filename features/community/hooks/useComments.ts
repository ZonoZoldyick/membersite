"use client";

import { useEffect, useState } from "react";
import { commentService } from "../services/commentService";
import type { Comment } from "../types/comment";

type UseCommentsResult = {
  comments: Comment[];
  createComment: (content: string, authorName?: string) => Promise<Comment | null>;
  error: string | null;
  isCreating: boolean;
  loading: boolean;
};

export function useComments(postId: string): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCreating, setIsCreating] = useState(false);
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
        setError(null);
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
    const unsubscribe = commentService.subscribe(() => {
      void loadComments();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [postId]);

  async function createComment(content: string, authorName?: string) {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Comment cannot be empty.");
      return null;
    }

    setIsCreating(true);

    try {
      const comment = await commentService.createComment({
        authorName,
        content: trimmedContent,
        postId,
      });
      setError(null);
      return comment;
    } catch {
      setError("Failed to create comment.");
      return null;
    } finally {
      setIsCreating(false);
    }
  }

  return { comments, createComment, error, isCreating, loading };
}
