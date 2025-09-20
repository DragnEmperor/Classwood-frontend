import type { ReactNode } from "react";
import { ToastProvider } from "@/app/_components/toast-provider";
import { requireSession } from "@/lib/auth";
import { StudentHeader } from "./_components/student-header";
import { StudentSidebar } from "./_components/student-sidebar";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await requireSession();

  return (
    <div className="flex">
      <ToastProvider>
        <StudentSidebar />
        <main className="min-h-screen flex-1 bg-[rgb(248,248,248)] lg:ml-[21rem]">
          <StudentHeader />
          {children}
        </main>
      </ToastProvider>
    </div>
  );
}
