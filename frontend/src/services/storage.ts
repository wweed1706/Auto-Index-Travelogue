import type { Journey, Itinerary, MediaItem } from "../types";
import type { LegacyJourney, LegacyItinerary } from "../types/legacy";

type StoreName = "journeys" | "itineraries" | "media" | "users" | "drafts";
const accessError = () =>
  new Error("Không thể mở bộ nhớ thiết bị. Hãy kiểm tra quyền lưu dữ liệu.");
const writeError = () =>
  new Error(
    "Không thể lưu hoặc đọc dữ liệu. Bộ nhớ có thể đã đầy; vui lòng thử lại.",
  );

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open("travelogue-local", 2);
    } catch {
      reject(accessError());
      return;
    }
    request.onupgradeneeded = () => {
      const db = request.result;
      const transaction = request.transaction;
      if (!transaction) return;
      for (const name of [
        "journeys",
        "itineraries",
        "users",
        "drafts",
      ] as const) {
        const store = db.objectStoreNames.contains(name)
          ? transaction.objectStore(name)
          : db.createObjectStore(name, { keyPath: "id" });
        const field = name === "users" ? "email" : "ownerId";
        if (!store.indexNames.contains(field))
          store.createIndex(field, field, { unique: name === "users" });
      }
      const media = db.createObjectStore("media", { keyPath: "id" });
      media.createIndex("journeyId", "journeyId");
      // Upgrade v1 in the same transaction. Blob data is preserved, never JSON-serialized.
      const journeys = transaction.objectStore("journeys");
      journeys.openCursor().onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (!cursor) return;
        const old = cursor.value as LegacyJourney;
        const metadata = old.media.map((item) => {
          const next: MediaItem = {
            ...item,
            journeyId: old.id,
            mimeType: item.blob.type,
            sizeBytes: item.blob.size,
            tags: old.tags,
            location: old.location,
          };
          media.put(next);
          const { blob: _blob, ...meta } = next;
          void _blob;
          return meta;
        });
        const next: Journey = {
          ...old,
          ownerId: "legacy",
          media: metadata,
          summary: "",
          updatedAt: old.createdAt,
        };
        cursor.update(next);
        cursor.continue();
      };
      const itineraries = transaction.objectStore("itineraries");
      itineraries.openCursor().onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (!cursor) return;
        const old = cursor.value as LegacyItinerary;
        const next: Itinerary = {
          ...old,
          ownerId: "legacy",
          updatedAt: old.createdAt,
          days: old.days.map((day) => ({
            ...day,
            activities: day.activities.map((activity) => ({
              id: activity.id || crypto.randomUUID(),
              time: activity.time,
              location: activity.location,
              note: activity.aiNote || "",
              costAmount:
                Number((activity.cost || "").replace(/[^\d]/g, "")) || 0,
              durationMinutes: Math.max(
                15,
                Math.min(
                  720,
                  (Number((activity.duration || "60").match(/\d+/)?.[0]) ||
                    60) *
                    (/giờ|hours?|h\b/i.test(activity.duration || "") ? 60 : 1),
                ),
              ),
              placeId: activity.placeId,
            })),
          })),
        };
        cursor.update(next);
        cursor.continue();
      };
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(accessError());
    request.onblocked = () =>
      reject(new Error("Hãy đóng các tab Travelogue khác rồi thử lại."));
  });
}

async function transact<T>(
  names: StoreName[],
  mode: IDBTransactionMode,
  operation: (
    get: (name: StoreName) => IDBObjectStore,
    tx: IDBTransaction,
    fail: (error: Error) => void,
  ) => () => T,
): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let tx: IDBTransaction;
    let result: () => T;
    let failure: Error | undefined;
    try {
      tx = db.transaction(names, mode);
      result = operation(
        (name) => tx.objectStore(name),
        tx,
        (error) => {
          failure = error;
          tx.abort();
        },
      );
    } catch {
      db.close();
      reject(writeError());
      return;
    }
    tx.oncomplete = () => {
      db.close();
      resolve(result());
    };
    tx.onabort = tx.onerror = () => {
      db.close();
      reject(failure || writeError());
    };
  });
}
function single<T>(
  name: StoreName,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
) {
  return transact([name], mode, (get) => {
    const request = operation(get(name));
    return () => request.result;
  });
}
function owned<T>(name: "journeys" | "itineraries", ownerId: string) {
  return single<T[]>(name, "readonly", (store) =>
    store.index("ownerId").getAll(ownerId),
  );
}
export const storage = {
  importPlans: (plans: Itinerary[]) =>
    transact<void>(["itineraries"], "readwrite", (get) => {
      plans.forEach((plan) => get("itineraries").put(plan));
      return () => undefined;
    }),
  itineraries: (ownerId: string) => owned<Itinerary>("itineraries", ownerId),
  saveItinerary: (itinerary: Itinerary) =>
    transact<Itinerary>(["itineraries"], "readwrite", (get, tx) => {
      const previous = get("itineraries").get(itinerary.id) as IDBRequest<
        Itinerary | undefined
      >;
      previous.onsuccess = () => {
        if (previous.result && previous.result.ownerId !== itinerary.ownerId) {
          tx.abort();
          return;
        }
        get("itineraries").put(itinerary);
      };
      return () => itinerary;
    }),
  mutateItinerary: (
    id: string,
    ownerId: string,
    transform: (plan: Itinerary) => Itinerary,
  ) =>
    transact<Itinerary>(["itineraries"], "readwrite", (get, _tx, fail) => {
      let result: Itinerary;
      const request = get("itineraries").get(id) as IDBRequest<
        Itinerary | undefined
      >;
      request.onsuccess = () => {
        if (!request.result || request.result.ownerId !== ownerId) {
          fail(new Error("Không tìm thấy kế hoạch."));
          return;
        }
        try {
          result = {
            ...transform(request.result),
            updatedAt: new Date().toISOString(),
          };
          get("itineraries").put(result);
        } catch (error) {
          fail(error instanceof Error ? error : writeError());
        }
      };
      return () => result;
    }),
  deleteItinerary: (id: string, ownerId: string) =>
    transact<Itinerary>(["itineraries"], "readwrite", (get, tx) => {
      let result: Itinerary;
      const request = get("itineraries").get(id) as IDBRequest<
        Itinerary | undefined
      >;
      request.onsuccess = () => {
        if (!request.result || request.result.ownerId !== ownerId) {
          tx.abort();
          return;
        }
        result = request.result;
        get("itineraries").delete(id);
      };
      return () => result;
    }),
  clearItineraries: (ownerId: string) =>
    transact<void>(["itineraries"], "readwrite", (get) => {
      const request = get("itineraries").index("ownerId").openCursor(ownerId);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      return () => undefined;
    }),
};
