import { useLibrary } from "../context/LibraryContext";
import { appendActivity, createDraft } from "../services/planner";
import type { Activity, Itinerary, PlannerInput } from "../types";
export function usePlanner() {
  const library = useLibrary();
  const create = async (input: PlannerInput) => {
    const plan = createDraft(input);
    await library.saveItinerary(plan);
    return plan;
  };
  const addActivity = (plan: Itinerary, day: number, activity: Activity) =>
    library.saveItinerary(appendActivity(plan, day, activity));
  return { ...library, create, addActivity };
}
