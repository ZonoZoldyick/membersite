import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: products, error: productsError }, { data: events, error: eventsError }] =
    await Promise.all([
      supabase
        .from("products")
        .select("id, title, description, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("events")
        .select("id, title, description, event_date, location")
        .is("deleted_at", null)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(5),
    ]);

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
            {productsError ? (
              <p className="text-sm text-rose-600">{productsError.message}</p>
            ) : products && products.length > 0 ? (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-[var(--secondary)] px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {product.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {product.description}
                    </p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {new Date(product.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No products yet</p>
            )}
          </Card>
          <Card
            title="Upcoming Events"
            description="The next sessions and gatherings members can join."
          >
            {eventsError ? (
              <p className="text-sm text-rose-600">{eventsError.message}</p>
            ) : events && events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl bg-[var(--secondary)] px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {event.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {event.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                      <span>{new Date(event.event_date).toLocaleString()}</span>
                      <span>{event.location ?? "Location TBD"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No upcoming events yet</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
