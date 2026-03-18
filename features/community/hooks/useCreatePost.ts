"use client";

import { useState } from "react";
import { postService } from "../services/postService";
import type { Post } from "../types/post";

type UseCreatePostResult = {
  createPost: (content: string) => Promise<Post | null>;
  createError: string | null;
  error: string | null;
  loading: boolean;
  success: boolean;
};

export function useCreatePost(): UseCreatePostResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function createPost(content: string) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const post = await postService.createPost(content);
      setSuccess(true);
      return post;
    } catch {
      setError("Failed to create post.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    createPost,
    createError: error,
    error,
    loading,
    success,
  };
}
