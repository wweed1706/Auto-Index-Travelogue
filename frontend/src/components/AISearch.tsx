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
          className="rounded-xl border border-slate-100 px-4 py-2 text-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
