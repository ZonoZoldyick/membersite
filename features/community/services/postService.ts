import { createClient } from "@/lib/supabase/browser";
import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";
import type { CommunitySidebarData, Post } from "../types/post";

const mockSidebarData: CommunitySidebarData = {
  activeMembers: [
    { id: "member-1", name: "Aiko Tanaka" },
    { id: "member-2", name: "Ren Sato" },
    { id: "member-3", name: "Daichi Kondo" },
    { id: "member-4", name: "Yuna Lee" },
  ],
  popularTopics: ["AI", "Startup", "Marketing", "Productivity", "Community"],
  upcomingEvents: [
    { date: "Apr 04", id: "event-1", title: "Founder Networking Session" },
    { date: "Apr 12", id: "event-2", title: "Community Product Demo Day" },
    { date: "Apr 20", id: "event-3", title: "Premium Learning Sprint" },
  ],
};

const listeners = new Set<() => void>();

type PostRow = {
  content: string;
  created_at: string;
  id: string;
  likes_count?: number | null;
  profile_id: string;
  profiles:
    | {
        avatar_url: string | null;
        display_name: string;
      }
    | {
        avatar_url: string | null;
        display_name: string;
      }[]
    | null;
};

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function getProfileRecord(
  profile:
    | {
        avatar_url: string | null;
        display_name: string;
      }
    | {
        avatar_url: string | null;
        display_name: string;
      }[]
    | null,
) {
  if (!profile) {
    return null;
  }

  if (Array.isArray(profile)) {
    return profile[0] ?? null;
  }

  return profile;
}

function mapPost(row: PostRow): Post {
  const profile = getProfileRecord(row.profiles);

  return {
    author: {
      avatar_url: profile?.avatar_url ?? null,
      id: row.profile_id,
      name: profile?.display_name ?? "Member",
    },
    comments_count: 0,
    content: row.content,
    created_at: row.created_at,
    id: row.id,
    likes_count: row.likes_count ?? 0,
  };
}

export const postService = {
  async createPost(content: string) {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!profile) {
      throw new Error("Profile not found");
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        content,
        profile_id: user.id,
        type: "post",
      })
      .select("id, content, created_at, profile_id, profiles(display_name, avatar_url)")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from insert");
    }

    const post = mapPost({
      ...data,
      likes_count: 0,
    } as PostRow);

    notifyListeners();

    await activityService.createActivity({
      actor_id: post.author.id,
      actor_name: post.author.name,
      entity_id: post.id,
      entity_type: "post",
      metadata: {
        title: "posted a new discussion in the community",
      },
      type: ACTIVITY_TYPES.post_created,
    });

    return post;
  },

  async getFeed() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("posts")
      .select("id, content, created_at, profile_id, profiles(display_name, avatar_url)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) =>
      mapPost({
        ...(row as Omit<PostRow, "likes_count">),
        likes_count: 0,
      }),
    );
  },

  async getSidebarData() {
    return Promise.resolve(mockSidebarData);
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
