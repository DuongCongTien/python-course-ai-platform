import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";

// Dữ liệu mẫu (Mock data) bóc từ HTML
const mockQuizzes = [
  {
    id: "QZ01",
    title: "Quiz 01 - Giới thiệu Python",
    course: "Python Cơ Bản",
    lesson: "Bài 1: Giới thiệu",
    questions: 10,
    duration: "15 phút",
    attempts: 420,
    totalStudents: 500,
    avgScore: "8.2/10",
    status: "active",
    date: "12/03/2024",
    icon: "description",
    iconBg: "bg-primary-container text-primary",
    passRate: 70
  },
  {
    id: "QZ04",
    title: "Quiz 04 - Vòng lặp trong Python",
    course: "Python Cơ Bản",
    lesson: "Bài 4: Vòng lặp",
    questions: 15,
    duration: "20 phút",
    attempts: 286,
    totalStudents: 350,
    avgScore: "7.6/10",
    status: "active",
    date: "21/03/2024",
    icon: "analytics",
    iconBg: "bg-primary text-white",
    passRate: 70
  },
  {
    id: "QZ02",
    title: "Kiểm tra chương 2 - Cấu trúc điều khiển",
    course: "Python Cơ Bản",
    lesson: "Chương 2",
    questions: 25,
    duration: "30 phút",
    attempts: 154,
    totalStudents: 200,
    avgScore: "7.9/10",
    status: "draft",
    date: "02/04/2024",
    icon: "folder_open",
    iconBg: "bg-surface-container-high text-on-surface-variant",
    passRate: 65
  }
];

