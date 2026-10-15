import { Link } from "react-router-dom";
import { useGallery } from "../hooks/useGallery";
import { useJourney } from "../hooks/useJourney";
import JourneyCard from "../components/JourneyCard";
import {
  PageHeading,
  EmptyState,
  ErrorNotice,
  Skeleton,
  Badge,
} from "../components/ui";
import { Plus, Search, Sparkles, X } from "../components/Icons";
export default function Gallery() {
  const gallery = useGallery();
  const actions = useJourney();
  return (
    <>
      <PageHeading
        eyebrow="YOUR MEMORIES"
        title="Thư viện ký ức."
        description="Những nơi đã đến, những khoảnh khắc muốn giữ. Tìm lại tất cả trong một không gian."
        action={
          <Link to="/upload" className="btn-primary">
            <Plus className="h-4 w-4" />
            Thêm chuyến đi
          </Link>
        }
      />
      <section aria-label="Tìm kiếm ký ức" className="card mb-7 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <label className="min-w-0 flex-1">
            <span className="sr-only">Tìm kiếm ký ức</span>
            <input
              type="search"
              value={gallery.query}
              onChange={(event) =>
                gallery.setFilter("query", event.target.value)
              }
              placeholder="Tìm Đà Lạt, cafe, hoặc một ký ức…"
              className="min-h-11 w-full min-w-0 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 focus-visible:outline-none"
            />
          </label>
          <span className="hidden sm:block">
            <Badge demo>AI demo</Badge>
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          <label>
            <span className="sr-only">Lọc chủ đề</span>
            <select
              aria-label="Lọc chủ đề"
              value={gallery.tag}
              onChange={(event) => gallery.setFilter("tag", event.target.value)}
              className="min-h-10 max-w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600"
            >
              <option value="">Mọi chủ đề</option>
              {gallery.tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-0">
            <span className="sr-only">Từ ngày</span>
            <input
              type="date"
              aria-label="Từ ngày"
              value={gallery.from}
              onChange={(event) =>
                gallery.setFilter("from", event.target.value)
              }
              className="min-h-10 max-w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-600"
            />
          </label>
          <span className="text-xs text-slate-400">—</span>
          <label className="min-w-0">
            <span className="sr-only">Đến ngày</span>
            <input
              type="date"
              aria-label="Đến ngày"
              value={gallery.to}
              onChange={(event) => gallery.setFilter("to", event.target.value)}
              className="min-h-10 max-w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-600"
            />
          </label>
          {gallery.filtered && (
            <button
              type="button"
              onClick={gallery.clear}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-700"
            >
              <X className="h-3 w-3" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </section>
      <ErrorNotice
        message={gallery.error || gallery.searchError || actions.mutationError}
        onRetry={gallery.error ? () => void gallery.reload() : undefined}
      />
      {gallery.query && !gallery.searching && !gallery.searchError && (
        <div
          role="status"
          className="mb-7 mt-4 flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4 animate-in fade-in"
        >
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
          <div>
            <p className="text-xs font-medium text-teal-800">
              {gallery.summary}
            </p>
            <p className="mt-2 text-[11px] text-teal-700/80">
              Tóm tắt mô phỏng từ tên, địa điểm, chủ đề và ghi chú.
            </p>
          </div>
        </div>
      )}
      <div className="mb-5 mt-7 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">
          {gallery.filtered ? "Kết quả tìm kiếm" : "Tất cả chuyến đi"}
          <span className="ml-2 text-xs font-normal text-slate-500">
            {gallery.loading || gallery.searching
              ? "…"
              : gallery.matches.length}
          </span>
        </p>
        <p className="text-[11px] text-slate-500">Mới nhất trước</p>
      </div>
      {gallery.loading || gallery.searching ? (
        <Skeleton />
      ) : gallery.error || gallery.searchError ? null : gallery.matches
          .length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {gallery.matches.map((journey) => (
            <JourneyCard
              key={journey.id}
              journey={journey}
              deleting={actions.deleting}
              onDelete={(id) => void actions.remove(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            gallery.filtered
              ? "Chưa tìm thấy ký ức phù hợp."
              : "Thư viện đang chờ câu chuyện của bạn."
          }
          action={
            gallery.filtered ? (
              <button onClick={gallery.clear} className="btn-secondary">
                Xóa bộ lọc
              </button>
            ) : (
              <Link to="/upload" className="btn-primary">
                <Plus className="h-4 w-4" />
                Lưu chuyến đi đầu tiên
              </Link>
            )
          }
        >
          {gallery.filtered
            ? "Thử một từ khóa khác hoặc mở rộng khoảng ngày."
            : "Chưa có chuyến đi nào. Thêm ảnh, âm thanh hoặc một trang nhật ký để bắt đầu."}
        </EmptyState>
      )}
    </>
  );
}
