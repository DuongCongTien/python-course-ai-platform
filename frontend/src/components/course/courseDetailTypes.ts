import { type LucideIcon } from "lucide-react";

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  durationSeconds?: number;
  status: "completed" | "available" | "locked";
  isFree?: boolean;
  sortOrder?: number;
}

export interface CourseChapter {
  id: string;
  title: string;
  meta: string;
  lessons?: LessonItem[];
  placeholder?: string;
}

export interface CourseObjective {
  id: string;
  text: string;
}

export interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface CourseDetail {
  id: string;
  firstLessonId: string;
  currentLessonId?: string;
  title: string;
  description: string;
  level: string;
  lessonsCount: number;
  duration: string;
  hasAI: boolean;
  studentsThisMonth: string;
  chapters: CourseChapter[];
  objectives: CourseObjective[];
  aiFeatures: AIFeature[];
}
