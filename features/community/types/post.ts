export type CommunityAuthor = {
  avatar_url?: string | null;
  id: string;
  name: string;
};

export type Post = {
  author: CommunityAuthor;
  comments_count: number;
  content: string;
  created_at: string;
  id: string;
  likes_count: number;
  link_url?: string | null;
};

export type CommunitySidebarEvent = {
  date: string;
  id: string;
  title: string;
};

export type CommunitySidebarMember = {
  id: string;
  name: string;
};

export type CommunitySidebarData = {
  activeMembers: CommunitySidebarMember[];
  popularTopics: string[];
  upcomingEvents: CommunitySidebarEvent[];
};

