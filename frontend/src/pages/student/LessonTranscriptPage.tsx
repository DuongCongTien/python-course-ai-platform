import { useMemo, useState } from "react";
import { Braces, Download, Menu, Share2, X } from "lucide-react";
import { Link, NavLink, useParams } from "react-router-dom";
import AISummaryContent from "../../components/lesson/AISummaryContent";
import LessonInfoSidebar from "../../components/lesson/LessonInfoSidebar";
import TranscriptList from "../../components/lesson/TranscriptList";
import TranscriptTabs from "../../components/lesson/TranscriptTabs";
import {
  type LessonInfo,
  type SummaryData,
  type TranscriptSegment,
  type TranscriptTab,
} from "../../components/lesson/lessonTypes";

const lessonInfo: LessonInfo = {
  courseName: "Python cơ bản",
  lessonName: "Vòng lặp trong Python",
  duration: "15 phút",
  aiStatus: "processed",
};

const transcriptSegments: TranscriptSegment[] = [
  {
    id: "intro",
    time: "00:00",
    title: "Giới thiệu bài học",
    content:
      "Chào mừng các bạn đã quay trở lại với khóa học Python AI Learning. Trong bài học ngày hôm nay, chúng ta sẽ cùng nhau tìm hiểu về một khái niệm cực kỳ quan trọng trong lập trình: Vòng lặp. Vòng lặp giúp chúng ta thực thi một đoạn mã nhiều lần mà không cần viết lại.",
  },
  {
    id: "for-loop",
    time: "02:15",
    title: "Khái niệm vòng lặp for",
    content:
      "Vòng lặp for trong Python thường được sử dụng để duyệt qua các phần tử của một tập hợp như list, tuple, string hoặc sử dụng hàm range(). Cấu trúc của nó rất tinh gọn và dễ hiểu, đúng theo triết lý của Python.",
  },
  {
    id: "while-loop",
    time: "05:40",
    title: "Vòng lặp while",
    content:
      "Khác với for, vòng lặp while sẽ tiếp tục chạy chừng nào điều kiện logic còn đúng. Đây là loại vòng lặp linh hoạt nhưng cần cẩn thận để tránh lỗi vòng lặp vô tận.",
  },
  {
    id: "compare",
    time: "09:20",
    title: "So sánh for và while",
    content:
      "Cuối cùng, chúng ta sẽ đặt lên bàn cân khi nào nên dùng for và khi nào nên dùng while. Đa số trường hợp trong Python, for được ưu tiên vì tính an toàn và minh bạch.",
  },
];

const summaryData: SummaryData = {
  keyPoints: [
    "Vòng lặp giúp lặp lại các tác vụ tự động, tiết kiệm công sức viết code.",
    "Vòng lặp for tối ưu cho việc duyệt qua các chuỗi hoặc danh sách.",
    "Vòng lặp while hoạt động dựa trên điều kiện Boolean cụ thể.",
  ],
  concepts: ["Iterables", "range() function", "Infinite Loop", "Break & Continue"],
  codeExample: `# Ví dụ vòng lặp for
for i in range(5):
    print(f"Số hiện tại là: {i}")

# Ví dụ vòng lặp while
count = 0

while count < 5:
    print("Đang đếm...")
    count += 1`,
  reviewSuggestion:
    "Hãy thử viết một vòng lặp for in ra các số chẵn từ 1 đến 100 để kiểm tra khả năng sử dụng hàm range() của bạn.",
};

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
];

function LessonTranscriptPage() {
  const { courseId = "python-cho-nguoi-moi-bat-dau", lessonId = "lesson-4" } = useParams();
  const [activeTab, setActiveTab] = useState<TranscriptTab>("transcript");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTranscripts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return transcriptSegments;

    return transcriptSegments.filter(
      (segment) =>
        segment.title.toLowerCase().includes(normalizedSearch) ||
        segment.content.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="page-container flex flex-col gap-6 py-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-600">
                KHÓA HỌC &gt; PYTHON CƠ BẢN
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Transcript & Tóm tắt bài học
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => console.log("Download PDF transcript")}
                className="focus-ring inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
              >
                <Download size={17} />
                Tải PDF
              </button>
              <button
                type="button"
                onClick={() => console.log("Share transcript")}
                className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <Share2 size={17} />
                Chia sẻ
              </button>
            </div>
          </div>
        </section>

        <section className="page-container grid gap-7 py-10 lg:grid-cols-[300px_minmax(0,1fr)]">
          <LessonInfoSidebar lessonInfo={lessonInfo} courseId={courseId} lessonId={lessonId} />

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card">
            <TranscriptTabs activeTab={activeTab} onChange={setActiveTab} />
            <div className="p-5 sm:p-7">
              {activeTab === "transcript" ? (
                <TranscriptList
                  searchTerm={searchTerm}
                  segments={filteredTranscripts}
                  onSearchChange={setSearchTerm}
                />
              ) : (
                <AISummaryContent summary={summaryData} courseId={courseId} lessonId={lessonId} />
              )}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

function TranscriptNavbar() {
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
          <Link to="/login" className="focus-ring rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600">
            Đăng nhập
          </Link>
          <Link to="/register" className="focus-ring rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">
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
        <nav className="page-container flex flex-col gap-1 border-t border-slate-100 bg-white py-4 md:hidden">
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
        </nav>
      )}
    </header>
  );
}

function TranscriptFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <p className="font-extrabold text-slate-950">Python AI Learning</p>
          <p className="mt-2 text-sm text-slate-500">© 2024 Python AI Learning. Nâng tầm tri thức công nghệ Việt.</p>
        </div>
        <FooterGroup title="Học tập" links={["Về chúng tôi", "Hướng dẫn"]} />
        <FooterGroup title="Pháp lý & Liên hệ" links={["Điều khoản dịch vụ", "Chính sách bảo mật", "Liên hệ"]} />
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-3 font-bold text-slate-950">{title}</h3>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link} to="/" className="text-sm text-slate-500 transition hover:text-indigo-600">
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LessonTranscriptPage;
