import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Eye, EyeOff, Sparkles, MapPin } from '../components/Icons';
import travelHeroImg from '../assets/travel-hero.jpg';

/**
 * Login Page Component
 * - Bố cục chia đôi màn hình:
 *   + Trái: Khung ảnh minh họa chủ đề du lịch kèm gradient và hiệu ứng thị giác.
 *   + Phải: Form đăng nhập "Auto-Index Travelogue" căn giữa với validation đầy đủ,
 *           ngã rẽ "Quên mật khẩu?", nút Đăng nhập nổi bật và redirect sang /dashboard.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Validation & UI State
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Địa chỉ email không đúng định dạng';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Giả lập cuộc gọi API xác thực thành công sau 600ms
    setTimeout(() => {
      login(formData.email);
      setIsLoading(false);
      // Tự động điều hướng người dùng sang /dashboard
      navigate('/dashboard');
    }, 600);
  };

  // Handle Forgot Password Click
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordMessage('Một liên kết khôi phục mật khẩu đã được gửi (giả lập) tới email của bạn.');
    setTimeout(() => setForgotPasswordMessage(''), 5000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50">
      {/* ========================================================= */}
      {/* NỬA TRÁI: HÌNH ẢNH MINH HỌA CHỦ ĐỀ DU LỊCH                */}
      {/* ========================================================= */}
      <div className="relative w-full md:w-1/2 min-h-[320px] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Fallback Gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ 
            backgroundImage: `url(${travelHeroImg}), url('/travel-hero.jpg'), linear-gradient(135deg, #0ea5e9 0%, #0d9488 50%, #0f172a 100%)` 
          }}
        />

        {/* Ambient Gradient Overlays for Aesthetic & Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/30" />
        <div className="absolute inset-0 bg-sky-950/20 mix-blend-multiply" />

        {/* Top Branding Badge */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg text-white">
            <Compass className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-tight text-white drop-shadow-sm">Auto-Index</h2>
            <span className="text-xs uppercase tracking-widest font-semibold text-sky-300">Travelogue</span>
          </div>
        </div>

        {/* Bottom Inspirational Content */}
        <div className="relative z-10 mt-auto pt-12 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sky-200 font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ký sự hành trình tự động</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3 drop-shadow">
            Khám phá thế giới, đánh chỉ mục mọi kỷ niệm.
          </h3>
          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed drop-shadow-sm">
            Biến từng bức ảnh và dấu chân thành một tập nhật ký du lịch sống động, kết nối tọa độ và thời gian hoàn hảo.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* NỬA PHẢI: FORM ĐĂNG NHẬP Ở GIỮA MÀN HÌNH                  */}
      {/* ========================================================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header Tiêu Đề */}
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex md:hidden items-center justify-center w-12 h-12 rounded-2xl bg-sky-500 text-white shadow-md mb-2">
              <Compass className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Auto-Index Travelogue
            </h1>
            <p className="text-sm text-slate-500">
              Chào mừng bạn quay trở lại! Vui lòng nhập thông tin để vào hệ thống quản lý chuyến đi.
            </p>
          </div>

          {/* Alert Message for Forgot Password */}
          {forgotPasswordMessage && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs sm:text-sm animate-in fade-in">
              {forgotPasswordMessage}
            </div>
          )}

          {/* Form Đăng Nhập */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Input Email */}
            <div className="space-y-1.5">
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-slate-700"
              >
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="traveler@example.com"
                  autoComplete="email"
                  className={`
                    w-full px-4 py-3 rounded-xl border bg-white text-slate-900 text-sm shadow-sm transition-all
                    focus:outline-none focus:ring-2 placeholder:text-slate-400
                    ${errors.email 
                      ? 'border-rose-400 focus:ring-rose-400/20 bg-rose-50/20' 
                      : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'}
                  `}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-slate-700"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`
                    w-full px-4 py-3 pr-11 rounded-xl border bg-white text-slate-900 text-sm shadow-sm transition-all
                    focus:outline-none focus:ring-2 placeholder:text-slate-400
                    ${errors.password 
                      ? 'border-rose-400 focus:ring-rose-400/20 bg-rose-50/20' 
                      : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'}
                  `}
                />

                {/* Password Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.password}
                </p>
              )}

              {/* Ngã rẽ Quên Mật Khẩu (Căn phải dưới ô password) */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            {/* Nút "Đăng nhập" (Màu chủ đạo nổi bật) */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg shadow-sky-500/25
                bg-gradient-to-r from-sky-500 via-teal-500 to-sky-600 hover:from-sky-600 hover:to-teal-600
                focus:outline-none focus:ring-4 focus:ring-sky-500/30 transition-all duration-200
                active:scale-[0.99] flex items-center justify-center gap-2
                ${isLoading ? 'opacity-80 cursor-wait' : ''}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>

            {/* Link phụ: "Chưa có tài khoản? Đăng ký ngay" */}
            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm text-slate-500">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => alert('Tính năng Đăng ký tài khoản mới đang được hoàn thiện!')}
                  className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </form>

          {/* Quick Demo Hint */}
          <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-center">
            <p className="text-xs text-slate-500">
              💡 <span className="font-semibold">Mẹo thử nghiệm:</span> Nhập bất kỳ email hợp lệ và mật khẩu từ 6 ký tự trở lên (ví dụ: <code className="text-sky-600 font-mono">admin@travel.com</code> / <code className="text-sky-600 font-mono">123456</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
