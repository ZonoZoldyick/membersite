import type { Post } from "../types/post";
import { PostCard } from "./PostCard";

type PostFeedProps = {
  currentUserName?: string;
  loading?: boolean;
  posts: Post[];
};

export function PostFeed({
  currentUserName,
  loading = false,
  posts,
}: PostFeedProps) {
  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]"
          >
            <div className="h-4 w-40 rounded-full bg-[var(--secondary)]" />
            <div className="mt-4 h-20 rounded-2xl bg-[var(--secondary)]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserName={currentUserName} />
      ))}
    </div>
  );
}