export default function QuizManagementPage() {
  const [quizzes] = useState(mockQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState(mockQuizzes[1]); // Mặc định chọn Quiz 04

  // Hàm render trạng thái
  const renderStatus = (status: string) => {
    if (status === 'active') {
      return (
        <span className="flex w-fit items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[12px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đang hoạt động
        </span>
      );
    }
    return (
      <span className="flex w-fit items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[12px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Bản nháp
      </span>
    );
  };

  return (
    <AdminLayout>
      <AdminHeader title="Quản lý Quiz" />
      
      <div className="p-8 space-y-8 max-w-[1440px] mx-auto min-h-screen">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-on-surface">Quản lý Quiz</h2>
            <p className="text-on-surface-variant text-base">Tạo, chỉnh sửa và theo dõi các bài kiểm tra trong từng khóa học.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">filter_alt</span> Lọc nâng cao
            </button>
            <button className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">file_download</span> Xuất báo cáo
            </button>
            <button className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span> Ngân hàng câu hỏi
            </button>
            <button className="px-5 py-2.5 bg-primary-container text-on-primary-container rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-[20px]">add_circle</span> Tạo Quiz mới
            </button>
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <span className="flex items-center text-[#0058be] text-sm font-bold">+8% <span className="material-symbols-outlined text-[16px] ml-1">trending_up</span></span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Tổng số Quiz</p>
            <h3 className="text-3xl font-bold mt-1 text-on-surface">86</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-100 rounded-xl text-green-600">
                <span className="material-symbols-outlined">toggle_on</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Quiz đang hoạt động</p>
            <h3 className="text-3xl font-bold mt-1 text-on-surface">64</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl text-yellow-700">
                <span className="material-symbols-outlined">database</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Câu hỏi trong ngân hàng</p>
            <h3 className="text-3xl font-bold mt-1 text-on-surface">1,245</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <span className="material-symbols-outlined">history_edu</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Lượt làm bài tháng này</p>
            <h3 className="text-3xl font-bold mt-1 text-on-surface">3,820</h3>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Table & Toolbar */}
          <div className="lg:w-2/3 space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-outline-variant/50 shadow-sm flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Tìm theo tên quiz..." type="text" />
              </div>
              <select className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-base focus:ring-primary focus:border-primary outline-none">
                <option>Khóa học</option>
                <option>Python Cơ Bản</option>
                <option>Python AI Advanced</option>
              </select>
              <select className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-base focus:ring-primary focus:border-primary outline-none">
                <option>Trạng thái</option>
                <option>Đang hoạt động</option>
                <option>Bản nháp</option>
              </select>
              <button className="px-6 py-2 bg-[#0058be] text-white rounded-xl font-semibold hover:opacity-90">Tìm kiếm</button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors">
                <span className="material-symbols-outlined">restart_alt</span>
              </button>
            </div>

            {/* Quiz Management Table */}
            <div className="bg-white rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low/50">
                    <tr>
                      <th className="px-4 py-4 w-12"><input className="rounded text-primary focus:ring-primary" type="checkbox" /></th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Tên Quiz</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Khóa học</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Nội dung</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant text-center whitespace-nowrap">Stats</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Trạng thái</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Ngày tạo</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {quizzes.map((quiz) => {
                      const isSelected = selectedQuiz.id === quiz.id;
                      return (
                        <tr 
                          key={quiz.id}
                          onClick={() => setSelectedQuiz(quiz)}
                          className={`transition-colors cursor-pointer group ${
                            isSelected 
                              ? "bg-primary/5 border-l-4 border-l-primary" 
                              : "hover:bg-surface border-l-4 border-transparent"
                          }`}
                        >
                          <td className="px-4 py-4"><input defaultChecked={isSelected} className="rounded text-primary focus:ring-primary" type="checkbox" /></td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${quiz.iconBg}`}>
                                <span className="material-symbols-outlined text-[20px]">{quiz.icon}</span>
                              </div>
                              <div>
                                <p className={`font-bold text-base ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{quiz.title}</p>
                                <p className="text-xs text-on-surface-variant">{quiz.questions} câu hỏi | {quiz.duration}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2.5 py-1 bg-surface-container text-on-surface rounded-full text-xs font-medium whitespace-nowrap">{quiz.course}</span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-on-surface whitespace-nowrap">{quiz.lesson}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-center">
                              <p className="text-sm font-bold text-on-surface">{quiz.attempts} lượt</p>
                              <p className="text-xs text-[#0058be]">Avg: {quiz.avgScore}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {renderStatus(quiz.status)}
                          </td>
                          <td className="px-4 py-4 text-on-surface-variant text-sm whitespace-nowrap">{quiz.date}</td>
                          <td className="px-4 py-4 text-right">
                            <button className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/30 flex items-center justify-between">
                <p className="text-sm text-on-surface-variant">Hiển thị 1 - 3 trong tổng số 86 bài quiz</p>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                  <button className="w-8 h-8 bg-primary text-white rounded-lg font-bold">1</button>
                  <button className="w-8 h-8 hover:bg-surface-container rounded-lg font-bold">2</button>
                  <button className="w-8 h-8 hover:bg-surface-container rounded-lg font-bold">3</button>
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Detail Panel */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/50 shadow-md sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-on-surface">Chi tiết Quiz</h4>
                {selectedQuiz.status === 'active' ? (
                   <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Hoạt động</span>
                ) : (
                   <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Bản nháp</span>
                )}
              </div>
              <div className="space-y-4 mb-8">
                <div>
                  <h5 className="text-primary font-bold text-lg leading-tight mb-2">{selectedQuiz.title}</h5>
                  <p className="text-on-surface-variant text-sm mb-1">Khóa học: <span className="font-semibold text-on-surface">{selectedQuiz.course}</span></p>
                  <p className="text-on-surface-variant text-sm">Bài học: <span className="font-semibold text-on-surface">{selectedQuiz.lesson}</span></p>
                </div>
                <hr className="border-outline-variant/30" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface rounded-xl">
                    <p className="text-on-surface-variant text-[12px] font-medium">Số câu hỏi</p>
                    <p className="text-lg font-bold text-on-surface">{selectedQuiz.questions} câu</p>
                  </div>
                  <div className="p-3 bg-surface rounded-xl">
                    <p className="text-on-surface-variant text-[12px] font-medium">Thời gian</p>
                    <p className="text-lg font-bold text-on-surface">{selectedQuiz.duration}</p>
                  </div>
                  <div className="p-3 bg-surface rounded-xl">
                    <p className="text-on-surface-variant text-[12px] font-medium">Điểm đạt</p>
                    <p className="text-lg font-bold text-on-surface">{selectedQuiz.passRate}%</p>
                  </div>
                  <div className="p-3 bg-surface rounded-xl">
                    <p className="text-on-surface-variant text-[12px] font-medium">Điểm TB</p>
                    <p className="text-lg font-bold text-[#0058be]">{selectedQuiz.avgScore}</p>
                  </div>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-on-surface">Lượt làm bài</span>
                    <span className="text-primary font-bold text-sm">{selectedQuiz.attempts} / {selectedQuiz.totalStudents} học viên</span>
                  </div>
                  <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(selectedQuiz.attempts / selectedQuiz.totalStudents) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="col-span-2 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm">
                  <span className="material-symbols-outlined text-[20px]">edit_note</span> Chỉnh sửa Quiz
                </button>
                <button className="py-2.5 bg-surface-container text-on-surface rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all text-sm">
                  <span className="material-symbols-outlined text-[20px]">list_alt</span> Câu hỏi
                </button>
                <button className="py-2.5 bg-surface-container text-on-surface rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all text-sm">
                  <span className="material-symbols-outlined text-[20px]">visibility_off</span> Ẩn Quiz
                </button>
                <button className="col-span-2 py-2.5 bg-[#0058be] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0058be]/90 transition-all mt-2 text-sm">
                  <span className="material-symbols-outlined text-[20px]">bar_chart_4_bars</span> Xem kết quả chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Quiz Generation Section */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/50 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Tạo câu hỏi bằng AI</h3>
                  <p className="text-on-surface-variant text-sm mt-1">AI có thể tự động tạo câu hỏi quiz dựa trên nội dung bài học.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Chọn bài học</label>
                  <select className="w-full bg-surface border border-outline-variant rounded-xl py-2.5 px-4 focus:ring-primary focus:border-primary outline-none">
                    <option>Vòng lặp For/While</option>
                    <option>Cấu trúc rẽ nhánh</option>
                    <option>Xử lý String</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Số lượng</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-xl py-2.5 px-4 focus:ring-primary focus:border-primary outline-none" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Mức độ</label>
                  <select className="w-full bg-surface border border-outline-variant rounded-xl py-2.5 px-4 focus:ring-primary focus:border-primary outline-none">
                    <option>Trung bình</option>
                    <option>Dễ</option>
                    <option>Khó</option>
                  </select>
                </div>
              </div>
              <button className="w-full py-4 bg-gradient-to-r from-primary to-[#0058be] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:scale-[1.01] transition-transform active:scale-95">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span> Tạo câu hỏi bằng AI ngay
              </button>
            </div>
          </div>

          {/* Analytics Section (Đã hoàn thiện phần bị cắt) */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/50 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Thống kê kết quả Quiz</h3>
                <p className="text-on-surface-variant text-sm mt-1">Tổng quan hiệu suất học tập tháng này.</p>
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-xl transition-colors">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">78%</div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Tỉ lệ hoàn thành</p>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">Học viên đã hoàn thành Quiz</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">8.5</div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Điểm trung bình</p>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">Trên toàn bộ hệ thống</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}