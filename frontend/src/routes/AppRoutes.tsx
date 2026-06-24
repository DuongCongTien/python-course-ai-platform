import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AIAssistantPage from "../pages/student/AIAssistantPage";
import CourseDetailPage from "../pages/student/CourseDetailPage";
import CourseListPage from "../pages/student/CourseListPage";
import LessonTranscriptPage from "../pages/student/LessonTranscriptPage";
import LearningPage from "../pages/student/LearningPage";
import MyProgressPage from "../pages/student/MyProgressPage";
import ProfilePage from "../pages/student/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import QuizPage from "../pages/student/QuizPage";
import StaticPlaceholderPage from "../pages/static/StaticPlaceholderPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/learning/:courseId/:lessonId" element={<LearningPage />} />
        <Route path="/learning/:courseId/:lessonId/transcript" element={<LessonTranscriptPage />} />
        <Route path="/quiz/:lessonId" element={<QuizPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/my-progress" element={<MyProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/about" element={<StaticPlaceholderPage title="Về chúng tôi" />} />
        <Route path="/guide" element={<StaticPlaceholderPage title="Hướng dẫn" />} />
        <Route path="/terms" element={<StaticPlaceholderPage title="Điều khoản dịch vụ" />} />
        <Route path="/privacy" element={<StaticPlaceholderPage title="Chính sách bảo mật" />} />
        <Route path="/contact" element={<StaticPlaceholderPage title="Liên hệ" />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
