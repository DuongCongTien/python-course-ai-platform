import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AccountActions() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      console.log("Logging out...");
      navigate("/login");
    }
  };

  return (
    <section className="grid gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card">
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
      >
        <Settings size={17} />
        Cài đặt tài khoản
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
      >
        <LogOut size={17} />
        Đăng xuất
      </button>
    </section>
  );
}

export default AccountActions;
