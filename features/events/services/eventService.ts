import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";

export type EventRecord = {
  created_at: string;
  creator_id: string;
  creator_name: string;
  id: string;
  title: string;
};

const mockEvents: EventRecord[] = [];

export const eventService = {
  async createEvent(input: {
    creatorName?: string;
    title: string;
  }) {
    const event = {
      created_at: "Just now",
      creator_id: "current-user",
      creator_name: input.creatorName ?? "Current Member",
      id: `event-${Date.now()}`,
      title: input.title,
    } satisfies EventRecord;

    mockEvents.unshift(event);

    await activityService.createActivity({
      actor_id: event.creator_id,
      actor_name: event.creator_name,
      entity_id: event.id,
      entity_type: "event",
      metadata: {
        title: `created a new event: ${event.title}`,
      },
      type: ACTIVITY_TYPES.event_created,
    });

    return Promise.resolve(event);
  },

  async joinEvent(input: {
    actorName?: string;
    eventId: string;
    eventTitle: string;
  }) {
    const participation = {
      actor_id: "current-user",
      actor_name: input.actorName ?? "Current Member",
      created_at: "Just now",
      event_id: input.eventId,
      id: `event-join-${Date.now()}`,
    };

    await activityService.createActivity({
      actor_id: participation.actor_id,
      actor_name: participation.actor_name,
      entity_id: participation.id,
      entity_type: "event_participant",
      metadata: {
        title: `joined an event: ${input.eventTitle}`,
      },
      type: ACTIVITY_TYPES.event_joined,
    });

    return Promise.resolve(participation);
  },

  async getEvents() {
    return Promise.resolve([...mockEvents]);
  },
};
