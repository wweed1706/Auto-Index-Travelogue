import { PageHeading } from "../components/ui";
export default function Settings() {
  return (
    <>
      <PageHeading
        title="Cài đặt"
        description="Tùy chỉnh không gian hành trình của bạn."
      />
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          Sắp ra mắt
        </span>
        <h2 className="pt-2 font-semibold">
          Các tùy chọn đang được phát triển
        </h2>
        <p className="text-sm leading-7 text-slate-500">
          Ngôn ngữ, thông báo và đồng bộ dữ liệu sẽ có mặt trong phiên bản tiếp
          theo. Hiện tại, chuyến đi và kế hoạch được lưu trên thiết bị này; xóa
          dữ liệu trình duyệt sẽ xóa các nội dung đã lưu.
        </p>
      </section>
    </>
  );
}
