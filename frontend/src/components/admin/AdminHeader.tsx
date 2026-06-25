import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface AdminHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
}

function AdminHeader({ title, actionLabel, onAction, actionIcon = "add" }: AdminHeaderProps) {
  const [hasNotification] = useState(true);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-outline-variant/30 bg-surface/90 px-6 backdrop-blur-xl sm:px-8">
      {/* Search */}
      <div className="hidden w-full max-w-md items-center gap-3 sm:flex">
        <div className="relative w-full">
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
            aria-hidden={true}
          >
            search
          </span>
          <input
            type="search"
            name="adminSearch"
            placeholder="Tìm kiếm..."
            className="h-12 w-full rounded-full border border-outline-variant/30 bg-surface-container-low pl-12 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <h1 className="font-semibold text-on-surface text-base sm:hidden">{title}</h1>
      {/* Right controls */}
      <div className="ml-auto flex items-center gap-4 sm:gap-5">
        {/* Notification */}
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="Xem thông báo"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden={true}>notifications</span>
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface" />
          )}
        </button>
        <div className="h-8 w-px bg-outline-variant/30" />
        {/* Admin info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">
              {user?.fullName ?? "Quản trị viên"}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              {user?.email ?? "admin@test.com"}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-[22px]" aria-hidden={true}>
              admin_panel_settings
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
