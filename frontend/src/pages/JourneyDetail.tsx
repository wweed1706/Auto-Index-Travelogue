import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useJourney } from "../hooks/useJourney";
import { useJourneyMedia } from "../hooks/useMedia";
import GalleryView from "../components/GalleryView";
import TimelineView from "../components/TimelineView";
import MapView from "../components/MapView";
import {
  PageHeading,
  EmptyState,
  ErrorNotice,
  Skeleton,
  Badge,
} from "../components/ui";
import { ArrowLeft, Image, Clock, Map, Sparkles, X } from "../components/Icons";
import { displayDate } from "../services/utils";
const views = [
  { id: "gallery", label: "Media", icon: Image },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "map", label: "Bản đồ", icon: Map },
];
export default function JourneyDetail() {
  const { id } = useParams();
  const data = useJourney(id);
  const media = useJourneyMedia(data.journey);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get("view") || "gallery";
  const view = views.some((item) => item.id === tab) ? tab : "gallery";
  if (data.loading) return <Skeleton count={2} />;
  if (data.error)
    return (
      <ErrorNotice message={data.error} onRetry={() => void data.reload()} />
    );
  const journey = data.journey;
  if (!journey)
    return (
      <EmptyState
        title="Không tìm thấy chuyến đi."
        action={
          <Link to="/gallery" className="btn-secondary">
            Về thư viện
          </Link>
        }
      >
        Chuyến đi đã được xóa hoặc không thuộc không gian này.
      </EmptyState>
    );
  return (
    <>
      <Link
        to="/gallery"
        className="mb-6 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-teal-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Thư viện ký ức
      </Link>
      <PageHeading
        eyebrow="A STORY TO KEEP"
        title={journey.title}
        description={
          journey.location.name +
          " · " +
          displayDate(journey.date) +
          " · " +
          journey.media.length +
          " media"
        }
        action={
          <>
            <Link
              to={"/journey/" + journey.id + "/edit"}
              className="btn-secondary"
            >
              Chỉnh sửa
            </Link>
            <button
              type="button"
              disabled={data.deleting}
              onClick={() => {
                void data.remove(journey.id).then((removed) => {
                  if (removed) navigate("/gallery");
                });
              }}
              className="btn-ghost"
              aria-label="Xóa chuyến đi"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        }
      />
      <ErrorNotice message={data.mutationError || media.error} />
      <div className="card mb-7 p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-600" />
          <p className="text-xs font-medium text-slate-700">
            Câu chuyện của chuyến đi
          </p>
          <Badge demo>AI demo</Badge>
        </div>
        <p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-slate-500">
          {journey.summary ||
            journey.notes ||
            "Một hành trình đã được lưu lại."}
        </p>
        {journey.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {journey.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
      <div
        role="tablist"
        aria-label="Chế độ xem chuyến đi"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
            return;
          event.preventDefault();
          const index = views.findIndex((item) => item.id === view);
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? views.length - 1
                : (index +
                    (event.key === "ArrowRight" ? 1 : -1) +
                    views.length) %
                  views.length;
          setParams({ view: views[next].id }, { replace: true });
          const tabs =
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              '[role="tab"]',
            );
          tabs[next]?.focus();
        }}
        className="mb-6 flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1"
      >
        {views.map(({ id: value, label, icon: Icon }) => (
          <button
            key={value}
            role="tab"
            tabIndex={view === value ? 0 : -1}
            aria-selected={view === value}
            aria-controls={"view-" + value}
            id={"tab-" + value}
            onClick={() => setParams({ view: value }, { replace: true })}
            className={`flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-medium transition-all duration-300 hover:bg-slate-50 ${view === value ? "bg-teal-50 text-teal-800" : "text-slate-500"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={"view-" + view}
        aria-labelledby={"tab-" + view}
        className="animate-in fade-in duration-300"
      >
        {media.loading ? (
          <Skeleton />
        ) : view === "gallery" ? (
          <GalleryView media={media.media} />
        ) : view === "timeline" ? (
          <TimelineView journey={journey} media={media.media} />
        ) : (
          <MapView
            points={
              journey.coordinates
                ? [
                    {
                      id: journey.id,
                      name: journey.location.name,
                      coordinates: journey.coordinates,
                    },
                  ]
                : []
            }
          />
        )}
      </div>
    </>
  );
}
