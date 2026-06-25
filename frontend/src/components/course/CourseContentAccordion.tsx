import { CheckCircle2, ChevronDown, Circle, ListChecks, Lock, PlayCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { type CourseChapter, type LessonItem } from "./courseDetailTypes";

interface CourseContentAccordionProps {
  chapters: CourseChapter[];
  courseId: string;
  isAuthenticated: boolean;
  activeLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

function CourseContentAccordion({
  chapters,
  courseId,
  isAuthenticated,
  activeLessonId,
  onSelectLesson,
}: CourseContentAccordionProps) {
  const initialChapterId = useMemo(
    () =>
      chapters.find((chapter) =>
        chapter.lessons?.some((lesson) => lesson.id === activeLessonId),
      )?.id ?? chapters[0]?.id ?? "",
    [activeLessonId, chapters],
  );
  const [activeChapterId, setActiveChapterId] = useState(initialChapterId);

  useEffect(() => {
    setActiveChapterId(initialChapterId);
  }, [initialChapterId]);

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

              <div
                id={`content-${chapter.id}`}
                role="region"
                aria-labelledby={`trigger-${chapter.id}`}
                aria-hidden={!isActive}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden border-t border-slate-200 bg-white">
                  <div className="p-4 sm:p-5">
                  {chapter.lessons ? (
                    <div className="space-y-3">
                      {chapter.lessons.map((lesson) => (
                        <LessonRow
                          key={lesson.id}
                          lesson={lesson}
                          courseId={courseId}
                          isAuthenticated={isAuthenticated}
                          isActive={lesson.id === activeLessonId}
                          isChapterOpen={isActive}
                          onSelect={onSelectLesson}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                      {chapter.placeholder ?? "Nội dung chương đang được cập nhật..."}
                    </p>
                  )}
                  </div>
                </div>
              </div>
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
  isActive: boolean;
  isChapterOpen: boolean;
  onSelect: (lessonId: string) => void;
}

function LessonRow({
  lesson,
  courseId,
  isAuthenticated,
  isActive,
  isChapterOpen,
  onSelect,
}: LessonRowProps) {
  const isCompleted = lesson.status === "completed";
  const isLocked = !isAuthenticated || lesson.status === "locked";
  const lessonCardClass = [
    "focus-ring flex items-center justify-between gap-4 rounded-2xl border p-3 transition-all",
    isLocked
      ? "cursor-not-allowed border-transparent bg-slate-50 text-slate-500 opacity-70"
      : isActive
        ? "cursor-pointer border-indigo-500 bg-indigo-50 shadow-sm hover:border-indigo-600"
        : "cursor-pointer border-transparent bg-white hover:border-indigo-300 hover:bg-indigo-50/50",
  ].join(" ");

  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isLocked
              ? "bg-slate-200 text-slate-500"
              : isActive
                ? "bg-indigo-600 text-white"
                : isCompleted
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
          }`}
        >
          {isLocked ? (
            <Lock size={18} aria-hidden={true} />
          ) : isActive ? (
            <PlayCircle size={18} aria-hidden={true} />
          ) : isCompleted ? (
            <CheckCircle2 size={18} aria-hidden={true} />
          ) : (
            <Circle size={17} aria-hidden={true} />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{lesson.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {!isAuthenticated
              ? "Đăng nhập để học bài này"
              : lesson.status === "locked"
                ? "Bài học đang bị khóa"
                : isCompleted
                  ? "Đã hoàn thành"
                  : "Sẵn sàng học"}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {isActive && !isLocked && (
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
            Đang học
          </span>
        )}
        <span className="text-sm font-bold text-slate-500">{lesson.duration}</span>
      </div>
    </>
  );

  if (lesson.status === "locked" && isAuthenticated) {
    return (
      <div className={lessonCardClass} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={isAuthenticated ? `/learning/${courseId}/${lesson.id}` : "/login"}
      state={isAuthenticated ? undefined : { from: { pathname: `/learning/${courseId}/${lesson.id}` } }}
      onClick={() => {
        if (!isLocked) onSelect(lesson.id);
      }}
      tabIndex={isChapterOpen ? 0 : -1}
      className={lessonCardClass}
      aria-label={
        isAuthenticated
          ? `Học ${lesson.title}`
          : `Đăng nhập để học bài ${lesson.title}`
      }
    >
      {content}
    </Link>
  );
}

export default CourseContentAccordion;
