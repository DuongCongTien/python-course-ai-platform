import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  type AdminCoursePayload,
  createCourseAdmin,
  deleteCourseAdmin,
  getCoursesAdmin,
  mapAdminCourseListItem,
  updateCourseAdmin,
} from "../../services/course.service";

type CourseLevel = "Cơ bản" | "Trung cấp" | "Nâng cao";
type CourseStatus = "published" | "draft" | "hidden";
type ApiLevel = "beginner" | "intermediate" | "advanced";

interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  lessons: number;
  students: number;
  status: CourseStatus;
  createdAt: string;
  thumbnail: string;
}

const levelToApi: Record<CourseLevel, ApiLevel> = {
  "Cơ bản": "beginner",
  "Trung cấp": "intermediate",
  "Nâng cao": "advanced",
};

const levelStyle: Record<CourseLevel, string> = {
  "Cơ bản": "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  "Trung cấp": "bg-secondary-fixed text-on-secondary-fixed-variant",
  "Nâng cao": "bg-primary-fixed text-on-primary-fixed-variant",
};

const statusConfig: Record<CourseStatus, { label: string; dot: string; badge: string }> = {
  published: { label: "Công khai", dot: "bg-green-500", badge: "bg-green-100 text-green-700" },
  draft: { label: "Nháp", dot: "bg-slate-400", badge: "bg-slate-100 text-slate-500" },
  hidden: { label: "Tạm ẩn", dot: "bg-orange-500", badge: "bg-orange-100 text-orange-700" },
};

interface CourseFormState {
  title: string;
  description: string;
  level: CourseLevel;
  status: CourseStatus;
  thumbnailUrl: string;
}

const emptyForm: CourseFormState = {
  title: "",
  description: "",
  level: "Cơ bản",
  status: "draft",
  thumbnailUrl: "",
};

// ==================== Edit panel ====================
interface EditPanelProps {
  open: boolean;
  onClose: () => void;
  course?: Course | null;
  isSaving: boolean;
  onSave: (form: CourseFormState) => void;
}

