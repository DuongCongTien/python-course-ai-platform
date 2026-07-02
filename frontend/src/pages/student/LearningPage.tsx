import { useCallback, useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AIAssistantPanel from "../../components/learning/AIAssistantPanel";
import LessonInfoSection from "../../components/learning/LessonInfoSection";
import LessonSidebar from "../../components/learning/LessonSidebar";
import LessonTabs from "../../components/learning/LessonTabs";
import VideoPlayerSection from "../../components/learning/VideoPlayerSection";
import {
  type ChatMessage,
  type Lesson,
  type LessonDetail,
  type LessonTab,
  type TranscriptSegment,
} from "../../components/learning/learningTypes";
import { getCourseLessons } from "../../services/course.service";
import { getLessonById, getLessonResources } from "../../services/lesson.service";

const initialMessages: ChatMessage[] = [
  {
    id: "message-1",
    role: "ai",
    content: "Chào bạn! Tôi là AI Assistant. Bạn có câu hỏi nào về bài học này không?",
  },
];

const suggestedQuestions = ["Tóm tắt bài học này", "Giải thích phần khó hiểu nhất", "Cho ví dụ dễ hiểu hơn"];

function LearningPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LessonTab>("overview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadLearningData = useCallback(async () => {
    if (!courseId || !lessonId) {
      setLesson(null);
      setLessons([]);
      setErrorMessage("Không tìm thấy khóa học hoặc bài học.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const resourcesPromise = getLessonResources(lessonId)
        .then((resourcesResponse) => unwrapApiData(resourcesResponse))
        .catch((error) => {
          console.warn("Resources API chưa sẵn sàng:", error);
          return null;
        });
      const [lessonResponse, resourcesData, lessonsResponse] = await Promise.all([
        getLessonById(lessonId),
        resourcesPromise,
        getCourseLessons(courseId),
      ]);
      const mappedLesson = mapLessonDetail(unwrapApiData(lessonResponse), resourcesData);

      setLesson(mappedLesson);
      setLessons(extractLessons(lessonsResponse));
    } catch (error) {
      console.error("Load learning data failed:", error);
      setLesson(null);
      setLessons([]);
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu bài học.");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    loadLearningData();
  }, [loadLearningData]);

  const handleSelectLesson = (nextLessonId: string) => {
    if (!courseId) return;
    navigate(`/learning/${courseId}/${nextLessonId}`);
  };

  const handleSendMessage = () => {
    const trimmedInput = chatInput.trim();
    if (!trimmedInput) return;

    setChatMessages((current) => [
      ...current,
      {
        id: `message-${Date.now()}-user`,
        role: "user",
        content: trimmedInput,
      },
      {
        id: `message-${Date.now()}-ai`,
        role: "ai",
        content: "AI đang dựa trên nội dung bài học để trả lời câu hỏi này.",
      },
    ]);
    setChatInput("");
  };

  const handleSelectSuggestedQuestion = (question: string) => {
    setChatInput(question);
  };

  if (isLoading) {
    return <LearningPageSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h3 className="text-lg font-bold text-red-700">Không thể tải dữ liệu bài học</h3>
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          <button
            type="button"
            onClick={loadLearningData}
            className="focus-ring mt-5 inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-600">
          Không tìm thấy bài học.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)_360px] lg:px-8">
        <LessonSidebar lessons={lessons} selectedLessonId={lesson.id} onSelectLesson={handleSelectLesson} />

        <div className="min-w-0 space-y-6">
          <VideoPlayerSection videoUrl={lesson.videoUrl} title={lesson.title} />
          <LessonSlideCard slideFile={lesson.slideFile} />
          <LessonInfoSection title={lesson.title} description={lesson.description} />
          <LessonTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            lessonId={lesson.id}
            transcript={lesson.transcript}
            summary={lesson.summary}
            transcriptSegments={lesson.transcriptSegments}
          />
        </div>

        <AIAssistantPanel
          messages={chatMessages}
          input={chatInput}
          suggestedQuestions={suggestedQuestions}
          onInputChange={setChatInput}
          onSend={handleSendMessage}
          onSelectSuggestedQuestion={handleSelectSuggestedQuestion}
        />
      </main>
    </div>
  );
}

function LessonSlideCard({ slideFile }: { slideFile: Lesson["slideFile"] | null }) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <FileText size={24} aria-hidden={true} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-slate-950">Slide bài học</h2>
          {slideFile ? (
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{slideFile.fileName}</p>
                <p className="mt-1 text-xs text-slate-500">{slideFile.fileSize}</p>
              </div>
              <a
                href={slideFile.fileUrl}
                download
                className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                <Download size={17} aria-hidden={true} />
                Tải xuống
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-500">Bài học này chưa có slide để tải xuống.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function LearningPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)_360px] lg:px-8">
        <div className="h-[520px] animate-pulse rounded-[26px] bg-white shadow-card" />
        <div className="space-y-6">
          <div className="aspect-video animate-pulse rounded-[28px] bg-slate-200" />
          <div className="h-32 animate-pulse rounded-[26px] bg-white shadow-card" />
          <div className="h-40 animate-pulse rounded-[26px] bg-white shadow-card" />
        </div>
        <div className="h-[520px] animate-pulse rounded-[26px] bg-white shadow-card" />
      </main>
    </div>
  );
}

