import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { storage } from "../services/storage";
import type { Journey, Itinerary } from "../types";

interface LibraryState {
  journeys: Journey[];
  itineraries: Itinerary[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
  saveJourney: (journey: Journey) => Promise<void>;
  saveItinerary: (itinerary: Itinerary) => Promise<void>;
}
const LibraryContext = createContext<LibraryState | null>(null);
export function LibraryProvider({ children }: { children: ReactNode }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [j, i] = await Promise.all([
        storage.journeys(),
        storage.itineraries(),
      ]);
      setJourneys(j);
      setItineraries(i);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đọc dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  const saveJourney = async (journey: Journey) => {
    await storage.saveJourney(journey);
    setJourneys((prev) => [
      journey,
      ...prev.filter((item) => item.id !== journey.id),
    ]);
  };
  const saveItinerary = async (itinerary: Itinerary) => {
    await storage.saveItinerary(itinerary);
    setItineraries((prev) => [
      itinerary,
      ...prev.filter((item) => item.id !== itinerary.id),
    ]);
  };
  return (
    <LibraryContext.Provider
      value={{
        journeys,
        itineraries,
        loading,
        error,
        reload,
        saveJourney,
        saveItinerary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("LibraryProvider chưa được khởi tạo");
  return context;
}
