"use client";

import { useEffect, useState } from "react";
import { postService } from "../services/postService";
import type { CommunitySidebarData, Post } from "../types/post";

type UsePostsResult = {
  error: string | null;
  loading: boolean;
  posts: Post[];
  sidebar: CommunitySidebarData;
};

const emptySidebar: CommunitySidebarData = {
  activeMembers: [],
  popularTopics: [],
  upcomingEvents: [],
};

export function usePosts(): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sidebar, setSidebar] = useState<CommunitySidebarData>(emptySidebar);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        const [feed, sidebarData] = await Promise.all([
          postService.getFeed(),
          postService.getSidebarData(),
        ]);

        if (!isMounted) {
          return;
        }

        setPosts(feed);
        setSidebar(sidebarData);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Failed to load community feed.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadPosts();
    const unsubscribe = postService.subscribe(() => {
      void loadPosts();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { error, loading, posts, sidebar };
}
