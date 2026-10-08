import type {
  Journey,
  JourneyInput,
  MediaItem,
  SelectedFile,
  ProcessingStage,
  LibraryFilters,
  LibrarySearchResult,
} from "../types";
import { storage } from "./storage";
import { delay, normalize, validDate } from "./utils";
import { findDestination, recommend } from "./catalog";
import { createDraft, suggestItinerary } from "./planner";
import hero from "../assets/travel-hero.jpg";

export function validateJourney(input: JourneyInput, count: number) {
  if (
    !input.title.trim() ||
    input.title.trim().length > 150 ||
    !input.location.trim()
  )
    throw new Error("Vui lòng nhập tên chuyến đi và địa điểm.");
  if (!validDate(input.date))
    throw new Error("Vui lòng chọn ngày chuyến đi hợp lệ.");
  if (!count && !input.notes.trim())
    throw new Error("Thêm ít nhất một tệp media hoặc ghi chú cho chuyến đi.");
  if (
    input.coordinates &&
    (!Number.isFinite(input.coordinates.latitude) ||
      !Number.isFinite(input.coordinates.longitude) ||
      Math.abs(input.coordinates.latitude) > 90 ||
      Math.abs(input.coordinates.longitude) > 180)
  )
    throw new Error("Tọa độ chưa hợp lệ.");
}
export function toMedia(
  files: SelectedFile[],
  journeyId: string,
  input: JourneyInput,
): MediaItem[] {
  return files.map((item) => ({
    id: item.id,
    journeyId,
    name: item.name,
    kind: item.type.startsWith("image/")
      ? "image"
      : item.type.startsWith("video/")
        ? "video"
        : "audio",
    blob: item.file,
    mimeType: item.type,
    sizeBytes: item.file.size,
    takenAt: input.date,
    tags: input.tags,
    location: input.location,
  }));
}
export function makeJourney(
  input: JourneyInput,
  files: SelectedFile[],
  ownerId: string,
  existing?: Journey,
) {
  validateJourney(input, files.length);
  const now = new Date().toISOString();
  const id = existing?.id || crypto.randomUUID();
  const media = toMedia(files, id, input);
  const tags = [
    ...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean)),
  ].slice(0, 12);
  const journey: Journey = {
    id,
    ownerId,
    ...input,
    title: input.title.trim(),
    location: input.location.trim(),
    notes: input.notes.trim(),
    tags,
    coordinates:
      input.coordinates || findDestination(input.location)?.coordinates,
    summary: `${input.title.trim()} tại ${input.location.trim()}. ${files.length ? `Hành trình lưu lại ${files.length} tệp media` : "Một trang nhật ký được lưu lại"}${tags.length ? `, với các chủ đề ${tags.join(", ")}` : ""}. ${input.notes.trim() ? input.notes.trim().slice(0, 220) : "Những khoảnh khắc nhỏ, một ký ức riêng."}`,
    media: media.map(({ blob, ...metadata }) => {
      void blob;
      return metadata;
    }),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  return { journey, media };
}
export const journeyService = {
  async process(
    input: JourneyInput,
    files: SelectedFile[],
    ownerId: string,
    onStage: (stage: ProcessingStage) => void,
    signal: AbortSignal,
    existing?: Journey,
  ) {
    validateJourney(input, files.length);
    onStage("checking");
    await delay(400, signal);
    onStage("analyzing");
    await delay(850, signal);
    const result = makeJourney(input, files, ownerId, existing);
    onStage("saving");
    // Once a durable write begins, cancellation is disabled in the UI.
    await delay(250, signal);
    const removed =
      existing?.media
        .filter((item) => !files.some((file) => file.id === item.id))
        .map((item) => item.id) || [];
    await storage.saveJourney(result.journey, result.media, removed, !existing);
    onStage("complete");
    return result.journey;
  },
  async search(
    journeys: Journey[],
    filters: LibraryFilters,
    signal?: AbortSignal,
  ): Promise<LibrarySearchResult> {
    await delay(350, signal);
    const stopWords = new Set([
      "tim",
      "cho",
      "toi",
      "nhung",
      "anh",
      "chuyen",
      "di",
      "o",
      "tai",
      "va",
      "cua",
      "ve",
      "co",
      "ky",
      "uc",
    ]);
    const tokens = normalize(filters.query.trim())
      .split(/\s+/)
      .filter((token) => token && !stopWords.has(token));
    const matches = journeys
      .filter((journey) => {
        const content = normalize(
          [
            journey.title,
            journey.location,
            journey.notes,
            ...journey.tags,
            ...journey.media.map((item) => item.name),
          ].join(" "),
        );
        return (
          tokens.every((token) => content.includes(token)) &&
          (!filters.tag || journey.tags.includes(filters.tag)) &&
          (!filters.from || journey.date >= filters.from) &&
          (!filters.to || journey.date <= filters.to)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
    return {
      journeys: matches,
      summary: matches.length
        ? `Tìm thấy ${matches.length} chuyến đi với ${matches.reduce((count, journey) => count + journey.media.length, 0)} tệp media. ${[...new Set(matches.map((journey) => journey.location))].slice(0, 3).join(" · ")}.`
        : "Chưa tìm thấy ký ức phù hợp. Thử một địa điểm, chủ đề hoặc khoảng ngày khác.",
    };
  },
};
export async function seedDemo(ownerId: string) {
  const response = await fetch(hero);
  if (!response.ok)
    throw new Error("Không thể tải ảnh minh họa. Vui lòng thử lại.");
  const file = new File([await response.blob()], "mot-sang-tren-duong.jpg", {
    type: "image/jpeg",
  });
  const result = makeJourney(
    {
      title: "Một sáng trên đường",
      location: "Đà Lạt",
      date: "2026-09-20",
      notes:
        "Một chút nắng, một ly cà phê và những khoảng lặng giữa rừng thông. Chuyến đi mẫu để bạn khám phá Travelogue.",
      tags: ["Thiên nhiên", "Cafe"],
    },
    [
      {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: "",
        type: file.type,
        previewUrl: null,
        isVideo: false,
      },
    ],
    ownerId,
  );
  await storage.saveJourney(result.journey, result.media);
  const draft = createDraft(
    {
      destination: "Đà Lạt",
      startDate: "2026-10-10",
      endDate: "2026-10-11",
      budget: 3000000,
      travelers: 2,
      interests: ["Thiên nhiên", "Cafe"],
      dislikes: "",
    },
    ownerId,
  );
  await storage.saveItinerary(
    suggestItinerary(draft, recommend(draft.criteria)),
  );
}
