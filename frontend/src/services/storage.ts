import type { Journey, Itinerary } from "../types";

type Store = "journeys" | "itineraries";
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open("travelogue-local", 1);
    } catch {
      reject(
        new Error(
          "Không thể mở bộ nhớ thiết bị. Hãy kiểm tra quyền lưu dữ liệu.",
        ),
      );
      return;
    }
    request.onupgradeneeded = () => {
      for (const name of ["journeys", "itineraries"])
        request.result.createObjectStore(name, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        new Error(
          "Không thể mở bộ nhớ thiết bị. Hãy kiểm tra quyền lưu dữ liệu.",
        ),
      );
    request.onblocked = () =>
      reject(new Error("Hãy đóng các tab Travelogue khác rồi thử lại."));
  });
}

// Chỉ báo lưu thành công khi transaction hoàn tất, bao gồm cả dữ liệu Blob của media.
async function transact<T>(
  store: Store,
  mode: IDBTransactionMode,
  operation: (objectStore: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    let request: IDBRequest<T>;
    try {
      request = operation(tx.objectStore(store));
    } catch {
      db.close();
      reject(
        new Error(
          "Không thể lưu dữ liệu. Hãy kiểm tra dung lượng và quyền lưu trữ.",
        ),
      );
      return;
    }
    tx.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    tx.onabort = tx.onerror = () => {
      db.close();
      reject(
        new Error(
          "Không thể lưu hoặc đọc dữ liệu. Bộ nhớ có thể đã đầy; vui lòng thử lại.",
        ),
      );
    };
  });
}

export const storage = {
  journeys: () =>
    transact<Journey[]>("journeys", "readonly", (store) => store.getAll()),
  itineraries: () =>
    transact<Itinerary[]>("itineraries", "readonly", (store) => store.getAll()),
  saveJourney: (journey: Journey) =>
    transact<IDBValidKey>("journeys", "readwrite", (store) =>
      store.put(journey),
    ),
  saveItinerary: (itinerary: Itinerary) =>
    transact<IDBValidKey>("itineraries", "readwrite", (store) =>
      store.put(itinerary),
    ),
};
