"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { useActivityFeed } from "../hooks/useActivityFeed";
import type { Activity, ActivityType } from "../types/activity";

type ActivityFeedProps = {
  compact?: boolean;
};

const activityLabelMap: Record<ActivityType, string> = {
  comment_created: "commented on a discussion",
  event_created: "created an event",
  event_joined: "joined an event",
  like_created: "liked a post",
  post_created: "posted a discussion",
  product_created: "created a product",
};

function formatActivityText(activity: Activity) {
  return `${activity.actor.name} ${activityLabelMap[activity.type]}`;
}

export function ActivityFeed({ compact = false }: ActivityFeedProps) {
  const { activities, error, loading } = useActivityFeed();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="h-4 w-40 rounded-full bg-[var(--secondary)]" />
            <div className="mt-3 h-3 w-28 rounded-full bg-[var(--secondary)]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className={compact ? "p-4 shadow-none" : "p-5"}>
          <div className="flex items-start gap-4">
            <Avatar name={activity.actor.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {formatActivityText(activity)}
                </p>
                <span className="text-xs text-[var(--muted)]">{activity.created_at}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {activity.metadata.title ?? "Community activity recorded."}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
