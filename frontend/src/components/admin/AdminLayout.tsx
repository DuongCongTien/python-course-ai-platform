import { type ReactNode, createContext, useContext, useState } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminNavigationContextValue {
  openSidebar: () => void;
}

const AdminNavigationContext = createContext<AdminNavigationContextValue | null>(null);

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminNavigationContext.Provider value={{ openSidebar: () => setIsSidebarOpen(true) }}>
      <div className="flex min-h-screen overflow-hidden bg-background">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);

  if (!context) {
    throw new Error("useAdminNavigation must be used within AdminLayout");
  }

  return context;
}

export default AdminLayout;
