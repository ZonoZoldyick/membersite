"use client";

import { useState } from "react";
import { eventService, type EventRecord } from "../services/eventService";

type EventItem = EventRecord & {
  joinedCount: number;
  location: string;
};

const initialEvents: EventItem[] = [
  {
    created_at: "Apr 04",
    creator_id: "seed-1",
    creator_name: "Community Team",
    id: "seed-event-1",
    joinedCount: 24,
    location: "Tokyo + Online",
    title: "Founder Networking Session",
  },
  {
    created_at: "Apr 12",
    creator_id: "seed-2",
    creator_name: "Community Team",
    id: "seed-event-2",
    joinedCount: 12,
    location: "Osaka",
    title: "Community Product Demo Day",
  },
  {
    created_at: "Apr 20",
    creator_id: "seed-3",
    creator_name: "Community Team",
    id: "seed-event-3",
    joinedCount: 39,
    location: "Online",
    title: "Premium Learning Sprint",
  },
];

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [isCreating, setIsCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  async function createEvent(title: string, location: string) {
    setIsCreating(true);
    try {
      const event = await eventService.createEvent({ title });
      const nextEvent: EventItem = {
        ...event,
        joinedCount: 0,
        location,
      };
      setEvents((current) => [nextEvent, ...current]);
      return nextEvent;
    } finally {
      setIsCreating(false);
    }
  }

  async function joinEvent(eventId: string, eventTitle: string) {
    setJoiningId(eventId);
    try {
      await eventService.joinEvent({ eventId, eventTitle });
      setEvents((current) =>
        current.map((event) =>
          event.id === eventId
            ? { ...event, joinedCount: event.joinedCount + 1 }
            : event,
        ),
      );
    } finally {
      setJoiningId(null);
    }
  }

  return { createEvent, events, isCreating, joinEvent, joiningId };
}
