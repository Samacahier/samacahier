import type { ReactNode } from "react";
import BottomNav from "@/components/navigation/BottomNav";

export default function CommercantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
