# Travelogue · Frontend

React 18, TypeScript strict, React Router 7, Tailwind CSS 4 và dnd-kit.
Xác thực và Chuyến đi qua FastAPI + MongoDB. Kế hoạch vẫn lưu cục bộ trong IndexedDB.

## Chạy trên máy

Cần Node.js từ 20.19 trở lên.

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Mở http://localhost:3000. Trên terminal khác có thể dùng `npm` thay cho `npm.cmd`.

Khởi động backend bằng Docker ở thư mục gốc trước khi đăng nhập.
Frontend dùng `VITE_API_URL` trong `frontend/.env`, mặc định `http://localhost:8000/api`.
Không đặt JWT secret hoặc URI MongoDB trong frontend.
Tài khoản mới thông thường bắt đầu với thư viện và danh sách kế hoạch trống.

## Các luồng đã hoàn thiện

- Login/Register: gọi API thật, JWT trong localStorage, lấy user qua `/auth/me`, loading khi phục hồi phiên và lỗi trực tiếp trên form. 401 ngoài login xóa phiên và chuyển về Login; lỗi mạng/5xx không xóa token đang lưu khi restore.
- Nhật ký: tạo ghi chú, danh sách, chi tiết và xóa qua API có JWT. Nút Lưu/Xóa có trạng thái chờ; lỗi mạng giữ nguyên form/danh sách. Bản nháp chỉ ở bộ nhớ trang, không lưu IndexedDB.
- Giao diện media/chỉnh sửa được giữ nguyên; API chưa có upload/PATCH nên thao tác chọn file hoặc lưu chỉnh sửa hiện lỗi rõ và không gửi yêu cầu tạo thay thế. Xóa chưa có hoàn tác phía server.
- Thư viện: ảnh bìa, tìm kiếm không phân biệt dấu, tóm tắt demo, lọc chủ đề/ngày và giữ bộ lọc trên URL.
- Chi tiết: media lightbox với điều hướng, timeline, sơ đồ tọa độ tương tác và gắn vị trí thủ công.
- Planner: catalog 6 điểm đến, form tiêu chí, lịch trình gợi ý hoặc trống, thêm/sửa/xóa hoạt động, kéo thả, chuyển ngày, điều chỉnh giờ, cảnh báo chồng lịch và tự lưu.
- Cài đặt: xem hồ sơ server, xuất/nhập bản sao JSON gồm cả Blob media và xóa dữ liệu thư viện theo tài khoản. Chưa có API đổi tên.

## Routes

| Route             | Nội dung                                          |
| ----------------- | ------------------------------------------------- |
| /login, /register | Xác thực qua FastAPI                              |
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

- Journey, media và bản nháp không đọc/ghi IndexedDB. Các store cũ vẫn được giữ nguyên dữ liệu để không phá migration; ứng dụng chỉ dùng IndexedDB cho Planner.
- Metadata thư viện không chứa Blob; chỉ tải media cần xem. Mọi ghi dữ liệu chờ transaction hoàn tất.
- LocalStorage chỉ lưu access token tại `travelogue_access_token`; user lấy từ `/me`. API tự xác định chủ sở hữu Journey qua JWT. Planner local vẫn dùng MongoDB user id làm ownerId.
- Dữ liệu tài khoản demo cũ không tự động gán sang tài khoản server. Chưa có luồng chuyển dữ liệu tài khoản cũ.
- Thay đổi Planner đọc và cập nhật bản mới nhất trong cùng transaction; BroadcastChannel cập nhật các tab cùng tài khoản.
- AI demo dùng metadata, từ khóa và ghi chú, chưa nhận diện ảnh hay gọi mô hình AI.
- Địa điểm, giá, độ phù hợp và nền sơ đồ là minh họa. Sơ đồ chạy offline; liên kết Google Maps cần mạng.
- Tài khoản và Journey lưu trên server. Kế hoạch vẫn chưa đồng bộ giữa thiết bị.
- Xóa dữ liệu trình duyệt sẽ xóa nội dung. Bản sao JSON chứa cả media và có thể nhập lại qua Cài đặt.
- Giới hạn upload: 50 MB/tệp, 40 tệp và 200 MB/chuyến đi. Giới hạn nhập bản sao: 300 MB.
- Logic dữ liệu nằm trong services/ và hooks/; types/ định nghĩa hợp đồng, pages/components hiển thị.

`IJourney` là alias của `JourneyApiResponse` với `id`, `user_id` đúng hợp đồng API.
`journeyService.ts` ánh xạ sang view model cũ (`ownerId`, `journeyId` trong metadata)
để giữ nguyên JSX/Tailwind; không sinh ID Journey tại frontend. Danh sách tải đủ các
trang API (100 mục/trang). Media được hiển thị trực tiếp từ URL server trả về.
Xuất bản sao đọc Journey từ API; nhập bản sao chỉ hỗ trợ Journey không có file,
báo rõ số mục đã nhập nếu lỗi giữa chừng. Dữ liệu user demo cũ không tự chuyển lên server.

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
