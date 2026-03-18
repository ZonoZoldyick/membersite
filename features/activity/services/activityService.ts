import { createClient } from "@/lib/supabase/browser";
import type { Tables, TablesInsert } from "@/types/supabase";
import {
  ACTIVITY_TYPES,
  type Activity,
  type ActivityType,
} from "../types/activity";

type ActivityRow = Pick<
  Tables<"activities">,
  "actor_id" | "created_at" | "entity_id" | "entity_type" | "id" | "metadata" | "type"
>;

type ProfileLookupRow = Pick<Tables<"profiles">, "avatar_url" | "display_name" | "id">;

const fallbackActivities: Activity[] = [
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
];

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function normalizeMetadata(metadata: ActivityRow["metadata"]) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, String(value)]),
  );
}

async function loadProfilesById(actorIds: string[]) {
  if (actorIds.length === 0) {
    return new Map<string, ProfileLookupRow>();
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", actorIds);

  if (error) {
    throw new Error(error.message);
  }

  return new Map((data ?? []).map((profile) => [profile.id, profile]));
}

async function mapActivities(rows: ActivityRow[]): Promise<Activity[]> {
  const actorIds = [...new Set(rows.map((row) => row.actor_id))];
  const profilesById = await loadProfilesById(actorIds);

  return rows.map((row) => {
    const profile = profilesById.get(row.actor_id);

    return {
      actor: {
        avatar_url: profile?.avatar_url ?? null,
        id: row.actor_id,
        name: profile?.display_name ?? "Member",
      },
      actor_id: row.actor_id,
      created_at: row.created_at,
      entity_id: row.entity_id,
      entity_type: row.entity_type,
      id: row.id,
      metadata: normalizeMetadata(row.metadata),
      type: row.type as ActivityType,
    };
  });
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
    const supabase = createClient();

    const insertPayload: TablesInsert<"activities"> = {
      actor_id: input.actor_id,
      entity_id: input.entity_id,
      entity_type: input.entity_type,
      metadata: input.metadata ?? {},
      type: input.type,
    };

    const { data, error } = await supabase
      .from("activities")
      .insert(insertPayload)
      .select("id, actor_id, type, entity_type, entity_id, metadata, created_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from activity insert");
    }

    const [activity] = await mapActivities([data]);

    notifyListeners();
    return activity;
  },

  async getActivityFeed() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("activities")
      .select("id, actor_id, type, entity_type, entity_id, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      if (error.message.toLowerCase().includes("relation")) {
        return fallbackActivities;
      }

      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return mapActivities(data);
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
