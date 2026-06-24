export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "current" | "locked";
}

export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
}

export type LessonTab = "overview" | "transcript" | "summary" | "quiz";

export interface TranscriptSegment {
  time: string;
  title: string;
}
