import { useState } from "react";
import type { Activity } from "../types";
import { validateActivity } from "../services/planner";
import { messageOf } from "../services/utils";
export function useActivityForm(
  onSave: (activity: Activity) => Promise<boolean>,
  initial?: Activity,
  time = "09:00",
) {
  const [activity, setActivity] = useState<Activity>(
    () =>
      initial || {
        id: crypto.randomUUID(),
        time,
        location: "",
        note: "",
        durationMinutes: 60,
        costAmount: 0,
      },
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const setField = <K extends keyof Activity>(key: K, value: Activity[K]) => {
    setActivity((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const submit = async () => {
    if (busy) return;
    try {
      validateActivity(activity);
    } catch (err) {
      setError(messageOf(err));
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSave(activity);
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };
  return { activity, setField, busy, error, submit };
}
