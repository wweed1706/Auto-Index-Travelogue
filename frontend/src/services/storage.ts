import type {
  Journey,
  Itinerary,
  MediaItem,
  UserRecord,
  UploadDraftRecord,
} from "../types";
import type {
  DeletedJourney,
  LegacyJourney,
  LegacyItinerary,
} from "../types/legacy";

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
  importLibrary: (
    journeys: { journey: Journey; media: MediaItem[] }[],
    plans: Itinerary[],
  ) =>
    transact<void>(["journeys", "media", "itineraries"], "readwrite", (get) => {
      journeys.forEach(({ journey, media }) => {
        get("journeys").put(journey);
        media.forEach((item) => get("media").put(item));
      });
      plans.forEach((plan) => get("itineraries").put(plan));
      return () => undefined;
    }),
  journeys: (ownerId: string) => owned<Journey>("journeys", ownerId),
  itineraries: (ownerId: string) => owned<Itinerary>("itineraries", ownerId),
  userByEmail: (email: string) =>
    single<UserRecord | undefined>("users", "readonly", (store) =>
      store.index("email").get(email),
    ),
  userById: (id: string) =>
    single<UserRecord | undefined>("users", "readonly", (store) =>
      store.get(id),
    ),
  userCount: () =>
    single<number>("users", "readonly", (store) => store.count()),
  saveUser: (user: UserRecord) =>
    single<IDBValidKey>("users", "readwrite", (store) => store.put(user)),
  addUser: (user: UserRecord) =>
    single<IDBValidKey>("users", "readwrite", (store) => store.add(user)),
  draft: (ownerId: string) =>
    single<UploadDraftRecord | undefined>("drafts", "readonly", (store) =>
      store.get(ownerId),
    ),
  saveDraft: (draft: UploadDraftRecord) =>
    single<IDBValidKey>("drafts", "readwrite", (store) => store.put(draft)),
  deleteDraft: (ownerId: string) =>
    single<undefined>("drafts", "readwrite", (store) => store.delete(ownerId)),
  media: (journeyId: string, ownerId: string) =>
    transact<MediaItem[]>(["journeys", "media"], "readonly", (get) => {
      let result: MediaItem[] = [];
      const journey = get("journeys").get(journeyId) as IDBRequest<
        Journey | undefined
      >;
      journey.onsuccess = () => {
        if (journey.result?.ownerId !== ownerId) return;
        const media = get("media")
          .index("journeyId")
          .getAll(journeyId) as IDBRequest<MediaItem[]>;
        media.onsuccess = () => {
          result = media.result;
        };
      };
      return () => result;
    }),
  mediaItem: (id: string, ownerId: string) =>
    transact<MediaItem | undefined>(
      ["journeys", "media"],
      "readonly",
      (get) => {
        let result: MediaItem | undefined;
        const media = get("media").get(id) as IDBRequest<MediaItem | undefined>;
        media.onsuccess = () => {
          if (!media.result) return;
          const journey = get("journeys").get(
            media.result.journeyId,
          ) as IDBRequest<Journey | undefined>;
          journey.onsuccess = () => {
            if (journey.result?.ownerId === ownerId) result = media.result;
          };
        };
        return () => result;
      },
    ),
  saveJourney: (
    journey: Journey,
    media: MediaItem[] = [],
    removedIds: string[] = [],
    clearDraft = false,
  ) =>
    transact<Journey>(
      ["journeys", "media", "drafts"],
      "readwrite",
      (get, tx) => {
        const previous = get("journeys").get(journey.id) as IDBRequest<
          Journey | undefined
        >;
        previous.onsuccess = () => {
          if (previous.result && previous.result.ownerId !== journey.ownerId) {
            tx.abort();
            return;
          }
          get("journeys").put(journey);
          media.forEach((item) => get("media").put(item));
          removedIds.forEach((id) => get("media").delete(id));
          if (clearDraft) get("drafts").delete(journey.ownerId);
        };
        return () => journey;
      },
    ),
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
  deleteJourney: (id: string, ownerId: string) =>
    transact<DeletedJourney>(["journeys", "media"], "readwrite", (get, tx) => {
      let result: DeletedJourney;
      const journey = get("journeys").get(id) as IDBRequest<
        Journey | undefined
      >;
      journey.onsuccess = () => {
        if (!journey.result || journey.result.ownerId !== ownerId) {
          tx.abort();
          return;
        }
        const media = get("media").index("journeyId").getAll(id) as IDBRequest<
          MediaItem[]
        >;
        media.onsuccess = () => {
          result = { journey: journey.result!, media: media.result };
          get("journeys").delete(id);
          media.result.forEach((item) => get("media").delete(item.id));
        };
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
  claimLegacy: (ownerId: string) =>
    transact<void>(["journeys", "itineraries"], "readwrite", (get) => {
      for (const name of ["journeys", "itineraries"] as const) {
        const request = get(name).index("ownerId").openCursor("legacy");
        request.onsuccess = () => {
          const cursor = request.result;
          if (!cursor) return;
          cursor.update({ ...(cursor.value as Journey | Itinerary), ownerId });
          cursor.continue();
        };
      }
      return () => undefined;
    }),
  clearLibrary: (ownerId: string) =>
    transact<void>(
      ["journeys", "itineraries", "media", "drafts"],
      "readwrite",
      (get) => {
        for (const name of ["journeys", "itineraries"] as const) {
          const request = get(name).index("ownerId").openCursor(ownerId);
          request.onsuccess = () => {
            const cursor = request.result;
            if (!cursor) return;
            if (name === "journeys") {
              const media = get("media")
                .index("journeyId")
                .openCursor(cursor.primaryKey);
              media.onsuccess = () => {
                const item = media.result;
                if (item) {
                  item.delete();
                  item.continue();
                }
              };
            }
            cursor.delete();
            cursor.continue();
          };
        }
        get("drafts").delete(ownerId);
        return () => undefined;
      },
    ),
};
