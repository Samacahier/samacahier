import type { ReactNode } from "react";
import BottomNav from "@/components/navigation/BottomNav";

export default function CommercantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page pb-16 text-ink">
      {children}
      <BottomNav />
    </div>
  );
}
