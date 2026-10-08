import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { journeyService } from "../services/journeys";
import { isAbort, messageOf } from "../services/utils";
import type { LibraryFilters, LibrarySearchResult } from "../types";
export function useGallery() {
  const library = useLibrary();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const tag = params.get("tag") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const [result, setResult] = useState<LibrarySearchResult>({
    journeys: [],
    summary: "",
  });
  const [searching, setSearching] = useState(true);
  const [searchError, setSearchError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setSearching(true);
    setSearchError("");
    if (from && to && from > to) {
      setSearchError("Ngày kết thúc cần bằng hoặc sau ngày bắt đầu.");
      setSearching(false);
      return;
    }
    journeyService
      .search(library.journeys, { query, tag, from, to }, controller.signal)
      .then((next) => {
        if (!controller.signal.aborted) setResult(next);
      })
      .catch((err: unknown) => {
        if (!isAbort(err)) setSearchError(messageOf(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setSearching(false);
      });
    return () => controller.abort();
  }, [library.journeys, query, tag, from, to]);
  const setFilter = (key: keyof LibraryFilters, value: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key === "query" ? "q" : key, value);
        else next.delete(key === "query" ? "q" : key);
        next.delete("tab");
        return next;
      },
      { replace: true },
    );
  const tags = useMemo(
    () => [...new Set(library.journeys.flatMap((journey) => journey.tags))],
    [library.journeys],
  );
  const clear = () => setParams({}, { replace: true });
  return {
    ...library,
    matches: result.journeys,
    summary: result.summary,
    query,
    tag,
    from,
    to,
    tags,
    searching,
    searchError,
    setFilter,
    clear,
    filtered: Boolean(query || tag || from || to),
  };
}
