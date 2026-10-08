# Travelogue · Frontend độc lập

React 18, TypeScript strict, React Router 7, Tailwind CSS 4 và dnd-kit.
Ứng dụng chạy hoàn toàn ở client, không cần backend, API key hay dịch vụ AI.

## Chạy trên máy

Cần Node.js từ 20.19 trở lên.

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Mở http://localhost:3000. Trên terminal khác có thể dùng `npm` thay cho `npm.cmd`.

Tạo tài khoản cục bộ hoặc chọn **Khám phá bản demo** để mở không gian có dữ liệu mẫu.
Tài khoản mới thông thường bắt đầu với thư viện và danh sách kế hoạch trống.

## Các luồng đã hoàn thiện

- Login/Register: kiểm tra thông tin, hash mật khẩu bằng PBKDF2, phiên 30 ngày, đăng xuất và đổi tên.
- Nhật ký: kéo thả ảnh/video/audio, kiểm tra loại và dung lượng, preview, lưu/khôi phục nháp, xử lý mô phỏng, CRUD và hoàn tác xóa.
- Thư viện: ảnh bìa, tìm kiếm không phân biệt dấu, tóm tắt demo, lọc chủ đề/ngày và giữ bộ lọc trên URL.
- Chi tiết: media lightbox với điều hướng, timeline, sơ đồ tọa độ tương tác và gắn vị trí thủ công.
- Planner: catalog 6 điểm đến, form tiêu chí, lịch trình gợi ý hoặc trống, thêm/sửa/xóa hoạt động, kéo thả, chuyển ngày, điều chỉnh giờ, cảnh báo chồng lịch và tự lưu.
- Cài đặt: xuất/nhập bản sao JSON gồm cả Blob media, đổi tên và xóa dữ liệu theo tài khoản.

## Routes

| Route             | Nội dung                                          |
| ----------------- | ------------------------------------------------- |
| /login, /register | Xác thực giả lập                                  |
| /                 | Tổng quan và hành trình gần đây                   |
| /gallery          | Thư viện ký ức; q/tag/from/to là bộ lọc           |
| /upload           | Tạo nhật ký, tự lưu nháp                          |
| /journey/:id      | Chi tiết; view=gallery/timeline/map               |
| /journey/:id/edit | Chỉnh nhật ký và media                            |
| /planner          | Kế hoạch đã lưu                                   |
| /planner/new      | Tạo kế hoạch; destination có thể được điền từ URL |
| /planner/:id      | Workspace; day lưu ngày đang chọn                 |
| /settings         | Hồ sơ và dữ liệu                                  |

Routes ứng dụng yêu cầu phiên đăng nhập; đăng nhập xong quay lại route đã yêu cầu.
Sidebar giữ cùng DOM instance giữa các trang; mobile dùng drawer có focus management.
Mỗi trang tải theo route, cùng skeleton, trạng thái lỗi, thông báo và hỗ trợ reduced motion.

## Dữ liệu và mô phỏng

- IndexedDB `travelogue-local` v2 lưu metadata, media, tài khoản và nháp trong các store riêng.
- Metadata thư viện không chứa Blob; chỉ tải media cần xem. Mọi ghi dữ liệu chờ transaction hoàn tất.
- Phiên nhỏ nằm trong LocalStorage. Journey và Itinerary được truy vấn theo ownerId.
- Migration từ v1 giữ media, ghi chú và hoạt động. Dữ liệu chưa có chủ sở hữu được gắn một lần với tài khoản đầu tiên tạo trên thiết bị.
- Thay đổi Planner đọc và cập nhật bản mới nhất trong cùng transaction; BroadcastChannel cập nhật các tab cùng tài khoản.
- AI demo dùng metadata, từ khóa và ghi chú, chưa nhận diện ảnh hay gọi mô hình AI.
- Địa điểm, giá, độ phù hợp và nền sơ đồ là minh họa. Sơ đồ chạy offline; liên kết Google Maps cần mạng.
- Tài khoản cục bộ phục vụ trải nghiệm demo, không thay thế xác thực phía server. Không có đồng bộ giữa thiết bị.
- Xóa dữ liệu trình duyệt sẽ xóa nội dung. Bản sao JSON chứa cả media và có thể nhập lại qua Cài đặt.
- Giới hạn upload: 50 MB/tệp, 40 tệp và 200 MB/chuyến đi. Giới hạn nhập bản sao: 300 MB.
- Logic dữ liệu nằm trong services/ và hooks/; types/ định nghĩa hợp đồng, pages/components hiển thị.

## Kiểm tra

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd test
```

Playwright chạy Microsoft Edge headless, tự mở server riêng ở port 4173 và không dùng lại server dev.
Cấu hình kiểm tra có thể đổi channel nếu dùng trình duyệt khác.
Test bao gồm xác thực, quyền sở hữu dữ liệu, migration v1, Blob sau reload, backup/restore,
lỗi lưu trữ, Sidebar, modal focus, kéo thả thật, hai tab cập nhật đồng thời và responsive 320px.
Ảnh kiểm tra trong test-results/; không đưa vào Git.
