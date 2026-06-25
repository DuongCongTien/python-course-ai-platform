import {
  ArrowLeft,
  Award,
  Bot,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  History,
  MessageCircle,
  PlayCircle,
  RefreshCw,
  Search,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ActivityType = "video" | "quiz" | "ai" | "account" | "certificate" | "course";
type ActivityGroup = "Hôm nay" | "Hôm qua" | "Tuần này";

interface ActivityItem {
  id: string;
  group: ActivityGroup;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  actionLabel?: string;
  actionTo?: string;
  icon: LucideIcon;
  iconColorClass: string;
  daysAgo: number;
}

const activities: ActivityItem[] = [
  {
    id: "activity-1",
    group: "Hôm nay",
    type: "video",
    title: "Đã xem: Bài 2 - Biến và Kiểu dữ liệu",
    description: "Khóa học: Python Cơ bản cho người mới",
    time: "10:30 sáng",
    actionLabel: "Xem bài học",
    actionTo: "/learning/python-basic/lesson-2",
    icon: PlayCircle,
    iconColorClass: "bg-blue-50 text-blue-600",
    daysAgo: 0,
  },
  {
    id: "activity-2",
    group: "Hôm nay",
    type: "quiz",
    title: "Hoàn thành Quiz: Vòng lặp for - 8/10",
    description: "Chương 2: Cấu trúc điều khiển",
    time: "08:15 sáng",
    actionLabel: "Xem kết quả",
    actionTo: "/quiz/lesson-2/result",
    icon: CheckCircle2,
    iconColorClass: "bg-emerald-50 text-emerald-600",
    daysAgo: 0,
  },
  {
    id: "activity-3",
    group: "Hôm qua",
    type: "ai",
    title: "Hỏi AI: Cách dùng list comprehension",
    description: "Làm sao để lọc các số chẵn trong list bằng 1 dòng code?",
    time: "16:45 chiều",
    actionLabel: "Hỏi lại AI",
    actionTo: "/ai-assistant",
    icon: Bot,
    iconColorClass: "bg-indigo-50 text-indigo-600",
    daysAgo: 1,
  },
  {
    id: "activity-4",
    group: "Hôm qua",
    type: "course",
    title: "Tiếp tục học khóa: Python Cơ bản",
    description: "Thời lượng học: 45 phút",
    time: "14:20 chiều",
    actionLabel: "Học tiếp",
    actionTo: "/learning/python-basic/lesson-3",
    icon: GraduationCap,
    iconColorClass: "bg-violet-50 text-violet-600",
    daysAgo: 1,
  },
  {
    id: "activity-5",
    group: "Tuần này",
    type: "certificate",
    title: "Nhận chứng nhận hoàn thành chương 1",
    description: "Chúc mừng bạn đã xuất sắc vượt qua bài kiểm tra tổng hợp.",
    time: "Thứ 4, 15/05/2024",
    actionLabel: "Tải chứng nhận",
    icon: Award,
    iconColorClass: "bg-amber-50 text-amber-600",
    daysAgo: 3,
  },
  {
    id: "activity-6",
    group: "Tuần này",
    type: "account",
    title: "Cập nhật thông tin hồ sơ cá nhân",
    description: "Đã đổi ảnh đại diện và số điện thoại liên lạc.",
    time: "Thứ 2, 13/05/2024",
    actionLabel: "Chỉnh sửa",
    actionTo: "/profile/settings",
    icon: UserRound,
    iconColorClass: "bg-slate-100 text-slate-600",
    daysAgo: 5,
  },
  {
    id: "activity-7",
    group: "Tuần này",
    type: "video",
    title: "Đã xem lại: Cấu trúc điều kiện",
    description: "Khóa học: Python Cơ bản cho người mới",
    time: "Chủ nhật, 12/05/2024",
    actionLabel: "Xem bài học",
    actionTo: "/learning/python-basic/lesson-1",
    icon: PlayCircle,
    iconColorClass: "bg-blue-50 text-blue-600",
    daysAgo: 6,
  },
  {
    id: "activity-8",
    group: "Tuần này",
    type: "ai",
    title: "Hỏi AI: Phân biệt tuple và list",
    description: "Yêu cầu AI đưa ví dụ trực quan và bài tập thực hành.",
    time: "Thứ 7, 11/05/2024",
    actionLabel: "Hỏi lại AI",
    actionTo: "/ai-assistant",
    icon: Bot,
    iconColorClass: "bg-indigo-50 text-indigo-600",
    daysAgo: 7,
  },
];

const groups: ActivityGroup[] = ["Hôm nay", "Hôm qua", "Tuần này"];
const avatarUrl = new URL("../../assets/images/register-illustration.png.png", import.meta.url).href;

function ProfileActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredActivities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("vi");
    const maximumDays = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : timeRange === "3months" ? 90 : null;

    return activities.filter((activity) => {
      const matchesSearch =
        !normalizedSearch ||
        `${activity.title} ${activity.description}`.toLocaleLowerCase("vi").includes(normalizedSearch);
      const matchesType =
        activityType === "all" ||
        activity.type === activityType ||
        (activityType === "quiz" && activity.type === "certificate");
      const matchesTime = maximumDays === null || activity.daysAgo <= maximumDays;

      return matchesSearch && matchesType && matchesTime;
    });
  }, [activityType, searchTerm, timeRange]);

  const visibleActivities = filteredActivities.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchTerm("");
    setActivityType("all");
    setTimeRange("all");
    setVisibleCount(6);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <div className="page-container py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <nav className="flex items-center gap-2 text-sm font-medium text-[#464555]" aria-label="Breadcrumb">
              <Link to="/profile" className="transition hover:text-[#3525cd]">
                Hồ sơ cá nhân
              </Link>
              <span aria-hidden={true}>/</span>
              <span className="text-[#3525cd]">Hoạt động</span>
            </nav>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Toàn bộ hoạt động</h1>
            <p className="mt-3 text-lg leading-8 text-[#464555]">
              Xem lại lịch sử học tập, quiz và tương tác AI của bạn trên hệ thống.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#c7c4d8] bg-white px-5 py-3 font-bold transition hover:border-[#3525cd] hover:text-[#3525cd]"
          >
            <ArrowLeft size={19} aria-hidden={true} />
            Quay lại hồ sơ
          </Link>
        </div>

        <div className="grid gap-7 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-3">
            <section className="card-elevation-1 rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 text-center">
              <img
                src={avatarUrl}
                alt="Ảnh đại diện của Nguyễn Văn A"
                className="mx-auto h-24 w-24 rounded-full border-4 border-[#e2dfff] object-cover"
              />
              <h2 className="mt-4 text-xl font-extrabold">Nguyễn Văn A</h2>
              <p className="mt-1 break-all text-sm text-[#464555]">nguyen.vana@example.com</p>
              <span className="mt-3 inline-flex rounded-full bg-[#e5eeff] px-3 py-1 text-xs font-bold text-[#3525cd]">
                Học viên
              </span>

              <div className="mt-6 space-y-3">
                <ProfileStat icon={BookOpen} label="Bài học" value="24" />
                <ProfileStat icon={CheckCircle2} label="Quiz" value="8" />
                <ProfileStat icon={MessageCircle} label="Hỏi AI" value="12" />
              </div>
            </section>

            <section className="card-elevation-2 group relative overflow-hidden rounded-2xl bg-[#3525cd] p-6 text-white">
              <TrendingUp
                size={120}
                className="absolute -bottom-8 -right-7 text-white/10 transition duration-300 group-hover:scale-110"
                aria-hidden={true}
              />
              <div className="relative">
                <h2 className="text-xl font-bold">Tiếp tục hành trình học tập</h2>
                <p className="mt-3 leading-7 text-white/80">
                  Bạn đang hoàn thành 45% khóa học Python Cơ bản. Hãy duy trì nhịp độ nhé!
                </p>
                <Link
                  to="/learning/python-basic/lesson-2"
                  className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-[#3525cd] transition hover:bg-[#eff4ff] active:scale-95"
                >
                  Tiếp tục học
                </Link>
              </div>
            </section>
          </aside>

          <main className="lg:col-span-9">
            <section className="card-elevation-1 rounded-2xl border border-[#c7c4d8]/70 bg-white p-4 sm:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_180px_auto_auto]">
                <div className="relative transition focus-within:scale-[1.01]">
                  <Search
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777587]"
                    aria-hidden={true}
                  />
                  <input
                    type="search"
                    name="activitySearch"
                    autoComplete="off"
                    aria-label="Tìm hoạt động"
                    placeholder="Tìm hoạt động..."
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setVisibleCount(6);
                    }}
                    className="h-12 w-full rounded-xl border border-[#c7c4d8] bg-[#f8f9ff] pl-11 pr-4 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                  />
                </div>

                <select
                  id="activityType"
                  name="activityType"
                  aria-label="Lọc theo loại hoạt động"
                  value={activityType}
                  onChange={(event) => {
                    setActivityType(event.target.value);
                    setVisibleCount(6);
                  }}
                  className="h-12 rounded-xl border border-[#c7c4d8] bg-white px-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                >
                  <option value="all">Loại hoạt động: Tất cả</option>
                  <option value="video">Video bài học</option>
                  <option value="quiz">Quiz & Bài tập</option>
                  <option value="ai">Tương tác AI</option>
                  <option value="account">Tài khoản</option>
                </select>

                <select
                  id="timeRange"
                  name="timeRange"
                  aria-label="Lọc theo thời gian"
                  value={timeRange}
                  onChange={(event) => {
                    setTimeRange(event.target.value);
                    setVisibleCount(6);
                  }}
                  className="h-12 rounded-xl border border-[#c7c4d8] bg-white px-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                >
                  <option value="all">Thời gian: Tất cả</option>
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                  <option value="3months">3 tháng qua</option>
                </select>

                <button
                  type="button"
                  onClick={() => setVisibleCount(6)}
                  className="h-12 rounded-xl bg-[#3525cd] px-5 font-bold text-white transition hover:bg-[#2d1fb7] active:scale-95"
                >
                  Lọc
                </button>
                <button
                  type="button"
                  aria-label="Làm mới bộ lọc"
                  onClick={resetFilters}
                  className="flex h-12 items-center justify-center rounded-xl border border-[#c7c4d8] bg-white px-4 text-[#464555] transition hover:border-[#3525cd] hover:text-[#3525cd] active:scale-95"
                >
                  <RefreshCw size={20} aria-hidden={true} />
                </button>
              </div>
            </section>

            {visibleActivities.length > 0 ? (
              <div className="mt-7 space-y-8">
                {groups.map((group) => {
                  const groupActivities = visibleActivities.filter((activity) => activity.group === group);
                  if (groupActivities.length === 0) return null;

                  return (
                    <section key={group}>
                      <h2 className="mb-4 text-lg font-extrabold text-[#3525cd]">{group}</h2>
                      <div className="timeline-line relative space-y-4">
                        {groupActivities.map((activity) => (
                          <ActivityCard key={activity.id} activity={activity} />
                        ))}
                      </div>
                    </section>
                  );
                })}

                {visibleCount < filteredActivities.length && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((current) => current + 2)}
                    className="mx-auto flex items-center gap-2 rounded-xl border border-[#c7c4d8] bg-white px-6 py-3 font-bold text-[#464555] transition hover:bg-[#e5eeff] hover:text-[#3525cd] active:scale-95"
                  >
                    <ChevronDown size={20} aria-hidden={true} />
                    Tải thêm hoạt động
                  </button>
                )}
              </div>
            ) : (
              <section className="card-elevation-1 mt-7 rounded-2xl border border-[#c7c4d8]/70 bg-white px-6 py-14 text-center">
                <History size={48} className="mx-auto text-[#777587]" aria-hidden={true} />
                <h2 className="mt-5 text-2xl font-bold">Chưa có hoạt động phù hợp</h2>
                <p className="mx-auto mt-3 max-w-lg leading-7 text-[#464555]">
                  Hãy thử thay đổi bộ lọc hoặc tiếp tục học để ghi nhận hoạt động mới.
                </p>
                <Link
                  to="/courses"
                  className="mt-6 inline-flex rounded-xl bg-[#3525cd] px-6 py-3 font-bold text-white transition hover:bg-[#2d1fb7] active:scale-95"
                >
                  Xem khóa học
                </Link>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#eff4ff] px-4 py-3 text-left">
      <Icon size={20} className="text-[#3525cd]" aria-hidden={true} />
      <span className="flex-1 text-sm font-medium text-[#464555]">{label}</span>
      <strong className="text-[#3525cd]">{value}</strong>
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  const Icon = activity.icon;

  const action = activity.actionLabel ? (
    activity.actionTo ? (
      <Link
        to={activity.actionTo}
        className="shrink-0 rounded-lg bg-[#eff4ff] px-3 py-2 text-sm font-bold text-[#3525cd] transition hover:bg-[#e5eeff]"
      >
        {activity.actionLabel}
      </Link>
    ) : (
      <button
        type="button"
        onClick={() => console.log("Mock activity action:", activity.id)}
        className="shrink-0 rounded-lg bg-[#eff4ff] px-3 py-2 text-sm font-bold text-[#3525cd] transition hover:bg-[#e5eeff]"
      >
        {activity.actionLabel}
      </button>
    )
  ) : null;

  return (
    <article className="group relative flex gap-4 pl-1">
      <span
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[#f8f9ff] ${activity.iconColorClass}`}
      >
        <Icon size={18} aria-hidden={true} />
      </span>
      <div className="card-elevation-1 min-w-0 flex-1 rounded-2xl border border-[#c7c4d8]/70 bg-white p-5 transition group-hover:border-[#3525cd]/35">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-bold leading-6 transition-colors group-hover:text-[#3525cd]">{activity.title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#464555]">{activity.description}</p>
            <p className="mt-2 text-xs font-semibold text-[#777587]">{activity.time}</p>
          </div>
          {action}
        </div>
      </div>
    </article>
  );
}

export default ProfileActivitiesPage;
