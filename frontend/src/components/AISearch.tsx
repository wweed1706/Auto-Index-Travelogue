import { useState, type FormEvent } from "react";
import { buttonClass, inputClass } from "./ui";
export default function AISearch({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    onSearch(query.trim());
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        Từ khóa lịch sử
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ví dụ: Đà Lạt, cafe, thiên nhiên"
          className={inputClass}
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button className={buttonClass}>Tìm trong lịch sử</button>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
        >
          Xóa tìm kiếm
        </button>
      </div>
    </form>
  );
}
