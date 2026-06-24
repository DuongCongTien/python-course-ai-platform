import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/admin/AdminLayout";

import HomePage from "../pages/HomePage";

// Auth
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Student
import AIAssistantPage from "../pages/student/AIAssistantPage";
import CourseDetailPage from "../pages/student/CourseDetailPage";
import CourseListPage from "../pages/student/CourseListPage";
import LessonTranscriptPage from "../pages/student/LessonTranscriptPage";
import LearningPage from "../pages/student/LearningPage";
import MyProgressPage from "../pages/student/MyProgressPage";
import ProfilePage from "../pages/student/ProfilePage";
import QuizPage from "../pages/student/QuizPage";

// Admin
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import CourseManagementPage from "../pages/admin/CourseManagementPage";
import LessonManagementPage from "../pages/admin/LessonManagementPage";
import VideoUploadPage from "../pages/admin/VideoUploadPage";
import VideoManagementPage from "../pages/admin/VideoManagementPage";
import QuizManagementPage from "../pages/admin/QuizManagementPage";
import StudentManagementPage from "../pages/admin/StudentManagementPage";

// Other
import ProtectedRoute from "./ProtectedRoute";
import StaticPlaceholderPage from "../pages/static/StaticPlaceholderPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public + Student */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Student */}
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />

        <Route
          path="/learning/:courseId/:lessonId"
          element={<LearningPage />}
        />

        <Route
          path="/learning/:courseId/:lessonId/transcript"
          element={<LessonTranscriptPage />}
        />

        <Route path="/quiz/:lessonId" element={<QuizPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-progress" element={<MyProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Static */}
        <Route
          path="/about"
          element={<StaticPlaceholderPage title="Về chúng tôi" />}
        />

        <Route
          path="/guide"
          element={<StaticPlaceholderPage title="Hướng dẫn" />}
        />

        <Route
          path="/terms"
          element={<StaticPlaceholderPage title="Điều khoản dịch vụ" />}
        />

        <Route
          path="/privacy"
          element={<StaticPlaceholderPage title="Chính sách bảo mật" />}
        />

        <Route
          path="/contact"
          element={<StaticPlaceholderPage title="Liên hệ" />}
        />
      </Route>

      {/* Admin routes: để riêng, KHÔNG nằm trong MainLayout */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/courses" element={<CourseManagementPage />} />
      <Route path="/admin/lessons" element={<LessonManagementPage />} />
      <Route path="/admin/upload" element={<VideoUploadPage />} />
      <Route path="/admin/videos" element={<VideoManagementPage />} />
      <Route path="/admin/quiz" element={<QuizManagementPage />} />
      <Route path="/admin/students" element={<StudentManagementPage />} />
    </Routes>
  );
}

export default AppRoutes;