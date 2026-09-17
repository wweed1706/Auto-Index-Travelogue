# Auto-Index Travelogue

Nền tảng ký sự hành trình du lịch thông minh, hỗ trợ tự động lập chỉ mục ảnh và dữ liệu GPS.

## 🚀 Cấu Trúc Dự Án (Project Structure)

```
Auto-Index-Travelogue/
├── frontend/               # Giao diện người dùng ReactJS + Vite + TailwindCSS
│   ├── public/             # Tài nguyên tĩnh (ảnh đại diện, favicon)
│   ├── src/
│   │   ├── assets/         # Hình ảnh minh họa du lịch độ nét cao
│   │   ├── components/     # Components tái sử dụng (Sidebar, Header, CTA, Placeholders, Icons)
│   │   ├── context/        # AuthContext quản lý trạng thái đăng nhập/đăng xuất
│   │   ├── pages/
│   │   │   ├── Login.jsx   # Trang đăng nhập chia đôi màn hình
│   │   │   └── Dashboard.jsx # Trang bảng điều khiển trung tâm
│   │   ├── App.jsx         # Cấu hình định tuyến & ProtectedRoute
│   │   ├── main.jsx        # Điểm bắt đầu React App
│   │   └── index.css       # Tailwind directives, theme du lịch & animations
│   ├── package.json        # Danh sách thư viện phụ thuộc
│   ├── vite.config.js      # Cấu hình Vite
│   └── tailwind.config.js  # Cấu hình Tailwind CSS
└── backend/                # API và dịch vụ xử lý dữ liệu backend
```

## 🛠️ Hướng Dẫn Chạy Ứng Dụng (Getting Started)

### Yêu cầu tiên quyết
- Cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+ hoặc mới nhất).

### Cài đặt và Khởi chạy Frontend:
```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi động môi trường phát triển (Dev Server)
npm run dev
```

Sau đó mở trình duyệt tại địa chỉ: `http://localhost:3000` (hoặc cổng được hiển thị trên terminal).

---

## 🌟 Tính Năng Đã Triển Khai Trong Bản Này

1. **Trang Đăng nhập (`Login.jsx`):**
   - **Bố cục chia đôi:** Nửa trái là phong cảnh du lịch hùng vĩ kết hợp gradient nghệ thuật, nửa phải là form đăng nhập nổi bật.
   - **Form Validation:** Kiểm tra email đúng định dạng và mật khẩu không để trống (ít nhất 6 ký tự).
   - **Tiện ích:** Nút ẩn/hiện mật khẩu (Eye/EyeOff), ngã rẽ "Quên mật khẩu?" căn phải dưới ô mật khẩu.
   - **Chuyển hướng:** Tự động lưu phiên và điều hướng sang `/dashboard`.

2. **Cơ chế Bảo vệ Đường Dẫn (`<ProtectedRoute>`):**
   - Ngăn chặn người dùng chưa xác thực truy cập thẳng vào URL `/dashboard`.
   - Tự động chuyển hướng về `/login` nếu chưa đăng nhập.

3. **Trang Bảng điều khiển (`Dashboard.jsx`):**
   - **Sidebar:** Hệ thống menu ("Lịch sử chuyến đi", "Lên kế hoạch (Planner)", "Cài đặt") và nút **Đăng xuất (Logout)** ở chân thanh điều hướng. Hỗ trợ responsive slide-over drawer trên Mobile.
   - **Header:** Lời chào thân thiện, ngày tháng cập nhật động, nút chuông thông báo, nút menu mobile và Avatar có dropdown menu kèm chức năng **Đăng xuất**.
   - **Khu vực Call-to-Action (CTA):** Card nổi bật ở trung tâm với nút lớn "Tạo chuyến đi mới" (Create Journey) kèm icon nổi bật kết nối tính năng đăng tải hành trình.
   - **Khu vực Recent:** Lưới (Grid) 3 cột hiển thị 3 khối thẻ placeholder đại diện cho các chuyến đi gần đây với hiệu ứng viền nét đứt sang trọng.