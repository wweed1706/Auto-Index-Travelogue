import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { ErrorNotice, Skeleton } from "../components/ui";
import JourneyCard from "../components/JourneyCard";
import {
  UploadCloud,
  ArrowRight,
  Calendar,
  Image,
  MapPin,
  Compass,
  Sparkles,
  Search,
  ShieldCheck,
  Plus,
} from "../components/Icons";
import { displayDate } from "../services/utils";
import hero from "../assets/travel-hero.jpg";

const features = [
  {
    number: "01",
    icon: UploadCloud,
    title: "Lưu giữ chuyến đi",
    description:
      "Thêm ảnh, video và những dòng nhật ký. Sắp xếp từng khoảnh khắc thành câu chuyện của bạn.",
    action: "Upload chuyến đi",
    to: "/upload",
    label: "NHẬT KÝ HÀNH TRÌNH",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Lên kế hoạch thông minh",
    description:
      "Chọn điểm đến, khám phá gợi ý và tự tay sắp xếp một lịch trình theo nhịp đi của riêng mình.",
    action: "Tạo kế hoạch mới",
    to: "/planner/new",
    label: "SMART TRAVEL PLANNER",
  },
  {
    number: "03",
    icon: Image,
    title: "Tìm lại những ký ức",
    description:
      "Một Gallery cho những nơi đã đến. Tìm chuyến đi theo địa điểm, chủ đề hoặc điều bạn còn nhớ.",
    action: "Khám phá Gallery",
    to: "/gallery",
    label: "GALLERY & AI SEARCH",
  },
];

