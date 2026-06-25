import { CheckCircle2, ChevronDown, ListChecks, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { type CourseChapter, type LessonItem } from "./courseDetailTypes";

interface CourseContentAccordionProps {
  chapters: CourseChapter[];
  courseId: string;
  isAuthenticated: boolean;
}

function CourseContentAccordion({ chapters, courseId, isAuthenticated }: CourseContentAccordionProps) {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id ?? "");

  const toggleChapter = (chapterId: string) => {
    setActiveChapterId((current) => (current === chapterId ? "" : chapterId));
  };

  return (
    <section id="course-content" className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-card sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ListChecks size={22} />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Nội dung khóa học</h2>
          <p className="mt-1 text-sm text-slate-500">Theo dõi từng chương và bài học trong lộ trình.</p>
        </div>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter) => {
          const isActive = activeChapterId === chapter.id;

          return (
            <div key={chapter.id} className="overflow-hidden rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                className="flex w-full items-center justify-between gap-4 bg-slate-50 px-4 py-4 text-left transition hover:bg-indigo-50/60 sm:px-5"
                aria-expanded={isActive}
                aria-controls={`content-${chapter.id}`}
                id={`trigger-${chapter.id}`}
              >
                <div>
                  <h3 className="font-extrabold text-slate-950">{chapter.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">{chapter.meta}</p>
                </div>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-slate-500 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isActive && (
                <div className="border-t border-slate-200 bg-white p-4 sm:p-5" id={`content-${chapter.id}`} role="region" aria-labelledby={`trigger-${chapter.id}`}>
                  {chapter.lessons ? (
                    <div className="space-y-3">
                      {chapter.lessons.map((lesson) => (
                        <LessonRow
                          key={lesson.id}
                          lesson={lesson}
                          courseId={courseId}
                          isAuthenticated={isAuthenticated}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                      {chapter.placeholder ?? "Nội dung chương đang được cập nhật..."}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface LessonRowProps {
  lesson: LessonItem;
  courseId: string;
  isAuthenticated: boolean;
}

function LessonRow({ lesson, courseId, isAuthenticated }: LessonRowProps) {
  const isCompleted = lesson.status === "completed";
  const destination = isAuthenticated
    ? `/learning/${courseId}/${lesson.id}`
    : "/login";

  return (
    <Link
      to={destination}
      state={isAuthenticated ? undefined : { from: { pathname: `/learning/${courseId}/${lesson.id}` } }}
      className="focus-ring flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3 transition hover:bg-indigo-50"
      aria-label={
        isAuthenticated
          ? `Học ${lesson.title}`
          : `Đăng nhập để học bài ${lesson.title}`
      }
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            !isAuthenticated
              ? "bg-slate-200 text-slate-500"
              : isCompleted
                ? "bg-emerald-100 text-emerald-600"
                : "bg-indigo-100 text-indigo-600"
          }`}
        >
          {!isAuthenticated ? (
            <Lock size={18} aria-hidden={true} />
          ) : isCompleted ? (
            <CheckCircle2 size={18} aria-hidden={true} />
          ) : (
            <Unlock size={18} aria-hidden={true} />
          )}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{lesson.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {!isAuthenticated
              ? "Đăng nhập để học bài này"
              : isCompleted
                ? "Đã hoàn thành"
                : "Sẵn sàng học"}
          </p>
        </div>
      </div>
      <span className="text-sm font-bold text-slate-500">{lesson.duration}</span>
    </Link>
  );
}

export default CourseContentAccordion;
