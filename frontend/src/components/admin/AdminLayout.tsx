import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto flex flex-col min-w-0">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;