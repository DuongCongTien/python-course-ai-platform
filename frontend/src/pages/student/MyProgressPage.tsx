import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { useAuth } from "../../context/AuthContext";
import { getCourses } from "../../services/course.service";
import {
  getCourseProgress,
  type CourseProgressData,
  unwrapProgressData,
} from "../../services/progress.service";

function MyProgressPage() {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const coursesResponse = await getCourses({ pageSize: 50 });
        const courseItems = extractCourseItems(coursesResponse);
        const progressRows = await Promise.all(
          courseItems.map(async (course) => {
            try {
              const progressResponse = await getCourseProgress(course.id);
              const progress = unwrapProgressData<CourseProgressData>(progressResponse);
              return {
                id: course.id,
                title: course.title,
                completedLessons: progress.completedLessons,
                totalLessons: progress.totalLessons,
                progress: progress.progressPercent,
              };
            } catch {
              return null;
            }
          }),
        );

        if (isMounted) {
          setCourses(progressRows.filter((item): item is CourseProgress => Boolean(item)));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProgress().catch((error) => {
      console.warn("Khong the tai trang tien do:", error);
      if (isMounted) {
        setCourses([]);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const profile: StudentProfile = {
    name: user?.fullName || "Hoc vien",
    email: user?.email || "",
    level: "Dang hoc",
    avatarUrl: user?.avatarUrl,
  };

  const stats: ProgressStat[] = useMemo(() => {
    const completedLessons = courses.reduce((sum, course) => sum + course.completedLessons, 0);
    return [
      { id: "courses", icon: "menu_book", value: courses.length, label: "Khoa hoc dang hoc" },
      { id: "lessons", icon: "check_circle", value: completedLessons, label: "Bai hoc da xong" },
      { id: "quiz", icon: "grade", value: "-", label: "Diem quiz TB" },
      { id: "ai", icon: "smart_toy", value: "-", label: "So lan hoi AI" },
    ];
  }, [courses]);

  const activities: RecentActivity[] = [];

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-card">
          <h1 className="text-2xl font-extrabold text-slate-950">Dang nhap de xem tien do</h1>
          <Link
            to="/login"
            state={{ from: { pathname: "/my-progress" } }}
            className="focus-ring mt-6 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Dang nhap
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="page-container py-10 sm:py-14">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Tien do hoc tap cua toi
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Theo doi lo trinh hoc Python AI cua ban
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
            {isLoading ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-bold text-slate-600 shadow-card">
                Dang tai tien do...
              </div>
            ) : (
              <MyCourseProgressList courses={courses} />
            )}
            <div className="lg:hidden">
              <RecentActivityTimeline activities={activities} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function extractCourseItems(payload: unknown): Array<{ id: string; title: string }> {
  const record = asRecord(payload);
  const data = asRecord(record.data);
  const items = Array.isArray(data.items) ? data.items : Array.isArray(record.data) ? record.data : [];

  return items
    .map((item) => {
      const course = asRecord(item);
      const id = String(course.slug || course.id || "");
      const title = String(course.title || "Khoa hoc");
      return id ? { id, title } : null;
    })
    .filter((item): item is { id: string; title: string } => Boolean(item));
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export default MyProgressPage;
