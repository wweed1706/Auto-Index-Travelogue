import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import { localDate } from "../services/utils";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
export function useDashboard() {
  const library = useLibrary();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const searchFor = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) navigate("/gallery?q=" + encodeURIComponent(trimmed));
  };
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchFor(query);
  };
  return {
    ...library,
    query,
    setQuery,
    search,
    searchFor,
    name: user?.name || "bạn",
    recent: library.journeys.slice(0, 3),
    upcoming: library.itineraries
      .filter((plan) => plan.criteria.endDate >= localDate())
      .slice(0, 2),
    mediaCount: library.journeys.reduce(
      (count, journey) => count + journey.media.length,
      0,
    ),
    placeCount: new Set(
      library.journeys.map((journey) =>
        journey.location.trim().toLocaleLowerCase("vi"),
      ),
    ).size,
  };
}
