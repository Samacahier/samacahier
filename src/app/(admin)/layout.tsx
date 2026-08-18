import type { ReactNode } from "react";
import AdminSidebar from "@/components/navigation/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-ink lg:pl-64">
      {children}
      <AdminSidebar />
    </div>
  );
}
