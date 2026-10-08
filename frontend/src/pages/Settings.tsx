import { useRef, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import {
  PageHeading,
  Field,
  ErrorNotice,
  Badge,
  Spinner,
} from "../components/ui";
import { UploadCloud, ArrowRight, LogOut } from "../components/Icons";
import Modal from "../components/Modal";
export default function Settings() {
  const data = useSettings();
  const input = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <PageHeading
        eyebrow="MAKE IT PERSONAL"
        title="Không gian của riêng bạn."
        description="Quản lý hồ sơ và những dữ liệu đã lưu trên thiết bị này."
      />
      <ErrorNotice message={data.error} />
      <div className="mt-5 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void data.save();
            }}
            className="card space-y-5 p-6"
          >
            <h2 className="text-base font-semibold tracking-tight">
              Hồ sơ cá nhân
            </h2>
            <fieldset disabled={Boolean(data.busy)} className="space-y-5">
              <Field label="Tên hiển thị">
                <input
                  value={data.name}
                  onChange={(event) => data.setName(event.target.value)}
                  required
                  maxLength={60}
                  autoComplete="name"
                  className="input"
                />
              </Field>
              <Field label="Email tài khoản">
                <input
                  value={data.user?.email || ""}
                  disabled
                  type="email"
                  className="input"
                />
              </Field>
              <button className="btn-primary" disabled={Boolean(data.busy)}>
                {data.busy === "profile" && <Spinner />}Lưu hồ sơ
              </button>
            </fieldset>
          </form>
          <section className="card p-6">
            <h2 className="text-base font-semibold tracking-tight">
              Bản sao của những ký ức
            </h2>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Tải bản sao đầy đủ gồm chuyến đi, media và kế hoạch. Nhập bản sao
              để thêm dữ liệu vào không gian hiện tại.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void data.exportData()}
                disabled={Boolean(data.busy)}
                className="btn-secondary"
              >
                {data.busy === "export" ? (
                  <Spinner />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Tải bản sao
              </button>
              <button
                type="button"
                onClick={() => input.current?.click()}
                disabled={Boolean(data.busy)}
                className="btn-secondary"
              >
                {data.busy === "import" ? (
                  <Spinner />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                Nhập bản sao
              </button>
              <input
                ref={input}
                aria-label="Chọn bản sao Travelogue"
                type="file"
                accept=".json,application/json"
                className="sr-only"
                disabled={Boolean(data.busy)}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void data.importData(file);
                  event.target.value = "";
                }}
              />
            </div>
          </section>
          <section className="card p-6">
            <h2 className="text-base font-semibold tracking-tight">
              Quản lý dữ liệu
            </h2>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Xóa chuyến đi, bản nháp và kế hoạch của tài khoản này. Hồ sơ và dữ
              liệu tài khoản khác được giữ nguyên.
            </p>
            <button
              type="button"
              onClick={() => setConfirm(true)}
              disabled={Boolean(data.busy)}
              className="btn-danger mt-5"
            >
              Xóa dữ liệu đã lưu
            </button>
          </section>
        </div>
        <aside className="card p-6">
          <Badge demo>Không gian cục bộ</Badge>
          <h2 className="mt-5 text-sm font-semibold">
            Những gì đang được giữ lại
          </h2>
          <div className="mt-5 space-y-4 text-xs">
            <p className="flex justify-between text-slate-500">
              Chuyến đi
              <span className="font-medium text-slate-800">
                {data.journeys}
              </span>
            </p>
            <p className="flex justify-between text-slate-500">
              Kế hoạch
              <span className="font-medium text-slate-800">{data.plans}</span>
            </p>
            {data.usage && (
              <p className="flex justify-between text-slate-500">
                Bộ nhớ ứng dụng
                <span className="font-medium text-slate-800">
                  {(data.usage.usage / 1024 / 1024).toFixed(1)} MB
                </span>
              </p>
            )}
          </div>
          <p className="mt-6 border-t border-slate-200 pt-5 text-[11px] leading-6 text-slate-500">
            Dữ liệu chỉ lưu trong trình duyệt này. Xóa dữ liệu trình duyệt cũng
            xóa nội dung đã lưu.
          </p>
          <button
            type="button"
            onClick={data.logout}
            className="btn-ghost mt-5 w-full"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </aside>
      </div>
      {confirm && (
        <Modal
          title="Xóa dữ liệu trong không gian này?"
          onClose={() => setConfirm(false)}
        >
          <ErrorNotice message={data.error} />
          <p className="text-sm leading-7 text-slate-500">
            Thao tác này xóa {data.journeys} chuyến đi, {data.plans} kế hoạch và
            bản nháp. Hãy tải bản sao nếu bạn muốn giữ lại nội dung.
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirm(false)}
              disabled={Boolean(data.busy)}
              className="btn-secondary"
            >
              Giữ lại
            </button>
            <button
              type="button"
              disabled={Boolean(data.busy)}
              onClick={() => {
                void data.clearData().then((success) => {
                  if (success) setConfirm(false);
                });
              }}
              className="btn-danger"
            >
              {data.busy === "clear" && <Spinner />}Xóa dữ liệu
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