export default function Dashboard() {
  const data = useDashboard();
  return (
    <div className="stitch-home space-y-7 sm:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700">
            AUTO-INDEX TRAVELOGUE
          </p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.035em] text-slate-800 sm:text-[34px]">
            Mỗi chuyến đi, một câu chuyện.
          </h1>
          <p className="mt-2.5 text-sm leading-6 text-slate-500">
            Chào {data.name}, cùng dành chỗ cho những hành trình đáng nhớ.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-[11px] font-medium text-sky-700">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> Người bạn đồng
          hành của bạn
        </span>
      </div>

      <section
        aria-label="Giới thiệu Travelogue"
        className="home-panel grid overflow-hidden md:grid-cols-[1.1fr_1fr]"
      >
        <div className="flex flex-col items-start justify-center p-6 sm:p-8 lg:p-9">
          <span className="mb-5 inline-flex items-center gap-2 text-[11px] font-medium text-sky-700">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> MỘT HÀNH
            TRÌNH MỚI ĐANG CHỜ
          </span>
          <h2 className="max-w-md text-[28px] font-semibold leading-[1.25] tracking-[-0.03em] text-slate-800 sm:text-[32px]">
            Đi theo cách của bạn.
            <br />
            <span className="text-sky-700">Nhớ theo cách của bạn.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
            Từ ý tưởng đầu tiên đến khoảnh khắc cuối chuyến đi. Travelogue giúp
            bạn lên kế hoạch, lưu giữ và tìm lại mọi điều đáng nhớ.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/planner/new" className="home-action">
              <Calendar className="h-4 w-4" /> Lên kế hoạch ngay
            </Link>
            <Link to="/upload" className="home-link">
              <UploadCloud className="h-4 w-4" /> Lưu chuyến đi
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck
              aria-hidden="true"
              className="h-3.5 w-3.5 text-slate-400"
            />{" "}
            Không gian riêng cho những câu chuyện của bạn.
          </p>
        </div>
        <div className="relative m-3 mt-0 min-h-56 overflow-hidden rounded-xl md:ml-0 md:mt-3 md:min-h-80">
          <img
            src={hero}
            alt="Thung lũng xanh và những dãy núi trong nắng sớm"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[50%_42%] saturate-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] text-white backdrop-blur-md">
              <Compass aria-hidden="true" className="h-3 w-3" /> CẢM HỨNG HÀNH
              TRÌNH
            </span>
            <p className="mt-2.5 text-xl font-medium tracking-tight text-white">
              Một chút bình yên,
              <br />
              một trời ký ức.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label="Thống kê hành trình"
        className="home-panel grid grid-cols-1 divide-y divide-slate-100 px-5 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-0 sm:py-5"
      >
        {[
          {
            label: "Chuyến đi đã lưu",
            value: data.journeys.length,
            icon: Compass,
          },
          {
            label: "Kế hoạch du lịch",
            value: data.itineraries.length,
            icon: Calendar,
          },
          { label: "Khoảnh khắc", value: data.mediaCount, icon: Image },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3.5 py-4 sm:px-5 sm:py-0 lg:px-7"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f4fa] text-slate-500">
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[11px] text-slate-500">{label}</p>
              <p className="mt-1 text-[22px] font-semibold leading-6 tracking-tight text-slate-800">
                {data.loading || data.error
                  ? "—"
                  : value.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="features-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2
            id="features-heading"
            className="text-lg font-semibold tracking-tight text-slate-800"
          >
            Mọi điều bạn cần cho một chuyến đi
          </h2>
          <span className="text-[11px] text-slate-500">
            Từ lên đường đến trở về
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(
            ({ number, icon: Icon, title, description, action, to, label }) => (
              <Link
                key={to}
                to={to}
                className="home-panel group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-100 hover:shadow-sm focus-visible:outline-sky-600 motion-reduce:transform-none sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5"
                      strokeWidth={1.6}
                    />
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {number}
                  </span>
                </div>
                <p className="text-[9px] font-semibold tracking-[0.09em] text-sky-700">
                  {label}
                </p>
                <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-800">
                  {title}
                </h3>
                <p className="mb-5 mt-2 text-xs leading-6 text-slate-500">
                  {description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-sky-700">
                  <span>{action}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                  />
                </div>
              </Link>
            ),
          )}
        </div>
      </section>

      <section
        aria-labelledby="search-heading"
        className="home-panel grid gap-5 p-5 sm:p-6 xl:grid-cols-[0.8fr_1.2fr] xl:items-center xl:gap-8"
      >
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-700">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> TÌM KIẾM
            TRONG GALLERY
          </span>
          <h2
            id="search-heading"
            className="text-lg font-semibold tracking-tight text-slate-800"
          >
            Bạn đang nhớ chuyến đi nào?
          </h2>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            Một địa điểm, một chủ đề, một chi tiết nhỏ.
            <br className="hidden sm:block" /> Tìm lại câu chuyện mà bạn đã lưu.
          </p>
        </div>
        <div className="min-w-0">
          <form
            role="search"
            aria-label="Tìm kiếm trong Gallery"
            onSubmit={data.search}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-2 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-50"
          >
            <Search
              aria-hidden="true"
              className="ml-2 h-4 w-4 shrink-0 text-slate-400"
            />
            <label className="min-w-0 flex-1">
              <span className="sr-only">Tìm kiếm ký ức</span>
              <input
                type="search"
                value={data.query}
                onChange={(event) => data.setQuery(event.target.value)}
                placeholder="Ví dụ: cafe Đà Lạt…"
                className="min-h-10 w-full min-w-0 border-0 bg-transparent pr-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus-visible:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={!data.query.trim()}
              className="home-action w-full !min-h-10 !rounded-lg !px-3 !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
            >
              Tìm kiếm <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-500">Thử tìm:</span>
            {["Đà Lạt", "Cafe", "Thiên nhiên"].map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => data.searchFor(query)}
                className="min-h-8 rounded-full bg-[#f1f4fa] px-3 text-[11px] text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-700"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ErrorNotice message={data.error} onRetry={() => void data.reload()} />
      <section aria-labelledby="recent-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="recent-heading"
            className="text-lg font-semibold tracking-tight text-slate-800"
          >
            Hành trình gần đây
          </h2>
          <Link
            to="/gallery"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg text-xs font-medium text-sky-700 transition-all duration-300 hover:gap-2.5"
          >
            Xem Gallery <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {data.loading ? (
          <Skeleton />
        ) : data.error ? null : data.recent.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.recent.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} accent="sky" />
            ))}
          </div>
        ) : (
          <div className="home-panel flex flex-col items-center gap-4 p-6 sm:flex-row sm:gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f1f4fa] text-slate-400">
              <Image aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-slate-700">
                Chuyến đi đầu tiên, câu chuyện đầu tiên.
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-slate-500">
                Thêm vài bức ảnh hoặc một trang nhật ký để bắt đầu lưu giữ ký
                ức.
              </p>
            </div>
            <Link
              to="/upload"
              className="home-action w-full !text-xs sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Thêm chuyến đi
            </Link>
          </div>
        )}
      </section>
      {!data.loading && !data.error && data.upcoming.length > 0 && (
        <section aria-labelledby="upcoming-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2
              id="upcoming-heading"
              className="text-lg font-semibold tracking-tight text-slate-800"
            >
              Hành trình sắp tới
            </h2>
            <Link
              to="/planner"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg text-xs font-medium text-sky-700 transition-all duration-300 hover:gap-2.5"
            >
              Xem kế hoạch <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.upcoming.map((plan) => (
              <Link
                key={plan.id}
                to={"/planner/" + plan.id}
                className="home-panel flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-100 hover:shadow-sm motion-reduce:transform-none"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Calendar className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-800">
                    {plan.criteria.destination}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-[11px] leading-5 text-slate-500">
                    <MapPin aria-hidden="true" className="h-3 w-3 shrink-0" />
                    {displayDate(plan.criteria.startDate)} · {plan.days.length}{" "}
                    ngày · {plan.criteria.travelers} người
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
