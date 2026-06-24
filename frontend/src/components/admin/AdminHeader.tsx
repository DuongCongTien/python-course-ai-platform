import { useState } from "react";

interface AdminHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
}

function AdminHeader({ title, actionLabel, onAction, actionIcon = "add" }: AdminHeaderProps) {
  const [hasNotification] = useState(true);

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0 z-20">
      {/* Search */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-56 focus:ring-2 focus:ring-primary/30 outline-none transition-all focus:w-72"
          />
        </div>
      </div>
      <h1 className="font-semibold text-on-surface text-base sm:hidden">{title}</h1>
      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">notifications</span>
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface" />
          )}
        </button>
        <div className="w-px h-6 bg-outline-variant/30" />
        {/* Admin info */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">Admin</p>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Quản trị viên</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border-2 border-primary/10 group-hover:border-primary transition-all">
            AD
          </div>
        </div>
        
      </div>
    </header>
  );
}

export default AdminHeader;