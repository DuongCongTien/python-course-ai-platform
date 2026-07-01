import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface AIStep {
  label: string;
  status: "done" | "active" | "pending";
  detail?: string;
}

const aiSteps: AIStep[] = [
  { label: "Tách audio bằng FFmpeg", status: "done", detail: "Hoàn thành lúc 14:20 · 20.5MB mp3" },
  { label: "Tạo transcript bằng Whisper", status: "active", detail: "Đang thực hiện... (45%)" },
  { label: "Chia nhỏ transcript (chunking)", status: "pending" },
  { label: "Tạo embedding vector", status: "pending" },
  { label: "Lưu vào ChromaDB", status: "pending" },
  { label: "Hoàn tất & sẵn sàng", status: "pending" },
];

const recentUploads = [
  {
    title: "Hướng dẫn Flask Web App",
    filename: "flask_tut_02.mp4",
    course: "Lập trình Python Cơ bản",
    date: "14/05/2024",
    aiStatus: "done" as const,
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRoW3y0ASrJmLsyA-kO0F14dCoVRuycxzWQA9yMSZQ1JgvlVGctCSxy58cZ1x-a5WCe4vv7mjcDIhP6ETDiDZTVrAiqfCAnh9vkNcxFlNOylUu1FKZjeX9Fk9l9zt9E-tCVIcnbvLw3_dNNTtVyKWZE-TzD-Wx_PpXYkPS4Wuszw6xRwEE632KBK62j1GbCeKtPdlYie24M4VDO4vlguLOgmVYKvjG72UFoCxtBnd4z-oKkpfn6VbUdvu3d5UiCFBxc3Wr0uSwg0Yk",
  },
  {
    title: "AI căn bản cho người mới",
    filename: "ai_intro_v2.mov",
    course: "AI & Machine Learning",
    date: "13/05/2024",
    aiStatus: "error" as const,
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfjvZyTp_CQoPghhoiP2hegO2qrI8eBbaResRwRERaF6BcQMc35RZuA_cKqLdCEASvQm2p6AwXsIAtl41HE9x90RBU1q4Ab690facTt7XxiH5Kk599m7ao4y8XtgUjQLDFc6xNlGn7sypEYGqNW6rJ4c2I2FWh8lutQNSnfE4zObUN8S2XBm2EqKP4qKILGwdAb7LcArwFoKwPdYWbH93WXCk02qoA8vmCF-FUMV6q4-X5-wZGNzwlePKTJEg6kcCnBWdbGbSCHLaY",
  },
];

