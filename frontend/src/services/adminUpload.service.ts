import { apiFetch } from "../config/api";

interface UploadLessonByTitlePayload {
  courseId: string;
  lessonTitle: string;
}

export function uploadLessonVideoFile(
  payload: UploadLessonByTitlePayload & {
    file: File;
    durationSeconds?: number;
  },
) {
  const formData = new FormData();
  formData.append("courseId", payload.courseId);
  formData.append("lessonTitle", payload.lessonTitle);
  formData.append("file", payload.file);

  if (payload.durationSeconds !== undefined) {
    formData.append("durationSeconds", String(payload.durationSeconds));
  }

  return apiFetch("/admin/upload/video", { method: "POST", body: formData });
}

export function uploadLessonYoutube(
  payload: UploadLessonByTitlePayload & {
    videoUrl: string;
    durationSeconds?: number;
  },
) {
  return apiFetch("/admin/upload/youtube", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function uploadLessonSlide(
  payload: UploadLessonByTitlePayload & {
    file: File;
  },
) {
  const formData = new FormData();
  formData.append("courseId", payload.courseId);
  formData.append("lessonTitle", payload.lessonTitle);
  formData.append("file", payload.file);

  return apiFetch("/admin/upload/slide", { method: "POST", body: formData });
}
