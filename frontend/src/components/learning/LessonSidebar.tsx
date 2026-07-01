import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { type Lesson } from "./learningTypes";

interface LessonSidebarProps {
  lessons: Lesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
}

function LessonSidebar({ lessons, selectedLessonId, onSelectLesson }: LessonSidebarProps) {
  return (
    <aside className="rounded-[26px] border border-slate-200 bg-white shadow-card lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 p-5 backdrop-blur">
        <h2 className="text-lg font-extrabold text-slate-950">Nội dung khóa học</h2>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">Hoàn thành: 25%</span>
          <span className="font-extrabold text-indigo-600">6/24</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" />
        </div>
      </div>

      <div className="space-y-2 p-3">
        {lessons.map((lesson) => {
          const isLocked = lesson.status === "locked";
          const isCurrent = lesson.id === selectedLessonId;
          const isCompleted = lesson.status === "completed";

          return (
            <button
              key={lesson.id}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectLesson(lesson.id)}
              className={`w-full rounded-2xl border p-3 text-left transition ${
                isCurrent
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                  : isLocked
                    ? "cursor-not-allowed border-transparent bg-slate-50 text-slate-400 opacity-70"
                    : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isCurrent
                      ? "bg-indigo-600 text-white"
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isLocked ? <Lock size={17} /> : isCompleted && !isCurrent ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold leading-5">{lesson.title}</span>
                  <span className="mt-1 flex items-center justify-between gap-2 text-xs font-medium">
                    <span>{lesson.duration}</span>
                    {isCurrent && (
                      <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        Đang học
                      </span>
                    )}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default LessonSidebar;   