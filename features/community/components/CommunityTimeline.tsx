"use client";

import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { CreatePost } from "./CreatePost";
import { CommunitySidebar } from "./CommunitySidebar";
import { PostFeed } from "./PostFeed";
import { usePosts } from "../hooks/usePosts";

type CommunityTimelineProps = {
  currentUserName: string;
};

export function CommunityTimeline({ currentUserName }: CommunityTimelineProps) {
  const { error, loading, posts, sidebar } = usePosts();

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <CreatePost currentUserName={currentUserName} />
        {error ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        <ActivityFeed />
        <PostFeed
          currentUserName={currentUserName}
          loading={loading}
          posts={posts}
        />
      </div>
      <aside>
        <CommunitySidebar sidebar={sidebar} />
      </aside>
    </div>
  );
}
