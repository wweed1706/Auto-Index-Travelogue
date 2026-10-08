import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import { useToast } from "../context/ToastContext";
import { messageOf } from "../services/utils";
export function useJourney(id?: string) {
  const library = useLibrary();
  const { notify } = useToast();
  const [mutationError, setMutationError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const remove = async (journeyId: string) => {
    if (deleting) return false;
    setDeleting(true);
    setMutationError("");
    try {
      const deleted = await library.deleteJourney(journeyId);
      notify("Đã xóa chuyến đi", {
        label: "Hoàn tác",
        run: () => {
          void library
            .restoreJourney(deleted)
            .then(() => notify("Đã khôi phục chuyến đi"))
            .catch((err: unknown) =>
              notify(messageOf(err), undefined, "error"),
            );
        },
      });
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
    journey: library.journeys.find((item) => item.id === id),
    mutationError,
    deleting,
    remove,
  };
}
