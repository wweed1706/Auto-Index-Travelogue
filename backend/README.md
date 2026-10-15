# Backend

Cloudinary được cấu hình qua `CLOUDINARY_URL` dạng
`cloudinary://<api_key>:<api_secret>@<cloud_name>`. Khi chạy Docker, đặt biến
trong `.env` ở gốc dự án; khi chạy Python trực tiếp, đặt trong `backend/.env`.
SDK khởi tạo ở startup và dùng HTTPS cho URL media. Để trống nếu chưa sử dụng.
Không đặt thông tin này trong frontend hoặc biến `VITE_*`.
Sau khi đổi cấu hình Docker, chạy `docker compose up -d --build --no-deps --wait backend`
từ gốc dự án.

`POST /api/upload` nhận multipart field `file`, yêu cầu Bearer JWT và trả
`{url, public_id, resource_type}`. Hỗ trợ JPEG/PNG/WebP/GIF, MP4/WebM,
tối đa 50 MB/tệp. SDK chạy trong thread pool với `resource_type="auto"`.
Frontend tải từng tệp, sau đó lưu URL và metadata bằng API tạo Journey;
spinner và khóa form hoạt động trong suốt quá trình. Có thể hủy lúc upload.
URL đã nhận được giữ trong trang để thử lại không tải trùng. Nếu đóng trang,
hủy hoặc xóa Journey, asset Cloudinary chưa được tự động dọn; chưa có PATCH.

FastAPI + Motor, Python 3.13. Chạy các lệnh dưới đây từ thư mục `backend`.

```powershell
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Điền `MONGODB_URL` trong `.env` bằng URI MongoDB đang hoạt động (ví dụ
`mongodb://localhost:27017`). Điền `JWT_SECRET` bằng chuỗi ngẫu nhiên tối thiểu
32 ký tự, có thể tạo bằng:

```powershell
.\venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(32))"
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Swagger UI: http://127.0.0.1:8000/docs. Liveness: `GET /api/health`.
Ứng dụng ping MongoDB khi startup qua lifespan và đóng client khi shutdown,
kể cả khi ping thất bại. Startup dừng nếu cấu hình hoặc kết nối DB không hợp lệ.
Health chỉ phản ánh tiến trình đang chạy, không kiểm tra lại DB mỗi request.

`CORS_ORIGINS` là danh sách JSON; mặc định cho frontend chạy ở cổng 3000.
Môi trường ảo và `.env` được Git ignore. Có thể chạy trực tiếp Python trong venv
như trên khi PowerShell chặn `Activate.ps1`, hoặc dùng `venv\Scripts\activate.bat`
trong CMD.

`requirements.txt` được xuất từ `pip freeze`. Đã khóa `bcrypt==4.0.1` vì kiểm tra
hash mật khẩu với Passlib 1.7.4 và bcrypt 5.0.0 thất bại.
API xác thực nhận JSON:

- `POST /api/auth/register`: `{ "email": "user@example.com", "password": "your-password", "name": "User" }`.
  Trả HTTP 201 với `id`, `email`, `name`, `avatar`; email trùng trả 400.
- `POST /api/auth/login`: `{ "email": "user@example.com", "password": "your-password" }`.
  Trả `access_token` và `token_type: bearer`; sai thông tin trả 401.
- `GET /api/auth/me`: gửi `Authorization: Bearer <token>`; trả user công khai.
  Thiếu/sai/hết hạn token hoặc user đã bị xóa trả 401.

Mật khẩu đăng ký tối thiểu 8 ký tự, tối đa 72 byte UTF-8, không chứa ký tự null.
Email được chuyển về chữ thường và có unique index. JWT dùng HS256, `sub` là user id,
có `iat` và `exp`; `ACCESS_TOKEN_EXPIRE_MINUTES` mặc định 30 (1–1440).
Frontend đã tích hợp Login/Register và restore qua `/me`. Dependency `get_current_user`
có thể dùng để bảo vệ API mới. Chưa có refresh token hoặc API cập nhật hồ sơ.

Chạy integration tests từ thư mục gốc sau khi rebuild Docker:

```powershell
Get-Content -Raw -Encoding UTF8 backend/tests/test_auth.py | docker compose exec -T backend python -
```

Tests tạo database `auth_test_<uuid>` riêng và xóa database đó sau khi chạy;
không ghi tài khoản kiểm thử vào database ứng dụng.

## Journeys API

Tất cả endpoint yêu cầu `Authorization: Bearer <access_token>`:

| Method | Route | Kết quả |
| --- | --- | --- |
| POST | `/api/journeys` | 201, chuyến đi vừa tạo |
| GET | `/api/journeys?skip=0&limit=100` | 200, danh sách của user, mới nhất trước |
| GET | `/api/journeys/{id}` | 200, chi tiết chuyến đi của user |
| DELETE | `/api/journeys/{id}` | 204, không có response body |

Body tạo tối thiểu:

```json
{"title":"Đà Lạt", "location":"Lâm Đồng", "date":"2026-10-15"}
```

Các trường bổ sung: `notes`, `tags`, `media`, `coordinates`, `summary`.
Response có `id`, `user_id` dạng chuỗi và `createdAt`, `updatedAt` UTC.
Trong MongoDB, `user_id` là BSON ObjectId lấy từ user đã xác thực. Không gửi
`user_id`, `ownerId`, `id` hoặc timestamps trong body; các trường này bị từ chối (422).
ID không hợp lệ trả 400; ID không tồn tại hoặc thuộc user khác đều trả 404.
Query danh sách có `skip >= 0`, `1 <= limit <= 100`, mặc định 100.

Frontend hiện dùng interface `Journey`, không có `IJourney`. Schema API giữ tên
các trường nghiệp vụ và camelCase timestamps, dùng `user_id` thay `ownerId`.
Các kiểu `JourneyCreateRequest`, `JourneyUpdateRequest`, `JourneyApiResponse`
đã bổ sung trong frontend; luồng Journey đã nối API tạo/list/detail/delete.

Media API dùng metadata và URL HTTP(S), không nhận Blob hoặc URL `blob:`.
Ví dụ một phần tử `media`:

```json
{"id":"photo-1", "url":"https://example.com/photo.jpg", "name":"photo.jpg",
 "kind":"image", "mimeType":"image/jpeg", "sizeBytes":1024, "tags":[]}
```

`kind` nhận `image`, `video`, `audio`; đầu vào cũng chấp nhận tên `type`.
`journeyId` không nằm trong media JSON vì media đã thuộc document Journey.
Chưa có API upload hoặc xóa file trên storage; DELETE chỉ xóa document Journey.
`JourneyUpdate` đã có schema optional cho cập nhật sau này, chưa có endpoint PATCH.
