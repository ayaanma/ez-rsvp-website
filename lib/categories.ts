export const categories = [
  "food",
  "music",
  "sport",
  "arts",
  "comedy",
  "outdoor activities",
  "gaming",
  "nightlife",
  "networking",
] as const;

export type EventCategory = (typeof categories)[number];
