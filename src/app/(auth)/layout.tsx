import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-page px-4 py-8 text-ink">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
