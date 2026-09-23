import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PageHeading,
  inputClass,
  buttonClass,
  ErrorNotice,
} from "../components/ui";
export default function Login({ register = false }: { register?: boolean }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      login(String(data.get("email")).trim(), String(data.get("name") || ""));
      navigate("/");
    } catch {
      setError(
        "Không thể lưu hồ sơ. Vui lòng kiểm tra quyền lưu trữ của trình duyệt.",
      );
    }
  }
  return (
    <div className="mx-auto max-w-lg">
      <PageHeading
        title={register ? "Tạo hồ sơ trên thiết bị" : "Hồ sơ cá nhân"}
        description="Đặt tên cho không gian của bạn. Hồ sơ này chỉ lưu trên thiết bị, chưa phải tài khoản đăng nhập và không phân tách dữ liệu giữa các hồ sơ."
      />
      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <ErrorNotice message={error} />
        <label className="block text-sm">
          Tên hiển thị
          <input
            className={inputClass}
            name="name"
            autoComplete="name"
            required
            maxLength={60}
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            className={inputClass}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <button className={buttonClass}>Lưu hồ sơ và tiếp tục</button>
        <p className="text-sm text-slate-500">
          <Link
            className="text-teal-700 underline"
            to={register ? "/login" : "/register"}
          >
            {register ? "Dùng hồ sơ cá nhân" : "Tạo hồ sơ mới"}
          </Link>
        </p>
      </form>
    </div>
  );
}
