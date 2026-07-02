import AIReviewSuggestionCard from "../../components/progress/AIReviewSuggestionCard";
import MyCourseProgressList from "../../components/progress/MyCourseProgressList";
import ProfileCard from "../../components/progress/ProfileCard";
import ProgressStatsGrid from "../../components/progress/ProgressStatsGrid";
import RecentActivityTimeline from "../../components/progress/RecentActivityTimeline";
import {
  type CourseProgress,
  type ProgressStat,
  type RecentActivity,
} from "../../components/progress/progressTypes";
import { useAuth } from "../../context/AuthContext";

// ⚠️ Dữ liệu bên dưới vẫn là dữ liệu giả — chưa có endpoint backend trả tiến độ/thống kê thật.
// Khi backend có API tương ứng, thay 3 mảng này bằng dữ liệu gọi API về.
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

function MyProgressPage() {
  const { user } = useAuth();

  if (!user) return null; // ProtectedRoute đảm bảo có user, phòng hờ render trước khi hydrate xong

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
            <ProfileCard
              profile={{
                name: user.fullName,
                email: user.email,
                // Chưa có field "trình độ" thật từ backend, tạm giữ nhãn cố định
                level: "Học viên",
              }}
            />
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

export default MyProgressPage;