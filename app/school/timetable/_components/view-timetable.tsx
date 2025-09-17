"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import type { Classroom, CommonTime, PaginatedResponse, TimeTable } from "@/types/api";
import {normalizeList} from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type TimetablePeriod = TimeTable | null;

type TimetableRow =
  | {
      kind: "periods";
      key: string;
      start_time: string;
      end_time: string;
      periods: TimetablePeriod[];
    }
  | {
      kind: "common";
      key: string;
      start_time: string;
      end_time: string;
      subject: string;
    };

function classLabel(classroom: Classroom | null) {
  if (!classroom) return "";
  return `${classroom.class_name} ${classroom.section_name ?? classroom.section ?? ""}`.trim();
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

function buildTimetableRows(periods: TimeTable[], commonRows: CommonTime[]): TimetableRow[] {
  const grouped = new Map<string, TimetableRow>();

  for (const period of periods) {
    const key = `${period.start_time}-${period.end_time}`;
    const existing = grouped.get(key);
    const row =
      existing?.kind === "periods"
        ? existing
        : {
            kind: "periods" as const,
            key,
            start_time: period.start_time,
            end_time: period.end_time,
            periods: Array<TimetablePeriod>(DAYS.length).fill(null),
          };

    const dayIndex = Number.parseInt(period.day, 10);
    if (dayIndex >= 0 && dayIndex < DAYS.length) row.periods[dayIndex] = period;
    grouped.set(key, row);
  }

  const common = commonRows.map<TimetableRow>((row) => ({
    kind: "common",
    key: `common-${row.id}`,
    start_time: row.start_time,
    end_time: row.end_time,
    subject: row.subject,
  }));

  return [...grouped.values(), ...common].sort((a, b) =>
    `${a.start_time}-${a.end_time}`.localeCompare(`${b.start_time}-${b.end_time}`),
  );
}

export function ViewTimetable({
  setTimetableState,
}: {
  setTimetableState: (state: 0 | 1) => void;
}) {
  const [selectedClassId, setSelectedClassId] = useState("");

  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => clientFetch<Classroom[] | PaginatedResponse<Classroom>>("list/classroom/"),
  });

  const classrooms = useMemo(() => normalizeList(classroomsQuery.data), [classroomsQuery.data]);
  const selectedClass = classrooms.find((item) => item.id === selectedClassId) ?? classrooms[0] ?? null;

  useEffect(() => {
    if (!selectedClassId && classrooms.length > 0) setSelectedClassId(classrooms[0].id);
  }, [classrooms, selectedClassId]);

  const timetableQuery = useQuery({
    queryKey: ["timetable", selectedClass?.id],
    queryFn: () =>
      clientFetch<TimeTable[] | PaginatedResponse<TimeTable>>(
        `staff/timeTable/?classroom=${selectedClass?.id}`,
      ),
    enabled: Boolean(selectedClass?.id),
  });

  const commonTimeQuery = useQuery({
    queryKey: ["commontime", selectedClass?.id],
    queryFn: () =>
      clientFetch<CommonTime[] | PaginatedResponse<CommonTime>>(
        `staff/commontime/?classroom=${selectedClass?.id}`,
      ),
    enabled: Boolean(selectedClass?.id),
  });

  const rows = useMemo(
    () =>
      buildTimetableRows(
        normalizeList(timetableQuery.data),
        normalizeList(commonTimeQuery.data),
      ),
    [commonTimeQuery.data, timetableQuery.data],
  );

  const isLoading =
    classroomsQuery.isLoading ||
    timetableQuery.isLoading ||
    commonTimeQuery.isLoading
  const hasError = classroomsQuery.isError || timetableQuery.isError || commonTimeQuery.isError;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-red-600">
        Unable to load timetable data.
      </div>
    );
  }

  if (classrooms.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Please create a classroom first.
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Timetable</h1>
        <button
          type="button"
          onClick={() => setTimetableState(1)}
          className="w-fit rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          Add Timetable
        </button>
      </div>

      <div className="mt-6 max-w-md">
        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="classroom">
          Class
        </label>
        <select
          id="classroom"
          value={selectedClass?.id ?? ""}
          onChange={(event) => setSelectedClassId(event.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classLabel(classroom)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">{classLabel(selectedClass)}</h2>

        {rows.length === 0 ? (
          <div className="flex h-[45vh] items-center justify-center text-gray-600">
            No timetable for this class.
          </div>
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
