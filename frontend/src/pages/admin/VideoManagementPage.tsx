import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

type AIStatus = "completed" | "processing" | "embedding" | "error";

interface VideoItem {
  id: number;
  title: string;
  filename: string;
  course: string;
  chapter: string;
  duration: string;
  aiStatus: AIStatus;
  hasTranscript: boolean;
  hasVectorDB: boolean;
}

const mockVideos: VideoItem[] = [
  {
    id: 1,
    title: "Bài 1: Tổng quan về LLM",
    filename: "video_llm_intro.mp4",
    course: "AI & Machine Learning",
    chapter: "Chương 1: Mở đầu",
    duration: "12:45",
    aiStatus: "completed",
    hasTranscript: true,
    hasVectorDB: true,
  },
  {
    id: 2,
    title: "Bài 2: Kiến trúc Transformer",
    filename: "trans_arch_deep_dive.mp4",
    course: "AI & Machine Learning",
    chapter: "Chương 2: Deep Learning",
    duration: "45:10",
    aiStatus: "processing",
    hasTranscript: false,
    hasVectorDB: false,
  },
  {
    id: 3,
    title: "Cài đặt Môi trường Python",
    filename: "setup_python.mov",
    course: "Python Cơ bản",
    chapter: "Chương 1: Bắt đầu",
    duration: "08:22",
    aiStatus: "embedding",
    hasTranscript: true,
    hasVectorDB: false,
  },
  {
    id: 4,
    title: "Data Science with Pandas",
    filename: "pandas_final.mp4",
    course: "Data Science",
    chapter: "Chương 5: Phân tích",
    duration: "32:15",
    aiStatus: "error",
    hasTranscript: false,
    hasVectorDB: false,
  },
];

const aiStatusConfig: Record<AIStatus, { label: string; badge: string; dot: string; dotPulse?: boolean }> = {
  completed: { label: "Hoàn thành", badge: "bg-green-100 text-green-700 border border-green-200", dot: "bg-green-500" },
  processing: { label: "Đang tạo transcript", badge: "bg-indigo-100 text-indigo-700 border border-indigo-200", dot: "bg-indigo-500", dotPulse: true },
  embedding: { label: "Đang tạo embedding", badge: "bg-purple-100 text-purple-700 border border-purple-200", dot: "bg-purple-500", dotPulse: true },
  error: { label: "Lỗi xử lý", badge: "bg-error-container text-on-error-container border border-error/20", dot: "bg-error" },
};

const aiPipelineSteps = [
  { label: "Trích xuất âm thanh", detail: "Hoàn thành lúc 14:20 · 20.5MB mp3", status: "done" },
  { label: "Tạo bản ghi (Transcription)", detail: "Đang chạy Whisper v3 large... 65%", status: "active", progress: 65 },
  { label: "Vectorize & Embedding", detail: "Đang chờ...", status: "pending" },
  { label: "Sẵn sàng sử dụng", status: "pending" },
];

interface DetailPanelProps {
  video: VideoItem | null;
}

