import { ClipboardList, FileText, ListChecks, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { type LessonTab, type TranscriptSegment } from "./learningTypes";

interface LessonTabsProps {
  activeTab: LessonTab;
  onTabChange: (tab: LessonTab) => void;
  lessonId: string;
  transcript: string | null;
  summary: string | null;
  transcriptSegments: TranscriptSegment[];
}

const tabs: Array<{ id: LessonTab; label: string }> = [
  { id: "overview", label: "Tổng quan" },
  { id: "transcript", label: "Transcript" },
  { id: "summary", label: "Tóm tắt" },
  { id: "quiz", label: "Quiz" },
];

function LessonTabs({
  activeTab,
  onTabChange,
  lessonId,
  transcript,
  summary,
  transcriptSegments,
}: LessonTabsProps) {
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
            onClick={() => onTabChange(tab.id)}
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
        {activeTab === "overview" && <OverviewTab summary={summary} />}
        {activeTab === "transcript" && <TranscriptTab transcript={transcript} segments={transcriptSegments} />}
        {activeTab === "summary" && <SummaryTab summary={summary} />}
        {activeTab === "quiz" && <QuizTab lessonId={lessonId} />}
      </div>
    </section>
  );
}

function OverviewTab({ summary }: { summary: string | null }) {
  return (
    <div className="rounded-2xl bg-indigo-50/70 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <ListChecks size={20} />
        </span>
        <h2 className="font-extrabold text-slate-950">Nội dung chính</h2>
      </div>
      {summary ? (
        <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{summary}</p>
      ) : (
        <p className="text-sm leading-6 text-slate-500">Tóm tắt bài học chưa có.</p>
      )}
    </div>
  );
}

function TranscriptTab({ transcript, segments }: { transcript: string | null; segments: TranscriptSegment[] }) {
  if (!transcript && segments.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">Transcript chưa được tạo.</p>;
  }

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
      {segments.length > 0 ? (
        <div className="space-y-3">
          {segments.map((segment) => (
            <div key={`${segment.time}-${segment.title}`} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
              <span className="font-mono text-sm font-extrabold text-indigo-600">{segment.time}</span>
              <p className="text-sm font-medium text-slate-700">{segment.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{transcript}</p>
      )}
    </div>
  );
}

function SummaryTab({ summary }: { summary: string | null }) {
  if (!summary) {
    return <p className="text-sm leading-6 text-slate-500">Tóm tắt bài học chưa có.</p>;
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <FileText size={18} />
      </span>
      <p className="whitespace-pre-line text-sm font-medium leading-7 text-slate-700">{summary}</p>
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
