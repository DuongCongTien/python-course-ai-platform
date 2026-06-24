import { ArrowRight, BarChart3, Clock3, Code2, Database, Globe2, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

interface Course {
  title: string;
  level: CourseLevel;
  lessons: number;
  duration: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

const courses: Course[] = [
  {
    title: "Python Cơ Bản",
    level: "Beginner",
    lessons: 20,
    duration: "10 giờ",
    description: "Nắm vững cú pháp, tư duy lập trình và xây dựng nền tảng Python chắc chắn.",
    icon: Code2,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Python & AI Data Science",
    level: "Intermediate",
    lessons: 35,
    duration: "25 giờ",
    description: "Phân tích dữ liệu, trực quan hóa và làm quen với các mô hình machine learning.",
    icon: Database,
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    title: "Lập trình Web với Django",
    level: "Advanced",
    lessons: 30,
    duration: "20 giờ",
    description: "Xây dựng ứng dụng web hoàn chỉnh với Django, database và REST API.",
    icon: Globe2,
    gradient: "from-cyan-500 to-blue-600",
  },
];

const badgeStyles: Record<CourseLevel, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

function CourseHighlightSection() {
  return (
    <section id="courses" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="page-container">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Khóa học nổi bật</p>
            <h2 className="section-heading">Lộ trình dành cho mọi cấp độ</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Học từ kiến thức nền tảng đến các ứng dụng Python chuyên sâu trong AI và phát triển web.
            </p>
          </div>
          <Link to="/courses" className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-lg font-bold text-indigo-600 hover:text-indigo-700">
            Xem tất cả
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <div className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${course.gradient}`}>
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-white/20 text-white shadow-xl backdrop-blur transition duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon size={38} />
        </div>
        <div className="absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-white/10" />
      </div>
      <div className="p-6">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeStyles[course.level]}`}>
          {course.level}
        </span>
        <h3 className="mt-4 text-xl font-bold text-slate-950">{course.title}</h3>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{course.description}</p>
        <div className="my-5 flex items-center gap-5 border-y border-slate-100 py-4 text-sm font-medium text-slate-500">
          <span className="flex items-center gap-2">
            <BarChart3 size={17} className="text-indigo-500" />
            {course.lessons} bài học
          </span>
          <span className="flex items-center gap-2">
            <Clock3 size={17} className="text-indigo-500" />
            {course.duration}
          </span>
        </div>
        <Link to="/courses/python-basic" className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 font-bold text-indigo-600 transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white">
          Xem chi tiết
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default CourseHighlightSection;
