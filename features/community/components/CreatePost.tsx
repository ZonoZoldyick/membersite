"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { useCreatePost } from "../hooks/useCreatePost";

type CreatePostProps = {
  currentUserName: string;
  onPostCreated?: () => void;
};

export function CreatePost({ currentUserName, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { createPost, error, loading, success } = useCreatePost();

  async function handleSubmit() {
    const createdPost = await createPost(content);

    if (!createdPost) {
      return;
    }

    setContent("");
    setIsExpanded(false);
    onPostCreated?.();
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <Avatar name={currentUserName} size="md" />
        <div className="min-w-0 flex-1">
          {!isExpanded ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex w-full items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-left text-sm text-[var(--muted)] transition hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              What do you want to share?
            </button>
          ) : (
            <div className="space-y-4">
              <Textarea
                aria-label="Create a new community post"
                placeholder="Share a win, ask a question, or start a conversation with the community."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-[var(--muted)]">
                  {error ? (
                    <p className="text-rose-600">{error}</p>
                  ) : success ? (
                    <p className="text-emerald-600">
                      Mock post submitted. Backend connection will be added later.
                    </p>
                  ) : (
                    <p>Attachments and rich content will be added later.</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setIsExpanded(false)}>
                    Cancel
                  </Button>
                  <Button disabled={!content.trim() || loading} onClick={handleSubmit}>
                    {loading ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
