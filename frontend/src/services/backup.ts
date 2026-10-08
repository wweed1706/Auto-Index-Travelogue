import type {
  Activity,
  Coordinates,
  JourneyInput,
  LibraryBackup,
  PlannerInput,
  SelectedFile,
} from "../types";
import { storage } from "./storage";
import { makeJourney } from "./journeys";
import { createDraft, validateActivity } from "./planner";
import { delay } from "./utils";
function dataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Không thể đọc media."));
    reader.onerror = () => reject(new Error("Không thể đọc media."));
    reader.readAsDataURL(blob);
  });
}
export async function exportBackup(ownerId: string) {
  const [journeys, plans] = await Promise.all([
    storage.journeys(ownerId),
    storage.itineraries(ownerId),
  ]);
  const backup: LibraryBackup = {
    format: "travelogue",
    version: 2,
    exportedAt: new Date().toISOString(),
    journeys: await Promise.all(
      journeys.map(async (journey) => ({
        input: {
          title: journey.title,
          location: journey.location,
          date: journey.date,
          notes: journey.notes,
          tags: journey.tags,
          coordinates: journey.coordinates,
        },
        createdAt: journey.createdAt,
        media: await Promise.all(
          (await storage.media(journey.id, ownerId)).map(async (media) => ({
            name: media.name,
            mimeType: media.mimeType,
            dataUrl: await dataUrl(media.blob),
          })),
        ),
      })),
    ),
    itineraries: plans.map((plan) => ({
      criteria: plan.criteria,
      days: plan.days,
      createdAt: plan.createdAt,
    })),
  };
  return new Blob([JSON.stringify(backup)], { type: "application/json" });
}
const invalid = () =>
  new Error("Bản sao không hợp lệ hoặc không đúng định dạng Travelogue.");
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw invalid();
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== "string") throw invalid();
  return value;
}
function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw invalid();
  return value;
}
function strings(value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    !value.every((item: unknown) => typeof item === "string")
  )
    throw invalid();
  return value as string[];
}
function coordinates(value: unknown): Coordinates | undefined {
  if (value === undefined) return undefined;
  const point = object(value);
  const latitude = number(point.latitude);
  const longitude = number(point.longitude);
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) throw invalid();
  return { latitude, longitude };
}
function parseActivity(value: unknown): Activity {
  const item = object(value);
  const activity: Activity = {
    id: crypto.randomUUID(),
    time: text(item.time),
    location: text(item.location),
    note: text(item.note),
    costAmount: number(item.costAmount),
    durationMinutes: number(item.durationMinutes),
    coordinates: coordinates(item.coordinates),
  };
  if (typeof item.placeId === "string") activity.placeId = item.placeId;
  if (
    item.category === "hotel" ||
    item.category === "restaurant" ||
    item.category === "activity" ||
    item.category === "checkin"
  )
    activity.category = item.category;
  validateActivity(activity);
  return activity;
}
export async function importBackup(file: File, ownerId: string) {
  if (file.size > 300 * 1024 * 1024)
    throw new Error("Bản sao vượt quá 300 MB.");
  let raw: unknown;
  try {
    raw = JSON.parse(await file.text());
  } catch {
    throw invalid();
  }
  const data = object(raw);
  if (
    data.format !== "travelogue" ||
    data.version !== 2 ||
    !Array.isArray(data.journeys) ||
    !Array.isArray(data.itineraries) ||
    data.journeys.length > 1000 ||
    data.itineraries.length > 1000
  )
    throw invalid();
  const journeys = [];
  for (const value of data.journeys as unknown[]) {
    const item = object(value);
    const values = object(item.input);
    const input: JourneyInput = {
      title: text(values.title),
      location: text(values.location),
      date: text(values.date),
      notes: text(values.notes),
      tags: strings(values.tags),
      coordinates: coordinates(values.coordinates),
    };
    if (!Array.isArray(item.media) || item.media.length > 40) throw invalid();
    const files: SelectedFile[] = (item.media as unknown[]).map((value) => {
      const media = object(value);
      const encoded = text(media.dataUrl);
      const match =
        /^data:(image\/(?:jpeg|png|webp|gif)|video\/(?:mp4|webm)|audio\/(?:mpeg|mp3|wav|x-wav|ogg|webm|mp4|aac));base64,([\s\S]*)$/.exec(
          encoded,
        );
      if (
        !match ||
        match[1] !== media.mimeType ||
        match[2].length > 70 * 1024 * 1024
      )
        throw invalid();
      let bytes: Uint8Array<ArrayBuffer>;
      try {
        bytes = Uint8Array.from(atob(match[2]), (character) =>
          character.charCodeAt(0),
        );
      } catch {
        throw invalid();
      }
      if (bytes.byteLength > 50 * 1024 * 1024) throw invalid();
      const file = new File([bytes], text(media.name), { type: match[1] });
      return {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: "",
        type: file.type,
        previewUrl: null,
        isVideo: file.type.startsWith("video/"),
      };
    });
    if (
      files.reduce((sum, item) => sum + item.file.size, 0) >
      200 * 1024 * 1024
    )
      throw invalid();
    const result = makeJourney(input, files, ownerId);
    result.journey.createdAt = text(item.createdAt);
    if (!Number.isFinite(Date.parse(result.journey.createdAt))) throw invalid();
    journeys.push(result);
    await delay(0);
  }
  const plans = (data.itineraries as unknown[]).map((value) => {
    const item = object(value);
    const values = object(item.criteria);
    const criteria: PlannerInput = {
      destination: text(values.destination),
      startDate: text(values.startDate),
      endDate: text(values.endDate),
      budget: number(values.budget),
      travelers: number(values.travelers),
      interests: strings(values.interests),
      dislikes: text(values.dislikes),
    };
    const plan = createDraft(criteria, ownerId);
    if (!Array.isArray(item.days) || item.days.length !== plan.days.length)
      throw invalid();
    const days: unknown[] = item.days;
    plan.days = plan.days.map((day, index) => {
      const previous = object(days[index]);
      if (
        previous.date !== day.date ||
        !Array.isArray(previous.activities) ||
        previous.activities.length > 100
      )
        throw invalid();
      return {
        ...day,
        title: text(previous.title),
        activities: (previous.activities as unknown[]).map(parseActivity),
      };
    });
    plan.createdAt = text(item.createdAt);
    if (!Number.isFinite(Date.parse(plan.createdAt))) throw invalid();
    return plan;
  });
  await storage.importLibrary(journeys, plans);
  return { journeys: journeys.length, plans: plans.length };
}
