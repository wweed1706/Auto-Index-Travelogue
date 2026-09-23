import { useLibrary } from "../context/LibraryContext";
export function useJourney(id?: string) {
  const library = useLibrary();
  return {
    ...library,
    journey: library.journeys.find((item) => item.id === id),
  };
}
