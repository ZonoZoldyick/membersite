"use client";

import { useState } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useEvents } from "@/features/events/hooks/useEvents";

export default function EventsPage() {
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const { createEvent, events, isCreating, joinEvent, joiningId } = useEvents();

  async function handleCreateEvent() {
    const event = await createEvent(title, location || "TBD");

    if (!event) {
      return;
    }

    setTitle("");
    setLocation("");
  }

  return (
    <div>
      <PageIntro
        title="Events"
        description="Upcoming community events in a list-first layout optimized for quick scanning."
      />
      <Card
        title="Create Event"
        description="Publish a new event to the member calendar using the mocked service layer."
        className="mb-6"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <Input
            placeholder="Event title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          <Button
            disabled={!title.trim() || isCreating}
            onClick={() => void handleCreateEvent()}
          >
            {isCreating ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </Card>
      <div className="grid gap-5">
        {events.map((event) => (
          <Card key={event.id}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-[var(--secondary)] px-4 py-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    Date
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                    {event.created_at}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {event.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">{event.location}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {event.joinedCount} joined
                  </p>
                </div>
              </div>
              <Button
                disabled={joiningId === event.id}
                onClick={() => void joinEvent(event.id, event.title)}
              >
                {joiningId === event.id ? "Joining..." : "Join Event"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
