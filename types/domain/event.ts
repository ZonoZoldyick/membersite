export type EventParticipantStatus = "pending" | "approved" | "cancelled";

export type Event = {
  id: string;
  profileId: string;
  title: string;
  description: string;
  eventDate: string;
  location: string | null;
  url: string | null;
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type EventParticipant = {
  id: string;
  eventId: string;
  profileId: string;
  status: EventParticipantStatus;
  createdAt: string;
  updatedAt: string;
};

