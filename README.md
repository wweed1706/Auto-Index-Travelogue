# Auto-Index Travelogue

# Chạy backend bằng Docker

Cần Docker Desktop đang chạy ở chế độ Linux containers, có Docker Compose v2.
Chạy từ thư mục gốc dự án.

Nếu chưa có `.env` ở thư mục gốc, sao chép `.env.example` thành `.env` và điền
`JWT_SECRET` ngẫu nhiên dài ít nhất 32 ký tự. Có thể tạo bằng
`python -c "import secrets; print(secrets.token_urlsafe(32))"`.
File này dành cho Compose, độc lập với `backend/.env` khi chạy Python trực tiếp.

```powershell
docker compose config --quiet
docker compose up --build -d --wait
docker compose ps
```

- Swagger UI: http://localhost:8000/docs
- Health: http://localhost:8000/api/health
- Log: `docker compose logs -f backend mongodb`
- Dừng: `docker compose down` (giữ dữ liệu MongoDB trong named volume).
- Sau khi sửa code: `docker compose up --build -d --wait`.

Compose chạy FastAPI và MongoDB; backend chờ MongoDB healthy trước khi khởi động.
MongoDB chỉ dùng mạng nội bộ Docker, không mở cổng lên máy host. URI trong
container dùng hostname `mongodb`, không dùng `localhost`. Cấu hình này dành cho
phát triển cục bộ, MongoDB chưa bật xác thực. API chỉ mở trên `127.0.0.1:8000`.
Không dùng `docker compose down -v` nếu muốn giữ dữ liệu.

Frontend tiếp tục chạy riêng ở cổng 3000 bằng `npm.cmd run dev` trong `frontend`.
Frontend đăng nhập/đăng ký qua API và khôi phục user qua `/api/auth/me`.
Chuyến đi tạo/đọc/xóa qua API; kế hoạch vẫn lưu cục bộ. Upload file và chỉnh sửa
chuyến đi chưa có API, UI sẽ báo rõ thay vì lưu vào IndexedDB.

Chạy Python không qua Docker: xem [backend/README.md](backend/README.md).

Để dùng MongoDB Atlas, thêm `MONGODB_URL` với URI đầy đủ vào `.env` ở thư mục gốc
và đặt `MONGODB_DB_NAME=auto_index_travelogue` (hoặc tên database muốn dùng).
Nếu mật khẩu chứa ký tự đặc biệt, percent-encode phần mật khẩu trong URI.
Không đưa mật khẩu thật vào `.env.example`.
Khi đã điền cấu hình, chạy:

```powershell
docker compose up -d --no-deps --force-recreate --wait backend
```

Lệnh trên chỉ khởi động lại backend để dùng Atlas. Container MongoDB local và
volume cũ vẫn được giữ; dữ liệu local không tự chuyển sang Atlas.
Nếu `MONGODB_URL` trống hoặc chưa được đặt, Compose tiếp tục dùng MongoDB local.

Nếu Docker Desktop báo `Virtual Machine Platform not enabled` và `wsl --status`
báo chưa cài WSL, mở PowerShell bằng quyền Administrator rồi chạy:

```powershell
wsl --install --no-distribution
```

Khởi động lại Windows, mở Docker Desktop và chạy lại các lệnh Compose ở trên.
Tham khảo [hướng dẫn WSL của Microsoft](https://learn.microsoft.com/en-us/windows/wsl/install).
Nếu terminal chưa nhận lệnh `docker`, mở lại VS Code sau khi cài Docker Desktop.

## Kiểm thử auth xuyên suốt

Stack test dùng MongoDB riêng, API cổng 8002 và frontend cổng 4183, không dùng Atlas
hoặc dữ liệu ứng dụng. Từ thư mục gốc:

```powershell
docker compose -f compose.auth-test.yaml up --build -d --wait
Get-Content -Raw -Encoding UTF8 backend/tests/test_auth.py | docker compose -f compose.auth-test.yaml exec -T backend python -
cd frontend
npm.cmd exec playwright test -- --config playwright.auth.config.ts
cd ..
docker compose -f compose.auth-test.yaml down -v
```

Lệnh cuối chỉ xóa container và volume của stack test. E2E yêu cầu Microsoft Edge.
Các test cũ dựa trên tài khoản/demo IndexedDB chưa được chuyển sang auth server;
dùng cấu hình `playwright.auth.config.ts` để chạy bộ kiểm thử auth mới.
