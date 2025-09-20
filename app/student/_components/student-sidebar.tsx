"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  AiOutlineBook,
  AiOutlineCreditCard,
  AiOutlineDashboard,
  AiOutlineEdit,
  AiOutlineMessage,
} from "react-icons/ai";
import type { ComponentType } from "react";

interface NavItem {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { href: "/student/dashboard", label: "Dashboard", Icon: AiOutlineDashboard },
  { href: "/student/subject", label: "My Courses", Icon: AiOutlineBook },
  { href: "/student/test", label: "Test/Exam", Icon: AiOutlineEdit },
  { href: "/student/fees", label: "Fee Payment", Icon: AiOutlineCreditCard },
  { href: "/student/message", label: "Messages", Icon: AiOutlineMessage },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-10 hidden h-screen w-[21rem] flex-col items-center overflow-y-auto bg-[#1E293B] p-10 px-4 lg:flex">
      <div className="mt-12 w-full gap-y-2 pb-10 text-gray-200">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "mx-4 my-1 flex w-full items-center justify-start rounded-xl p-4 text-center duration-300 ease-in-out hover:bg-gray-700",
                active && "bg-gray-700",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="ml-4 select-none text-lg font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
