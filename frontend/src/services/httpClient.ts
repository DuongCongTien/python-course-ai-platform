import axios from "axios";

// Đặt VITE_API_BASE_URL trong file .env ở gốc project (xem .env.example)
const baseURL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://cobweb-lunchbox-upcoming.ngrok-free.dev/api/v1"
).replace(/\/+$/, "");

const httpClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // Bắt buộc với ngrok free tier, nếu không request sẽ bị chặn bởi trang cảnh báo HTML
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 15000,
});

export default httpClient;
