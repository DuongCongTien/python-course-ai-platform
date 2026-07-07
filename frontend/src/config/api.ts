export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://cobweb-lunchbox-upcoming.ngrok-free.dev/api/v1"
).replace(/\/+$/, "");

const TOKEN_STORAGE_KEY = "pyai_token";
const LEGACY_TOKEN_STORAGE_KEY = "python_ai_learning_token";

function getStoredToken() {
  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY)
  );
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;
  const token = getStoredToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(!isFormData && options.body ? { "Content-Type": "application/json" } : {}),
      "ngrok-skip-browser-warning": "true",
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    let message = `API loi ${response.status}`;

    if (contentType.includes("application/json")) {
      const errorBody = await response.json().catch(() => null);
      message =
        errorBody?.message ||
        errorBody?.detail?.message ||
        (typeof errorBody?.detail === "string" ? errorBody.detail : undefined) ||
        errorBody?.error ||
        message;
    } else {
      const text = await response.text().catch(() => "");
      if (text) message = text.slice(0, 200);
    }

    throw new Error(message);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("API khong tra ve JSON. Co the ngrok dang chan request.");
  }

  return response.json();
}
