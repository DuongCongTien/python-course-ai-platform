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

        <div key={course?.id || 'new'} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tên khóa học */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">
              Tên khóa học <span className="text-error">*</span>
            </label>
            <input
              type="text"
              defaultValue={course?.title}
              placeholder="Nhập tiêu đề khóa học..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all text-sm"
            />
          </div>

          {/* Mô tả (Chỉ hiển thị thêm cho đầy đủ form) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Mô tả ngắn</label>
            <textarea
              rows={3}
              defaultValue={course?.id ? "Mô tả mẫu cho khóa học..." : ""}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all resize-none text-sm"
              placeholder="Tóm tắt nội dung khóa học..."
            />
          </div>

          {/* Grid 2 cột: Trình độ & Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Trình độ</label>
              <select
                defaultValue={course?.level || "Cơ bản"}
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
                defaultValue={course?.status || "draft"}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              >
                <option value="published">Công khai</option>
                <option value="draft">Nháp</option>
                <option value="hidden">Tạm ẩn</option>
              </select>
            </div>
          </div>

          {/* Grid 3 cột: Số bài học, Số học viên, Ngày tạo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Số bài học</label>
              <input
                type="number"
                defaultValue={course?.lessons || 0}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Học viên</label>
              <input
                type="number"
                defaultValue={course?.students || 0}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Ngày tạo</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                defaultValue={course?.createdAt || ""}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background outline-none focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Ảnh đại diện */}
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
        </div>

        <div className="p-6 border-t border-outline-variant/30 grid grid-cols-2 gap-4 mt-auto">
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const openEdit = (course?: Course) => {
    setSelectedCourse(course ?? null);
    setPanelOpen(true);
  };

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || course.status === statusFilter;
    const matchesLevel = levelFilter === "" || course.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <AdminLayout>
      <AdminHeader title="Quản lý khóa học" />

      <div className="p-6 space-y-6">
        {/* Filters & Add Button */}
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
              className="hidden sm:flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tạo khóa học mới
            </button>
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
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const st = statusConfig[course.status];
                    const lv = levelStyle[course.level];
                    return (
                      <tr key={course.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="w-16 h-10 rounded-lg overflow-hidden border border-outline-variant/30">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
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

      <CourseEditPanel open={panelOpen} onClose={() => setPanelOpen(false)} course={selectedCourse} />
    </AdminLayout>
  );
}

export default CourseManagementPage;