function mapLessonDetail(lessonData: unknown, resourcesData?: unknown): LessonDetail {
  const data = asRecord(lessonData);
  const resources = asRecord(resourcesData);

  return {
    id: String(getValue(data.id, "")),
    courseId: String(getValue(data.courseId, data.course_id, "")),
    title: String(getValue(data.title, "Chưa có tiêu đề bài học")),
    description: String(getValue(data.description, "")),
    durationSeconds: Number(getValue(data.durationSeconds, data.duration_seconds, 0)),
    videoUrl: getStringOrNull(
      getNested(resources, "video", "videoUrl"),
      getNested(resources, "video", "video_url"),
      getNested(data, "video", "videoUrl"),
      getNested(data, "video", "video_url"),
      resources.videoUrl,
      resources.video_url,
      data.videoUrl,
      data.video_url,
    ),
    slideFile: mapSlideFile(getValue(resources.slideFile, resources.slide_file, data.slideFile, data.slide_file)),
    transcript: getStringOrNull(
      getNested(resources, "transcript", "text"),
      getNested(resources, "transcript", "transcriptText"),
      getNested(resources, "transcript", "transcript_text"),
      getNested(data, "transcript", "text"),
      getNested(data, "transcript", "transcriptText"),
      getNested(data, "transcript", "transcript_text"),
      resources.transcriptText,
      resources.transcript_text,
      data.transcriptText,
      data.transcript_text,
    ),
    summary: getStringOrNull(
      getNested(resources, "summary", "summaryText"),
      getNested(resources, "summary", "summary_text"),
      getNested(data, "summary", "summaryText"),
      getNested(data, "summary", "summary_text"),
      resources.summaryText,
      resources.summary_text,
      data.summaryText,
      data.summary_text,
    ),
    transcriptSegments: extractTranscriptSegments(resources, data),
  };
}

function mapSlideFile(slideFile: unknown): Lesson["slideFile"] | null {
  const slide = asRecord(slideFile);
  const fileUrl = getStringOrNull(slide.fileUrl, slide.file_url, slide.url, slide.downloadUrl, slide.download_url);

  if (!fileUrl) return null;

  return {
    fileName: getStringOrNull(slide.fileName, slide.file_name, slide.name, slide.title) ?? "slide.pdf",
    fileUrl,
    fileSize: getStringOrNull(slide.fileSize, slide.file_size, slide.size) ?? "",
  };
}

function extractLessons(response: unknown): Lesson[] {
  const data = unwrapApiData(response);
  const items = Array.isArray(data) ? data : [];
  const lessons: Lesson[] = [];

  const lessonItems = items.every((item) => !Array.isArray(asRecord(item).lessons))
    ? items
    : items.flatMap((chapter) => {
        const chapterRecord = asRecord(chapter);
        return Array.isArray(chapterRecord.lessons) ? chapterRecord.lessons : [];
      });

  lessonItems.forEach((item) => {
    const lesson = asRecord(item);
    lessons.push({
      id: String(getValue(lesson.id, "")),
      title: String(getValue(lesson.title, "Bài học")),
      duration: String(getValue(lesson.duration, formatLessonDuration(Number(getValue(lesson.durationSeconds, lesson.duration_seconds, 0))))),
      status: mapLessonStatus(getStringOrNull(lesson.status)),
    });
  });

  return lessons.filter((item) => item.id);
}

function extractTranscriptSegments(...sources: unknown[]): TranscriptSegment[] {
  for (const source of sources) {
    const record = asRecord(source);
    const transcript = asRecord(record.transcript);
    const segments = getValue(record.transcriptSegments, record.transcript_segments, transcript.segments);

    if (Array.isArray(segments)) {
      return segments
        .map((segment) => {
          const item = asRecord(segment);
          const time = getStringOrNull(item.time, item.timestamp, item.startTime, item.start_time) ?? "";
          const title = getStringOrNull(item.title, item.text, item.content) ?? "";
          return time || title ? { time, title } : null;
        })
        .filter((segment): segment is TranscriptSegment => Boolean(segment));
    }
  }

  return [];
}

function unwrapApiData(payload: unknown): unknown {
  const record = asRecord(payload);
  if ("data" in record) return record.data;
  if ("items" in record) return record.items;
  return payload;
}

function mapLessonStatus(status: string | null): Lesson["status"] {
  if (status === "completed" || status === "locked") return status;
  return "available";
}

function formatLessonDuration(durationSeconds: number) {
  const secondsTotal = Math.max(durationSeconds, 0);
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getNested(source: Record<string, unknown>, key: string, nestedKey: string) {
  return asRecord(source[key])[nestedKey];
}

function getStringOrNull(...values: unknown[]) {
  const value = values.find((item) => typeof item === "string" && item.trim().length > 0);
  return typeof value === "string" ? value : null;
}

function getValue<T>(...values: Array<T | null | undefined>): T {
  const value = values.find((item) => item !== null && item !== undefined);
  return value as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export default LearningPage;
