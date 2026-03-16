import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { ActivityFeed } from "@/features/activity/components/ActivityFeed";

const featuredProducts = [
  "Launch Playbook Kit",
  "Member CRM Template",
  "Partnership Outreach Pack",
];

const upcomingEvents = [
  "Community Demo Day",
  "Founder Growth Circle",
  "Premium Learning Sprint",
];

export default function DashboardPage() {
  return (
    <div>
      <PageIntro
        title="Dashboard"
        description="A quick overview of community activity, featured products, and upcoming events."
      />
      <div className="grid gap-6">
        <Card
          title="Activity Timeline"
          description="The latest member activity and community momentum at a glance."
        >
          <ActivityFeed compact />
        </Card>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card
            title="Featured Products"
            description="Highlighted member offerings and currently active showcases."
          >
            <div className="space-y-3">
              {featuredProducts.map((product) => (
                <div
                  key={product}
                  className="rounded-2xl bg-[var(--secondary)] px-4 py-4 text-sm font-medium text-[var(--foreground)]"
                >
                  {product}
                </div>
              ))}
            </div>
          </Card>
          <Card
            title="Upcoming Events"
            description="The next sessions and gatherings members can join."
          >
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event}
                  className="rounded-2xl bg-[var(--secondary)] px-4 py-4 text-sm font-medium text-[var(--foreground)]"
                >
                  {event}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
