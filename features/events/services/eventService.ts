import { createClient } from "@/lib/supabase/browser";
import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";
import type { Tables, TablesInsert } from "@/types/supabase";

export type EventRecord = Pick<
  Tables<"events">,
  "created_at" | "description" | "event_date" | "id" | "profile_id" | "title"
> & {
  joinedCount: number;
  location: string;
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function mapEvent(
  row: Pick<
    Tables<"events">,
    "created_at" | "description" | "event_date" | "id" | "location" | "profile_id" | "title"
  >,
  joinedCount: number,
): EventRecord {
  return {
    created_at: row.created_at,
    description: row.description,
    event_date: row.event_date,
    id: row.id,
    joinedCount,
    location: row.location ?? "TBD",
    profile_id: row.profile_id,
    title: row.title,
  };
}

async function ensureAuthenticatedProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!profile) {
    throw new Error("Profile not found");
  }

  return { profile, supabase, user };
}

export const eventService = {
  async createEvent(input: {
    description?: string;
    eventDate?: string;
    location?: string;
    title: string;
  }) {
    const { profile, supabase, user } = await ensureAuthenticatedProfile();

    const insertPayload: TablesInsert<"events"> = {
      description: input.description ?? "",
      event_date: input.eventDate ?? new Date().toISOString(),
      location: input.location ?? null,
      profile_id: user.id,
      title: input.title,
    };

    const { data, error } = await supabase
      .from("events")
      .insert(insertPayload)
      .select("id, created_at, description, event_date, location, profile_id, title")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from event insert");
    }

    const event = mapEvent(data, 0);

    await activityService.createActivity({
      actor_id: event.profile_id,
      actor_name: profile.display_name,
      entity_id: event.id,
      entity_type: "event",
      metadata: {
        title: `created a new event: ${event.title}`,
      },
      type: ACTIVITY_TYPES.event_created,
    });

    notifyListeners();
    return event;
  },

  async getEvents() {
    const supabase = createClient();

    const { data: events, error } = await supabase
      .from("events")
      .select("id, created_at, description, event_date, location, profile_id, title")
      .is("deleted_at", null)
      .order("event_date", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    if (!events || events.length === 0) {
      return [];
    }

    const eventIds = events.map((event) => event.id);

    const { data: participations, error: participationError } = await supabase
      .from("event_participants")
      .select("event_id, status")
      .in("event_id", eventIds)
      .neq("status", "cancelled");

    if (participationError) {
      throw new Error(participationError.message);
    }

    const joinedCountByEventId = new Map<string, number>();

    (participations ?? []).forEach((participation) => {
      const current = joinedCountByEventId.get(participation.event_id) ?? 0;
      joinedCountByEventId.set(participation.event_id, current + 1);
    });

    return events.map((event) =>
      mapEvent(event, joinedCountByEventId.get(event.id) ?? 0),
    );
  },

  async joinEvent(input: {
    actorName?: string;
    eventId: string;
    eventTitle: string;
  }) {
    const { profile, supabase, user } = await ensureAuthenticatedProfile();

    const insertPayload: TablesInsert<"event_participants"> = {
      event_id: input.eventId,
      profile_id: user.id,
      status: "pending",
    };

    const { data, error } = await supabase
      .from("event_participants")
      .upsert(insertPayload, {
        onConflict: "event_id,profile_id",
      })
      .select("id, event_id, profile_id, status, created_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from event participation insert");
    }

    await activityService.createActivity({
      actor_id: profile.id,
      actor_name: profile.display_name ?? input.actorName ?? "Current Member",
      entity_id: data.id,
      entity_type: "event_participant",
      metadata: {
        title: `joined an event: ${input.eventTitle}`,
      },
      type: ACTIVITY_TYPES.event_joined,
    });

    notifyListeners();
    return data;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
