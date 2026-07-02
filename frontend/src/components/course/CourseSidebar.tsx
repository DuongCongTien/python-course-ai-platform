import { Award, CheckCircle2, FileText, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";
import InstructorCard from "./InstructorCard";
import { type CourseDetail, type CourseLesson } from "./courseDetailTypes";

interface CourseSidebarProps {
  course: CourseDetail;
  lessons?: CourseLesson[];
  isAuthenticated: boolean;
}

const extras = [
  { label: "Tài liệu PDF & mã nguồn mẫu", icon: FileText },
  { label: "Chứng nhận hoàn thành", icon: Award },
  { label: "Cộng đồng học viên hỗ trợ 24/7", icon: Users },
  { label: "Cập nhật nội dung trọn đời", icon: RefreshCw },
];

function CourseSidebar({ course, lessons = [], isAuthenticated }: CourseSidebarProps) {
  const nextLessonId = course.currentLessonId || course.firstLessonId || lessons[0]?.id;

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      {isAuthenticated ? (
        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-950">Tiến độ của bạn</h2>
            <span className="text-2xl font-extrabold text-indigo-600">0%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Tiến độ học tập sẽ được cập nhật khi bạn hoàn thành bài học.
          </p>
          {nextLessonId ? (
            <Link
              to={`/learning/${course.id}/${nextLessonId}`}
              className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Tiếp tục bài học
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-slate-300 px-4 py-3 text-sm font-bold text-white"
            >
              Khóa học chưa có bài học
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-[26px] border border-indigo-100 bg-indigo-50/70 p-5 shadow-card">
          <h2 className="text-lg font-extrabold text-slate-950">Theo dõi tiến độ học tập</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Đăng nhập để xem tiến độ học tập của bạn.
          </p>
          <Link
            to="/login"
            state={{ from: { pathname: `/courses/${course.id}` } }}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}

      <InstructorCard />

      <div className="rounded-[26px] bg-slate-950 p-5 text-white shadow-soft">
        <h2 className="text-lg font-extrabold">Bao gồm trong khóa học</h2>
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
          Truy cập ngay sau khi đăng ký
        </div>
      </div>
    </aside>
  );
}

export default CourseSidebar;
