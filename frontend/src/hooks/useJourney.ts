import { useEffect, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import { useToast } from "../context/ToastContext";
import { messageOf } from "../services/utils";
import { getJourneyById } from "../services/journeyService";
import { ApiError } from "../services/api";
import type { Journey } from "../types";
export function useJourney(id?: string) {
  const library = useLibrary();
  const { notify } = useToast();
  const [mutationError, setMutationError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [detail, setDetail] = useState<Journey>();
  const [detailLoading, setDetailLoading] = useState(Boolean(id));
  const [detailError, setDetailError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setDetail(undefined);
    setDetailLoading(true);
    setDetailError("");
    getJourneyById(id, controller.signal)
      .then((item) => {
        if (!controller.signal.aborted) setDetail(item);
      })
      .catch((err: unknown) => {
        if (
          !controller.signal.aborted &&
          !(err instanceof ApiError && err.status === 404)
        )
          setDetailError(messageOf(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false);
      });
    return () => controller.abort();
  }, [id, revision]);
  const remove = async (journeyId: string) => {
    if (deleting) return false;
    setDeleting(true);
    setMutationError("");
    try {
      await library.removeJourney(journeyId);
      if (journeyId === id) setDetail(undefined);
      notify("Đã xóa chuyến đi");
      return true;
    } catch (err) {
      setMutationError(messageOf(err));
      return false;
    } finally {
      setDeleting(false);
    }
  };
  return {
    ...library,
    journey: id ? detail : undefined,
    loading: id ? detailLoading : library.loading,
    isLoading: id ? detailLoading : library.isLoading,
    error: id ? detailError : library.error,
    reload: async () => {
      if (id) setRevision((value) => value + 1);
      else await library.fetchJourneys();
    },
    mutationError,
    deleting,
    remove,
  };
}
