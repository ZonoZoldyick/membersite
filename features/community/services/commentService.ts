import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";
import type { Comment } from "../types/comment";

const mockComments: Record<string, Comment[]> = {
  "post-1": [
    {
      author: {
        id: "member-10",
        name: "Sora Kim",
      },
      content:
        "This would be perfect for members launching side projects next month.",
      created_at: "25 min ago",
      id: "comment-1",
      likes_count: 1,
      post_id: "post-1",
      replies: [
        {
          author: {
            id: "member-11",
            name: "Mika Ito",
          },
          content:
            "Agreed. We could bundle this with the upcoming demo event as well.",
          created_at: "18 min ago",
          id: "reply-1",
          likes_count: 0,
          post_id: "post-1",
        },
      ],
    },
  ],
  "post-2": [
    {
      author: {
        id: "member-12",
        name: "Daichi Kondo",
      },
      content: "Would love to see a version tailored for members running tiny teams.",
      created_at: "1h ago",
      id: "comment-2",
      likes_count: 0,
      post_id: "post-2",
    },
  ],
  "post-3": [],
};

export const commentService = {
  async createComment(input: {
    authorName?: string;
    content: string;
    postId: string;
  }) {
    const comment = {
      author: {
        id: "current-user",
        name: input.authorName ?? "Current Member",
      },
      content: input.content,
      created_at: "Just now",
      id: `comment-${Date.now()}`,
      likes_count: 0,
      post_id: input.postId,
    } satisfies Comment;

    const currentComments = mockComments[input.postId] ?? [];
    mockComments[input.postId] = [comment, ...currentComments];

    await activityService.createActivity({
      actor_id: comment.author.id,
      actor_name: comment.author.name,
      entity_id: comment.id,
      entity_type: "comment",
      metadata: {
        title: "commented on a community discussion",
      },
      type: ACTIVITY_TYPES.comment_created,
    });

    return Promise.resolve(comment);
  },

  async getCommentsByPostId(postId: string) {
    return Promise.resolve(mockComments[postId] ?? []);
  },
};
