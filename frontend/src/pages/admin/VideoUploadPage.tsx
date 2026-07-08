import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  uploadLessonSlide,
  uploadLessonVideoFile,
  uploadLessonYoutube,
} from "../../services/adminUpload.service";
import { getCoursesAdmin } from "../../services/course.service";

type UploadMode = "youtube" | "video" | "slide";

interface CourseOption {
  id: number | string;
  title: string;
}

export default function VideoUploadPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [courseId, setCourseId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [mode, setMode] = useState<UploadMode>("youtube");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadCourses();
  }, []);

  async function loadCourses() {
    setInitialLoading(true);
    try {
      const response = await getCoursesAdmin();
      const data = unwrap(response);
      setCourses(data.items ?? data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách khóa học."));
    } finally {
      setInitialLoading(false);
    }
  }

  function onVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !isAllowed(file.name, [".mp4", ".webm", ".ogg", ".mov"])) {
      setError("Video chỉ hỗ trợ .mp4, .webm, .ogg, .mov.");
      event.target.value = "";
      setVideoFile(null);
      return;
    }
    setError("");
    setVideoFile(file);
  }

  function onSlideChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !isAllowed(file.name, [".pdf"])) {
      setError("Slide chỉ hỗ trợ PDF.");
      event.target.value = "";
      setSlideFile(null);
      return;
    }
    setError("");
    setSlideFile(file);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmedLessonTitle = lessonTitle.trim();

    if (!courseId) {
      setError("Vui lòng chọn khóa học.");
      return;
    }

    if (!trimmedLessonTitle) {
      setError("Vui lòng nhập tên bài học.");
      return;
    }

    if (mode === "youtube" && !videoUrl.trim()) {
      setError("Vui lòng nhập đường dẫn YouTube.");
      return;
    }

    if (mode === "video" && !videoFile) {
      setError("Vui lòng chọn file video.");
      return;
    }

    if (mode === "slide" && !slideFile) {
      setError("Vui lòng chọn file slide PDF.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "youtube") {
        if (!isYoutubeUrl(videoUrl)) {
          setError("Đường dẫn YouTube không hợp lệ.");
          return;
        }
        await uploadLessonYoutube({
          courseId,
          lessonTitle: trimmedLessonTitle,
          videoUrl: videoUrl.trim(),
          durationSeconds,
        });
      }

      if (mode === "video" && videoFile) {
        await uploadLessonVideoFile({
          courseId,
          lessonTitle: trimmedLessonTitle,
          file: videoFile,
          durationSeconds,
        });
      }

      if (mode === "slide" && slideFile) {
        await uploadLessonSlide({
          courseId,
          lessonTitle: trimmedLessonTitle,
          file: slideFile,
        });
      }

      setMessage("Tải lên thành công.");
      setVideoFile(null);
      setSlideFile(null);
      setVideoUrl("");
      setDurationSeconds(0);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải lên tài nguyên. Vui lòng thử lại."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Tải lên tài nguyên bài học</h1>
          <p className="text-sm text-on-surface-variant">
            Tải lên video, đường dẫn YouTube hoặc slide PDF vào hệ thống lưu trữ backend.
          </p>
        </div>

        {initialLoading ? (
          <div className="rounded-xl bg-white p-8 text-center text-on-surface-variant">Đang tải dữ liệu...</div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-5 rounded-xl border bg-white p-6">
            {(error || message) && (
              <div className={`rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                {error || message}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Khóa học</label>
                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Bài học</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(event) => setLessonTitle(event.target.value)}
                  placeholder="Nhập tên bài học, ví dụ: Bài 1: Giới thiệu Django"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Loại tải lên</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {(["youtube", "video", "slide"] as UploadMode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                      mode === item ? "border-primary bg-primary text-white" : "bg-white"
                    }`}
                  >
                    {item === "youtube" ? "Đường dẫn YouTube" : item === "video" ? "File video" : "Slide PDF"}
                  </button>
                ))}
              </div>
            </div>

            {mode === "youtube" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">Đường dẫn YouTube</label>
                <input
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            )}

            {mode === "video" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">File video</label>
                <input
                  type="file"
                  accept=".mp4,.webm,.ogg,.mov,video/*"
                  onChange={onVideoChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                {videoFile && <p className="mt-2 text-sm text-on-surface-variant">{videoFile.name}</p>}
              </div>
            )}

            {mode === "slide" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">Slide PDF</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={onSlideChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                {slideFile && <p className="mt-2 text-sm text-on-surface-variant">{slideFile.name}</p>}
              </div>
            )}

            {mode !== "slide" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">Thời lượng video (giây)</label>
                <input
                  type="number"
                  min={0}
                  value={durationSeconds}
                  onChange={(event) => setDurationSeconds(Number(event.target.value))}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            )}

            <button disabled={loading} className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {loading ? "Đang tải lên..." : "Tải lên"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

function unwrap(response: any) {
  return response?.data ?? response;
}

function isAllowed(name: string, extensions: string[]) {
  const lower = name.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext));
}

function isYoutubeUrl(value: string) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value.trim());
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
