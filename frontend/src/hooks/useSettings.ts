import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import { useToast } from "../context/ToastContext";
import { storage } from "../services/storage";
import { exportBackup, importBackup } from "../services/backup";
import { downloadBlob, localDate, messageOf } from "../services/utils";
import type { StorageInfo } from "../types";
import { getJourneys, deleteJourney } from "../services/journeyService";
export function useSettings() {
  const auth = useAuth();
  const library = useLibrary();
  const { notify } = useToast();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [usage, setUsage] = useState<StorageInfo>();
  useEffect(() => {
    let active = true;
    if (navigator.storage?.estimate)
      void navigator.storage
        .estimate()
        .then((result) => {
          if (active)
            setUsage({ usage: result.usage || 0, quota: result.quota || 0 });
        })
        .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [library.journeys, library.itineraries]);
  const run = async (kind: string, operation: () => Promise<void>) => {
    if (busy) return false;
    setBusy(kind);
    setError("");
    try {
      await operation();
      return true;
    } catch (err) {
      setError(messageOf(err));
      return false;
    } finally {
      setBusy("");
    }
  };
  const exportData = () =>
    run("export", async () => {
      const blob = await exportBackup(library.ownerId);
      downloadBlob(blob, "travelogue-" + localDate() + ".json");
      notify("Đã tạo bản sao gồm cả media");
    });
  const importData = (file: File) =>
    run("import", async () => {
      let result;
      try {
        result = await importBackup(file, library.ownerId);
      } finally {
        await library.reload();
      }
      notify(
        `Đã nhập ${result.journeys} chuyến đi và ${result.plans} kế hoạch`,
      );
    });
  const clearData = () =>
    run("clear", async () => {
      try {
        const journeys = await getJourneys();
        for (const journey of journeys) await deleteJourney(journey.id);
        await storage.clearItineraries(library.ownerId);
      } finally {
        await library.reload();
      }
      notify("Đã xóa dữ liệu trong không gian này");
    });
  return {
    name: auth.user?.name || "",
    user: auth.user,
    logout: auth.logout,
    error,
    busy,
    usage,
    exportData,
    importData,
    clearData,
    journeys: library.journeys.length,
    plans: library.itineraries.length,
  };
}
