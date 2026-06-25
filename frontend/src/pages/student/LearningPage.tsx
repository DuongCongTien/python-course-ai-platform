import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
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
  { id: "lesson-1", title: "Bài 1: Giới thiệu về Python", duration: "08:15", status: "completed" },
  {
    id: "lesson-2",
    title: "Bài 2: Biến và kiểu dữ liệu",
    duration: "15:40",
    status: "completed",
    slideFile: {
      fileName: "bien-va-kieu-du-lieu-python.pdf",
      fileUrl: "/mock/slides/bien-va-kieu-du-lieu-python.pdf",
      fileSize: "2.4 MB",
    },
  },
  { id: "lesson-3", title: "Bài 3: Cấu trúc điều kiện If-Else", duration: "10:20", status: "completed" },
  {
    id: "lesson-4",
    title: "Bài 4: Vòng lặp trong Python",
    duration: "12:30",
    status: "current",
    slideFile: {
      fileName: "vong-lap-trong-python.pdf",
      fileUrl: "/mock/slides/vong-lap-trong-python.pdf",
      fileSize: "1.8 MB",
    },
  },
  { id: "lesson-5", title: "Bài 5: Hàm và Module", duration: "22:10", status: "locked" },
  { id: "lesson-6", title: "Bài 6: Xử lý file trong Python", duration: "18:45", status: "locked" },
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
  const { courseId = "python-cho-nguoi-moi-bat-dau", lessonId = "lesson-4" } = useParams();
  const [activeTab, setActiveTab] = useState<LessonTab>("overview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(lessonId);
  const activeLesson = lessons.find((lesson) => lesson.id === selectedLesson);

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
        <LessonSidebar lessons={lessons} selectedLessonId={selectedLesson} onSelectLesson={setSelectedLesson} />

        <div className="min-w-0 space-y-6">
          <VideoPlayerSection />
          <LessonSlideCard slideFile={activeLesson?.slideFile} />
          <LessonInfoSection />
          <LessonTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            lessonId={selectedLesson}
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
