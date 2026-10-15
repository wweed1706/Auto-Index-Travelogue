export const TOKEN_KEY = "travelogue_access_token";
export const SESSION_EXPIRED = "travelogue:session-expired";
const baseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function errorMessage(status: number, path: string): string {
  if (path === "/upload") {
    if (status === 413) return "Tệp vượt quá giới hạn 50 MB.";
    if (status === 415 || status === 400) return "Tệp không hợp lệ. Chỉ nhận ảnh và video được hỗ trợ.";
    if (status === 502 || status === 503) return "Không thể tải media lên. Vui lòng thử lại.";
  }
  if (status === 401)
    return path === "/auth/login"
      ? "Email hoặc mật khẩu không chính xác."
      : "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  if (status === 400 && path === "/auth/register")
    return "Email này đã được sử dụng.";
  if (status === 404 && path.startsWith("/journeys"))
    return "Không tìm thấy chuyến đi hoặc bạn không có quyền truy cập.";
  if (status === 422)
    return path.startsWith("/auth/")
      ? "Thông tin chưa hợp lệ. Kiểm tra email và mật khẩu (tối đa 72 byte UTF-8)."
      : "Thông tin chuyến đi chưa hợp lệ. Kiểm tra ngày, tọa độ và các tệp đính kèm.";
  if (status === 429) return "Bạn thao tác quá nhanh. Vui lòng thử lại sau.";
  return "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại.";
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 15000,
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);
  if (options.body instanceof FormData) headers.delete("Content-Type");
  else if (options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = window.setTimeout(abort, timeoutMs);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    if (!response.ok) {
      // Không để response cũ xóa một phiên đăng nhập mới.
      if (
        response.status === 401 &&
        path !== "/auth/login" &&
        localStorage.getItem(TOKEN_KEY) === token
      ) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event(SESSION_EXPIRED));
      }
      throw new ApiError(response.status, errorMessage(response.status, path));
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError || options.signal?.aborted) throw error;
    throw new Error("Không thể kết nối máy chủ. Kiểm tra mạng rồi thử lại.");
  } finally {
    window.clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}
