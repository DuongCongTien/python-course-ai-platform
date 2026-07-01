import { FileText, HelpCircle, ScrollText } from "lucide-react";
import { apiFetch } from "../config/api";
import { type Course } from "../components/course/CourseCard";
import {
  type AIFeature,
  type CourseChapter,
  type CourseDetail,
  type CourseObjective,
} from "../components/course/courseDetailTypes";

interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  message?: string;
  data?: T;
  items?: T;
  errorCode?: string;
  details?: unknown;
}

interface CourseListData {
  items: BackendCourse[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

type CoursesResponseData = CourseListData | BackendCourse[];

interface BackendCourse {
  id: number | string;
  slug?: string | null;
  title?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  level?: string | null;
  price?: number | string | null;
  status?: string | null;
  lessons_count?: number | null;
  lessonsCount?: number | null;
  totalLessons?: number | null;
  total_lessons?: number | null;
  duration_seconds?: number | null;
  durationSeconds?: number | null;
  has_ai?: boolean | null;
  hasAI?: boolean | null;
  is_learning?: boolean | null;
  isLearning?: boolean | null;
  progress_percent?: number | null;
  progress?: number | null;
  current_lesson_id?: number | string | null;
  currentLessonId?: number | string | null;
  first_lesson_id?: number | string | null;
  firstLessonId?: number | string | null;
  students_this_month?: string | null;
  studentsThisMonth?: string | null;
  objectives?: Array<string | { id?: string | number; text?: string }> | null;
  ai_features?: Array<{ id?: string; title?: string; description?: string }> | null;
  aiFeatures?: Array<{ id?: string; title?: string; description?: string }> | null;
}

interface BackendLesson {
  id: number | string;
  title?: string | null;
  duration_seconds?: number | null;
  durationSeconds?: number | null;
  duration?: string | null;
  status?: "completed" | "available" | "locked" | string | null;
  is_free?: boolean | null;
  isFree?: boolean | null;
  sort_order?: number | null;
  sortOrder?: number | null;
}

interface BackendChapter {
  id: number | string;
  title?: string | null;
  meta?: string | null;
  lessons?: BackendLesson[] | null;
}

const gradients = [
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-indigo-600 via-blue-600 to-cyan-500",
  "from-blue-600 via-indigo-600 to-violet-600",
  "from-purple-600 via-fuchsia-600 to-pink-500",
];

async function requestApi<T>(path: string, fallbackErrorMessage: string): Promise<ApiResponse<T>> {
  try {
    const payload = await apiFetch<ApiResponse<T> | T>(path);

    if (Array.isArray(payload)) {
      return {
        success: true,
        message: "OK",
        data: payload as T,
      };
    }

    if (!payload || typeof payload !== "object") {
      throw new Error(fallbackErrorMessage);
    }

    const responsePayload = payload as ApiResponse<T>;
    const isSuccessful =
      responsePayload.success === true ||
      responsePayload.status === "success" ||
      "data" in responsePayload ||
      "items" in responsePayload;

    if (!isSuccessful) {
      throw new Error(responsePayload.message || fallbackErrorMessage);
    }

    return {
      ...responsePayload,
      success: true,
      data: ("data" in responsePayload ? responsePayload.data : responsePayload.items) as T,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || fallbackErrorMessage);
    }
    throw new Error(fallbackErrorMessage);
  }
}

export async function getCourses(params?: {
  keyword?: string;
  level?: string;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.keyword) searchParams.set("keyword", params.keyword);
  if (params?.level && params.level !== "all") searchParams.set("level", params.level);
  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("pageSize", String(params?.pageSize ?? 20));

  const query = searchParams.toString();
  return requestApi<CoursesResponseData>(
    `/courses${query ? `?${query}` : ""}`,
    "Khong the tai danh sach khoa hoc.",
  );
}

export async function getFeaturedCourses() {
  return requestApi<BackendCourse[]>("/courses/featured", "Khong the tai khoa hoc noi bat.");
}

export async function getCourseById(courseId: string) {
  return requestApi<BackendCourse>(
    `/courses/${encodeURIComponent(courseId)}`,
    "Khong the tai chi tiet khoa hoc.",
  );
}

export async function getCourseLessons(courseId: string) {
  return requestApi<BackendChapter[]>(
    `/courses/${encodeURIComponent(courseId)}/lessons`,
    "Khong the tai noi dung khoa hoc.",
  );
}

export function mapCourseListItem(course: BackendCourse, index = 0): Course {
  const durationSeconds = Number(getValue(course.durationSeconds, course.duration_seconds, 0));
  const lessonsCount = Number(getValue(course.lessonsCount, course.lessons_count, course.totalLessons, course.total_lessons, 0));
  const hasAI = Boolean(getValue(course.hasAI, course.has_ai, true));
  const isLearning = Boolean(getValue(course.isLearning, course.is_learning, false));
  const progress = Number(getValue(course.progress, course.progress_percent, 0));
  const currentLessonId = getValue(course.currentLessonId, course.current_lesson_id, null);
  const id = String(course.slug || course.id);

  return {
    id,
    title: course.title || "Chua co tieu de",
    level: mapLevel(course.level),
    lessons: lessonsCount,
    duration: formatDuration(durationSeconds),
    durationHours: secondsToHours(durationSeconds),
    description: course.description || "",
    hasAI,
    popular: index === 0,
    isLearning,
    progress,
    lessonId: currentLessonId ? String(currentLessonId) : undefined,
    gradient: gradients[index % gradients.length],
  };
}

export function mapCourseDetail(course: BackendCourse, chapters: BackendChapter[] = []): CourseDetail {
  const mappedChapters = mapChapters(chapters);
  const firstLessonId = findFirstLessonId(mappedChapters);
  const backendFirstLessonIdValue = getValue(course.firstLessonId, course.first_lesson_id, null);
  const currentLessonIdValue = getValue(course.currentLessonId, course.current_lesson_id, null);
  const backendFirstLessonId = backendFirstLessonIdValue ? String(backendFirstLessonIdValue) : null;
  const currentLessonId = currentLessonIdValue ? String(currentLessonIdValue) : backendFirstLessonId ?? firstLessonId;
  const durationSeconds = Number(getValue(course.durationSeconds, course.duration_seconds, 0));
  const lessonsCount =
    Number(getValue(course.lessonsCount, course.lessons_count, course.totalLessons, course.total_lessons, 0)) ||
    mappedChapters.reduce((total, chapter) => total + (chapter.lessons?.length ?? 0), 0);

  return {
    id: String(course.slug || course.id),
    firstLessonId: backendFirstLessonId ?? firstLessonId ?? "",
    currentLessonId: currentLessonId ?? undefined,
    title: course.title || "Chua co tieu de",
    description: course.description || "",
    level: mapLevel(course.level),
    lessonsCount,
    duration: formatDuration(durationSeconds),
    hasAI: Boolean(getValue(course.hasAI, course.has_ai, false)),
    studentsThisMonth: getValue(course.studentsThisMonth, course.students_this_month, ""),
    chapters: mappedChapters,
    objectives: mapObjectives(course.objectives),
    aiFeatures: mapAIFeatures(getValue(course.aiFeatures, course.ai_features, null)),
  };
}

function mapChapters(chapters: BackendChapter[]): CourseChapter[] {
  return chapters.map((chapter) => ({
    id: String(chapter.id),
    title: chapter.title || "Chuong hoc",
    meta: chapter.meta || "",
    lessons: (chapter.lessons ?? []).map((lesson) => ({
      id: String(lesson.id),
      title: lesson.title || "Bai hoc",
      duration: lesson.duration || formatLessonDuration(Number(getValue(lesson.durationSeconds, lesson.duration_seconds, 0))),
      durationSeconds: Number(getValue(lesson.durationSeconds, lesson.duration_seconds, 0)),
      status: mapLessonStatus(lesson.status),
      isFree: Boolean(getValue(lesson.isFree, lesson.is_free, false)),
      sortOrder: Number(getValue(lesson.sortOrder, lesson.sort_order, 0)),
    })),
  }));
}

function mapObjectives(objectives: BackendCourse["objectives"]): CourseObjective[] {
  if (!objectives?.length) return [];

  return objectives.map((objective, index) =>
    typeof objective === "string"
      ? { id: `objective-${index + 1}`, text: objective }
      : {
          id: String(objective.id ?? `objective-${index + 1}`),
          text: objective.text || "",
        },
  );
}

function mapAIFeatures(features: BackendCourse["aiFeatures"]): AIFeature[] {
  if (!features?.length) return [];
  const iconMap = [ScrollText, FileText, HelpCircle];

  return features.map((feature, index) => ({
    id: feature.id || `ai-feature-${index + 1}`,
    title: feature.title || "AI feature",
    description: feature.description || "",
    icon: iconMap[index % iconMap.length],
  }));
}

function mapLevel(level?: string | null): Course["level"] {
  if (level === "intermediate") return "Trung cấp";
  if (level === "advanced") return "Nâng cao";
  return "Cơ bản";
}

function mapLessonStatus(status?: string | null): "completed" | "available" | "locked" {
  if (status === "completed" || status === "locked") return status;
  return "available";
}

function formatDuration(durationSeconds: number) {
  const hours = Math.max(1, Math.round(durationSeconds / 3600));
  return `${hours} giờ`;
}

function secondsToHours(durationSeconds: number) {
  return Math.round((durationSeconds / 3600) * 10) / 10;
}

function formatLessonDuration(durationSeconds: number) {
  const minutes = Math.floor(Math.max(durationSeconds, 0) / 60);
  const seconds = Math.max(durationSeconds, 0) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function findFirstLessonId(chapters: CourseChapter[]) {
  for (const chapter of chapters) {
    const lesson = chapter.lessons?.[0];
    if (lesson) return lesson.id;
  }

  return null;
}

function getValue<T>(...values: Array<T | null | undefined>): T {
  const value = values.find((item) => item !== null && item !== undefined);
  return value as T;
}
