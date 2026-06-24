import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import CourseManagementPage from "../pages/admin/CourseManagementPage";
import LessonManagementPage from "../pages/admin/LessonManagementPage";
import VideoUploadPage from "../pages/admin/VideoUploadPage";
import VideoManagementPage from "../pages/admin/VideoManagementPage";
import QuizManagementPage from "../pages/admin/QuizManagementPage";
import StudentManagementPage from "../pages/admin/StudentManagementPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Admin module */}
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