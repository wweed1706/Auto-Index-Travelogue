import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useToast } from "../context/ToastContext";
import {
  appendActivity,
  createDraft,
  activityFromPlace,
  moveActivity,
  removeActivity,
  updateActivity,
  suggestItinerary,
  scheduleConflicts,
  nextTime,
} from "../services/planner";
import { recommend } from "../services/catalog";
import { delay, messageOf } from "../services/utils";
import type { Activity, Itinerary, Place, PlannerInput } from "../types";
export function usePlanner(id?: string) {
  const library = useLibrary();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const plan = library.itineraries.find((item) => item.id === id);
  const requestedDay = Number(params.get("day") || 1);
  const selectedDay =
    plan?.days.find((day) => day.dayNumber === requestedDay)?.dayNumber || 1;
  const day = plan?.days.find((item) => item.dayNumber === selectedDay);
  const criteria = plan?.criteria;
  const recommendations = useMemo(
    () => (criteria ? recommend(criteria) : []),
    [criteria],
  );
  const [pending, setPending] = useState(0);
  const [mutationError, setMutationError] = useState("");
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const run = (operation: () => Promise<void>) => {
    setPending((count) => count + 1);
    const job = queue.current
      .catch(() => undefined)
      .then(async () => {
        setMutationError("");
        try {
          await operation();
          return true;
        } catch (err) {
          setMutationError(messageOf(err));
          return false;
        } finally {
          setPending((count) => count - 1);
        }
      });
    queue.current = job;
    return job;
  };
  const create = (input: PlannerInput, suggest = true) =>
    run(async () => {
      await delay(650);
      let next = createDraft(input, library.ownerId);
      if (suggest) next = suggestItinerary(next, recommend(input));
      await library.saveItinerary(next);
      notify(
        suggest
          ? "Kế hoạch đã sẵn sàng để bạn chỉnh sửa"
          : "Đã tạo kế hoạch trống",
      );
      navigate("/planner/" + next.id);
    });
  const mutate = (transform: (current: Itinerary) => Itinerary) =>
    run(async () => {
      if (!id) throw new Error("Chưa chọn kế hoạch.");
      await library.mutateItinerary(id, transform);
    });
  const addPlace = (place: Place) =>
    mutate((current) =>
      appendActivity(
        current,
        selectedDay,
        activityFromPlace(place, current, selectedDay),
      ),
    );
  const saveActivity = (activity: Activity) =>
    mutate((current) =>
      current.days.some((item) =>
        item.activities.some((entry) => entry.id === activity.id),
      )
        ? updateActivity(current, activity)
        : appendActivity(current, selectedDay, activity),
    );
  const remove = (activityId: string) =>
    run(async () => {
      if (!id || !plan) return;
      const sourceDay = plan.days.find((item) =>
        item.activities.some((activity) => activity.id === activityId),
      );
      const activity = sourceDay?.activities.find(
        (item) => item.id === activityId,
      );
      await library.mutateItinerary(id, (current) =>
        removeActivity(current, activityId),
      );
      if (activity && sourceDay)
        notify("Đã xóa hoạt động", {
          label: "Hoàn tác",
          run: () => {
            void mutate((current) =>
              appendActivity(current, sourceDay.dayNumber, activity),
            );
          },
        });
    });
  const move = (activityId: string, targetDay: number, beforeId?: string) =>
    mutate((current) => moveActivity(current, activityId, targetDay, beforeId));
  const changeCriteria = (input: PlannerInput) =>
    mutate((current) => {
      const draft = createDraft(input, library.ownerId);
      if (
        current.days.some(
          (item) =>
            !draft.days.some((next) => next.date === item.date) &&
            item.activities.length,
        )
      )
        throw new Error(
          "Khoảng ngày mới sẽ bỏ hoạt động đã lưu. Hãy chuyển hoặc xóa chúng trước khi rút ngắn.",
        );
      return {
        ...current,
        criteria: draft.criteria,
        days: draft.days.map((item) => ({
          ...item,
          activities:
            current.days.find((previous) => previous.date === item.date)
              ?.activities || [],
        })),
      };
    });
  const deletePlan = (planId: string) =>
    run(async () => {
      const deleted = await library.deleteItinerary(planId);
      notify("Đã xóa kế hoạch", {
        label: "Hoàn tác",
        run: () => {
          void library
            .saveItinerary(deleted)
            .then(() => notify("Đã khôi phục kế hoạch"))
            .catch((err: unknown) =>
              notify(messageOf(err), undefined, "error"),
            );
        },
      });
      if (id === planId) navigate("/planner");
    });
  const selectDay = (dayNumber: number) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("day", String(dayNumber));
        return next;
      },
      { replace: true },
    );
  return {
    ...library,
    error: library.itineraryError,
    plan,
    selectedDay,
    day,
    selectDay,
    recommendations,
    saving: pending > 0,
    mutationError,
    create,
    addPlace,
    saveActivity,
    remove,
    move,
    changeCriteria,
    deletePlan,
    conflicts: scheduleConflicts(day?.activities || []),
    suggestedTime: plan ? nextTime(plan, selectedDay) : "09:00",
    addedPlaceIds:
      day?.activities.flatMap((activity) =>
        activity.placeId ? [activity.placeId] : [],
      ) || [],
    totalCost:
      plan?.days.reduce(
        (total, item) =>
          total +
          item.activities.reduce(
            (sum, activity) => sum + activity.costAmount,
            0,
          ),
        0,
      ) || 0,
  };
}
