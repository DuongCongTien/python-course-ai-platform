import os

# Danh sách cấu trúc thư mục và file Frontend React + TypeScript
fe_files = [
    # 1. Cấu hình nền tảng ở thư mục gốc src
    "frontend/src/main.tsx",
    "frontend/src/App.tsx",
    "frontend/src/index.css",
    
    # 2. Cấu hình API và Endpoint
    "frontend/src/config/api.ts",
    
    # 3. Quản lý trạng thái và Xác thực (AuthContext)
    "frontend/src/context/AuthContext.tsx",
    
    # 4. Custom Hooks và Types
    "frontend/src/hooks/useFetch.ts",
    "frontend/src/types/index.ts",
    
    # 5. Các Component dùng chung (Common)
    "frontend/src/components/common/Navbar.tsx",
    "frontend/src/components/common/Sidebar.tsx",
    "frontend/src/components/common/Loading.tsx",
    "frontend/src/components/protected/ProtectedRoute.tsx",
    
    # 6. Tầng dịch vụ API Services
    "frontend/src/services/auth.service.ts",
    "frontend/src/services/course.service.ts",
    "frontend/src/services/chat.service.ts",
    
    # 7. Các Module Tính năng (Features)
    # Auth Feature (Tuần 2)
    "frontend/src/features/auth/pages/LoginPage.tsx",
    "frontend/src/features/auth/pages/RegisterPage.tsx",
    
    # Courses Feature (Tuần 2)
    "frontend/src/features/courses/pages/CourseListPage.tsx",
    "frontend/src/features/courses/pages/CourseDetailPage.tsx",
    "frontend/src/features/courses/components/CourseCard.tsx",
    
    # Learning Feature (Tuần 3 -> Tuần 6 trọng tâm AI)
    "frontend/src/features/learning/pages/VideoLearningPage.tsx",
    "frontend/src/features/learning/components/VideoPlayer.tsx",
    "frontend/src/features/learning/components/TranscriptView.tsx",
    "frontend/src/features/learning/components/ChatbotWidget.tsx",
    "frontend/src/features/learning/components/SummaryBox.tsx",
    "frontend/src/features/learning/components/QuizSection.tsx",
    
    # Admin Feature (Tuần 3 quản lý video/bài học)
    "frontend/src/features/admin/pages/AdminDashboard.tsx",
    "frontend/src/features/admin/pages/ManageCourses.tsx",
    "frontend/src/features/admin/components/UploadVideoForm.tsx",
    
    # Assets tĩnh & file môi trường
    "frontend/src/assets/.gitkeep",
    "frontend/.env"
]

print("⏳ Đang khởi tạo cấu trúc thư mục và file FRONTEND tự động...")

for file_path in fe_files:
    dir_name = os.path.dirname(file_path)
    
    # Tự động tạo thư mục nếu chưa có
    if dir_name and not os.path.exists(dir_name):
        os.makedirs(dir_name, exist_ok=True)
        print(f"  📁 Đã tạo thư mục: {dir_name}")
        
    # Tạo file trống nếu chưa có
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            pass
        print(f"  📄 Đã tạo file: {file_path}")

print("\n✨ Hoàn thành! Cấu trúc Frontend React + TS đã sẵn sàng để phân chia task.")