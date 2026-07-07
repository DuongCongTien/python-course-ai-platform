import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  createAdminLesson,
  deleteAdminLesson,
  generateLessonSummary,
  generateLessonTranscript,
  getAdminLessons,
  updateAdminLesson,
} from "../../services/adminLesson.service";
import { getCoursesAdmin } from "../../services/course.service";

interface CourseOption { id: number; title: string }
interface LessonItem {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  description: string;
  durationSeconds: number;
  sortOrder: number;
  isFree: boolean;
  status: string;
  video: { id: number; provider: string; processingStatus: string } | null;
  hasSlide: boolean;
  transcriptStatus: string;
  summaryStatus: string;
}

const emptyForm = { courseId: "", title: "", description: "", durationSeconds: 0, sortOrder: 0, isFree: false, status: "draft" };

export default function LessonManagementPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [courseId, setCourseId] = useState("all");
  const [status, setStatus] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<LessonItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { void loadCourses(); }, []);
  useEffect(() => { void loadLessons(); }, [page, courseId, status]);

  async function loadCourses() {
    const response = await getCoursesAdmin();
    const data = unwrap(response);
    setCourses((data.items ?? data ?? []).map((course: any) => ({ id: Number(course.id), title: course.title })));
  }

  async function loadLessons(nextPage = page) {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminLessons({ courseId, keyword, status, page: nextPage, pageSize: 10 });
      const data = unwrap(response);
      setLessons(data.items ?? []);
      setPagination(data.pagination ?? pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tai bai hoc.");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(lesson: LessonItem) {
    setEditing(lesson);
    setForm({
      courseId: String(lesson.courseId),
      title: lesson.title,
      description: lesson.description,
      durationSeconds: lesson.durationSeconds,
      sortOrder: lesson.sortOrder,
      isFree: lesson.isFree,
      status: lesson.status,
    });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.courseId || !form.title.trim()) {
      setError("Vui long chon khoa hoc va nhap ten bai hoc.");
      return;
    }
    const payload = { ...form, courseId: Number(form.courseId), durationSeconds: Number(form.durationSeconds), sortOrder: Number(form.sortOrder) };
    if (editing) await updateAdminLesson(String(editing.id), payload);
    else await createAdminLesson(payload);
    setMessage(editing ? "Da cap nhat bai hoc." : "Da tao bai hoc.");
    resetForm();
    await loadLessons();
  }

  async function handleArchive(lesson: LessonItem) {
    await deleteAdminLesson(String(lesson.id));
    setMessage("Da luu tru bai hoc.");
    await loadLessons();
  }

  async function runAction(action: () => Promise<unknown>, done: string) {
    try {
      await action();
      setMessage(done);
      await loadLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tac that bai.");
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Quan ly bai hoc</h1>
          <p className="text-sm text-on-surface-variant">CRUD bai hoc, tao transcript va summary tu du lieu backend.</p>
        </div>

        <div className="mb-5 grid gap-3 rounded-xl border bg-white p-4 lg:grid-cols-[1fr_220px_180px_auto]">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tim bai hoc" className="rounded-lg border px-3 py-2 text-sm" />
          <select value={courseId} onChange={(e) => { setCourseId(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tat ca khoa hoc</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tat ca trang thai</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
            <option value="hidden">Hidden</option>
          </select>
          <button onClick={() => { setPage(1); void loadLessons(1); }} className="rounded-lg bg-primary px-5 py-2 text-white">Tim kiem</button>
        </div>

        {(error || message) && <div className={`mb-4 rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{error || message}</div>}

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-xl border bg-white">
            {loading ? <StateText text="Dang tai du lieu..." /> : lessons.length === 0 ? <StateText text="Chua co bai hoc nao." /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-3">Bai hoc</th>
                      <th className="px-4 py-3">Khoa hoc</th>
                      <th className="px-4 py-3">Thu tu</th>
                      <th className="px-4 py-3">Video</th>
                      <th className="px-4 py-3">Transcript</th>
                      <th className="px-4 py-3">Summary</th>
                      <th className="px-4 py-3">Trang thai</th>
                      <th className="px-4 py-3 text-right">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td className="px-4 py-3"><p className="font-semibold">{lesson.title}</p><p className="text-xs text-on-surface-variant">{lesson.durationSeconds}s</p></td>
                        <td className="px-4 py-3">{lesson.courseTitle}</td>
                        <td className="px-4 py-3">{lesson.sortOrder}</td>
                        <td className="px-4 py-3">{lesson.video ? `${lesson.video.provider}/${lesson.video.processingStatus}` : "Chua co"}</td>
                        <td className="px-4 py-3"><Badge value={lesson.transcriptStatus} /></td>
                        <td className="px-4 py-3"><Badge value={lesson.summaryStatus} /></td>
                        <td className="px-4 py-3"><Badge value={lesson.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(lesson)} className="rounded border px-2 py-1">Sua</button>
                            <button onClick={() => void handleArchive(lesson)} className="rounded border px-2 py-1 text-red-600">Xoa</button>
                            <button onClick={() => void runAction(() => generateLessonTranscript(String(lesson.id)), "Da bat dau tao transcript.")} className="rounded border px-2 py-1 text-primary">Transcript</button>
                            <button disabled={lesson.transcriptStatus !== "completed"} onClick={() => void runAction(() => generateLessonSummary(String(lesson.id)), "Da tao summary.")} className="rounded border px-2 py-1 text-primary disabled:opacity-40">Summary</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination pagination={pagination} page={page} setPage={setPage} />
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Sua bai hoc" : "Tao bai hoc"}</h2>
            <div className="space-y-3">
              <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="">Chon khoa hoc</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ten bai hoc" className="w-full rounded-lg border px-3 py-2 text-sm" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mo ta" rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.durationSeconds} onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) })} placeholder="Thoi luong giay" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} placeholder="Thu tu" className="rounded-lg border px-3 py-2 text-sm" />
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} /> Bai mien phi</label>
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white">Luu</button>
                <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm">Huy</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

function StateText({ text }: { text: string }) {
  return <div className="p-8 text-center text-on-surface-variant">{text}</div>;
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-full bg-surface-container-low px-2 py-1 text-xs font-bold">{value}</span>;
}

function Pagination({ pagination, page, setPage }: any) {
  return <div className="flex justify-between border-t px-4 py-3 text-sm"><span>{pagination.totalItems} bai hoc</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Truoc</button><button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sau</button></div></div>;
}

function unwrap(response: any) {
  return response?.data ?? response;
}
