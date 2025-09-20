"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import {DAYS} from "@/lib/constants";
import Loading from "@/app/_components/loader";
import CenteredText from "@/app/_components/centered-text";
import {buildTimetableRows, formatTime} from "@/app/school/timetable/_components/view-timetable/utils";
import type { Classroom, CommonTime, TimeTable } from "@/types/api";

export default function StaffTimetablePage() {
  const [selectedClassId, setSelectedClassId] = useState("");

  const classroomsQuery = useQuery({
    queryKey: ["staff", "classrooms"],
    queryFn: () => clientFetchPage<Classroom>("staff/classroom/", { pageSize: 100 }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.results ?? [], [classroomsQuery.data]);
  const selectedClass = classrooms.find((item) => item.id === selectedClassId) ?? classrooms[0] ?? null;

  useEffect(() => {
    if (!selectedClassId && classrooms.length > 0) setSelectedClassId(classrooms[0].id);
  }, [classrooms, selectedClassId]);

  const timetableQuery = useQuery({
    queryKey: ["staff", "timetable", selectedClass?.id],
    queryFn: () =>
      clientFetchPage<TimeTable>(`staff/timeTable/?classroom=${selectedClass?.id}`, { pageSize: 100 }),
    enabled: Boolean(selectedClass?.id),
  });

  const commonTimeQuery = useQuery({
    queryKey: ["staff", "commontime", selectedClass?.id],
    queryFn: () =>
      clientFetchPage<CommonTime>(`staff/commontime/?classroom=${selectedClass?.id}`, { pageSize: 100 }),
    enabled: Boolean(selectedClass?.id),
  });

  const rows = useMemo(
    () =>
      buildTimetableRows(
        timetableQuery.data?.results ?? [],
        commonTimeQuery.data?.results ?? [],
      ),
    [commonTimeQuery.data, timetableQuery.data],
  );

  const isPending = classroomsQuery.isPending || timetableQuery.isPending || commonTimeQuery.isPending;
  const hasError = classroomsQuery.isError || timetableQuery.isError || commonTimeQuery.isError;

  if (isPending) return <Loading />;
  if (hasError) return <CenteredText className="text-red-600" text="Unable to load timetable." />;
  if (classrooms.length === 0) return <CenteredText text="No classroom assigned." />;

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Timetable</h1>
          <p className="mt-1 text-sm text-gray-500">Read-only timetable for your assigned classes.</p>
        </div>
        <div className="w-full max-w-md">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="classroom">
            Class
          </label>
          <select
            id="classroom"
            value={selectedClass?.id ?? ""}
            onChange={(event) => setSelectedClassId(event.target.value)}
            className="input"
          >
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classLabel(classroom)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">{classLabel(selectedClass)}</h2>

        {rows.length === 0 ? (
          <CenteredText text="No timetable for this class." />
        ) : (
          <div className="mt-6 overflow-x-auto rounded-md border bg-white">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[150px_repeat(6,minmax(130px,1fr))] border-b bg-gray-50 text-sm font-semibold text-gray-700">
                <div className="px-4 py-3">Time</div>
                {DAYS.map((day) => (
                  <div key={day} className="px-4 py-3 text-center">
                    {day}
                  </div>
                ))}
              </div>

              {rows.map((row) => (
                <div
                  key={row.key}
                  className="grid grid-cols-[150px_repeat(6,minmax(130px,1fr))] border-b last:border-b-0"
                >
                  <div className="border-r px-4 py-4 text-sm font-medium text-gray-600">
                    {formatTime(row.start_time)} - {formatTime(row.end_time)}
                  </div>

                  {row.kind === "common" ? (
                    <div className="col-span-6 px-4 py-3">
                      <div className="rounded-md border-l-4 border-amber-500 bg-amber-50 px-4 py-3">
                        <div className="font-medium text-gray-900">{row.subject}</div>
                      </div>
                    </div>
                  ) : (
                    row.periods.map((period, index) => (
                      <div key={`${row.key}-${DAYS[index]}`} className="border-r px-3 py-3 last:border-r-0">
                        <div className="min-h-20 rounded-md border-l-4 border-indigo-600 bg-gray-50 px-3 py-3 shadow-sm">
                          <div className="font-medium text-gray-900">
                            {period?.subject ?? "No Subject"}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {period ? period.teacher : "Free Class"}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
