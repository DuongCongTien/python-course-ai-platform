import { ClipboardList, FileText, ListChecks, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { type LessonTab, type TranscriptSegment } from "./learningTypes";

interface LessonTabsProps {
  activeTab: LessonTab;
  onTabChange: (tab: LessonTab) => void;
  lessonId: string;
  courseId: string;
  transcriptSegments: TranscriptSegment[];
}

const tabs: Array<{ id: LessonTab; label: string }> = [
  { id: "overview", label: "Tổng quan" },
  { id: "transcript", label: "Transcript" },
  { id: "summary", label: "Tóm tắt" },
  { id: "quiz", label: "Quiz" },
];

function LessonTabs({ activeTab, onTabChange, lessonId, courseId, transcriptSegments }: LessonTabsProps) {
  const navigate = useNavigate();

  const handleTabChange = (tab: LessonTab) => {
    if (tab === "transcript") {
      navigate(`/learning/${courseId}/${lessonId}/transcript`);
      return;
    }
    onTabChange(tab);
  };
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white shadow-card">
      <div className="flex overflow-x-auto border-b border-slate-100 px-4" role="tablist" aria-label="Nội dung bài học">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={`min-w-max border-b-2 px-4 py-4 text-sm font-extrabold transition ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-indigo-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "transcript" && <TranscriptTab segments={transcriptSegments} />}
        {activeTab === "summary" && <SummaryTab />}
        {activeTab === "quiz" && <QuizTab lessonId={lessonId} />}
      </div>
    </section>
  );
}

function OverviewTab() {
  const notes = [
    "Vòng lặp `for` được dùng khi biết trước số lần lặp.",
    "Vòng lặp `while` lặp cho đến khi một điều kiện không còn đúng.",
    "Sử dụng `break` để thoát vòng lặp ngay lập tức.",
  ];

  return (
    <div className="rounded-2xl bg-indigo-50/70 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <ListChecks size={20} />
        </span>
        <h2 className="font-extrabold text-slate-950">Ghi chú quan trọng</h2>
      </div>
      <ul className="space-y-3">
        {notes.map((note) => (
          <li key={note} className="flex gap-3 text-sm leading-6 text-slate-700">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TranscriptTab({ segments }: { segments: TranscriptSegment[] }) {
  return (
    <div>
      <div className="relative mb-5">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          name="transcript-search"
          autoComplete="off"
          placeholder="Tìm trong transcript..."
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </div>
      <div className="space-y-3">
        {segments.map((segment) => (
          <div key={segment.time} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
            <span className="font-mono text-sm font-extrabold text-indigo-600">{segment.time}</span>
            <p className="text-sm font-medium text-slate-700">{segment.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryTab() {
  const summaries = ["Khái niệm vòng lặp", "Khi nào dùng for", "Khi nào dùng while", "Ví dụ ứng dụng thực tế"];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {summaries.map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FileText size={18} />
          </span>
          <span className="text-sm font-bold text-slate-700">{item}</span>
        </div>
      ))}
    </div>
  );
}

function QuizTab({ lessonId }: { lessonId: string }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <ClipboardList size={22} />
          </span>
          <div>
            <h2 className="font-extrabold text-slate-950">Kiểm tra nhanh kiến thức bài học</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">5 câu hỏi</p>
          </div>
        </div>
        <Link
          to={`/quiz/${lessonId}`}
          className="focus-ring inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Bắt đầu làm quiz
        </Link>
      </div>
    </div>
  );
}

export default LessonTabs;
