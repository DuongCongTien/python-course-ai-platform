import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";

interface Lesson {
  id: number;
  order: number;
  title: string;
  duration: string;
  hasVideo: boolean;
  hasQuiz: boolean;
  status: "published" | "draft";
}

const mockLessons: Lesson[] = [
  { id: 1, order: 1, title: "Bài 1: Giới thiệu Python", duration: "08:15", hasVideo: true, hasQuiz: true, status: "published" },
  { id: 2, order: 2, title: "Bài 2: Biến và Kiểu dữ liệu", duration: "15:40", hasVideo: true, hasQuiz: true, status: "published" },
  { id: 3, order: 3, title: "Bài 3: Cấu trúc điều kiện", duration: "10:20", hasVideo: false, hasQuiz: false, status: "draft" },
  { id: 4, order: 4, title: "Bài 4: Vòng lặp for và while", duration: "18:05", hasVideo: true, hasQuiz: true, status: "published" },
  { id: 5, order: 5, title: "Bài 5: Hàm và Module", duration: "22:30", hasVideo: false, hasQuiz: false, status: "draft" },
];

const courses = ["Python cơ bản", "Python cho AI nâng cao", "Xử lý dữ liệu với Pandas", "Machine Learning căn bản"];

function LessonManagementPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(mockLessons[2]);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  return (
    <AdminLayout>
      <AdminHeader title="Quản lý bài học" />

      <div className="flex flex-1 overflow-hidden">
        {/* Center content */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Controls row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="text-sm font-medium text-on-surface-variant whitespace-nowrap">Chọn khóa học:</label>
                <div className="relative w-full sm:w-72">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-outline-variant/50 rounded-xl appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                  >
                    {courses.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              <button className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Thêm bài học mới
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/30">
                      {["Thứ tự", "Tên bài học", "Thời lượng", "Video", "Quiz", "Trạng thái", "Hành động"].map((h) => (
                        <th key={h} className={`px-5 py-4 text-[11px] font-bold text-outline uppercase tracking-wider ${h === "Hành động" ? "text-right" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {mockLessons.map((lesson) => (
                      <tr
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`transition-colors group cursor-pointer ${
                          selectedLesson?.id === lesson.id
                            ? "bg-primary/5"
                            : "hover:bg-surface-bright"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline cursor-move opacity-0 group-hover:opacity-100 transition-opacity text-[18px]">
                              drag_indicator
                            </span>
                            <span className="font-mono text-sm text-on-surface-variant font-semibold">
                              {String(lesson.order).padStart(2, "0")}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-on-surface text-sm">{lesson.title}</td>
                        <td className="px-5 py-4 font-mono text-sm text-on-surface-variant">{lesson.duration}</td>
                        <td className="px-5 py-4">
                          {lesson.hasVideo ? (
                            <span className="flex items-center gap-1.5 text-secondary font-medium text-sm">
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              Đã có
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-outline-variant font-medium text-sm">
                              <span className="material-symbols-outlined text-[18px]">error</span>
                              Chưa có
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-on-surface-variant font-medium">
                          {lesson.hasQuiz ? "Có" : <span className="opacity-50">Không</span>}
                        </td>
                        <td className="px-5 py-4">
                          {lesson.status === "published" ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              Đã xuất bản
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-surface-container-highest text-outline rounded-full text-xs font-bold">
                              Bản nháp
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-outline hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-outline hover:text-primary transition-colors"
                              onClick={(e) => { e.stopPropagation(); setSelectedLesson(lesson); }}
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error-container text-error transition-colors">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-4 flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-low/20">
                <p className="text-sm text-on-surface-variant">
                  Hiển thị <span className="font-bold">1–5</span> trên <span className="font-bold">45</span> bài học
                </p>
                <div className="flex gap-2">
                  <button disabled className="p-2 rounded-lg border border-outline-variant/30 hover:bg-white transition-colors disabled:opacity-40">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-2 rounded-lg border border-outline-variant/30 hover:bg-white transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Lesson form */}
        <aside className="hidden lg:flex w-[400px] bg-white border-l border-outline-variant/30 flex-col h-screen sticky top-0 shadow-2xl z-10">
          <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-bright">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                edit_note
              </span>
              <h2 className="font-bold text-lg tracking-tight">Thông tin bài học</h2>
            </div>
            <button className="text-outline hover:text-error transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Lesson name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Tên bài học <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={selectedLesson?.title ?? ""}
                onChange={() => {}}
                className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Thứ tự</label>
              <input
                type="number"
                value={selectedLesson?.order ?? 1}
                onChange={() => {}}
                className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Mô tả</label>
              <textarea
                rows={3}
                placeholder="Tóm tắt nội dung bài học..."
                className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-sm"
              />
            </div>

            {/* Rich text placeholder */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Nội dung chính</label>
              <div className="border border-outline-variant/50 rounded-xl overflow-hidden">
                <div className="bg-surface-container-low p-2 flex gap-1 border-b border-outline-variant/30">
                  {["format_bold", "format_italic", "format_list_bulleted", "link", "code"].map((icon) => (
                    <button key={icon} className="w-8 h-8 rounded hover:bg-white text-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </button>
                  ))}
                </div>
                <div className="min-h-[120px] p-4 bg-white text-sm text-on-surface-variant italic opacity-60">
                  Nhập nội dung chi tiết bài học tại đây...
                </div>
              </div>
            </div>

            {/* Video upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Video bài học</label>
              <div className="w-full p-5 border-2 border-dashed border-outline-variant/50 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-3xl text-outline group-hover:text-primary transition-colors">
                  cloud_upload
                </span>
                <p className="text-xs font-bold text-outline uppercase tracking-wider group-hover:text-primary transition-colors">
                  Tải video lên hoặc chọn từ kho
                </p>
                <p className="text-[10px] text-outline-variant">MP4 · Tối đa 500MB</p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Trạng thái</label>
              <div className="relative">
                <select
                  defaultValue={selectedLesson?.status}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                >
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-outline-variant/30 bg-surface-bright grid grid-cols-2 gap-3">
            <button className="py-3 border border-outline-variant text-on-surface-variant font-bold rounded-xl hover:bg-surface transition-colors text-sm">
              Hủy
            </button>
            <button className="py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm">
              Lưu thay đổi
            </button>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}

export default LessonManagementPage;