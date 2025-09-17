import Image from "next/image";
import { HiOutlineBell } from "react-icons/hi2";
import { apiFetch } from "@/lib/api";
import type { AccountProfile } from "@/types/api";
import { ProfileMenu } from "./profile-menu";

async function safeAccount(): Promise<AccountProfile | null> {
  try {
    return await apiFetch<AccountProfile>("account/");
  } catch {
    return null;
  }
}

function resolveLogoUrl(account: AccountProfile | null): string {
  const raw = account?.school_logo_url;
  if (!raw) return "/assets/profile.png";
  if (raw.startsWith("http")) return raw;
  const base = (process.env.API_URL ?? "").replace(/\/api\/?$/, "/");
  try {
    return new URL(raw, base).href;
  } catch {
    return "/assets/profile.png";
  }
}

export async function DashHeader() {
  const account = await safeAccount();
  const name = account?.school_name ?? "there";
  const logo = resolveLogoUrl(account);

  return (
    <div className="flex w-full items-center justify-between border-b-[0.5px] border-[#D9D9D9] bg-white p-10 py-6">
      <div className="flex flex-row items-center">
        <Image
          src={logo}
          width={56}
          height={56}
          alt={`${account?.school_name ?? "School"} logo`}
          className="mr-4 h-14 w-14 rounded-full border object-cover"
          unoptimized={logo.startsWith("http")}
        />
        <p className="text-2xl font-semibold sm:text-4xl">Hello {name}!</p>
      </div>
      <div className="flex flex-row items-center justify-center">
        <button
          type="button"
          aria-label="Notifications"
          className="mr-4 flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] hover:bg-gray-100"
        >
          <HiOutlineBell className="h-7 w-7" />
        </button>
        <ProfileMenu />
      </div>
    </div>
  );
}
