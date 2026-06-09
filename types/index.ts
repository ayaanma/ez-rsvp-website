export type RSVPStatus = "locked" | "revealed" | "attended" | "cancelled";

export interface EventItem {
  id: string;
  name: string;
  category: string;
  description: string;
  venue: string;
  address: string;
  city: string;
  area: string;
  neighborhood?: string;
  startTime: string;
  endTime: string;
  price: number;
  remainingTickets: number;
  capacity: number;
  ageRestriction?: string;
  dressCode?: string;
  accessibilityNotes?: string;
  safetyNotes?: string;
  organizerName: string;
  color: "baby" | "wisteria" | "amethyst" | "apricot";
  groupMembersGoing?: GroupMember[];
  imageUrl?: string;
  imageBlurred?: boolean;
  ticketDetails?: string;
  verified?: boolean;
}

export interface GroupMember {
  id: string;
  name: string;
  initials: string;
  attendingEventId?: string;
  avatarGradient?: string;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  readiness: number;
  code: string;
  role: "Owner" | "Member";
  ownerUserId?: string;
  icon: string;
  upcomingPlan: string;
  upcomingDateTime: string;
  memberStatuses?: Record<string, string>;
}

export interface RSVP {
  id: string;
  userId: string;
  eventId: string;
  status: RSVPStatus;
  selectedDate: string;
  selectedTimeRange: string;
  radius: number;
  budgetMax: number;
  categories: string[];
  revealAt: string;
  createdAt: string;
}

export interface PastEvent {
  id: string;
  name: string;
  date: string;
  category: string;
  icon: string;
  address: string;
  wouldDoAgain: string;
}

export type Event = EventItem;
export type RSVPGroup = Group;
