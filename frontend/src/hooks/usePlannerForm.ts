import { useState } from "react";
import type { PlannerInput } from "../types";
import { createDraft } from "../services/planner";
import { localDate, messageOf } from "../services/utils";
export function usePlannerForm(
  onSubmit: (input: PlannerInput, suggest: boolean) => Promise<boolean>,
  initial?: PlannerInput,
  destination = "",
) {
  const [input, setInput] = useState<PlannerInput>(() => {
    const end = new Date();
    end.setDate(end.getDate() + 2);
    return (
      initial || {
        destination,
        startDate: localDate(),
        endDate: localDate(end),
        budget: 3000000,
        travelers: 2,
        interests: ["Thiên nhiên", "Ẩm thực"],
        dislikes: "",
      }
    );
  });
  const [suggest, setSuggest] = useState(!initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const setField = <K extends keyof PlannerInput>(
    key: K,
    value: PlannerInput[K],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const toggleInterest = (interest: string) =>
    setField(
      "interests",
      input.interests.includes(interest)
        ? input.interests.filter((item) => item !== interest)
        : [...input.interests, interest],
    );
  const submit = async () => {
    if (busy) return;
    try {
      createDraft(input);
    } catch (err) {
      setError(messageOf(err));
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSubmit(input, suggest);
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  };
  return {
    input,
    setField,
    toggleInterest,
    suggest,
    setSuggest,
    error,
    busy,
    submit,
  };
}
