import { Link } from "react-router-dom";
import { UploadCloud, Calendar, Image } from "../components/Icons";
import { useLibrary } from "../context/LibraryContext";
import { buttonClass } from "../components/ui";
import hero from "../assets/travel-hero.jpg";
export default function Dashboard() {
  const { journeys, itineraries } = useLibrary();
  return (
    <div className="space-y-10">
      <section className="grid overflow-hidden rounded-3xl border border-slate-200/70 bg-white lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6 p-6 sm:p-10">
          <p className="text-xs font-medium uppercase tracking-widest text-teal-700">
            Chào mừng đến với Travelogue
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-800 sm:text-4xl">
            Mỗi chuyến đi,
            <br />
            một câu chuyện riêng.
          </h1>
          <p className="max-w-md text-sm leading-7 text-slate-500">
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
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm hover:bg-slate-50"
            >
              Mở Gallery
            </Link>
          </div>
        </div>
        <img
          src={hero}
          alt="Phong cảnh gợi cảm hứng cho hành trình tiếp theo"
          className="h-56 w-full object-cover lg:h-[420px]"
        />
      </section>
      <section aria-label="Các tính năng" className="grid gap-4 xl:grid-cols-3">
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
            className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-6 transition-colors hover:border-teal-200"
          >
            <Icon className="h-6 w-6 text-teal-700" />
            <h2 className="font-semibold text-slate-800">{title}</h2>
            <p className="text-sm leading-6 text-slate-500">{desc}</p>
            <span className="block text-sm text-teal-700">Khám phá →</span>
          </Link>
        ))}
      </section>
      <section className="flex flex-wrap gap-6 rounded-2xl bg-slate-100/70 p-6 text-sm text-slate-600">
        <span>
          <strong className="text-slate-800">{journeys.length}</strong> chuyến
          đi thực tế
        </span>
        <span>
          <strong className="text-slate-800">{itineraries.length}</strong> kế
          hoạch đã tạo
        </span>
        <span>Dữ liệu được lưu trong trình duyệt trên thiết bị này.</span>
      </section>
    </div>
  );
}
