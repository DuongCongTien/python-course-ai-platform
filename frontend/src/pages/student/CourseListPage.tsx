import { useMemo, useState } from "react";
import { Bot, Braces, Facebook, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import CourseCard, { type Course, type CourseLevel } from "../../components/course/CourseCard";
import CourseFilterChips, { type CourseChip } from "../../components/course/CourseFilterChips";
import CourseFilterSidebar, { type DurationFilter } from "../../components/course/CourseFilterSidebar";
import CoursePagination from "../../components/course/CoursePagination";
import CourseSearchBar from "../../components/course/CourseSearchBar";

const chips: CourseChip[] = ["Tất cả", "Cơ bản", "Trung cấp", "Có AI hỗ trợ", "Đang học"];

const courses: Course[] = [
  {
    id: "phan-tich-du-lieu-voi-ai",
    title: "Phân tích dữ liệu với AI",
    level: "Trung cấp",
    lessons: 24,
    duration: "18 giờ",
    durationHours: 18,
    description:
      "Học cách ứng dụng machine learning và các mô hình AI để xử lý dữ liệu thực tế chuyên sâu.",
    hasAI: true,
    isLearning: true,
    progress: 65,
    lessonId: "lesson-08",
    gradient: "from-indigo-600 via-blue-600 to-cyan-500",
  },
  {
    id: "python-cho-nguoi-moi-bat-dau",
    title: "Python Cho Người Mới Bắt Đầu",
    level: "Cơ bản",
    lessons: 15,
    duration: "10 giờ",
    durationHours: 10,
    description:
      "Bắt đầu hành trình lập trình của bạn với những kiến thức nền tảng vững chắc nhất về Python.",
    popular: true,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    id: "lap-trinh-web-voi-django-ai",
    title: "Lập trình Web với Django & AI",
    level: "Trung cấp",
    lessons: 32,
    duration: "25 giờ",
    durationHours: 25,
    description:
      "Xây dựng các ứng dụng web mạnh mẽ và tích hợp các tính năng thông minh bằng Django framework.",
    hasAI: true,
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
  },
  {
    id: "deep-learning-computer-vision",
    title: "Deep Learning & Computer Vision",
    level: "Nâng cao",
    lessons: 40,
    duration: "35 giờ",
    durationHours: 35,
    description:
      "Chinh phục những công nghệ AI phức tạp nhất hiện nay trong lĩnh vực thị giác máy tính.",
    hasAI: true,
    gradient: "from-purple-600 via-fuchsia-600 to-pink-500",
  },
];

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
];

function CourseListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChip, setActiveChip] = useState<CourseChip>("Tất cả");
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<DurationFilter | "">("");

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.description.toLowerCase().includes(normalizedSearch);

      const matchesChip =
        activeChip === "Tất cả" ||
        course.level === activeChip ||
        (activeChip === "Có AI hỗ trợ" && course.hasAI) ||
        (activeChip === "Đang học" && course.isLearning);

      const matchesLevels = selectedLevels.length === 0 || selectedLevels.includes(course.level);

      const matchesDuration =
        !selectedDuration ||
        (selectedDuration === "Dưới 5 giờ" && course.durationHours < 5) ||
        (selectedDuration === "5 - 15 giờ" && course.durationHours >= 5 && course.durationHours <= 15) ||
        (selectedDuration === "Trên 15 giờ" && course.durationHours > 15);

      return matchesSearch && matchesChip && matchesLevels && matchesDuration;
    });
  }, [activeChip, searchTerm, selectedDuration, selectedLevels]);

  const handleToggleLevel = (level: CourseLevel) => {
    setSelectedLevels((current) =>
      current.includes(level) ? current.filter((item) => item !== level) : [...current, level],
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveChip("Tất cả");
    setSelectedLevels([]);
    setSelectedDuration("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl" />

          <div className="page-container relative py-14 sm:py-16 lg:py-20">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm backdrop-blur">
              <Bot size={16} />
              Học Python cùng trợ lý AI
            </span>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Danh sách khóa học Python
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Lựa chọn khóa học phù hợp và học tập cùng trợ lý AI chuyên nghiệp để tối ưu hóa lộ trình phát triển
              của bạn.
            </p>
          </div>
        </section>

        <section className="page-container py-10 lg:py-12">
          <div className="mb-8 space-y-4">
            <CourseSearchBar value={searchTerm} onChange={setSearchTerm} />
            <CourseFilterChips chips={chips} activeChip={activeChip} onChange={setActiveChip} />
          </div>

          <div className="grid gap-7 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
            <CourseFilterSidebar
              selectedLevels={selectedLevels}
              selectedDuration={selectedDuration}
              onToggleLevel={handleToggleLevel}
              onSelectDuration={setSelectedDuration}
              onReset={handleResetFilters}
            />

            <div>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950">Khóa học nổi bật</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Hiển thị {filteredCourses.length} / {courses.length} khóa học
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-500">Sắp xếp: Phù hợp nhất</p>
              </div>

              {filteredCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
                  <h3 className="text-lg font-extrabold text-slate-950">Không tìm thấy khóa học phù hợp</h3>
                  <p className="mt-2 text-sm text-slate-500">Hãy thử đổi từ khóa hoặc làm mới bộ lọc.</p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="focus-ring mt-5 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Làm mới bộ lọc
                  </button>
                </div>
              )}

              <CoursePagination />
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

function CourseNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
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
                  isActive || item.to === "/courses"
                    ? "text-indigo-600"
                    : "text-slate-600 hover:text-indigo-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            to="/login"
            className="focus-ring rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="focus-ring rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Đăng ký
          </Link>
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
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="page-container flex flex-col gap-1 py-4" aria-label="Điều hướng mobile">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  item.to === "/courses" ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-indigo-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:hidden">
              <Link to="/login" className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700">
                Đăng nhập
              </Link>
              <Link to="/register" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function CourseFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Braces size={20} />
              </span>
              <span className="font-extrabold text-slate-950">Python AI Learning</span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              © 2024 Python AI Learning. Nâng tầm tri thức công nghệ Việt.
            </p>
          </div>

          <FooterLinkGroup title="Học tập" links={["Về chúng tôi", "Hướng dẫn", "Liên hệ"]} />
          <FooterLinkGroup title="Chính sách" links={["Điều khoản dịch vụ", "Chính sách bảo mật"]} />

          <div>
            <h3 className="mb-4 font-bold text-slate-950">Kết nối</h3>
            <div className="flex gap-3">
              {[Mail, Facebook, Github, Linkedin].map((Icon, index) => (
                <Link
                  key={index}
                  to="/contact"
                  className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-indigo-600 hover:text-white"
                  aria-label="Liên kết mạng xã hội"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkGroupProps {
  title: string;
  links: string[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="mb-4 font-bold text-slate-950">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link to="/" className="text-sm text-slate-600 transition hover:text-indigo-600">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseListPage;
