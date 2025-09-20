import type { ReactNode } from "react";
import { ToastProvider } from "@/app/_components/toast-provider";
import { requireSession } from "@/lib/auth";
import { StaffHeader } from "./_components/staff-header";
import { StaffSidebar } from "./_components/staff-sidebar";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  await requireSession();

  return (
    <div className="flex">
      <ToastProvider>
        <StaffSidebar />
        <main className="min-h-screen flex-1 bg-[rgb(248,248,248)] lg:ml-[21rem]">
          <StaffHeader />
          {children}
        </main>
      </ToastProvider>
    </div>
  );
}
