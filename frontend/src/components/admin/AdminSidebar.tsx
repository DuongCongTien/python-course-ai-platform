import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface AdminSidebarProps {
  aiSystemStatus?: "online" | "offline";
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: "Tổng quan", icon: "dashboard", to: "/admin" },
  { label: "Quản lý khóa học", icon: "menu_book", to: "/admin/courses" },
  { label: "Quản lý bài học", icon: "library_books", to: "/admin/lessons" },
  { label: "Tải video lên", icon: "smart_display", to: "/admin/upload" },
  { label: "Quản lý video & AI", icon: "video_library", to: "/admin/videos" },
  { label: "Quiz", icon: "quiz", to: "/admin/quiz" },
  { label: "Học viên", icon: "group", to: "/admin/students" },
];

function AdminSidebar({ aiSystemStatus = "online", isOpen = false, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <button
        type="button"
        aria-label="Đóng menu quản trị"
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 transform flex-col border-r border-outline-variant/30 bg-surface-container-low shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined text-[20px] text-white" aria-hidden={true}>
              admin_panel_settings
            </span>
          </div>
          <span className="font-headline-md font-bold tracking-tight text-primary">
            Xin chào!
            <br />
            Quản trị viên
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container lg:hidden"
            aria-label="Đóng menu quản trị"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden={true}>
              close
            </span>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {navItems.map((item) => {
            const isActive = item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden={true}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant/20 p-4">
          <div className="mb-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Hệ thống AI</p>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${aiSystemStatus === "online" ? "animate-pulse bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs font-medium text-on-surface-variant">
                {aiSystemStatus === "online" ? "Hoạt động bình thường" : "Đang offline"}
              </span>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-[20px]" aria-hidden={true}>
                admin_panel_settings
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-on-surface">{user?.fullName ?? "Quản trị viên"}</p>
              <p className="truncate text-xs text-on-surface-variant">{user?.email ?? "admin@test.com"}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary">Admin</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-error transition-colors hover:bg-error-container"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden={true}>
              logout
            </span>
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
