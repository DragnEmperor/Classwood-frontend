import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth";
import { SchoolSidebar } from "./_components/sidebar";

export default async function SchoolLayout({ children }: { children: ReactNode }) {
  await requireSession();
  return (
    <div className="flex">
      <SchoolSidebar />
      <main className="flex-1 bg-[rgb(248,248,248)] lg:ml-[21rem]" style={{ minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
