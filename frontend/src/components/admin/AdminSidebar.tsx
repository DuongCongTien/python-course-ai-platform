import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
    aiSystemStatus?: "online" | "offline";
}

const navItems = [
    { label: "Tổng quan", icon: "dashboard", to: "/admin" },
    { label: "Quản lý khóa học", icon: "menu_book", to: "/admin/courses" },
    { label: "Quản lý bài học", icon: "library_books", to: "/admin/lessons" },
    { label: "Upload video", icon: "smart_display", to: "/admin/upload" },
    { label: "Quản lý video & AI", icon: "video_library", to: "/admin/videos" },
    { label: "Quiz", icon: "quiz", to: "/admin/quiz" },
    { label: "Học viên", icon: "group", to: "/admin/students" },
];

function AdminSidebar({ aiSystemStatus = "online" }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Phải xóa sạch Token / Session đã lưu khi đăng nhập thành công
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Xóa tùy theo cách bạn lưu dữ liệu auth

        // 2. Chuyển hướng và XÓA LỊCH SỬ trang admin vừa đứng
        navigate("/", { replace: true });
    };

    return (
        <aside className="hidden lg:flex w-64 flex-col bg-surface-container-low border-r border-outline-variant/30 h-screen sticky top-0 shrink-0">
            {/* Logo */}
            <div className="px-6 py-8 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                    <span className="material-symbols-outlined text-white text-[20px]">
                        person
                    </span>
                </div>
                <span className="font-headline-md font-bold text-primary tracking-tight">Xin chào!
                    <br />Quản Trị Viên</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive =
                        item.to === "/admin"
                            ? location.pathname === "/admin"
                            : location.pathname.startsWith(item.to);

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                                }`}
                        >
                            <span
                                className="material-symbols-outlined text-[22px]"
                                style={
                                    isActive
                                        ? { fontVariationSettings: "'FILL' 1" }
                                        : undefined
                                }
                            >
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* AI System Status */}
            <div className="p-4 border-t border-outline-variant/20">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mb-3">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Hệ thống AI</p>
                    <div className="flex items-center gap-2">
                        <span
                            className={`w-2 h-2 rounded-full ${aiSystemStatus === "online" ? "bg-green-500 animate-pulse" : "bg-red-500"
                                }`}
                        />
                        <span className="text-xs text-on-surface-variant font-medium">
                            {aiSystemStatus === "online" ? "Hoạt động bình thường" : "Đang offline"}
                        </span>
                    </div>
                </div>

                {/* Admin avatar */}
                <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        AD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate text-on-surface">Admin User</p>
                        <p className="text-xs text-on-surface-variant truncate">Quản trị viên</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-on-surface-variant hover:text-error transition-colors"
                        title="Đăng xuất"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;