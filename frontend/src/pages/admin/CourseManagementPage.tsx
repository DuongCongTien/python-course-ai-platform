import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";

type CourseLevel = "Cơ bản" | "Trung cấp" | "Nâng cao";
type CourseStatus = "published" | "draft" | "hidden";

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

const mockCourses: Course[] = [
  {
    id: "PYDS-001",
    title: "Python for Data Science 2024",
    level: "Trung cấp",
    lessons: 42,
    students: 1248,
    status: "published",
    createdAt: "12/05/2024",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdjbakyeii4HvfaAdUWYAL53TgSO_tAF9V2QYVZVD9VrnUPOuBXOhztbNAC5GNWRFiCIPi-Ya2QT6a0gq6HE9kLUlYuSmsqtw932kDBX8MA3TC4xXj8QeuqMc1qP_YBO0Awo2JUiwbmhLsDHM_E1vBbTOn-ZwHpASHsppNpQG0eJlRaNSsKqnJlu86_5ESSZ6zxMarf7qGIcktVK80H39tXaFM-Q0QZ_tsRHWXcWbLPV4dIJMwB469yhpwxs417PRpaZY5llm8h4yU",
  },
  {
    id: "MLBA-002",
    title: "Cơ bản về Machine Learning",
    level: "Cơ bản",
    lessons: 18,
    students: 856,
    status: "draft",
    createdAt: "20/06/2024",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnoBdM7FmW1AuNd3XADc28toFoIYtBKOQ6THPYv3N8CFaEoMYAkkeH3d-JLsVBXnwKHk_eY5w5UH4QvKsb_rhNoVpGlBWBKPdWXs7DgzNPG4cxUcSy81yIkR_IYJQ4vde4Mbtlf6Xt-ZAwBeILq6MlRZXNYZMB4gjQk12p04I_NdSiLc0PWrQQ_xEAdhTrclVlN6d4M78l39AfZhXyXWBvYz2n-wXxWlXAnjeph5erS1mPkqPYUYtnqV6WCGPzaJZ8lBdPYgUge_OF",
  },
  {
    id: "DLAD-005",
    title: "Deep Learning nâng cao",
    level: "Nâng cao",
    lessons: 56,
    students: 432,
    status: "hidden",
    createdAt: "05/01/2024",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlNYAd3GnU8J50UcdvimNaq-4-3QenSLRHux7tvQvi9uyDdhKBarbjV2dz2ylhdS2tD5490J925mMDcTD4OKA8xkmxQfZh7kWsP1HgMXXoZpUtSBdSj9WgAZNvYrCm7wj3kqwbhDqLAids6FGhW7wfbcOiQkvfNjuOlmo4Bv95aOaLuHrcTccRWg-f-LGvhi3HYXyoN3t5yggKi8tdXb9mVkBdJxmoK8VUIKKodfdpdyvQVZj4BxTwuy5mi4LyfwqLb4mPIPhPPK4d",
  },
];

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

// Edit panel
interface EditPanelProps {
  open: boolean;
  onClose: () => void;
  course?: Course | null;
}

function CourseEditPanel({ open, onClose, course }: EditPanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Panel */}
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
            <label className="text-sm font-semibold text-on-surface-variant">Tiêu đề khóa học</label>
            <input
              type="text"
              defaultValue={course?.title}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Mô tả ngắn</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all resize-none text-sm"
              placeholder="Tóm tắt nội dung khóa học..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Trình độ</label>
              <select
                defaultValue={course?.level}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              >
                <option>Cơ bản</option>
                <option>Trung cấp</option>
                <option>Nâng cao</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Số bài học</label>
              <input
                type="number"
                defaultValue={course?.lessons}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Thumbnail upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Ảnh đại diện</label>
            <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 text-center bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-3xl text-outline mb-2 group-hover:text-primary group-hover:scale-110 transition-all block">
                upload_file
              </span>
              <p className="text-sm text-on-surface-variant">
                Kéo thả hoặc <span className="text-primary font-bold">chọn tệp</span>
              </p>
              <p className="text-xs text-outline mt-1">JPG, PNG, WEBP · Tối đa 2MB</p>
            </div>
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div>
              <p className="font-semibold text-on-surface text-sm">Trạng thái công khai</p>
              <p className="text-xs text-on-surface-variant">Hiển thị cho học viên ngay lập tức</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={course?.status === "published"} className="sr-only peer" />
              <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant/30 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="py-3 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container-low transition-colors text-sm"
          >
            Hủy
          </button>
          <button className="py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
}

function CourseManagementPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openEdit = (course?: Course) => {
    setSelectedCourse(course ?? null);
    setPanelOpen(true);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Quản lý khóa học"
        actionLabel="Thêm khóa học"
        actionIcon="add"
        onAction={() => openEdit()}
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white border border-outline-variant/30 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select className="px-4 py-2.5 rounded-xl border border-outline-variant bg-background text-on-surface-variant outline-none text-sm min-w-[130px]">
              <option>Trạng thái</option>
              <option>Công khai</option>
              <option>Nháp</option>
              <option>Tạm ẩn</option>
            </select>
            <select className="px-4 py-2.5 rounded-xl border border-outline-variant bg-background text-on-surface-variant outline-none text-sm min-w-[130px]">
              <option>Trình độ</option>
              <option>Cơ bản</option>
              <option>Trung cấp</option>
              <option>Nâng cao</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
                  {["Ảnh", "Tên khóa học", "Trình độ", "Bài học", "Học viên", "Trạng thái", "Ngày tạo", "Thao tác"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-4 text-[11px] font-bold text-outline uppercase tracking-wider ${
                        ["Bài học", "Học viên"].includes(h) ? "text-center" : h === "Thao tác" ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {mockCourses.map((course) => {
                  const st = statusConfig[course.status];
                  const lv = levelStyle[course.level];
                  return (
                    <tr key={course.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-outline-variant/30">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-on-surface text-sm">{course.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">ID: {course.id}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lv}`}>{course.level}</span>
                      </td>
                      <td className="px-5 py-4 text-center font-medium text-sm">{course.lessons}</td>
                      <td className="px-5 py-4 text-center font-medium text-sm">{course.students.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{course.createdAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button className="p-2 hover:bg-primary-fixed rounded-lg text-primary transition-colors" title="Xem">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button
                            className="p-2 hover:bg-secondary-fixed rounded-lg text-secondary transition-colors"
                            title="Sửa"
                            onClick={() => openEdit(course)}
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button className="p-2 hover:bg-error-container rounded-lg text-error transition-colors" title="Xóa">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-outline-variant/30 flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">Hiển thị 1–3 trong 12 khóa học</p>
            <div className="flex gap-2">
              <button disabled className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm">1</button>
              <button className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container font-medium text-sm">2</button>
              <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CourseEditPanel open={panelOpen} onClose={() => setPanelOpen(false)} course={selectedCourse} />
    </AdminLayout>
  );
}

export default CourseManagementPage;