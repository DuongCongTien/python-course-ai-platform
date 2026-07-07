import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  createAdminVideo,
  deleteAdminVideo,
  generateVideoTranscript,
  getAdminVideos,
  updateAdminVideo,
} from "../../services/adminVideo.service";
import { getAdminLessons } from "../../services/adminLesson.service";
import { getCoursesAdmin } from "../../services/course.service";

interface VideoItem {
  id: number;
  lessonId: number;
  lessonTitle: string;
  courseId: number;
  courseTitle: string;
  provider: string;
  videoUrl: string;
  embedUrl: string | null;
  durationSeconds: number;
  processingStatus: string;
  transcriptStatus: string;
  uploadedAt: string | null;
}

const emptyForm = { lessonId: "", provider: "youtube", videoUrl: "", durationSeconds: 0, processingStatus: "completed" };

export default function VideoManagementPage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("all");
  const [lessonId, setLessonId] = useState("all");
  const [provider, setProvider] = useState("all");
  const [status, setStatus] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { void loadCourses(); }, []);
  useEffect(() => { void loadVideos(); }, [page, courseId, lessonId, provider, status]);
  useEffect(() => { void loadLessonsForCourse(courseId); }, [courseId]);

  async function loadCourses() {
    const response = await getCoursesAdmin();
    const data = unwrap(response);
    setCourses(data.items ?? data ?? []);
  }

  async function loadLessonsForCourse(selectedCourseId: string) {
    if (!selectedCourseId || selectedCourseId === "all") {
      setLessons([]);
      setLessonId("all");
      return;
    }
    const response = await getAdminLessons({ courseId: selectedCourseId, page: 1, pageSize: 100 });
    setLessons(unwrap(response).items ?? []);
  }

  async function loadVideos(nextPage = page) {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminVideos({ courseId, lessonId, provider, status, keyword, page: nextPage, pageSize: 10 });
      const data = unwrap(response);
      setVideos(data.items ?? []);
      setPagination(data.pagination ?? pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tai video.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(video: VideoItem) {
    setEditing(video);
    setForm({ lessonId: String(video.lessonId), provider: video.provider, videoUrl: video.videoUrl, durationSeconds: video.durationSeconds, processingStatus: video.processingStatus });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.lessonId || !form.videoUrl.trim()) {
      setError("Vui long chon bai hoc va nhap video URL.");
      return;
    }
    const payload = { ...form, lessonId: Number(form.lessonId), durationSeconds: Number(form.durationSeconds) };
    if (editing) await updateAdminVideo(String(editing.id), payload);
    else await createAdminVideo(payload);
    setMessage(editing ? "Da cap nhat video." : "Da tao video.");
    setEditing(null);
    setForm(emptyForm);
    await loadVideos();
  }

  async function runAction(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      setMessage(success);
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tac that bai.");
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold">Quan ly video bai hoc</h1>
            <p className="text-sm text-on-surface-variant">Quan ly YouTube/local/cloud video va transcript status.</p>
          </div>
          <button onClick={() => navigate("/admin/upload")} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">Upload tai nguyen</button>
        </div>

        <div className="mb-5 grid gap-3 rounded-xl border bg-white p-4 lg:grid-cols-[1fr_180px_180px_150px_170px_auto]">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tim video, URL, bai hoc" className="rounded-lg border px-3 py-2 text-sm" />
          <select value={courseId} onChange={(e) => { setCourseId(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tat ca khoa</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
          <select value={lessonId} onChange={(e) => { setLessonId(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tat ca bai</option>
            {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
          </select>
          <select value={provider} onChange={(e) => { setProvider(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Provider</option>
            <option value="youtube">YouTube</option>
            <option value="local">Local</option>
            <option value="cloud">Cloud</option>
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Xu ly</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <button onClick={() => { setPage(1); void loadVideos(1); }} className="rounded-lg bg-primary px-4 py-2 text-white">Tim</button>
        </div>

        {(error || message) && <div className={`mb-4 rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{error || message}</div>}

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-xl border bg-white">
            {loading ? <State text="Dang tai du lieu..." /> : videos.length === 0 ? <State text="Chua co video nao." /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-3">Video</th>
                      <th className="px-4 py-3">Khoa/Bai</th>
                      <th className="px-4 py-3">Provider</th>
                      <th className="px-4 py-3">Xu ly</th>
                      <th className="px-4 py-3">Transcript</th>
                      <th className="px-4 py-3 text-right">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {videos.map((video) => (
                      <tr key={video.id}>
                        <td className="px-4 py-3">
                          <p className="font-semibold">#{video.id}</p>
                          <a href={video.videoUrl} target="_blank" rel="noreferrer" className="block max-w-[360px] truncate text-xs text-primary">{video.videoUrl}</a>
                        </td>
                        <td className="px-4 py-3"><p>{video.courseTitle}</p><p className="text-xs text-on-surface-variant">{video.lessonTitle}</p></td>
                        <td className="px-4 py-3"><Badge value={video.provider} /></td>
                        <td className="px-4 py-3"><Badge value={video.processingStatus} /></td>
                        <td className="px-4 py-3"><Badge value={video.transcriptStatus} /></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(video)} className="rounded border px-2 py-1">Sua</button>
                            <button onClick={() => void runAction(() => deleteAdminVideo(String(video.id)), "Da xoa video.")} className="rounded border px-2 py-1 text-red-600">Xoa</button>
                            <button onClick={() => void runAction(() => generateVideoTranscript(String(video.id)), "Da bat dau tao transcript.")} className="rounded border px-2 py-1 text-primary">Transcript</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-between border-t px-4 py-3 text-sm">
              <span>{pagination.totalItems} video</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Truoc</button>
                <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sau</button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Sua video" : "Them video URL"}</h2>
            <div className="space-y-3">
              <select value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="">Chon bai hoc</option>
                {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
              </select>
              <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="youtube">YouTube</option>
                <option value="local">Local</option>
                <option value="cloud">Cloud</option>
              </select>
              <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="Video URL hoac file path" className="w-full rounded-lg border px-3 py-2 text-sm" />
              <input type="number" value={form.durationSeconds} onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) })} placeholder="Thoi luong giay" className="w-full rounded-lg border px-3 py-2 text-sm" />
              <select value={form.processingStatus} onChange={(e) => setForm({ ...form, processingStatus: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white">Luu</button>
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} className="rounded-lg border px-4 py-2 text-sm">Huy</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-full bg-surface-container-low px-2 py-1 text-xs font-bold">{value}</span>;
}

function State({ text }: { text: string }) {
  return <div className="p-8 text-center text-on-surface-variant">{text}</div>;
}

function unwrap(response: any) {
  return response?.data ?? response;
}
