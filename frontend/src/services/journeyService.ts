import { apiRequest } from "./api";
import type {
  Journey,
  JourneyApiResponse,
  JourneyCreateRequest,
} from "../types";

// Chuyển hợp đồng HTTP sang view model hiện tại, không tạo ID ở frontend.
export function toJourneyView(data: JourneyApiResponse): Journey {
  return {
    ...data,
    ownerId: data.user_id,
    coordinates: data.coordinates ?? undefined,
    media: data.media.map((item) => ({
      ...item,
      journeyId: data.id,
      takenAt: item.takenAt ?? undefined,
      location: item.location ?? undefined,
    })),
  };
}

export async function getJourneys(signal?: AbortSignal): Promise<Journey[]> {
  const result: Journey[] = [];
  // API giới hạn 100/trang; tải đủ danh sách để bộ lọc UI không bỏ sót chuyến đi.
  for (let skip = 0; ; skip += 100) {
    const page = await apiRequest<JourneyApiResponse[]>(
      `/journeys?skip=${skip}&limit=100`,
      { signal },
    );
    result.push(...page.map(toJourneyView));
    if (page.length < 100)
      return [...new Map(result.map((item) => [item.id, item])).values()];
  }
}

export async function getJourneyById(
  id: string,
  signal?: AbortSignal,
): Promise<Journey> {
  return toJourneyView(
    await apiRequest<JourneyApiResponse>(
      `/journeys/${encodeURIComponent(id)}`,
      { signal },
    ),
  );
}

export async function createJourney(
  data: JourneyCreateRequest,
  signal?: AbortSignal,
): Promise<Journey> {
  return toJourneyView(
    await apiRequest<JourneyApiResponse>("/journeys", {
      method: "POST",
      body: JSON.stringify(data),
      signal,
    }),
  );
}

export function deleteJourney(id: string): Promise<void> {
  return apiRequest<void>(`/journeys/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function toJourneyCreate(journey: Journey): JourneyCreateRequest {
  return {
    title: journey.title,
    location: journey.location,
    date: journey.date,
    notes: journey.notes,
    tags: journey.tags,
    coordinates: journey.coordinates,
    summary: journey.summary,
    media: journey.media.map((item) => {
      if (!item.url) throw new Error("Media chưa có URL trên máy chủ.");
      return {
        id: item.id,
        url: item.url,
        name: item.name,
        kind: item.kind,
        mimeType: item.mimeType,
        sizeBytes: item.sizeBytes,
        takenAt: item.takenAt,
        tags: item.tags,
        location: item.location,
      };
    }),
  };
}
