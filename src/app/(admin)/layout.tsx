import type { ReactNode } from "react";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import AdminMobileHeader from "@/components/navigation/AdminMobileHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page pt-[72px] text-ink lg:pt-0 lg:pl-64">
      <AdminMobileHeader />
      {children}
      <AdminSidebar />
    </div>
  );
}