function CourseEditPanel({ open, onClose, course, isSaving, onSave }: EditPanelProps) {
  const [form, setForm] = useState<CourseFormState>(emptyForm);

  // Nạp lại dữ liệu form mỗi khi mở panel với 1 course khác (hoặc mở panel "thêm mới")
  useEffect(() => {
    if (open) {
      setForm(
        course
          ? {
              title: course.title,
              description: "",
              level: course.level,
              status: course.status,
              thumbnailUrl: course.thumbnail,
            }
          : emptyForm,
      );
    }
  }, [open, course]);

  const updateField = <K extends keyof CourseFormState>(field: K, value: CourseFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-surface-container-lowest z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-on-surface">
              {course ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
            </h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Cập nhật thông tin chi tiết</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">
              Tên khóa học <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Nhập tiêu đề khóa học..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all resize-none text-sm"
              placeholder="Tóm tắt nội dung khóa học..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Trình độ</label>
              <select
                value={form.level}
                onChange={(event) => updateField("level", event.target.value as CourseLevel)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              >
                <option value="Cơ bản">Cơ bản</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Nâng cao">Nâng cao</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Trạng thái</label>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value as CourseStatus)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              >
                <option value="published">Công khai</option>
                <option value="draft">Nháp</option>
                <option value="hidden">Tạm ẩn</option>
              </select>
            </div>
          </div>

          {/* Số bài học/học viên/ngày tạo do backend tự tính (từ bảng lessons/enrollment thật),
              không cho admin sửa tay ở đây để tránh sai lệch dữ liệu */}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Ảnh đại diện (URL)</label>
            <input
              type="text"
              value={form.thumbnailUrl}
              onChange={(event) => updateField("thumbnailUrl", event.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all text-sm"
            />
            <p className="text-xs text-outline mt-1">
              Chưa hỗ trợ tải ảnh trực tiếp — dán link ảnh có sẵn (vd từ Google Drive, Imgur...) vào đây.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant/30 grid grid-cols-2 gap-4 mt-auto">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="py-3 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container-low transition-colors text-sm disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving || !form.title.trim()}
            className="py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:cursor-wait"
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </>
  );
}

// ==================== Trang chính ====================
function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const loadCourses = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await getCoursesAdmin();
      const items = Array.isArray(response.data) ? response.data : [];
      setCourses(items.map(mapAdminCourseListItem));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Không thể tải danh sách khóa học.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openEdit = (course?: Course) => {
    setSelectedCourse(course ?? null);
    setPanelOpen(true);
  };

  const handleSave = async (form: CourseFormState) => {
    setIsSaving(true);
    try {
      const payload: AdminCoursePayload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        level: levelToApi[form.level],
        status: form.status,
        thumbnail_url: form.thumbnailUrl.trim() || undefined,
      };

      if (selectedCourse) {
        await updateCourseAdmin(selectedCourse.id, payload);
      } else {
        await createCourseAdmin(payload);
      }

      setPanelOpen(false);
      await loadCourses(); // tải lại danh sách mới nhất sau khi lưu
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể lưu khóa học.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Xóa khóa học "${course.title}"? Hành động này không thể hoàn tác.`)) return;

    try {
      await deleteCourseAdmin(course.id);
      await loadCourses();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể xóa khóa học.");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || course.status === statusFilter;
    const matchesLevel = levelFilter === "" || course.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Quản lý khóa học</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Tạo, chỉnh sửa và quản lý nội dung các khóa học.
          </p>
        </div>

        <div className="bg-white border border-outline-variant/30 p-5 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học theo tên, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all text-sm"
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-outline-variant bg-background text-on-surface-variant outline-none text-sm min-w-[130px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="published">Công khai</option>
              <option value="draft">Nháp</option>
              <option value="hidden">Tạm ẩn</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-outline-variant bg-background text-on-surface-variant outline-none text-sm min-w-[130px]"
            >
              <option value="">Tất cả trình độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Nâng cao">Nâng cao</option>
            </select>

            <button
              onClick={() => openEdit()}
              className="flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tạo khóa học mới
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
                  {["Ảnh", "Tên khóa học", "Trình độ", "Bài học", "Học viên", "Trạng thái", "Ngày tạo", "Thao tác"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-4 text-[11px] font-bold text-outline uppercase tracking-wider whitespace-nowrap ${
                        ["Bài học", "Học viên"].includes(h) ? "text-center" : h === "Thao tác" ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-on-surface-variant text-sm">
                      Đang tải danh sách khóa học...
                    </td>
                  </tr>
                ) : loadError ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-error">
                      {loadError}
                    </td>
                  </tr>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const st = statusConfig[course.status];
                    const lv = levelStyle[course.level];
                    return (
                      <tr key={course.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="w-16 h-10 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-low">
                            {course.thumbnail && (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-bold text-on-surface text-sm">{course.title}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">ID: {course.id}</p>
                        </td>
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lv}`}>{course.level}</span>
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-sm whitespace-nowrap">{course.lessons}</td>
                        <td className="px-5 py-4 text-center font-medium text-sm whitespace-nowrap">{course.students.toLocaleString()}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${st.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-on-surface-variant whitespace-nowrap">{course.createdAt}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex justify-end gap-1">
                            <button
                              className="p-2 hover:bg-secondary-fixed rounded-lg text-secondary transition-colors"
                              title="Sửa"
                              onClick={() => openEdit(course)}
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              className="p-2 hover:bg-error-container rounded-lg text-error transition-colors"
                              title="Xóa"
                              onClick={() => handleDelete(course)}
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-on-surface-variant text-sm">
                      Không tìm thấy khóa học nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low/20">
            <p className="text-sm text-on-surface-variant">
              Hiển thị <span className="font-bold">{filteredCourses.length}</span> khóa học
            </p>
            <div className="flex gap-2">
              <button disabled className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors disabled:opacity-40">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm">1</button>
              <button className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors disabled:opacity-40" disabled>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CourseEditPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        course={selectedCourse}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

export default CourseManagementPage;