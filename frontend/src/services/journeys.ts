import type {
  Journey,
  JourneyInput,
  LibraryFilters,
  LibrarySearchResult,
} from "../types";
import { delay, normalize, validDate } from "./utils";

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

export const journeyService = {
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
    const matches = journeys.filter((journey) => {
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
    });
    return {
      journeys: matches,
      summary: matches.length
        ? `Tìm thấy ${matches.length} chuyến đi với ${matches.reduce((count, journey) => count + journey.media.length, 0)} tệp media. ${[...new Set(matches.map((journey) => journey.location))].slice(0, 3).join(" · ")}.`
        : "Chưa tìm thấy ký ức phù hợp. Thử một địa điểm, chủ đề hoặc khoảng ngày khác.",
    };
  },
};
