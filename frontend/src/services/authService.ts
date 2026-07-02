import httpClient from "./httpClient";
import type { ApiUser, LoginPayload, RegisterPayload } from "./auth.types";

/**
 * Response của /auth/login theo Swagger chỉ khai báo schema "string",
 * nên token có thể trả về dạng chuỗi thuần hoặc bọc trong object.
 * Hàm này xử lý linh hoạt cả hai trường hợp.
 */
function extractToken(data: unknown): string {
  if (typeof data === "string" && data.length > 0) return data;

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.access_token === "string") return obj.access_token;
    if (typeof obj.token === "string") return obj.token;
  }

  throw new Error("Không xác định được token trong phản hồi từ server.");
}

export const authService = {
  async login(payload: LoginPayload): Promise<string> {
    const { data } = await httpClient.post("/auth/login", payload);
    return extractToken(data);
  },

  async register(payload: RegisterPayload): Promise<unknown> {
    const { data } = await httpClient.post("/auth/register", payload);
    return data;
  },

  async loginWithGoogle(idToken: string): Promise<string> {
    const { data } = await httpClient.post("/auth/google-login", { id_token_str: idToken });
    return extractToken(data);
  },

  async getMe(token: string): Promise<ApiUser> {
    const { data } = await httpClient.get("/users/me", {
      params: { token },
    });
    // Response thật có dạng { status: "success", user: {...} }, không phải user trực tiếp
    return (data?.user ?? data) as ApiUser;
  },
};

interface ApiErrorShape {
  response?: {
    data?: {
      detail?: string | Array<{ msg?: string; loc?: (string | number)[] }>;
    };
  };
  message?: string;
}

/** Chuyển lỗi từ axios (FastAPI 422 validation error, 401, network error...) thành message tiếng Việt dễ hiểu */
export function parseApiError(error: unknown): string {
  const err = error as ApiErrorShape;
  const detail = err.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg ?? JSON.stringify(item)).join(" ");
  }
  if (typeof detail === "string") return detail;
  if (err.message === "Network Error") return "Không kết nối được tới máy chủ. Vui lòng kiểm tra đường truyền hoặc thử lại sau.";

  return "Đã có lỗi xảy ra, vui lòng thử lại.";
}
