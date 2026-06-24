import { useState } from "react";
import { Bell, Braces, Menu, Settings, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import AIReviewSuggestionCard from "../../components/progress/AIReviewSuggestionCard";
import MyCourseProgressList from "../../components/progress/MyCourseProgressList";
import ProfileCard from "../../components/progress/ProfileCard";
import ProgressStatsGrid from "../../components/progress/ProgressStatsGrid";
import RecentActivityTimeline from "../../components/progress/RecentActivityTimeline";
import {
  type CourseProgress,
  type ProgressStat,
  type RecentActivity,
  type StudentProfile,
} from "../../components/progress/progressTypes";

const profile: StudentProfile = {
  name: "Nguyễn Văn A",
  email: "vana.nguyen@example.com",
  level: "Trung cấp",
};

const stats: ProgressStat[] = [
  { id: "courses", icon: "menu_book", value: 3, label: "Khóa học đang học" },
  { id: "lessons", icon: "check_circle", value: 24, label: "Bài học đã xong" },
  { id: "quiz", icon: "grade", value: "8.5/10", label: "Điểm quiz TB" },
  { id: "ai", icon: "smart_toy", value: 12, label: "Số lần hỏi AI" },
];

const activities: RecentActivity[] = [
  { id: "activity-1", title: "Đã xem bài: Cấu trúc điều kiện", time: "2 giờ trước", icon: "visibility", type: "view" },
  { id: "activity-2", title: "Hoàn thành Quiz: Vòng lặp", time: "5 giờ trước", icon: "task_alt", type: "quiz" },
  { id: "activity-3", title: "Đã hỏi AI về: Đệ quy trong Python", time: "Hôm qua", icon: "psychology", type: "ai" },
];

const myCourses: CourseProgress[] = [
  {
    id: "python-basic",
    title: "Lập trình Python Cơ bản",
    completedLessons: 17,
    totalLessons: 20,
    progress: 85,
  },
  {
    id: "data-science-python",
    title: "Data Science với Python",
    completedLessons: 9,
    totalLessons: 20,
    progress: 45,
  },
  {
    id: "advanced-machine-learning",
    title: "Machine Learning nâng cao",
    completedLessons: 2,
    totalLessons: 20,
    progress: 10,
    isMuted: true,
  },
];

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
];

function MyProgressPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="page-container py-10 sm:py-14">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Tiến độ học tập của tôi
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Theo dõi lộ trình làm chủ kiến thức cùng Python AI Learning
            </p>
          </div>
        </section>

        <section className="page-container grid gap-7 py-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:py-10">
          <div className="space-y-7 lg:order-1">
            <ProfileCard profile={profile} />
            <div className="hidden lg:block">
              <AIReviewSuggestionCard />
            </div>
            <div className="hidden lg:block">
              <RecentActivityTimeline activities={activities} />
            </div>
          </div>

          <div className="space-y-7 lg:order-2">
            <ProgressStatsGrid stats={stats} />
            <div className="lg:hidden">
              <AIReviewSuggestionCard />
            </div>
            <MyCourseProgressList courses={myCourses} />
            <div className="lg:hidden">
              <RecentActivityTimeline activities={activities} />
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

function ProgressNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="page-container flex h-[72px] items-center justify-between py-3">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg" aria-label="Python AI Learning">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <Braces size={21} strokeWidth={2.5} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
            Python <span className="text-indigo-600">AI</span> Learning
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring rounded px-1 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Thông báo"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Cài đặt"
          >
            <Settings size={18} />
          </button>
          <div className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-sm font-extrabold text-white">
            NA
          </div>
        </div>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="page-container flex flex-col gap-1 border-t border-slate-100 bg-white py-4 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function ProgressFooter() {
  const links = ["Privacy Policy", "Terms of Service", "Help Center", "Contact"];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-extrabold text-slate-950">Python AI Learning</p>
          <p className="mt-1 text-sm text-slate-500">© 2024 Python AI Learning. All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link key={link} to="/" className="text-sm font-medium text-slate-500 transition hover:text-indigo-600">
              {link}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default MyProgressPage;
