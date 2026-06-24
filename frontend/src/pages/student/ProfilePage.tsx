import { useState } from "react";
import { Braces, ChevronDown, Menu, Search, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import AccountActions from "../../components/profile/AccountActions";
import PremiumStatusCard from "../../components/profile/PremiumStatusCard";
import ProfileHeaderCard from "../../components/profile/ProfileHeaderCard";
import ProfileInfoForm from "../../components/profile/ProfileInfoForm";
import RecentActivitiesCard from "../../components/profile/RecentActivitiesCard";
import SecurityForm from "../../components/profile/SecurityForm";
import {
  type PasswordFormData,
  type PasswordFormErrors,
  type ProfileFormData,
  type RecentActivity,
} from "../../components/profile/profileTypes";

const activities: RecentActivity[] = [
  {
    id: "activity-1",
    title: "Đã xem: Bài 2 - Biến và Kiểu dữ liệu",
    time: "2 giờ trước • 15 phút",
    icon: "play_circle",
    type: "video",
  },
  {
    id: "activity-2",
    title: "Hoàn thành Quiz: Vòng lặp for - 8/10",
    time: "Hôm qua • Khóa học Python cơ bản",
    icon: "task_alt",
    type: "quiz",
  },
  {
    id: "activity-3",
    title: "Hỏi AI: Cách dùng list comprehension",
    time: "2 ngày trước • AI Assistant",
    icon: "smart_toy",
    type: "ai",
  },
];

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
];

function ProfilePage() {
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    fullName: "Nguyễn Văn A",
    email: "nguyen.vana@example.com",
    phone: "090 123 4567",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});

  const handleProfileSubmit = () => {
    console.log("Profile update data:", profileForm);
  };

  const handleSecuritySubmit = () => {
    const nextErrors: PasswordFormErrors = {};
    const hasNewPassword = Boolean(passwordForm.newPassword || passwordForm.confirmPassword);

    if (hasNewPassword && !passwordForm.currentPassword) {
      nextErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }

    if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
      nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }

    if (hasNewPassword && passwordForm.confirmPassword !== passwordForm.newPassword) {
      nextErrors.confirmPassword = "Xác nhận mật khẩu không khớp.";
    }

    setPasswordErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      console.log("Security update data:", passwordForm);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="page-container py-10 sm:py-14">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Hồ sơ cá nhân</h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Quản lý thông tin tài khoản và theo dõi tiến trình học tập của bạn.
            </p>
          </div>
        </section>

        <section className="page-container grid gap-7 py-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-10">
          <div className="space-y-7">
            <ProfileHeaderCard />
            <ProfileInfoForm data={profileForm} onChange={setProfileForm} onSubmit={handleProfileSubmit} />
            <SecurityForm
              data={passwordForm}
              errors={passwordErrors}
              onChange={(nextData) => {
                setPasswordForm(nextData);
                setPasswordErrors({});
              }}
              onSubmit={handleSecuritySubmit}
            />
          </div>

          <aside className="space-y-7">
            <RecentActivitiesCard activities={activities} />
            <AccountActions />
            <PremiumStatusCard />
          </aside>
        </section>
      </main>

    </div>
  );
}

function ProfileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="page-container flex h-[72px] items-center justify-between gap-4 py-3">
        <Link to="/" className="focus-ring flex shrink-0 items-center gap-2 rounded-lg" aria-label="Python AI Learning">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <Braces size={21} strokeWidth={2.5} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
            Python <span className="text-indigo-600">AI</span> Learning
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring rounded px-1 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative hidden max-w-xs flex-1 xl:block">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Tìm kiếm khóa học..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <button
          type="button"
          className="hidden items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 transition hover:bg-indigo-50 sm:flex"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-xs font-extrabold text-white">
            NA
          </span>
          <span className="hidden text-sm font-bold text-slate-700 md:inline">Nguyễn Văn A</span>
          <ChevronDown size={17} className="text-slate-500" />
        </button>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="page-container flex flex-col gap-1 border-t border-slate-100 bg-white py-4 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function ProfileFooter() {
  const links = ["Về chúng tôi", "Điều khoản", "Chính sách bảo mật"];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-extrabold text-slate-950">Python AI Learning</p>
          <p className="mt-1 text-sm text-slate-500">
            © 2024 Python AI Learning. Nền tảng học tập Python & AI.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link key={link} to="/" className="text-sm font-medium text-slate-500 transition hover:text-indigo-600">
              {link}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default ProfilePage;
