import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";

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
  if (!video) return (
    <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
      Chọn một video để xem chi tiết
    </div>
  );

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
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(mockVideos[1]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <AdminLayout>
      <AdminHeader title="Quản lý video & AI" actionLabel="Tải lên Video mới" actionIcon="cloud_upload" />

      <div className="flex flex-1 overflow-hidden">
        {/* Main table area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Filters */}
          <div className="p-5 pb-0">
            <div className="bg-white rounded-2xl border border-outline-variant/30 p-4 flex flex-wrap gap-3 items-center shadow-sm">
              <div className="flex-1 min-w-[220px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm video..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                {["Tất cả Khóa học", "Tất cả Bài học", "Trạng thái AI"].map((placeholder) => (
                  <select key={placeholder} className="bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer">
                    <option>{placeholder}</option>
                  </select>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-5">
            <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low/50 sticky top-0 z-10">
                  <tr>
                    {["Tên video", "Khóa học / Bài học", "Thời lượng", "Trạng thái AI", "Transcript", "Vector DB", "Hành động"].map((h) => (
                      <th key={h} className={`px-5 py-4 font-semibold text-xs text-on-surface-variant uppercase tracking-wider ${h === "Transcript" || h === "Vector DB" ? "text-center" : h === "Hành động" ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {mockVideos.map((video) => {
                    const st = aiStatusConfig[video.aiStatus];
                    const isSelected = selectedVideo?.id === video.id;
                    return (
                      <tr
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className={`group cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-surface-container-low/30"}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded-lg bg-slate-900 border border-outline-variant/30 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                play_arrow
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface text-sm line-clamp-1">{video.title}</p>
                              <p className="text-xs text-on-surface-variant">{video.filename}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-on-surface">{video.course}</p>
                          <p className="text-xs text-on-surface-variant">{video.chapter}</p>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-on-surface">{video.duration}</td>
                        <td className="px-5 py-4">
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
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-outline-variant/30 bg-surface-container-low/30 flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              Hiển thị 1–4 trong tổng số <span className="font-bold">128</span> video
            </p>
            <div className="flex gap-2">
              {[
                { icon: "chevron_left", disabled: true },
              ].map((btn, i) => (
                <button key={i} disabled={btn.disabled} className="w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-white transition-all shadow-sm disabled:opacity-40">
                  <span className="material-symbols-outlined">{btn.icon}</span>
                </button>
              ))}
              {[1, 2, 3].map((p) => (
                <button key={p} className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${p === 1 ? "bg-primary text-white shadow-md shadow-primary/20" : "border border-outline-variant/30 text-on-surface-variant hover:bg-white shadow-sm"}`}>
                  {p}
                </button>
              ))}
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-white transition-all shadow-sm">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right detail panel */}
        <aside className="hidden lg:flex w-96 border-l border-outline-variant/30 bg-white flex-col h-screen sticky top-0">
          <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between">
            <h3 className="font-semibold text-on-surface truncate pr-4 text-sm">
              {selectedVideo?.title ?? "Chi tiết video"}
            </h3>
            <button className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <VideoDetailPanel video={selectedVideo} />

          <div className="p-5 border-t border-outline-variant/20 bg-surface-container-lowest">
            <button className="w-full py-3.5 bg-error text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-error/20 hover:bg-error/90 active:scale-[0.98] transition-all text-sm">
              <span className="material-symbols-outlined">delete_forever</span>
              Xóa Video & Dữ liệu AI
            </button>
          </div>
        </aside>
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </AdminLayout>
  );
}

export default VideoManagementPage;