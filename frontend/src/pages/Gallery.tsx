import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import AISearch from "../components/AISearch";
import { PageHeading, EmptyState, ErrorNotice } from "../components/ui";
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
export default function Gallery() {
  const { journeys, itineraries, loading, error, reload } = useLibrary();
  const [params, setParams] = useSearchParams();
  const search = params.get("tab") === "search";
  const [query, setQuery] = useState("");
  const matches = (value: string) =>
    normalize(value).includes(normalize(query.trim()));
  const visibleJourneys = journeys.filter(
    (j) =>
      !search ||
      matches(
        [
          j.title,
          j.location,
          j.notes,
          ...j.tags,
          ...j.media.map((m) => m.name),
        ].join(" "),
      ),
  );
  const visiblePlans = itineraries.filter(
    (p) =>
      !search ||
      matches(
        [
          p.criteria.destination,
          ...p.criteria.interests,
          p.criteria.dislikes,
          ...p.days.flatMap((d) => d.activities.map((a) => a.location)),
        ].join(" "),
      ),
  );
  return (
    <div className="space-y-8">
      <PageHeading
        title="Gallery"
        description="Những nơi đã đi và những hành trình đang chờ bạn. Xem lại toàn bộ lịch sử trong cùng một không gian."
      />
      <div
        aria-label="Khu vực Gallery"
        className="sticky top-16 z-20 flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-slate-200/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-md "
      >
        {[
          { label: "Lịch sử", active: !search, value: "history" },
          { label: "Tìm kiếm AI", active: search, value: "search" },
        ].map((tab) => (
          <button
            key={tab.value}
            aria-pressed={tab.active}
            onClick={() =>
              setParams(tab.value === "search" ? { tab: "search" } : {})
            }
            className={
              "rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none " +
              (tab.active
                ? "bg-slate-50 font-medium text-slate-800 "
                : "text-slate-500 hover:bg-white ")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      {search && (
        <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
          <h2 className="font-semibold text-slate-800 ">
            Tìm trong ký ức của bạn
          </h2>
          <p className="text-sm leading-7 text-slate-500 ">
            Tìm kiếm AI đang chờ kết nối. Hiện bạn có thể tìm bằng từ khóa trong
            tên, địa điểm, tags, ghi chú và kế hoạch đã lưu; chưa hỗ trợ hỏi đáp
            hay phân tích nội dung ảnh.
          </p>
          <AISearch onSearch={setQuery} />
          {query && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <p role="status">
                {visibleJourneys.length + visiblePlans.length} kết quả cho “
                {query}”
              </p>
              <button
                className="text-slate-700 underline transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                onClick={() => setQuery("")}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </section>
      )}
      <ErrorNotice message={error} />
      {error && (
        <button
          onClick={() => void reload()}
          className="text-slate-700 underline transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          Thử lại
        </button>
      )}
      {loading ? (
        <p role="status">Đang đọc lịch sử…</p>
      ) : (
        <>
          <section className="space-y-5 py-2">
            <h2 className="text-lg font-semibold text-slate-800 ">
              Chuyến đi thực tế{" "}
              <span className="text-sm font-normal text-slate-500 ">
                ({visibleJourneys.length})
              </span>
            </h2>
            {visibleJourneys.length ? (
              <div className="grid gap-5 lg:grid-cols-2 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none motion-safe:[@starting-style]:opacity-0 motion-safe:[@starting-style]:translate-y-4">
                {visibleJourneys.map((j) => (
                  <Link
                    key={j.id}
                    to={"/journey/" + j.id}
                    className="space-y-2 rounded-2xl border border-slate-200/70 bg-white p-5 hover:border-slate-200 shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 hover:-translate-y-1"
                  >
                    <p className="text-xs text-slate-500 ">
                      {j.date} · {j.media.length} tệp media
                    </p>
                    <h3 className="font-semibold text-slate-800 ">
                      {j.title}
                    </h3>
                    <p className="text-sm text-slate-500 ">
                      {j.location}
                    </p>
                    <p className="line-clamp-2 text-sm text-slate-500 ">
                      {j.notes}
                    </p>
                    <span className="block pt-2 text-sm text-slate-700 ">
                      Xem chuyến đi →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState>
                {query && search ? (
                  "Không tìm thấy chuyến đi phù hợp."
                ) : (
                  <>
                    Chưa có chuyến đi nào.{" "}
                    <Link
                      className="text-slate-700 underline transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80"
                      to="/upload"
                    >
                      Lưu chuyến đi đầu tiên
                    </Link>
                  </>
                )}
              </EmptyState>
            )}
          </section>
          <section className="space-y-5 py-2">
            <h2 className="text-lg font-semibold text-slate-800 ">
              Kế hoạch đã tạo{" "}
              <span className="text-sm font-normal text-slate-500 ">
                ({visiblePlans.length})
              </span>
            </h2>
            {visiblePlans.length ? (
              <div className="grid gap-5 lg:grid-cols-2 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none motion-safe:[@starting-style]:opacity-0 motion-safe:[@starting-style]:translate-y-4">
                {visiblePlans.map((p) => (
                  <Link
                    key={p.id}
                    to={"/planner/" + p.id}
                    className="space-y-2 rounded-2xl border border-slate-200/70 bg-white p-5 hover:border-slate-200 shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 hover:-translate-y-1"
                  >
                    <p className="text-xs text-slate-500 ">
                      {p.criteria.startDate} · {p.criteria.endDate}
                    </p>
                    <h3 className="font-semibold text-slate-800 ">
                      {p.criteria.destination}
                    </h3>
                    <p className="text-sm text-slate-500 ">
                      {p.criteria.travelers} người · {p.days.length} ngày ·{" "}
                      {p.criteria.budget.toLocaleString("vi-VN")} đ/người
                    </p>
                    <span className="block pt-2 text-sm text-slate-700 ">
                      Mở kế hoạch →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState>
                {query && search ? (
                  "Không tìm thấy kế hoạch phù hợp."
                ) : (
                  <>
                    Chưa có kế hoạch nào.{" "}
                    <Link
                      className="text-slate-700 underline transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80"
                      to="/planner"
                    >
                      Tạo kế hoạch mới
                    </Link>
                  </>
                )}
              </EmptyState>
            )}
          </section>
        </>
      )}
    </div>
  );
}
