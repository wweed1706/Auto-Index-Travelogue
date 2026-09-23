import { Link } from "react-router-dom";
import { UploadCloud, Calendar, Image } from "../components/Icons";
import { useLibrary } from "../context/LibraryContext";
import { buttonClass } from "../components/ui";
import hero from "../assets/travel-hero.jpg";
export default function Dashboard() {
  const { journeys, itineraries } = useLibrary();
  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="group grid items-center gap-8 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-100/60 p-5 shadow-sm hover:shadow-lg hover:shadow-slate-900/5 sm:p-8 xl:grid-cols-[1.15fr_1fr] xl:gap-10 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none">
        <div className="flex flex-col justify-center space-y-7 py-3 sm:py-5">
          <p className="w-fit rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 ">
            Chào mừng đến với Travelogue
          </p>
          <h1 className="text-3xl font-semibold leading-[1.18] tracking-[-0.045em] text-slate-800 sm:text-4xl 2xl:text-5xl">
            Mỗi chuyến đi,
            <br />
            một câu chuyện riêng.
          </h1>
          <p className="max-w-md text-sm leading-7 text-slate-500 ">
            Lưu lại những nơi đã đến, sắp xếp ký ức và chuẩn bị cho hành trình
            tiếp theo. Tất cả trong một không gian nhẹ nhàng, dành riêng cho
            bạn.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/upload" className={buttonClass}>
              Lưu chuyến đi đầu tiên
            </Link>
            <Link
              to="/gallery"
              className="rounded-xl border border-slate-200/70 px-4 py-3 text-sm hover:bg-slate-50 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 hover:-translate-y-1"
            >
              Mở Gallery
            </Link>
          </div>
        </div>
        <img
          src={hero}
          alt="Phong cảnh gợi cảm hứng cho hành trình tiếp theo"
          className="h-60 w-full rounded-2xl object-cover saturate-[0.65] group-hover:saturate-100 sm:h-72 xl:h-[370px] transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none"
        />
      </section>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Bắt đầu từ đây
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-800 ">
            Một không gian, mọi hành trình.
          </h2>
        </div>
        <span className="hidden text-xs text-slate-400 sm:block">
          Ghi lại. Lên kế hoạch. Khám phá.
        </span>
      </div>
      <section aria-label="Các tính năng" className="grid gap-5 lg:grid-cols-3">
        {[
          {
            to: "/upload",
            title: "Lưu giữ ký ức",
            desc: "Thêm ảnh, video, audio và ghi chú cho những chuyến đi thực tế.",
            icon: UploadCloud,
          },
          {
            to: "/planner",
            title: "Chuẩn bị hành trình",
            desc: "Chọn điểm đến, ngân sách và sở thích. Tạo lịch trình theo từng ngày.",
            icon: Calendar,
          },
          {
            to: "/gallery",
            title: "Tìm lại trải nghiệm",
            desc: "Xem chuyến đi và kế hoạch đã lưu, tìm kiếm trong lịch sử của bạn.",
            icon: Image,
          },
        ].map(({ to, title, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col items-start gap-5 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 sm:p-7 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 "
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 ">
              <Icon className="h-5 w-5 text-slate-600 " />
            </span>
            <h2 className="text-base font-semibold tracking-tight text-slate-800 ">
              {title}
            </h2>
            <p className="text-sm leading-6 text-slate-500 ">
              {desc}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-2 text-xs font-medium text-slate-500 group-hover:translate-x-1 group-hover:text-slate-800 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none">
              Khám phá →
            </span>
          </Link>
        ))}
      </section>
      <section className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-slate-200/70 px-1 py-6 text-xs text-slate-500 ">
        <span>
          <strong className="text-slate-800 ">
            {journeys.length}
          </strong>{" "}
          chuyến đi thực tế
        </span>
        <span>
          <strong className="text-slate-800 ">
            {itineraries.length}
          </strong>{" "}
          kế hoạch đã tạo
        </span>
        <span>Dữ liệu được lưu trong trình duyệt trên thiết bị này.</span>
      </section>
    </div>
  );
}
