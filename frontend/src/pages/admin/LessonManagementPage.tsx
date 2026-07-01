import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface Lesson {
  id: number;
  order: number;
  title: string;
  duration: string;
  hasVideo: boolean;
  hasSlide: boolean;
  hasQuiz: boolean;
  status: "published" | "draft";
  course: string;
}

const courses = [
  "Python cơ bản",
  "Python cho AI nâng cao",
  "Xử lý dữ liệu với Pandas",
  "Machine Learning căn bản",
];

const mockLessons: Lesson[] = [
  {
    id: 1,
    order: 1,
    title: "Bài 1: Giới thiệu Python",
    duration: "08:15",
    hasVideo: true,
    hasSlide: false,
    hasQuiz: true,
    status: "published",
    course: "Python cơ bản",
  },
  {
    id: 2,
    order: 2,
    title: "Bài 2: Biến và Kiểu dữ liệu",
    duration: "15:40",
    hasVideo: true,
    hasSlide: true,
    hasQuiz: true,
    status: "published",
    course: "Python cơ bản",
  },
  {
    id: 3,
    order: 3,
    title: "Bài 3: Cấu trúc điều kiện",
    duration: "10:20",
    hasVideo: false,
    hasSlide: false,
    hasQuiz: false,
    status: "draft",
    course: "Python cơ bản",
  },
  {
    id: 4,
    order: 4,
    title: "Bài 4: Vòng lặp for và while",
    duration: "18:05",
    hasVideo: true,
    hasSlide: true,
    hasQuiz: true,
    status: "published",
    course: "Python cho AI nâng cao",
  },
  {
    id: 5,
    order: 5,
    title: "Bài 5: Hàm và Module",
    duration: "22:30",
    hasVideo: false,
    hasSlide: false,
    hasQuiz: false,
    status: "draft",
    course: "Xử lý dữ liệu với Pandas",
  },
];

