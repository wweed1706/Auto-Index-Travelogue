export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  avatar?: string;
}
export interface UserRecord extends User {
  salt: string;
  passwordHash: string;
}
export interface Session {
  userId: string;
  expiresAt: number;
}
export interface Credentials {
  email: string;
  password: string;
  name?: string;
}
export type MediaKind = "image" | "video" | "audio";
export interface MediaMetadata {
  id: string;
  journeyId: string;
  name: string;
  kind: MediaKind;
  mimeType: string;
  sizeBytes: number;
  takenAt?: string;
  tags: string[];
  location?: string;
}
export interface MediaItem extends MediaMetadata {
  blob: Blob;
}
export interface Journey {
  id: string;
  ownerId: string;
  title: string;
  location: string;
  date: string;
  notes: string;
  tags: string[];
  media: MediaMetadata[];
  coordinates?: Coordinates;
  summary: string;
  createdAt: string;
  updatedAt: string;
}
export interface JourneyInput {
  title: string;
  location: string;
  date: string;
  notes: string;
  tags: string[];
  coordinates?: Coordinates;
}
export interface JourneyDraft extends JourneyInput {
  id: string;
  ownerId: string;
  updatedAt: string;
}
export interface UploadDraftRecord {
  id: string;
  ownerId: string;
  input: JourneyInput;
  media: MediaItem[];
  updatedAt: string;
}
export interface StorageInfo {
  usage: number;
  quota: number;
}
export interface BackupMedia {
  name: string;
  mimeType: string;
  dataUrl: string;
}
export interface BackupJourney {
  input: JourneyInput;
  media: BackupMedia[];
  createdAt: string;
}
export interface BackupPlan {
  criteria: PlannerInput;
  days: ItineraryDay[];
  createdAt: string;
}
export interface LibraryBackup {
  format: "travelogue";
  version: 2;
  exportedAt: string;
  journeys: BackupJourney[];
  itineraries: BackupPlan[];
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
  id: string;
  time: string;
  location: string;
  note: string;
  costAmount: number;
  durationMinutes: number;
  placeId?: string;
  coordinates?: Coordinates;
  category?: PlaceCategory;
}
export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  activities: Activity[];
}
export interface Itinerary {
  id: string;
  ownerId: string;
  criteria: PlannerInput;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}
export type PlaceCategory = "hotel" | "restaurant" | "checkin" | "activity";
export interface Place {
  id: string;
  destinationId: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  tags: string[];
  costAmount: number;
  durationMinutes: number;
  coordinates: Coordinates;
  matchScore?: number;
}
export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  coordinates: Coordinates;
  color: string;
  symbol: string;
}
export interface MapPoint {
  id: string;
  name: string;
  coordinates: Coordinates;
  category?: PlaceCategory;
}
export type ProcessingStage =
  "idle" | "checking" | "analyzing" | "saving" | "complete";
export interface LibraryFilters {
  query: string;
  tag: string;
  from: string;
  to: string;
}
export interface LibrarySearchResult {
  journeys: Journey[];
  summary: string;
}
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
export interface SearchResult {
  query: string;
  summaryText: string;
  stats?: { places: string; photosCount: string; timeRange: string };
  matchingPhotos: Photo[];
}
export type ApiResponse<T> =
  { status: "success"; data: T } | { status: "error"; message: string };
export interface ToastMessage {
  id: string;
  message: string;
  tone: "success" | "error";
  action?: { label: string; run: () => void };
}
