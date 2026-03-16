import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CommunitySidebarData } from "../types/post";

type CommunitySidebarProps = {
  sidebar: CommunitySidebarData;
};

export function CommunitySidebar({ sidebar }: CommunitySidebarProps) {
  return (
    <div className="space-y-6">
      <Card title="Popular Topics" description="Trending tags members are discussing right now.">
        <div className="flex flex-wrap gap-2">
          {sidebar.popularTopics.map((topic) => (
            <Badge key={topic}>#{topic}</Badge>
          ))}
        </div>
      </Card>

      <Card title="Upcoming Events" description="Events connected to this week's community momentum.">
        <div className="space-y-3">
          {sidebar.upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {event.title}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{event.date}</p>
              <Button variant="secondary" size="sm" className="mt-3">
                Join
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Active Members" description="Recently active people in the feed and discussion threads.">
        <div className="flex flex-wrap items-center gap-3">
          {sidebar.activeMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] px-3 py-2"
            >
              <Avatar name={member.name} size="sm" />
              <span className="text-sm font-medium text-[var(--foreground)]">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

