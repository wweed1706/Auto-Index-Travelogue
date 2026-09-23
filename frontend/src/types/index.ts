export interface Photo {
  id: string;
  url: string;
  title: string;
  location: string;
  takenAt: string;
  tags: string[];
}
export interface TimelineNode {
  id: string;
  dayLabel: string;
  date: string;
  time: string;
  location: string;
  aiDescription: string;
  thumbnails: { url: string; caption: string }[];
  tags: string[];
}
export interface MediaItem {
  id: string;
  name: string;
  kind: "image" | "video" | "audio";
  blob: Blob;
}
export interface Journey {
  id: string;
  title: string;
  location: string;
  date: string;
  notes: string;
  tags: string[];
  media: MediaItem[];
  createdAt: string;
}
export interface PlannerInput {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
  dislikes: string;
}
export interface Activity {
  id?: string;
  time: string;
  location: string;
  aiNote?: string;
  cost?: string;
  image?: string;
  duration?: string;
  type?: "sightseeing" | "transport" | "cafe" | "dining" | "activity";
  typeLabel?: string;
  placeId?: string;
}
export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  weather?: string;
  activities: Activity[];
}
export interface Itinerary {
  id: string;
  criteria: PlannerInput;
  days: ItineraryDay[];
  createdAt: string;
}
export type PlaceCategory = "hotel" | "restaurant" | "checkin" | "activity";
export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  categoryLabel?: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  cost?: string;
  matchScore?: number;
  address?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
}
export interface SearchResult {
  query: string;
  summaryText: string;
  stats?: { places: string; photosCount: string; timeRange: string };
  matchingPhotos: Photo[];
}
export interface SelectedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  previewUrl: string | null;
  isVideo: boolean;
}
export interface User {
  email: string;
  name: string;
  avatar?: string;
}
export type ApiResponse<T> =
  | { status: "success"; data: T; message?: string }
  | { status: "error"; data: null; message: string };
