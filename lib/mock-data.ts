import type { EventItem, Group, PastEvent, RSVP } from "@/types";

const base = new Date();
const isoIn = (hours: number) => new Date(base.getTime() + hours * 60 * 60 * 1000).toISOString();

export const members = [
  { id: "m1", name: "Mia Farrow", initials: "MF" },
  { id: "m2", name: "Sana Chen", initials: "SC" },
  { id: "m3", name: "Jude Blake", initials: "JB" },
  { id: "m4", name: "Eli Park", initials: "EP" }
];

export const categories = ["Nightlife", "Fitness", "Dining", "Culture", "Music", "Networking", "Outdoor", "Comedy", "Family", "Chill"];

export const events: EventItem[] = [
  {
    id: "evt-1",
    name: "Secret Warehouse Rave",
    category: "Music",
    description: "A curated night of lights, bass, and surprise performers.",
    venue: "Atlas District Loft",
    address: "214 Mercer Street, New York, NY",
    city: "New York, NY",
    area: "Arts District",
    startTime: isoIn(5),
    endTime: isoIn(8),
    price: 38,
    remainingTickets: 9,
    capacity: 80,
    ageRestriction: "21+",
    dressCode: "Black or chrome accents",
    accessibilityNotes: "Elevator access available.",
    safetyNotes: "Verified public venue with staffed entry.",
    organizerName: "Night Circuit",
    color: "baby",
    groupMembersGoing: [members[0], members[1], members[2]],
    ticketDetails: "Entry included with RSVP",
    verified: true
  },
  {
    id: "evt-2",
    name: "Fifty Four NYC",
    category: "Nightlife",
    description: "A polished Midtown venue experience with lounge energy, reserved entry, and a curated night built around food, music, and an easy arrival plan.",
    venue: "Fifty Four NYC",
    address: "226 West 54th Street, New York, NY",
    city: "New York, NY",
    area: "Midtown",
    startTime: isoIn(1.4),
    endTime: isoIn(3.4),
    price: 52,
    remainingTickets: 4,
    capacity: 28,
    ageRestriction: "All ages",
    dressCode: "Smart casual",
    accessibilityNotes: "Step-free entrance.",
    safetyNotes: "Reserved table and verified host.",
    organizerName: "Fifty Four NYC",
    color: "apricot",
    imageUrl: "/event-images/fifty-four-venue.png",
    imageBlurred: true,
    groupMembersGoing: [members[1], members[3]],
    ticketDetails: "Entry included with RSVP",
    verified: true
  },
  {
    id: "evt-3",
    name: "Location Hidden",
    category: "Culture",
    description: "A quiet after-hours gallery experience with interactive rooms.",
    venue: "Revealed 2 hours before",
    address: "Revealed later",
    city: "Brooklyn, NY",
    area: "North Side",
    startTime: isoIn(26),
    endTime: isoIn(29),
    price: 18,
    remainingTickets: 12,
    capacity: 40,
    organizerName: "Soft Signal Arts",
    color: "wisteria",
    groupMembersGoing: [members[0], members[2]],
    ticketDetails: "Entry included with RSVP",
    verified: true
  },
  {
    id: "evt-4",
    name: "Location Hidden",
    category: "Comedy",
    description: "A relaxed pop-up comedy night at a public venue.",
    venue: "Revealed 2 hours before",
    address: "Revealed later",
    city: "Jersey City, NJ",
    area: "Downtown",
    startTime: isoIn(32),
    endTime: isoIn(34),
    price: 24,
    remainingTickets: 7,
    capacity: 60,
    organizerName: "Laughline",
    color: "amethyst",
    groupMembersGoing: [members[2], members[3]],
    ticketDetails: "Entry included with RSVP",
    verified: true
  },
  {
    id: "evt-5",
    name: "Rooftop Reset",
    category: "Chill",
    description: "A calm sunset hang with mocktails, games, and skyline views.",
    venue: "Revealed 2 hours before",
    address: "Revealed later",
    city: "New York, NY",
    area: "Chelsea",
    startTime: isoIn(14),
    endTime: isoIn(17),
    price: 28,
    remainingTickets: 6,
    capacity: 34,
    organizerName: "Soft Plans Club",
    color: "baby",
    groupMembersGoing: [members[0], members[3]],
    ticketDetails: "Entry included with RSVP",
    verified: true

  }
];

