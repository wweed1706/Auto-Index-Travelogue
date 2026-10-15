import type { ILocation } from "../types";
import { destinations } from "./catalog";
import { normalize } from "./utils";

export interface LocationSearchProvider {
  search(query: string, signal?: AbortSignal): Promise<ILocation[]>;
}

const mockLocations: ILocation[] = destinations.map((destination) => ({
  name: destination.name,
  lat: destination.coordinates.latitude,
  lng: destination.coordinates.longitude,
  address: `${destination.name}, Việt Nam`,
  placeId: `mock:${destination.id}`,
}));

// Giữ cùng hợp đồng async để có thể thay bằng Google Places/Nominatim sau này.
export const mockLocationProvider: LocationSearchProvider = {
  async search(query, signal) {
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, 120);
      signal?.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );
    });
    const term = normalize(query.trim());
    return mockLocations
      .filter((location) =>
        normalize([location.name, location.address].filter(Boolean).join(" ")).includes(term),
      )
      .slice(0, 6);
  },
};
