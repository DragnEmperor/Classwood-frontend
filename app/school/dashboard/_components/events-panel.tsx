import Link from "next/link";
import type { SchoolEvent } from "@/types/api";
import { AddEventDialog } from "./add-event-dialog";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function EventsPanel({
  events,
  canAdd,
}: {
  events: SchoolEvent[];
  canAdd: boolean;
}) {
  const visible = events.slice(0, 4);

  return (
    <div className="mb-10 min-h-[23.5rem] rounded-xl bg-white py-4 shadow-md">
      <div className="px-4">
        <div className="mx-2 flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          {canAdd ? <AddEventDialog /> : null}
        </div>

        <div className="pt-4">
          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No events scheduled.</p>
          ) : (
            visible.map((event) => {
              const d = new Date(event.date);
              return (
                <Link key={event.id} href={`/school/event/${event.id}`} className="block">
                  <div className="flex items-start pt-4">
                    <div className="mr-6 flex flex-col items-center justify-center self-start rounded-md bg-[#F0F7FD] px-4 py-2 text-sm font-semibold text-[#76A5FF]">
                      <span>{d.getDate()}</span>
                      <span>{MONTHS[d.getMonth()]}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-md font-medium uppercase text-[#020410] sm:text-xl">
                        {event.title}
                      </span>
                      <p className="pt-1 text-xs text-[#8A8A8A] sm:text-sm">
                        {event.description}
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
