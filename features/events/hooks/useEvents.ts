"use client";

import { useEffect, useState } from "react";
import { eventService, type EventRecord } from "../services/eventService";

type UseEventsResult = {
  createError: string | null;
  createEvent: (title: string, location: string) => Promise<EventRecord | null>;
  events: EventRecord[];
  isCreating: boolean;
  isLoading: boolean;
  joinError: string | null;
  joinEvent: (eventId: string, eventTitle: string) => Promise<boolean>;
  joiningId: string | null;
  loadError: string | null;
};

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const result = await eventService.getEvents();

        if (!isMounted) {
          return;
        }

        setEvents(result);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(
          error instanceof Error ? error.message : "Failed to load events.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadEvents();
    const unsubscribe = eventService.subscribe(() => {
      void loadEvents();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  async function createEvent(title: string, location: string) {
    setIsCreating(true);
    setCreateError(null);

    try {
      const event = await eventService.createEvent({
        description: `${title} at ${location || "TBD"}`,
        location: location || "TBD",
        title,
      });

      return event;
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Failed to create event.",
      );
      return null;
    } finally {
      setIsCreating(false);
    }
  }

  async function joinEvent(eventId: string, eventTitle: string) {
    setJoiningId(eventId);
    setJoinError(null);

    try {
      await eventService.joinEvent({ eventId, eventTitle });
      return true;
    } catch (error) {
      setJoinError(
        error instanceof Error ? error.message : "Failed to join event.",
      );
      return false;
    } finally {
      setJoiningId(null);
    }
  }

  return {
    createError,
    createEvent,
    events,
    isCreating,
    isLoading,
    joinError,
    joinEvent,
    joiningId,
    loadError,
  };
}