export const rsvps: RSVP[] = [
  { id: "rsvp-1", userId: "user-1", eventId: "evt-3", status: "locked", selectedDate: "Friday", selectedTimeRange: "Evening", radius: 12, budgetMax: 30, categories: ["Culture"], revealAt: isoIn(24), createdAt: new Date().toISOString() },
  { id: "rsvp-2", userId: "user-1", eventId: "evt-2", status: "revealed", selectedDate: "Tonight", selectedTimeRange: "Evening", radius: 10, budgetMax: 75, categories: ["Nightlife"], revealAt: isoIn(.2), createdAt: new Date().toISOString() },
  { id: "rsvp-3", userId: "user-1", eventId: "evt-5", status: "locked", selectedDate: "Tomorrow", selectedTimeRange: "Sunset", radius: 8, budgetMax: 40, categories: ["Chill"], revealAt: isoIn(12), createdAt: new Date().toISOString() }
];

export const pastEvents: PastEvent[] = [
  { id: "past-1", name: "The Velvet Lounge", date: "Oct 12", category: "Nightlife", icon: "/icons/nightlife.svg", address: "148 Lafayette Street, New York, NY", wouldDoAgain: "Would do again — great vibe, easy entry, perfect surprise level." },
  { id: "past-2", name: "Neon Gallery", date: "Sep 28", category: "Culture", icon: "/icons/culture.svg", address: "37 Walker Street, New York, NY", wouldDoAgain: "Would do again — quiet, pretty, and fun with friends." },
  { id: "past-3", name: "Secret Supper Club", date: "Sep 15", category: "Dining", icon: "/icons/dining.svg", address: "412 West Broadway, New York, NY", wouldDoAgain: "Maybe — food was excellent, but the commute was long." }
];

export const groups: Group[] = [
  { id: "g1", name: "Friday Adventure Squad", members: [members[0], members[1], members[2], members[3]], readiness: 50, code: "FRIDAY", role: "Owner", icon: "☾", upcomingPlan: "Secret Warehouse Rave", upcomingDateTime: "July 7th at 8 PM", memberStatuses: { m1: "RSVP'd yes", m2: "Haven't RSVP'd yet", m3: "Haven't RSVP'd yet", m4: "RSVP'd yes" } },
  { id: "g2", name: "Rutgers Crew", members: [members[3], members[0], members[1]], readiness: 66, code: "RUKNGT", role: "Member", icon: "◈", upcomingPlan: "Gallery night", upcomingDateTime: "July 12th at 7 PM", memberStatuses: { m4: "RSVP'd yes", m1: "RSVP'd no", m2: "RSVP'd yes" } }
];

export const currentUser = {
  id: "user-1",
  name: "Ayaan Malik",
  email: "ayaan@example.com",
  phone: "(732) 555-0198",
  defaultAddress: "New York, NY"
};

export const userPreferences = {
  defaultRadius: 12,
  favoriteCategories: ["Nightlife", "Dining", "Culture", "Comedy"],

  notificationPreferences: [
    "Reveal reminders",
    "Group activity",
    "Event changes",
    "Weekly ideas"
  ],

  safetyPreferences: [
    "Verified organizers only",
    "Emergency contact",
    "Accessibility notes"
  ],

  notifications: {
    revealReminders: true,
    groupActivity: true,
    eventChanges: true,
    weeklyIdeas: false
  },

  safety: {
    verifiedOrganizersOnly: true,
    emergencyContact: true,
    accessibilityNotes: true
  }
};
