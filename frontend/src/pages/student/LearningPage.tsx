import { useEffect, useMemo, useState } from "react";
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
  type LessonTab,
  type TranscriptSegment,
} from "../../components/learning/learningTypes";

const lessons: Lesson[] = [
  {
    id: "lesson-1-1",
    title: "Bài 1: Giới thiệu về Python",
    duration: "08:15",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "gioi-thieu-python.pdf",
      fileUrl: "/mock/slides/gioi-thieu-python.pdf",
      fileSize: "1.2 MB",
    },
  },
  {
    id: "lesson-1-2",
    title: "Bài 2: Biến và kiểu dữ liệu",
    duration: "15:40",
    status: "current",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "bien-va-kieu-du-lieu-python.pdf",
      fileUrl: "/mock/slides/bien-va-kieu-du-lieu-python.pdf",
      fileSize: "2.4 MB",
    },
  },
  {
    id: "lesson-1-3",
    title: "Bài 3: Cấu trúc điều kiện If-Else",
    duration: "10:20",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "cau-truc-dieu-kien-if-else.pdf",
      fileUrl: "/mock/slides/cau-truc-dieu-kien-if-else.pdf",
      fileSize: "1.5 MB",
    },
  },
  {
    id: "lesson-1-4",
    title: "Bài 4: Vòng lặp trong Python",
    duration: "12:30",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "vong-lap-trong-python.pdf",
      fileUrl: "/mock/slides/vong-lap-trong-python.pdf",
      fileSize: "1.8 MB",
    },
  },
  {
    id: "lesson-1-5",
    title: "Bài 5: Hàm (Function) trong Python",
    duration: "18:00",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "ham-function-trong-python.pdf",
      fileUrl: "/mock/slides/ham-function-trong-python.pdf",
      fileSize: "2.0 MB",
    },
  },
  {
    id: "lesson-1-6",
    title: "Bài 6: List và Tuple",
    duration: "14:20",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "list-va-tuple.pdf",
      fileUrl: "/mock/slides/list-va-tuple.pdf",
      fileSize: "1.6 MB",
    },
  },
  {
    id: "lesson-1-7",
    title: "Bài 7: Dictionary và Set",
    duration: "16:45",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "dictionary-va-set.pdf",
      fileUrl: "/mock/slides/dictionary-va-set.pdf",
      fileSize: "1.9 MB",
    },
  },
  {
    id: "lesson-1-8",
    title: "Bài 8: Xử lý file trong Python",
    duration: "20:10",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    slideFile: {
      fileName: "xu-ly-file-trong-python.pdf",
      fileUrl: "/mock/slides/xu-ly-file-trong-python.pdf",
      fileSize: "2.2 MB",
    },
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: "message-1",
    role: "ai",
    content:
      "Chào bạn! Tôi là AI Assistant. Bạn có thắc mắc gì về cách hoạt động của vòng lặp for trong đoạn mã phút 03:45 không?",
  },
  {
    id: "message-2",
    role: "user",
    content: "Bạn có thể giải thích lại sự khác biệt giữa for và while một cách ngắn gọn được không?",
  },
  {
    id: "message-3",
    role: "ai",
    content:
      "Tất nhiên! Hãy nhớ: For dùng để duyệt qua một danh sách như list, string hoặc range. While dùng khi bạn chỉ quan tâm đến một điều kiện đúng/sai.",
  },
];

const suggestedQuestions = [
  "Tóm tắt bài học này",
  "Vòng lặp for khác while như thế nào?",
  "Cho ví dụ dễ hiểu hơn",
];

const transcriptSegments: TranscriptSegment[] = [
  { time: "00:00", title: "Giới thiệu bài học vòng lặp" },
  { time: "03:45", title: "Vòng lặp for trong Python" },
  { time: "07:20", title: "Vòng lặp while trong Python" },
  { time: "10:30", title: "So sánh for và while" },
];

function LearningPage() {
  const { courseId = "python-cho-nguoi-moi-bat-dau", lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LessonTab>("overview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState("");
  const normalizedLessonId = useMemo(() => {
    if (lessonId && lessons.some((lesson) => lesson.id === lessonId)) {
      return lessonId;
    }

    return lessons.find((lesson) => lesson.status === "current")?.id ?? lessons[0]?.id ?? "";
  }, [lessonId]);
  const activeLesson = lessons.find((lesson) => lesson.id === normalizedLessonId);

  useEffect(() => {
    if ((!lessonId || !lessons.some((lesson) => lesson.id === lessonId)) && normalizedLessonId) {
      navigate(`/learning/${courseId}/${normalizedLessonId}`, { replace: true });
    }
  }, [courseId, lessonId, navigate, normalizedLessonId]);

  const handleSelectLesson = (nextLessonId: string) => {
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
        content: "AI đang dựa trên transcript bài học để trả lời câu hỏi này.",
      },
    ]);
    setChatInput("");
  };

  const handleSelectSuggestedQuestion = (question: string) => {
    setChatInput(question);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)_360px] lg:px-8">
        <LessonSidebar lessons={lessons} selectedLessonId={normalizedLessonId} onSelectLesson={handleSelectLesson} />

        <div className="min-w-0 space-y-6">
          <VideoPlayerSection videoUrl={activeLesson?.videoUrl} />
          <LessonSlideCard slideFile={activeLesson?.slideFile} />
          <LessonInfoSection />
          <LessonTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            lessonId={normalizedLessonId}
            courseId={courseId}
            transcriptSegments={transcriptSegments}
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

function LessonSlideCard({ slideFile }: { slideFile?: Lesson["slideFile"] }) {
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
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Bài học này chưa có slide để tải xuống.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default LearningPage;