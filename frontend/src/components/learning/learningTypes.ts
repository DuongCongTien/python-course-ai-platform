export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "available" | "locked";
  slideFile?: {
    fileName: string;
    fileUrl: string;
    fileSize: string;
  };
}

export interface LessonDetail {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationSeconds: number;
  videoUrl: string | null;
  slideFile: Lesson["slideFile"] | null;
  transcript: string | null;
  summary: string | null;
  transcriptSegments: TranscriptSegment[];
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
