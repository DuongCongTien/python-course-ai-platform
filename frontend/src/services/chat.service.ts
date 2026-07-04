import httpClient from "./httpClient";

export interface AskAIPayload {
  question: string;
  lessonId?: string;
  context?: string | null;
}

// ⚠️ Tính đến hiện tại, backend CHƯA có endpoint AI thật.
// Hàm dưới đây được viết SẴN SÀNG để gọi API thật ngay khi backend hoàn thành —
// chỉ cần sửa lại đúng AI_CHAT_ENDPOINT (và tên field request/response nếu khác)
// bên dưới, không cần sửa gì ở LearningPage.tsx hay AIAssistantPanel.tsx.
//
// Trong lúc chưa có API thật: nếu gọi thất bại (404/network error), hàm sẽ tự
// rơi về 1 câu trả lời mô phỏng để trải nghiệm người dùng không bị vỡ (không văng lỗi đỏ).
const AI_CHAT_ENDPOINT = "/api/v1/chat/ask"; // TODO: đổi đúng path khi backend có API AI thật

export async function askAI({ question, lessonId, context }: AskAIPayload): Promise<string> {
  try {
    const { data } = await httpClient.post(AI_CHAT_ENDPOINT, {
      question,
      lesson_id: lessonId,
      context: context ?? undefined,
    });

    return (
      data?.answer ??
      data?.response ??
      data?.message ??
      "AI không trả về nội dung."
    );
  } catch (error) {
    console.warn(
      "[chat.service] API AI chat chưa sẵn sàng ở backend, dùng câu trả lời mô phỏng tạm thời:",
      error,
    );
    return "AI đang dựa trên nội dung bài học để trả lời câu hỏi này. (Đây là phản hồi mô phỏng tạm thời — API AI thật của backend chưa được kết nối.)";
  }
}