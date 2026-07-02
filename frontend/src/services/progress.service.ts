import { apiFetch } from "../config/api";

export interface LessonProgressData {
  lessonId: number | string;
  lastPositionSeconds: number;
  watchedSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  isCompleted: boolean;
}

export interface CourseProgressData {
  courseId: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  currentLessonId: number | string | null;
  lessons: LessonProgressData[];
}

export interface CourseContinueData {
  courseId: string;
  lessonId: number | string;
  lastPositionSeconds: number;
  progressPercent: number;
  isCompleted: boolean;
}

export function getCourseContinue(courseId: string) {
  return apiFetch<{ success?: boolean; message?: string; data?: CourseContinueData } | CourseContinueData>(
    `/courses/${encodeURIComponent(courseId)}/continue`,
  );
}

export function getCourseProgress(courseId: string) {
  return apiFetch<{ success?: boolean; message?: string; data?: CourseProgressData } | CourseProgressData>(
    `/courses/${encodeURIComponent(courseId)}/progress`,
  );
}

export function getLessonProgress(lessonId: string) {
  return apiFetch<{ success?: boolean; message?: string; data?: LessonProgressData } | LessonProgressData>(
    `/lessons/${encodeURIComponent(lessonId)}/progress`,
  );
}

export function updateLessonProgress(
  lessonId: string,
  payload: {
    courseId: string;
    lastPositionSeconds: number;
    watchedSeconds: number;
    durationSeconds: number;
    progressPercent: number;
  },
) {
  return apiFetch<{ success?: boolean; message?: string; data?: LessonProgressData } | LessonProgressData>(
    `/lessons/${encodeURIComponent(lessonId)}/progress`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export function completeLesson(
  lessonId: string,
  payload: {
    courseId: string;
    durationSeconds: number;
  },
) {
  return apiFetch<{ success?: boolean; message?: string; data?: LessonProgressData } | LessonProgressData>(
    `/lessons/${encodeURIComponent(lessonId)}/complete`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function unwrapProgressData<T>(payload: { data?: T } | T): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: T }).data as T;
  }

  return payload as T;
}