function LessonManagementPage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const filteredLessons = mockLessons.filter(
    (lesson) => selectedCourse === "" || lesson.course === selectedCourse,
  );

  const handleAddNew = () => {
    setSelectedLesson(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <AdminLayout>
      <div className="relative flex flex-1 flex-col lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col transition-all duration-300">
          <div className="space-y-5 p-6">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Quản lý bài học</h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                Sắp xếp và cập nhật bài học theo từng khóa học.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <label className="whitespace-nowrap text-sm font-medium text-on-surface-variant">
                  Chọn khóa học:
                </label>

                <div className="relative w-full sm:w-72">
                  <select
                    value={selectedCourse}
                    onChange={(event) => {
                      setSelectedCourse(event.target.value);
                      setIsPanelOpen(false);
                    }}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-outline-variant/50 bg-white py-2.5 pl-4 pr-10 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Tất cả khóa học</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>

                  <span
                    className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-outline"
                    aria-hidden={true}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden={true}>
                  add_circle
                </span>
                Thêm bài học mới
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                      {[
                        "Thứ tự",
                        "Tên bài học",
                        "Thời lượng",
                        "Video",
                        "Slide",
                        "Quiz",
                        "Trạng thái",
                        "Hành động",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-outline ${
                            heading === "Hành động" ? "text-right" : ""
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-outline-variant/20">
                    {filteredLessons.map((lesson) => (
                      <tr
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`group cursor-pointer transition-colors ${
                          selectedLesson?.id === lesson.id
                            ? "bg-primary/5"
                            : "hover:bg-surface-bright"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="material-symbols-outlined cursor-move text-[18px] text-outline opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden={true}
                            >
                              drag_indicator
                            </span>
                            <span className="font-mono text-sm font-semibold text-on-surface-variant">
                              {String(lesson.order).padStart(2, "0")}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-on-surface">
                          {lesson.title}
                        </td>

                        <td className="px-5 py-4 font-mono text-sm text-on-surface-variant">
                          {lesson.duration}
                        </td>

                        <td className="px-5 py-4">
                          {lesson.hasVideo ? (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-secondary">
                              <span
                                className="material-symbols-outlined text-[18px]"
                                aria-hidden={true}
                              >
                                check_circle
                              </span>
                              Đã có
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-outline-variant">
                              <span
                                className="material-symbols-outlined text-[18px]"
                                aria-hidden={true}
                              >
                                error
                              </span>
                              Chưa có
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {lesson.hasSlide ? (
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                                Có PDF
                              </span>
                              <button
                                type="button"
                                onClick={(event) => event.stopPropagation()}
                                className="text-xs font-bold text-primary hover:underline"
                              >
                                Xem
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm font-medium text-outline-variant">
                              Chưa có
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-on-surface-variant">
                          {lesson.hasQuiz ? "Có" : <span className="opacity-50">Không</span>}
                        </td>

                        <td className="px-5 py-4">
                          {lesson.status === "published" ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Đã xuất bản
                            </span>
                          ) : (
                            <span className="rounded-full bg-surface-container-highest px-3 py-1 text-xs font-bold text-outline">
                              Bản nháp
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={(event) => event.stopPropagation()}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container hover:text-primary"
                              aria-label={`Xem ${lesson.title}`}
                            >
                              <span
                                className="material-symbols-outlined text-[18px]"
                                aria-hidden={true}
                              >
                                visibility
                              </span>
                            </button>

                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container hover:text-primary"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(lesson);
                              }}
                              aria-label={`Chỉnh sửa ${lesson.title}`}
                            >
                              <span
                                className="material-symbols-outlined text-[18px]"
                                aria-hidden={true}
                              >
                                edit
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={(event) => event.stopPropagation()}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-error transition-colors hover:bg-error-container"
                              aria-label={`Xóa ${lesson.title}`}
                            >
                              <span
                                className="material-symbols-outlined text-[18px]"
                                aria-hidden={true}
                              >
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-low/20 px-5 py-4">
                <p className="text-sm text-on-surface-variant">
                  Hiển thị <span className="font-bold">{filteredLessons.length}</span> bài học
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled
                    className="rounded-lg border border-outline-variant/30 p-2 transition-colors hover:bg-white disabled:opacity-40"
                    aria-label="Trang trước"
                  >
                    <span className="material-symbols-outlined" aria-hidden={true}>
                      chevron_left
                    </span>
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-outline-variant/30 p-2 transition-colors hover:bg-white"
                    aria-label="Trang sau"
                  >
                    <span className="material-symbols-outlined" aria-hidden={true}>
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPanelOpen && (
          <aside className="z-10 flex w-full shrink-0 flex-col border-t border-outline-variant/30 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[400px] lg:border-l lg:border-t-0 lg:shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-bright p-5">
              <div className="flex items-center gap-2 text-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden={true}
                >
                  {selectedLesson ? "edit_note" : "add_box"}
                </span>
                <h2 className="text-lg font-bold tracking-tight">
                  {selectedLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleClosePanel}
                className="rounded-md p-1 text-outline transition-colors hover:bg-error-container/50 hover:text-error"
                aria-label="Đóng bảng chỉnh sửa bài học"
              >
                <span className="material-symbols-outlined" aria-hidden={true}>
                  close
                </span>
              </button>
            </div>

            <div className="flex-1 space-y-5 p-5 lg:overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Thuộc khóa học <span className="text-error">*</span>
                </label>
                <select
                  value={selectedLesson?.course ?? (selectedCourse || courses[0])}
                  onChange={() => {}}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Tên bài học <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={selectedLesson?.title ?? ""}
                  onChange={() => {}}
                  placeholder="Nhập tên bài học..."
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Thứ tự
                </label>
                <input
                  type="number"
                  value={selectedLesson?.order ?? filteredLessons.length + 1}
                  onChange={() => {}}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Nội dung chính
                </label>
                <div className="overflow-hidden rounded-xl border border-outline-variant/50">
                  <div className="flex gap-1 border-b border-outline-variant/30 bg-surface-container-low p-2">
                    {[
                      "format_bold",
                      "format_italic",
                      "format_list_bulleted",
                      "link",
                      "code",
                    ].map((icon) => (
                      <button
                        type="button"
                        key={icon}
                        className="flex h-8 w-8 items-center justify-center rounded text-outline-variant hover:bg-white"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden={true}
                        >
                          {icon}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="min-h-[120px] bg-white p-4 text-sm italic text-on-surface-variant opacity-60">
                    Nhập nội dung chi tiết bài học tại đây...
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Video bài học
                </label>
                <div className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/50 p-5 transition-colors hover:bg-surface-container-low">
                  <span
                    className="material-symbols-outlined text-3xl text-outline transition-colors group-hover:text-primary"
                    aria-hidden={true}
                  >
                    cloud_upload
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-outline transition-colors group-hover:text-primary">
                    Tải video lên hoặc chọn từ kho
                  </p>
                  <p className="text-[10px] text-outline-variant">MP4 · Tối đa 500MB</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="lesson-slide-edit"
                  className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
                >
                  Slide bài học
                </label>
                <label
                  htmlFor="lesson-slide-edit"
                  className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/50 p-5 transition-colors hover:bg-surface-container-low"
                >
                  <span
                    className="material-symbols-outlined text-3xl text-error"
                    aria-hidden={true}
                  >
                    picture_as_pdf
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">
                    Upload hoặc thay slide PDF
                  </span>
                  <span className="text-[10px] text-outline-variant">Chỉ hỗ trợ PDF</span>
                </label>
                <input
                  id="lesson-slide-edit"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Trạng thái
                </label>
                <div className="relative">
                  <select
                    value={selectedLesson?.status ?? "draft"}
                    onChange={() => {}}
                    className="w-full appearance-none rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                  <span
                    className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-outline"
                    aria-hidden={true}
                  >
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-outline-variant/30 bg-surface-bright p-5">
              <button
                type="button"
                onClick={handleClosePanel}
                className="rounded-xl border border-outline-variant py-3 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface"
              >
                Hủy
              </button>
              <button
                type="button"
                className="rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
              >
                Lưu thay đổi
              </button>
            </div>
          </aside>
        )}
      </div>
    </AdminLayout>
  );
}

export default LessonManagementPage;
