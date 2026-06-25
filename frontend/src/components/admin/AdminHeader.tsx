import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAdminNavigation } from "./AdminLayout";

interface AdminHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
}

function AdminHeader({ title, actionLabel, onAction, actionIcon = "add" }: AdminHeaderProps) {
  const [hasNotification] = useState(true);
  const { user } = useAuth();
  const { openSidebar } = useAdminNavigation();

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between gap-3 border-b border-outline-variant/30 bg-surface/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={openSidebar}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container lg:hidden"
        aria-label="Mở điều hướng quản trị"
      >
        <span className="material-symbols-outlined text-[22px]" aria-hidden={true}>
          menu
        </span>
      </button>
      {/* Search */}
      <div className="hidden min-w-0 w-full max-w-md items-center gap-3 sm:flex">
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
      <h1 className="min-w-0 truncate font-semibold text-on-surface text-base sm:hidden">{title}</h1>
      {/* Right controls */}
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-95 sm:inline-flex"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden={true}>
              {actionIcon}
            </span>
            {actionLabel}
          </button>
        )}
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
        <div className="hidden h-8 w-px bg-outline-variant/30 sm:block" />
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
