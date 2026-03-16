import {
  ACTIVITY_TYPES,
  type Activity,
  type ActivityType,
} from "../types/activity";

const mockActivities: Activity[] = [
  {
    actor: {
      id: "member-1",
      name: "Tanaka",
    },
    actor_id: "member-1",
    created_at: "10 min ago",
    entity_id: "post-1",
    entity_type: "post",
    id: "activity-1",
    metadata: {
      title: "posted a discussion about spring showcase demos",
    },
    type: ACTIVITY_TYPES.post_created,
  },
  {
    actor: {
      id: "member-2",
      name: "Sato",
    },
    actor_id: "member-2",
    created_at: "1 hour ago",
    entity_id: "event-1",
    entity_type: "event",
    id: "activity-2",
    metadata: {
      title: "created a new event for founder networking",
    },
    type: ACTIVITY_TYPES.event_created,
  },
  {
    actor: {
      id: "member-3",
      name: "Park",
    },
    actor_id: "member-3",
    created_at: "Today",
    entity_id: "product-1",
    entity_type: "product",
    id: "activity-3",
    metadata: {
      title: "added a new product to the catalog",
    },
    type: ACTIVITY_TYPES.product_created,
  },
  {
    actor: {
      id: "member-4",
      name: "Kondo",
    },
    actor_id: "member-4",
    created_at: "Today",
    entity_id: "event-1",
    entity_type: "event_participant",
    id: "activity-4",
    metadata: {
      title: "joined the community demo day event",
    },
    type: ACTIVITY_TYPES.event_joined,
  },
];

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const activityService = {
  async createActivity(input: {
    actor_name?: string;
    actor_id: string;
    entity_id: string;
    entity_type: string;
    metadata?: Record<string, string>;
    type: ActivityType;
  }) {
    const activity = {
      actor: {
        id: input.actor_id,
        name: input.actor_name ?? "Current Member",
      },
      actor_id: input.actor_id,
      created_at: "Just now",
      entity_id: input.entity_id,
      entity_type: input.entity_type,
      id: `activity-${Date.now()}`,
      metadata: input.metadata ?? {},
      type: input.type,
    } satisfies Activity;

    mockActivities.unshift(activity);
    notifyListeners();

    return Promise.resolve(activity);
  },

  async getActivityFeed() {
    return Promise.resolve([...mockActivities]);
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
