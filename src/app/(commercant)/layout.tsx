import type { ReactNode } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import Sidebar from "@/components/navigation/Sidebar";
import MobileHeader from "@/components/navigation/MobileHeader";
import { createClient } from "@/lib/supabase/server";
import { getCommercant } from "@/lib/commercants/queries";

export default async function CommercantLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const commercant = user ? await getCommercant(user.id) : null;

  return (
    <div className="min-h-screen bg-page pt-[72px] pb-16 text-ink lg:pt-0 lg:pb-0 lg:pl-64">
      <MobileHeader nomCommerce={commercant?.nom_commerce ?? ""} email={user?.email ?? ""} />
      {children}
      <BottomNav />
      <Sidebar />
    </div>
  );
}
