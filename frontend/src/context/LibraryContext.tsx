import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { storage } from "../services/storage";
import { delay, messageOf } from "../services/utils";
import type { Journey, Itinerary, MediaItem } from "../types";
import type { DeletedJourney } from "../types/legacy";
interface LibraryState {
  ownerId: string;
  journeys: Journey[];
  itineraries: Itinerary[];
  loading: boolean;
  error: string;
  reload: (silent?: boolean) => Promise<void>;
  commitJourney: (journey: Journey) => void;
  saveJourney: (journey: Journey, media?: MediaItem[]) => Promise<void>;
  deleteJourney: (id: string) => Promise<DeletedJourney>;
  restoreJourney: (deleted: DeletedJourney) => Promise<void>;
  saveItinerary: (plan: Itinerary) => Promise<void>;
  mutateItinerary: (
    id: string,
    transform: (plan: Itinerary) => Itinerary,
  ) => Promise<Itinerary>;
  deleteItinerary: (id: string) => Promise<Itinerary>;
}
const LibraryContext = createContext<LibraryState | null>(null);
export function LibraryProvider({
  ownerId,
  children,
}: {
  ownerId: string;
  children: ReactNode;
}) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const broadcast = useCallback(
    () => channel.current?.postMessage(ownerId),
    [ownerId],
  );
  const reload = useCallback(
    async (silent = false) => {
      const request = ++generation.current;
      if (!silent) setLoading(true);
      setError("");
      try {
        const [nextJourneys, nextPlans] = await Promise.all([
          storage.journeys(ownerId),
          storage.itineraries(ownerId),
        ]);
        if (request !== generation.current) return;
        setJourneys(
          nextJourneys.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        );
        setItineraries(
          nextPlans.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        );
      } catch (err) {
        if (request === generation.current) setError(messageOf(err));
      } finally {
        if (request === generation.current) setLoading(false);
      }
    },
    [ownerId],
  );
  useEffect(() => {
    void reload();
    if (typeof BroadcastChannel !== "undefined") {
      channel.current = new BroadcastChannel("travelogue-library");
      channel.current.onmessage = (event: MessageEvent<unknown>) => {
        if (event.data === ownerId) void reload(true);
      };
    }
    const invalidate = () => {
      generation.current++;
    };
    return () => {
      invalidate();
      channel.current?.close();
      channel.current = null;
    };
  }, [ownerId, reload]);
  const commitJourney = useCallback(
    (journey: Journey) => {
      generation.current++;
      setLoading(false);
      setJourneys((items) => [
        journey,
        ...items.filter((item) => item.id !== journey.id),
      ]);
      broadcast();
    },
    [broadcast],
  );
  const commitPlan = (plan: Itinerary) => {
    generation.current++;
    setLoading(false);
    setItineraries((items) => [
      plan,
      ...items.filter((item) => item.id !== plan.id),
    ]);
    broadcast();
  };
  const saveJourney = async (journey: Journey, media: MediaItem[] = []) => {
    await storage.saveJourney(journey, media);
    commitJourney(journey);
  };
  const deleteJourney = async (id: string) => {
    await delay(250);
    const result = await storage.deleteJourney(id, ownerId);
    generation.current++;
    setLoading(false);
    setJourneys((items) => items.filter((item) => item.id !== id));
    broadcast();
    return result;
  };
  const restoreJourney = async (deleted: DeletedJourney) => {
    await saveJourney(deleted.journey, deleted.media);
  };
  const saveItinerary = async (plan: Itinerary) => {
    await storage.saveItinerary(plan);
    commitPlan(plan);
  };
  const mutateItinerary = async (
    id: string,
    transform: (plan: Itinerary) => Itinerary,
  ) => {
    await delay(250);
    const result = await storage.mutateItinerary(id, ownerId, transform);
    commitPlan(result);
    return result;
  };
  const deleteItinerary = async (id: string) => {
    await delay(250);
    const plan = await storage.deleteItinerary(id, ownerId);
    generation.current++;
    setLoading(false);
    setItineraries((items) => items.filter((item) => item.id !== id));
    broadcast();
    return plan;
  };
  return (
    <LibraryContext.Provider
      value={{
        ownerId,
        journeys,
        itineraries,
        loading,
        error,
        reload,
        commitJourney,
        saveJourney,
        deleteJourney,
        restoreJourney,
        saveItinerary,
        mutateItinerary,
        deleteItinerary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("Thiếu LibraryProvider");
  return context;
}
