# Frontend Travelogue

```sh
npm install
npm run dev
```

Ứng dụng dùng React, TypeScript strict và Tailwind CSS. Route cha `MainLayout`
giữ Sidebar cố định; `Outlet` chỉ thay phần nội dung khi điều hướng. Trên mobile,
Sidebar thu gọn thành icon có tên truy cập và tooltip.

## Các trang

- `/`: giới thiệu và lối vào các tính năng.
- `/upload`: lưu chuyến đi cùng ảnh, video, audio, ghi chú và tags.
- `/planner`, `/planner/:id`: tạo bản nháp theo tiêu chí, thêm hoạt động theo giờ.
- `/gallery`: lịch sử chuyến đi và kế hoạch; `?tab=search` để tìm từ khóa lịch sử.
- `/journey/:id`: media, timeline và liên kết tìm địa điểm trên Google Maps.
- `/settings`: placeholder.
- `/login`, `/register`: hồ sơ cục bộ, không phải xác thực tài khoản.

## Dữ liệu và giới hạn

Chưa có backend. IndexedDB lưu metadata và Blob media trên thiết bị. Hồ sơ lưu
trong localStorage và không phân tách dữ liệu giữa người dùng. Xóa dữ liệu trình
duyệt sẽ xóa nội dung; chưa có đồng bộ giữa các thiết bị.

Không gọi OpenAI/Google Places và không hiển thị mock như kết quả thật. Planner
tạo bản nháp rỗng đúng ngày đã chọn; người dùng tự thêm hoạt động. Gallery tìm
từ khóa không phân biệt dấu, chưa trả lời câu hỏi ngôn ngữ tự nhiên hoặc nhận diện
ảnh. Bản đồ mở Google Maps qua liên kết; chưa nhúng SDK bản đồ.

`services/` quản lý lưu trữ và logic lập kế hoạch; `hooks/` và Context nối dữ liệu
với UI. `types/` chứa hợp đồng dữ liệu; `fixtures/` tách riêng dữ liệu mẫu, không
được dùng làm fallback trong các trang.

## Kiểm tra

```sh
npm run typecheck
npm run lint
npm run build
npm test
```

Playwright dùng Microsoft Edge đã cài trên máy. Có thể đổi `channel` trong cấu
hình nếu môi trường sử dụng trình duyệt khác. Test kiểm tra Sidebar không remount,
media/plan còn sau reload, dữ liệu rỗng, tìm lịch sử, focus modal và responsive.
Ảnh chụp kiểm tra nằm trong `test-results/` (không đưa vào Git).
