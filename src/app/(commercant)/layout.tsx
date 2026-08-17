import type { ReactNode } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import Sidebar from "@/components/navigation/Sidebar";

export default function CommercantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page pb-16 text-ink lg:pb-0 lg:pl-60">
      {children}
      <BottomNav />
      <Sidebar />
    </div>
  );
}
