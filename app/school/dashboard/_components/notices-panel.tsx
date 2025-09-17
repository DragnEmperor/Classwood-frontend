import Link from "next/link";
import { HiOutlineMegaphone } from "react-icons/hi2";
import type { Notice } from "@/types/api";
import { AddNoticeDialog } from "./add-notice-dialog";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function NoticesPanel({
  notices,
  canAdd,
}: {
  notices: Notice[];
  canAdd: boolean;
}) {
  const visible = notices.slice(0, 4);

  return (
    <div className="mb-10 min-h-[23.5rem] rounded-xl bg-white py-4 shadow-md">
      <div className="px-4">
        <div className="mx-2 flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-semibold">Announcement Board</h2>
          {canAdd ? <AddNoticeDialog /> : null}
        </div>

        <div className="pt-4">
          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No notices yet.</p>
          ) : (
            visible.map((notice) => {
              const d = new Date(notice.date_posted);
              return (
                <Link
                  key={notice.id}
                  href={`/school/notice/${notice.id}`}
                  className="block"
                >
                  <div className="flex items-center pt-4">
                    <HiOutlineMegaphone className="mr-4 h-6 w-6 text-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-md font-medium uppercase text-[#020410] sm:text-xl">
                        {notice.title}
                      </span>
                      <p className="ml-0 pt-1 text-xs text-[#8A8A8A] sm:text-sm">
                        {d.getDate()} {MONTHS[d.getMonth()]}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
