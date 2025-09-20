import Image from "next/image";
import { HiOutlineBell } from "react-icons/hi2";
import { ProfileMenu } from "@/app/school/_components/profile-menu";
import { apiFetch } from "@/lib/api";
import type { Staff } from "@/types/api";

function resolveProfileUrl(staff: Staff | null): string {
  const raw = staff?.profile_pic_url ?? staff?.profile_pic;
  if (!raw) return "/assets/profile.png";
  if (raw.startsWith("http")) return raw;
  const base = (process.env.API_URL ?? "").replace(/\/api\/?$/, "/");
  try {
    return new URL(raw, base).href;
  } catch {
    return "/assets/profile.png";
  }
}

export async function StaffHeader() {
  let staff: Staff | null = null;
  try {
    staff = await apiFetch<Staff>("staff/me");
  } catch {
    return null;
  }
  const name = staff ? `${staff.first_name} ${staff.last_name}`.trim() : "there";
  const profileUrl = resolveProfileUrl(staff);

  return (
    <div className="flex w-full items-center justify-between border-b-[0.5px] border-[#D9D9D9] bg-white p-10 py-6">
      <div className="flex min-w-0 flex-row items-center">
        <Image
          src={profileUrl}
          width={56}
          height={56}
          alt={`${name} profile`}
          className="mr-4 h-14 w-14 rounded-full border object-cover"
          unoptimized={profileUrl.startsWith("http")}
        />
        <div className="min-w-0">
          <p className="truncate text-2xl font-semibold sm:text-4xl">Hello {name}!</p>
          <p className="mt-1 text-sm text-gray-500">Staff workspace</p>
        </div>
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
