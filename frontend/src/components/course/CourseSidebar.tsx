import { Award, CheckCircle2, FileText, RefreshCw, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import InstructorCard from "./InstructorCard";
import { type CourseDetail, type CourseLesson } from "./courseDetailTypes";
import {
  getCourseContinue,
  type CourseProgressData,
  unwrapProgressData,
} from "../../services/progress.service";

interface CourseSidebarProps {
  course: CourseDetail;
  lessons?: CourseLesson[];
  isAuthenticated: boolean;
  courseProgress?: CourseProgressData | null;
}

const extras = [
  { label: "Tai lieu PDF va ma nguon mau", icon: FileText },
  { label: "Chung nhan hoan thanh", icon: Award },
  { label: "Cong dong hoc vien ho tro 24/7", icon: Users },
  { label: "Cap nhat noi dung tron doi", icon: RefreshCw },
];

function CourseSidebar({ course, lessons = [], isAuthenticated, courseProgress }: CourseSidebarProps) {
  const navigate = useNavigate();
  const fallbackLessonId = course.currentLessonId || course.firstLessonId || lessons[0]?.id;
  const progressPercent = courseProgress?.progressPercent ?? 0;
  const completedLessons = courseProgress?.completedLessons ?? 0;
  const totalLessons = courseProgress?.totalLessons ?? lessons.length;

  const handleContinueLearning = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: `/courses/${course.id}` } },
      });
      return;
    }

    try {
      const response = await getCourseContinue(course.id);
      const continueData = unwrapProgressData(response);
      navigate(`/learning/${course.id}/${continueData.lessonId}`);
    } catch (error) {
      console.warn("Khong the lay bai hoc tiep tuc:", error);
      if (fallbackLessonId) {
        navigate(`/learning/${course.id}/${fallbackLessonId}`);
      }
    }
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      {isAuthenticated ? (
        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-950">Tien do cua ban</h2>
            <span className="text-2xl font-extrabold text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Da hoan thanh {completedLessons}/{totalLessons} bai hoc.
          </p>
          {fallbackLessonId ? (
            <button
              type="button"
              onClick={handleContinueLearning}
              className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Hoc tiep
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-slate-300 px-4 py-3 text-sm font-bold text-white"
            >
              Khoa hoc chua co bai hoc
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-[26px] border border-indigo-100 bg-indigo-50/70 p-5 shadow-card">
          <h2 className="text-lg font-extrabold text-slate-950">Theo doi tien do hoc tap</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dang nhap de xem tien do hoc tap cua ban.
          </p>
          <Link
            to="/login"
            state={{ from: { pathname: `/courses/${course.id}` } }}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Dang nhap ngay
          </Link>
        </div>
      )}

      <InstructorCard />

      <div className="rounded-[26px] bg-slate-950 p-5 text-white shadow-soft">
        <h2 className="text-lg font-extrabold">Bao gom trong khoa hoc</h2>
        <ul className="mt-5 space-y-4">
          {extras.map((extra) => {
            const Icon = extra.icon;

            return (
              <li key={extra.label} className="flex items-start gap-3 text-sm text-slate-200">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                  <Icon size={16} />
                </span>
                <span className="leading-6">{extra.label}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/10 p-3 text-sm font-semibold text-emerald-300">
          <CheckCircle2 size={17} />
          Truy cap ngay sau khi dang ky
        </div>
      </div>
    </aside>
  );
}

export default CourseSidebar;