function VideoUploadPage() {
  const [uploadProgress] = useState(65);
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [slideError, setSlideError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slideInputRef = useRef<HTMLInputElement>(null);

  const handleSlideChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSlideFile(null);
      setSlideError("Vui lòng chọn file PDF.");
      event.target.value = "";
      return;
    }

    setSlideFile(file);
    setSlideError("");
  };

  const handleRemoveSlide = () => {
    setSlideFile(null);
    setSlideError("");
    if (slideInputRef.current) slideInputRef.current.value = "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ videoFile, slideFile });
  };

  const handleVideoDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setVideoFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleVideoZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Upload video bài giảng</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Tải video và slide bài học để chuẩn bị dữ liệu cho hệ thống AI.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
            <span className="material-symbols-outlined">info</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface text-sm">Hướng dẫn tải lên</p>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Tải video bài giảng lên để AI tự động tạo transcript, embedding và lưu vào Vector DB cho tính năng hỏi đáp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload form */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Course & lesson selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Chọn khóa học</label>
                    <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm">
                      <option>Lập trình Python Cơ bản</option>
                      <option>AI & Machine Learning</option>
                      <option>Phân tích dữ liệu với Pandas</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Chọn bài học</label>
                    <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm">
                      <option>Bài 1: Giới thiệu khóa học</option>
                      <option>Bài 2: Cài đặt môi trường</option>
                      <option>Bài 3: Biến và kiểu dữ liệu</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Tiêu đề video</label>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề video bài giảng..."
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Mô tả video</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập tóm tắt nội dung bài giảng..."
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none text-sm"
                  />
                </div>

                {/* Drop zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant/50 hover:border-primary hover:bg-primary/5"
                  }`}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleVideoDrop}
                  onClick={(event) => {
                    if (event.target !== fileInputRef.current) {
                      fileInputRef.current?.click();
                    }
                  }}
                  onKeyDown={handleVideoZoneKeyDown}
                  role="button"
                  tabIndex={0}
                  aria-label="Chọn hoặc kéo thả video bài học"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-1 transition-all ${isDragging ? "bg-primary/20 scale-110" : "bg-primary/10"}`}>
                    <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
                  </div>
                  <p className="font-semibold text-on-surface text-center">Kéo thả video vào đây hoặc chọn file</p>
                  <p className="text-sm text-on-surface-variant text-center">Hỗ trợ định dạng MP4, MOV · Tối đa 500MB</p>
                  <label htmlFor="lesson-video" className="sr-only">
                    Chọn video bài học
                  </label>
                  <input
                    id="lesson-video"
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lesson-slide"
                    className="text-xs font-bold text-on-surface-variant uppercase tracking-wide"
                  >
                    Upload slide bài học
                  </label>
                  <label
                    htmlFor="lesson-slide"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant/50 p-6 text-center transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <span
                      className="material-symbols-outlined text-4xl text-error"
                      aria-hidden={true}
                    >
                      picture_as_pdf
                    </span>
                    <span className="text-sm font-semibold text-on-surface">
                      Chọn slide PDF
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Chỉ hỗ trợ file PDF. Học viên có thể tải slide này trong trang học bài.
                    </span>
                  </label>
                  <input
                    id="lesson-slide"
                    ref={slideInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={handleSlideChange}
                    aria-describedby={slideError ? "slide-error" : "slide-helper"}
                  />
                  <p id="slide-helper" className="sr-only">
                    Chỉ hỗ trợ file PDF.
                  </p>

                  {slideError && (
                    <p id="slide-error" className="text-sm font-semibold text-error" role="alert">
                      {slideError}
                    </p>
                  )}

                  {slideFile && (
                    <div className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
                      <span
                        className="material-symbols-outlined text-3xl text-error"
                        aria-hidden={true}
                      >
                        picture_as_pdf
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-on-surface">{slideFile.name}</p>
                        <p className="text-xs text-on-surface-variant">
                          {(slideFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveSlide}
                        className="rounded-lg p-2 text-error transition-colors hover:bg-error-container"
                        aria-label="Xóa file slide đã chọn"
                      >
                        <span className="material-symbols-outlined" aria-hidden={true}>
                          delete
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">
                      Đang tải lên: {videoFile?.name ?? "Python_Lesson_01.mp4"}
                    </span>
                    <span className="text-primary font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm">
                    <span className="material-symbols-outlined" aria-hidden={true}>upload</span>
                    Upload video
                  </button>
                  <button type="button" className="flex-1 bg-secondary/10 text-secondary font-bold py-4 px-6 rounded-xl hover:bg-secondary/20 transition-all flex items-center justify-center gap-2 text-sm border border-secondary/20">
                    <span className="material-symbols-outlined" aria-hidden={true}>auto_awesome</span>
                    Bắt đầu xử lý AI
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* AI Pipeline status */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-low border border-outline-variant/30 p-6 rounded-2xl h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-on-surface">Tiến trình AI</h3>
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold rounded-full uppercase tracking-wider">
                  Đang xử lý
                </span>
              </div>

              <div className="relative space-y-0">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-outline-variant/30 z-0" />

                {aiSteps.map((step, i) => (
                  <div key={i} className={`relative z-10 flex items-start gap-4 pb-7 last:pb-0 ${step.status === "pending" ? "opacity-45" : ""}`}>
                    {/* Step indicator */}
                    {step.status === "done" && (
                      <div className="w-8 h-8 shrink-0 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-green-600 text-[16px]">check</span>
                      </div>
                    )}
                    {step.status === "active" && (
                      <div className="w-8 h-8 shrink-0 rounded-full bg-primary border-4 border-primary/20 flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-white text-[16px] animate-spin">sync</span>
                      </div>
                    )}
                    {step.status === "pending" && (
                      <div className="w-8 h-8 shrink-0 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center z-10">
                        <span className="text-xs font-bold text-on-surface-variant">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    )}

                    <div className="pt-1">
                      <p className={`text-sm font-bold ${step.status === "active" ? "text-primary" : "text-on-surface"}`}>
                        {i + 1}. {step.label}
                      </p>
                      {step.detail && (
                        <p className={`text-xs mt-1 ${step.status === "done" ? "text-green-600" : "text-primary"}`}>
                          {step.detail}
                        </p>
                      )}
                      {step.status === "active" && (
                        <div className="mt-2 w-full bg-primary/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-[45%] rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status legend */}
              <div className="mt-6 pt-5 border-t border-outline-variant/30">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Chú giải</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Chưa xử lý", cls: "bg-surface-container-highest text-on-surface-variant" },
                    { label: "Đang xử lý", cls: "bg-primary/10 text-primary" },
                    { label: "Hoàn thành", cls: "bg-green-100 text-green-700" },
                    { label: "Lỗi", cls: "bg-error-container text-on-error-container" },
                  ].map((b) => (
                    <span key={b.label} className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase ${b.cls}`}>
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent uploads table */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-bold text-on-surface">Video tải lên gần đây</h3>
            <button type="button" className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  {["Video / Tiêu đề", "Khóa học", "Ngày tải", "Trạng thái AI", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recentUploads.map((v, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30">
                          <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm line-clamp-1">{v.title}</p>
                          <p className="text-xs text-on-surface-variant">{v.filename}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{v.course}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{v.date}</td>
                    <td className="px-5 py-4">
                      {v.aiStatus === "done" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                          Hoàn thành
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error-container text-on-error-container text-xs font-bold rounded-full">
                          <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
                          Lỗi xử lý
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {v.aiStatus === "error" ? (
                          <button type="button" className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="Xử lý lại">
                            <span className="material-symbols-outlined text-[20px]">refresh</span>
                          </button>
                        ) : (
                          <button type="button" className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="Xem chi tiết">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        )}
                        <button type="button" className="p-2 hover:bg-error-container text-error rounded-lg transition-colors" title="Xóa">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default VideoUploadPage;
