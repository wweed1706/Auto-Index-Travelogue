import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthForm } from "../hooks/useAuthForm";
import {
  Compass,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
} from "../components/Icons";
import { ErrorNotice, Field, Spinner } from "../components/ui";
import hero from "../assets/travel-hero.jpg";
export default function Login({ register = false }: { register?: boolean }) {
  const { user } = useAuth();
  const location = useLocation();
  const form = useAuthForm(register);
  const [showPassword, setShowPassword] = useState(false);
  if (user) return <Navigate to={form.redirectTo} replace />;
  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-teal-950 lg:flex lg:flex-col lg:justify-between">
        <img
          src={hero}
          alt="Phong cảnh miền núi trong ánh sáng buổi sớm"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/15 to-slate-900/30" />
        <div className="relative flex items-center gap-3 p-12 text-white">
          <Compass className="h-6 w-6" />
          <span className="text-xl font-semibold tracking-tight">
            travelogue.
          </span>
        </div>
        <div className="relative max-w-xl p-12 xl:p-16">
          <p className="mb-5 text-xs uppercase tracking-[0.22em] text-teal-100">
            MAKE ROOM FOR MEMORIES
          </p>
          <h2 className="text-4xl font-medium leading-[1.2] tracking-tight text-white xl:text-5xl">
            Đi thật xa.
            <br />
            Giữ thật gần.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-200">
            Một không gian để lưu lại những nơi đã đến và chuẩn bị cho những
            hành trình phía trước.
          </p>
          <div className="mt-10 flex flex-wrap gap-5 text-xs text-slate-200">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Ký ức có tổ chức
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Lịch trình của riêng bạn
            </span>
          </div>
        </div>
      </section>
      <section className="flex min-w-0 flex-col justify-center px-5 py-10 sm:px-12 lg:px-14 xl:px-24">
        <div className="mx-auto w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-12 flex items-center gap-2 text-teal-700 lg:hidden">
            <Compass className="h-6 w-6" />
            <span className="text-xl font-semibold tracking-tight">
              travelogue.
            </span>
          </div>
          <p className="eyebrow mb-3">Không gian của những hành trình</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-800">
            {register ? "Bắt đầu câu chuyện." : "Chào mừng trở lại."}
          </h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-slate-500">
            {register
              ? "Tạo tài khoản để lưu giữ ký ức theo cách của bạn."
              : "Đăng nhập để tiếp tục hành trình của bạn."}
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void form.submit();
            }}
            className="space-y-5"
          >
            <ErrorNotice message={form.error} />
            <fieldset disabled={form.busy} className="space-y-5">
              {register && (
                <Field label="Tên hiển thị">
                  <input
                    required
                    maxLength={60}
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => form.setName(event.target.value)}
                    placeholder="Tên của bạn"
                    className="input"
                  />
                </Field>
              )}
              <Field label="Email">
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => form.setEmail(event.target.value)}
                  placeholder="ban@example.com"
                  className="input"
                />
              </Field>
              <Field
                label="Mật khẩu"
                hint={register ? "Ít nhất 8 ký tự." : undefined}
              >
                <span className="relative block">
                  <input
                    required
                    minLength={8}
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      register ? "new-password" : "current-password"
                    }
                    value={form.password}
                    onChange={(event) => form.setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </span>
              </Field>
              <button className="btn-primary w-full" disabled={form.busy}>
                {form.busy ? <Spinner /> : <ArrowRight className="h-4 w-4" />}
                {register ? "Tạo tài khoản" : "Đăng nhập"}
              </button>
            </fieldset>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">
            {register ? "Đã có tài khoản? " : "Lần đầu ghé thăm? "}
            <Link
              to={register ? "/login" : "/register"}
              state={location.state}
              className="font-semibold text-teal-700 hover:underline"
            >
              {register ? "Đăng nhập" : "Tạo tài khoản"}
            </Link>
          </p>
          <div className="my-7 flex items-center gap-4 text-[11px] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            hoặc trải nghiệm trước
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <button
            type="button"
            className="btn-secondary w-full"
            disabled={form.busy}
            onClick={() => void form.submit(true)}
          >
            <Sparkles className="h-4 w-4 text-teal-600" />
            Khám phá bản demo
          </button>
          <p className="mt-7 text-center text-[11px] leading-5 text-slate-500">
            Phiên bản demo cục bộ. Tài khoản và dữ liệu chỉ được lưu trong trình
            duyệt này.
          </p>
        </div>
      </section>
    </main>
  );
}
