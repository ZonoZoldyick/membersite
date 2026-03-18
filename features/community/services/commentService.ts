import { createClient } from "@/lib/supabase/browser";
import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";
import type { Tables, TablesInsert } from "@/types/supabase";
import type { Comment } from "../types/comment";

type CommentRow = Pick<
  Tables<"comments">,
  "content" | "created_at" | "id" | "post_id" | "profile_id"
> & {
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

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function getProfileRecord(profile: CommentRow["profiles"]) {
  if (!profile) {
    return null;
  }

  if (Array.isArray(profile)) {
    return profile[0] ?? null;
  }

  return profile;
}

function mapComment(row: CommentRow): Comment {
  const profile = getProfileRecord(row.profiles);

  return {
    author: {
      avatar_url: profile?.avatar_url ?? null,
      id: row.profile_id,
      name: profile?.display_name ?? "Member",
    },
    content: row.content,
    created_at: row.created_at,
    id: row.id,
    likes_count: 0,
    post_id: row.post_id,
  };
}

export const commentService = {
  async createComment(input: {
    authorName?: string;
    content: string;
    postId: string;
  }) {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!profile) {
      throw new Error("Profile not found");
    }

    const insertPayload: TablesInsert<"comments"> = {
      content: input.content,
      post_id: input.postId,
      profile_id: user.id,
    };

    const { data, error } = await supabase
      .from("comments")
      .insert(insertPayload)
      .select(
        "id, content, created_at, post_id, profile_id, profiles(display_name, avatar_url)",
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from insert");
    }

    const comment = mapComment(data as CommentRow);

    notifyListeners();

    await activityService.createActivity({
      actor_id: comment.author.id,
      actor_name: profile.display_name ?? input.authorName ?? "Current Member",
      entity_id: comment.id,
      entity_type: "comment",
      metadata: {
        title: "commented on a community discussion",
      },
      type: ACTIVITY_TYPES.comment_created,
    });

    return comment;
  },

  async getCommentsByPostId(postId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("comments")
      .select(
        "id, content, created_at, post_id, profile_id, profiles(display_name, avatar_url)",
      )
      .eq("post_id", postId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => mapComment(row as CommentRow));
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
