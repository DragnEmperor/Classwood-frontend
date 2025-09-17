"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineUserCircle } from "react-icons/hi2";

export function ProfileMenu() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] hover:bg-gray-100">
        <HiOutlineUserCircle className="h-8 w-8" />
      </MenuButton>
      <MenuItems className="absolute right-0 z-20 mt-2 w-44 rounded-lg border bg-white py-2 shadow-lg focus:outline-none">
        <MenuItem disabled>
          <span className="block cursor-not-allowed px-4 py-2 text-sm text-gray-400">
            View Profile (3.2)
          </span>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 disabled:opacity-60"
          >
            {pending ? "Logging out…" : "Logout"}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
