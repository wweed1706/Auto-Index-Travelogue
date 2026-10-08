import type { Journey, Itinerary } from "./domain";
export interface LegacyMedia {
  id: string;
  name: string;
  kind: "image" | "video" | "audio";
  blob: Blob;
}
export interface LegacyJourney {
  id: string;
  title: string;
  location: string;
  date: string;
  notes: string;
  tags: string[];
  media: LegacyMedia[];
  createdAt: string;
}
export interface LegacyActivity {
  id?: string;
  time: string;
  location: string;
  aiNote?: string;
  cost?: string;
  duration?: string;
  placeId?: string;
}
export interface LegacyItinerary {
  id: string;
  criteria: Itinerary["criteria"];
  days: {
    dayNumber: number;
    date: string;
    title: string;
    activities: LegacyActivity[];
  }[];
  createdAt: string;
}
export interface DeletedJourney {
  journey: Journey;
  media: import("./domain").MediaItem[];
}
