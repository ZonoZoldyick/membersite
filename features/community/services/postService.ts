import { activityService } from "@/features/activity/services/activityService";
import { ACTIVITY_TYPES } from "@/features/activity/types/activity";
import type {
  CommunitySidebarData,
  Post,
} from "../types/post";

const mockPosts: Post[] = [
  {
    author: {
      id: "author-1",
      name: "Aiko Tanaka",
    },
    comments_count: 1,
    content:
      "Launching a new collaboration thread for local product showcases and demo sessions. If you're preparing something for spring, share the link and tell us what kind of feedback you need.",
    created_at: "2h ago",
    id: "post-1",
    likes_count: 12,
    link_url: "https://example.com/showcase",
  },
  {
    author: {
      id: "author-2",
      name: "Ren Sato",
    },
    comments_count: 1,
    content:
      "Looking for feedback on a workshop format for first-time founders inside the community. Thinking about a 45 minute session with live teardown and peer Q&A.",
    created_at: "5h ago",
    id: "post-2",
    likes_count: 8,
  },
  {
    author: {
      id: "author-3",
      name: "Nina Park",
    },
    comments_count: 0,
    content:
      "We just published a new member onboarding checklist. It is written to reduce approval friction and help new members introduce themselves more confidently.",
    created_at: "Today",
    id: "post-3",
    likes_count: 21,
  },
];

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

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const postService = {
  async createPost(content: string) {
    const post = {
      author: {
        id: "current-user",
        name: "Current Member",
      },
      comments_count: 0,
      content,
      created_at: "Just now",
      id: `mock-post-${Date.now()}`,
      likes_count: 0,
    } satisfies Post;

    mockPosts.unshift(post);
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

    return Promise.resolve(post);
  },

  async getFeed() {
    return Promise.resolve([...mockPosts]);
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