function VideoDetailPanel({ video }: DetailPanelProps) {
  if (!video) return null;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-7">
      {/* Video preview */}
      <section>
        <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-14 h-14 bg-primary/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </button>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-on-surface">{video.filename}</p>
            <p className="text-xs text-on-surface-variant">{video.duration}</p>
          </div>
          <button className="text-primary text-xs font-semibold hover:underline">Phóng to</button>
        </div>
      </section>

      {/* AI pipeline */}
      <section>
        <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
          Lộ trình xử lý AI
        </h4>
        <div className="relative space-y-0">
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-outline-variant/30 z-0" />

          {aiPipelineSteps.map((step, i) => (
            <div key={i} className={`relative pl-10 pb-7 last:pb-0 ${step.status === "pending" ? "opacity-40" : ""}`}>
              {step.status === "done" && (
                <div className="absolute left-0 w-8 h-8 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
                </div>
              )}
              {step.status === "active" && (
                <div className="absolute left-0 w-8 h-8 rounded-full bg-primary border-4 border-primary/20 flex items-center justify-center z-10">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              )}
              {step.status === "pending" && (
                <div className="absolute left-0 w-8 h-8 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">more_horiz</span>
                </div>
              )}

              <p className={`text-sm font-bold ${step.status === "active" ? "text-primary" : "text-on-surface"}`}>
                {step.label}
              </p>
              {step.detail && (
                <p className={`text-xs mt-1 ${step.status === "done" ? "text-green-600" : step.status === "active" ? "text-primary" : "text-on-surface-variant"}`}>
                  {step.detail}
                </p>
              )}
              {step.status === "active" && step.progress && (
                <div className="mt-2 w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${step.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Metadata */}
      <section className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Metadata & RAG</h4>
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20">
          <p className="text-xs font-semibold text-on-surface-variant uppercase mb-2">Tóm tắt transcript</p>
          <p className="text-sm text-on-surface leading-relaxed">
            Bài học đi sâu vào kiến trúc "Attention Is All You Need", giải thích cơ chế Self-attention, Encoder và Decoder...
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20">
            <p className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Chunks</p>
            <p className="text-xl font-bold text-primary">--</p>
            <p className="text-[10px] text-on-surface-variant">Chờ xử lý...</p>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20">
            <p className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Vector DB</p>
            <p className="text-sm font-bold text-on-surface-variant">ChromaDB</p>
            <p className="text-[10px] text-on-surface-variant">Chưa index</p>
          </div>
        </div>
        <button className="w-full py-3 bg-surface-container rounded-xl text-primary font-bold text-sm border border-primary/20 hover:bg-primary/10 transition-colors">
          Xem toàn bộ JSON metadata
        </button>
      </section>
    </div>
  );
}

// Toast notification
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl transition-all duration-300 z-50 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <span className="material-symbols-outlined text-green-400">check_circle</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

function VideoManagementPage() {
  const navigate = useNavigate();

  // 1. Chỉnh sửa mặc định thành null để ẩn Panel lúc ban đầu
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 2. Khởi tạo State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // 3. Trích xuất danh sách options tự động từ mock data (Dùng useMemo để tối ưu)
  const uniqueCourses = useMemo(() => Array.from(new Set(mockVideos.map((v) => v.course))), []);
  const uniqueChapters = useMemo(() => Array.from(new Set(mockVideos.map((v) => v.chapter))), []);

  // 4. Logic Lọc Video
  const filteredVideos = mockVideos.filter((video) => {
    // Tìm trong tiêu đề hoặc tên file
    const matchSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.filename.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCourse = courseFilter === "" || video.course === courseFilter;
    const matchChapter = chapterFilter === "" || video.chapter === chapterFilter;
    const matchStatus = statusFilter === "" || video.aiStatus === statusFilter;

    return matchSearch && matchCourse && matchChapter && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="flex flex-1 flex-col lg:flex-row relative">
        {/* Main table area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          <div className="flex flex-col gap-4 p-5 pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Quản lý video & AI</h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                Theo dõi video, transcript và trạng thái xử lý dữ liệu AI.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/upload")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden={true}>
                cloud_upload
              </span>
              Tải lên video mới
            </button>
          </div>

          {/* Filters */}
          <div className="p-5 pb-0">
            <div className="bg-white rounded-2xl border border-outline-variant/30 p-4 flex flex-wrap gap-3 items-center shadow-sm">
              <div className="flex-1 min-w-[220px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                {/* Ràng buộc State cho Ô tìm kiếm */}
                <input
                  type="text"
                  placeholder="Tìm kiếm video hoặc file..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                {/* Dropdown 1: Khóa học */}
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
                >
                  <option value="">Tất cả Khóa học</option>
                  {uniqueCourses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>

                {/* Dropdown 2: Bài học / Chương */}
                <select
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value)}
                  className="bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
                >
                  <option value="">Tất cả Bài học</option>
                  {uniqueChapters.map((chapter) => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>

                {/* Dropdown 3: Trạng thái AI */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
                >
                  <option value="">Tất cả Trạng thái AI</option>
                  {Object.entries(aiStatusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-5">
            <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low/50">
                    <tr>
                      {["Tên video", "Khóa học / Bài học", "Thời lượng", "Trạng thái AI", "Transcript", "Vector DB", "Hành động"].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-4 font-semibold text-xs text-on-surface-variant uppercase tracking-wider whitespace-nowrap ${h === "Transcript" || h === "Vector DB" ? "text-center" : h === "Hành động" ? "text-right" : ""
                            }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {/* Render mảng đã được filter */}
                    {filteredVideos.length > 0 ? (
                      filteredVideos.map((video) => {
                        const st = aiStatusConfig[video.aiStatus];
                        const isSelected = selectedVideo?.id === video.id;
                        return (
                          <tr
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className={`group cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-surface-container-low/30"}`}
                          >
                            <td className="px-5 py-4 min-w-[220px]">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 shrink-0 rounded-lg bg-slate-900 border border-outline-variant/30 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    play_arrow
                                  </span>
                                </div>
                                <div className="whitespace-nowrap">
                                  <p className="font-semibold text-on-surface text-sm">{video.title}</p>
                                  <p className="text-xs text-on-surface-variant">{video.filename}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <p className="text-sm font-medium text-on-surface">{video.course}</p>
                              <p className="text-xs text-on-surface-variant">{video.chapter}</p>
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-on-surface whitespace-nowrap">{video.duration}</td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${st.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${st.dotPulse ? "animate-pulse" : ""}`} />
                                {st.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              {video.hasTranscript ? (
                                <span className="material-symbols-outlined text-green-600">check_circle</span>
                              ) : video.aiStatus === "processing" ? (
                                <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                              ) : (
                                <span className="material-symbols-outlined text-error">cancel</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-center">
                              {video.hasVectorDB ? (
                                <span className="material-symbols-outlined text-green-600">database</span>
                              ) : video.aiStatus === "embedding" ? (
                                <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
                              ) : (
                                <span className="material-symbols-outlined text-outline-variant">
                                  {video.aiStatus === "error" ? "error" : "hourglass_empty"}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Xem transcript">
                                  <span className="material-symbols-outlined text-[18px]">description</span>
                                </button>
                                <button
                                  className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                                  title="Xử lý lại"
                                  onClick={(e) => { e.stopPropagation(); showToast(`Bắt đầu xử lý lại: "${video.title}"`); }}
                                >
                                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                                </button>
                                <button className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Xóa">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-10 text-center text-sm text-on-surface-variant italic">
                          Không tìm thấy video nào phù hợp với bộ lọc hiện tại.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-outline-variant/30 bg-surface-container-low/30 flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              Hiển thị tổng cộng <span className="font-bold">{filteredVideos.length}</span> video
            </p>
            <div className="flex gap-2">
              <button disabled className="w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-white transition-all shadow-sm disabled:opacity-40">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button disabled className="w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-white transition-all shadow-sm disabled:opacity-40">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. ẨN/HIỆN PANEL CHI TIẾT: Chỉ hiển thị thẻ <aside> khi selectedVideo có dữ liệu */}
        {selectedVideo && (
          <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-outline-variant/30 bg-white flex flex-col lg:sticky lg:top-0 lg:h-screen shrink-0 shadow-2xl lg:shadow-none z-10">
            <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between">
              <h3 className="font-semibold text-on-surface truncate pr-4 text-sm">
                {selectedVideo.title}
              </h3>
              {/* Đóng panel bằng cách gán null cho selectedVideo */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-md hover:bg-error-container/50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <VideoDetailPanel video={selectedVideo} />

            <div className="p-5 border-t border-outline-variant/20 bg-surface-container-lowest mt-auto">
              <button className="w-full py-3.5 bg-error text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-error/20 hover:bg-error/90 active:scale-[0.98] transition-all text-sm">
                <span className="material-symbols-outlined">delete_forever</span>
                Xóa Video & Dữ liệu AI
              </button>
            </div>
          </aside>
        )}
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </AdminLayout>
  );
}

export default VideoManagementPage;
