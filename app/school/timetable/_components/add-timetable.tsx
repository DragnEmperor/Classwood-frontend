"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiTrash2, FiX } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { clientFetch } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import type { Classroom, PaginatedResponse, Subject } from "@/types/api";
import {normalizeList} from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface PeriodDraft {
  id: string;
  subjectId: string;
  start: string;
  end: string;
}

interface CommonDraft {
  id: string;
  subject: string;
  start: string;
  end: string;
}

function classLabel(classroom: Classroom | null) {
  if (!classroom) return "";
  return `${classroom.class_name} ${classroom.section_name ?? classroom.section ?? ""}`.trim();
}

function newPeriod(): PeriodDraft {
  return {
    id: crypto.randomUUID(),
    subjectId: "",
    start: "",
    end: "",
  };
}

function newCommonRow(): CommonDraft {
  return {
    id: crypto.randomUUID(),
    subject: "",
    start: "",
    end: "",
  };
}

function emptyTimetable() {
  return DAYS.map(() => [newPeriod()]);
}

function timeParts(value: string) {
  const [hour = "", minute = ""] = value.split(":");
  return { hour, minute };
}

function subjectTeacherId(subject: Subject) {
  if (subject.teacher_id === "not assigned") return null;
  return subject.teacher_id;
}

function validatePeriodRows(rows: PeriodDraft[][], subjects: Subject[]) {
  for (const dayRows of rows) {
    for (const row of dayRows) {
      if (!row.subjectId && !row.start && !row.end) continue;
      if (!row.subjectId || !row.start || !row.end) return false;
      if (row.start >= row.end) return false;
      if (!subjects.some((subject) => subject.id === row.subjectId)) return false;
    }
  }
  return true;
}

function buildTimetablePayload(rows: PeriodDraft[][], subjects: Subject[]) {
  return rows.map((dayRows) =>
    dayRows
      .filter((row) => row.subjectId && row.start && row.end)
      .map((row) => {
        const subject = subjects.find((item) => item.id === row.subjectId);
        const start = timeParts(row.start);
        const end = timeParts(row.end);

        return {
          subject: subject
            ? {
                id: subject.id,
                name: subject.name,
                teacher_id: subjectTeacherId(subject),
              }
            : { name: "No Subject Selected" },
          start,
          end,
        };
      }),
  );
}

function validateCommonRows(rows: CommonDraft[]) {
  for (const row of rows) {
    if (!row.subject && !row.start && !row.end) continue;
    if (!row.subject.trim() || !row.start || !row.end) return false;
    if (row.start >= row.end) return false;
  }
  return true;
}

function buildCommonPayload(rows: CommonDraft[]) {
  return rows
    .filter((row) => row.subject.trim() && row.start && row.end)
    .map((row) => ({
      subject: row.subject.trim(),
      start: timeParts(row.start),
      end: timeParts(row.end),
    }));
}

export function TimetableEditor({
  setTimetableState,
}: {
  setTimetableState: (state: 0 | 1) => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [rows, setRows] = useState<PeriodDraft[][]>(() => emptyTimetable());
  const [commonRows, setCommonRows] = useState<CommonDraft[]>(() => [newCommonRow()]);
  const [commonPanelOpen, setCommonPanelOpen] = useState(false);

  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => clientFetch<Classroom[] | PaginatedResponse<Classroom>>("list/classroom/"),
  });

  const classrooms = useMemo(() => normalizeList(classroomsQuery.data), [classroomsQuery.data]);
  const selectedClass = classrooms.find((item) => item.id === selectedClassId) ?? classrooms[0] ?? null;

  useEffect(() => {
    if (!selectedClassId && classrooms.length > 0) setSelectedClassId(classrooms[0].id);
  }, [classrooms, selectedClassId]);

  const subjectsQuery = useQuery({
    queryKey: ["subjects", selectedClass?.id],
    queryFn: () =>
      clientFetch<Subject[] | PaginatedResponse<Subject>>(
        `staff/subject/?classroom=${selectedClass?.id}`,
      ),
    enabled: Boolean(selectedClass?.id),
  });

  const subjects = useMemo(() => normalizeList(subjectsQuery.data), [subjectsQuery.data]);

  const saveTimetable = useMutation({
    mutationFn: async () => {
      if (!selectedClass) throw new Error("Select a class");
      if (!validatePeriodRows(rows, subjects)) {
        throw new Error("Complete every selected period and keep start time before end time.");
      }

      const timetable = buildTimetablePayload(rows, subjects);
      const filledRows = timetable.reduce((count, dayRows) => count + dayRows.length, 0);
      if (filledRows === 0) throw new Error("Add at least one period.");

      return clientFetch("staff/timeTable/", {
        method: "POST",
        body: {
          timetable,
          classroom: selectedClass.id,
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["timetable"] });
      toast.success("Timetable added successfully");
      setTimetableState(0);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error adding timetable");
    },
  });

  const saveCommonTime = useMutation({
    mutationFn: async () => {
      if (!selectedClass) throw new Error("Select a class");
      if (!validateCommonRows(commonRows)) {
        throw new Error("Complete every common row and keep start time before end time.");
      }

      const common = buildCommonPayload(commonRows);
      if (common.length === 0) throw new Error("Add at least one common timing row.");

      return clientFetch("staff/commontime/", {
        method: "POST",
        body: {
          common,
          classroom: selectedClass.id,
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["commontime"] });
      toast.success("Common timing added successfully");
      setCommonRows([newCommonRow()]);
      setCommonPanelOpen(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error adding common timing");
    },
  });

  function updatePeriod(rowId: string, field: keyof Omit<PeriodDraft, "id">, value: string) {
    setRows((current) =>
      current.map((dayRows, dayIndex) =>
        dayIndex === activeDay
          ? dayRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
          : dayRows,
      ),
    );
  }

  function addPeriodRow() {
    setRows((current) =>
      current.map((dayRows, dayIndex) =>
        dayIndex === activeDay ? [...dayRows, newPeriod()] : dayRows,
      ),
    );
  }

  function removePeriodRow(rowId: string) {
    setRows((current) =>
      current.map((dayRows, dayIndex) =>
        dayIndex === activeDay
          ? dayRows.length === 1
            ? [newPeriod()]
            : dayRows.filter((row) => row.id !== rowId)
          : dayRows,
      ),
    );
  }

  function updateCommonRow(rowId: string, field: keyof Omit<CommonDraft, "id">, value: string) {
    setCommonRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  }

  function removeCommonRow(rowId: string) {
    setCommonRows((current) =>
      current.length === 1 ? [newCommonRow()] : current.filter((row) => row.id !== rowId),
    );
  }

  if (classroomsQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
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
    <div className="relative px-4 py-8 md:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add Timetable</h1>
          <p className="mt-1 text-sm text-gray-500">{classLabel(selectedClass)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setCommonPanelOpen(true)}
            className="rounded-md border border-indigo-200 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Add Common Time
          </button>
          <button
            type="button"
            onClick={() => setTimetableState(0)}
            className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            View Timetable
          </button>
        </div>
      </div>

      <div className="mt-6 max-w-md">
        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="classroom">
          Class
        </label>
        <select
          id="classroom"
          value={selectedClass?.id ?? ""}
          onChange={(event) => {
            setSelectedClassId(event.target.value);
            setRows(emptyTimetable());
            setCommonRows([newCommonRow()]);
            setActiveDay(0);
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classLabel(classroom)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 overflow-hidden rounded-md border bg-white">
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {DAYS.map((day, index) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`min-w-32 border-r px-4 py-3 text-sm font-medium ${
                activeDay === index
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b text-left text-sm font-semibold text-gray-600">
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Teacher Assigned</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">End Time</th>
                <th className="w-20 px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows[activeDay].map((row) => {
                const selectedSubject = subjects.find((subject) => subject.id === row.subjectId);

                return (
                  <tr key={row.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <select
                        value={row.subjectId}
                        onChange={(event) => updatePeriod(row.id, "subjectId", event.target.value)}
                        disabled={subjectsQuery.isLoading}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">
                          {subjectsQuery.isLoading ? "Loading subjects..." : "Select subject"}
                        </option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="rounded-md border bg-gray-50 px-3 py-2 text-gray-700">
                        {selectedSubject?.teacher ?? "Not assigned"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={row.start}
                        onChange={(event) => updatePeriod(row.id, "start", event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={row.end}
                        onChange={(event) => updatePeriod(row.id, "end", event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removePeriodRow(row.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                        aria-label="Delete row"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t px-4 py-4 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={addPeriodRow}
            className="inline-flex w-fit items-center rounded-md px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
          >
            <IoMdAddCircleOutline className="mr-2" />
            Add Row
          </button>
          <button
            type="button"
            onClick={() => saveTimetable.mutate()}
            disabled={saveTimetable.isPending}
            className="rounded-md bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveTimetable.isPending ? "Submitting..." : "Submit Timetable"}
          </button>
        </div>
      </div>

      {subjectsQuery.isSuccess && subjects.length === 0 ? (
        <p className="mt-4 text-sm text-amber-700">
          No subjects are configured for this class yet.
        </p>
      ) : null}

      {commonPanelOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30">
          <div className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">Common School Timing</h2>
                <p className="mt-1 text-sm text-gray-500">{classLabel(selectedClass)}</p>
              </div>
              <button
                type="button"
                onClick={() => setCommonPanelOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                aria-label="Close common timing panel"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-[1fr_160px_160px_56px] gap-4 text-sm font-semibold text-gray-600">
                <span>Subject</span>
                <span>Start Time</span>
                <span>End Time</span>
                <span />
              </div>

              <div className="mt-3 space-y-3">
                {commonRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1fr_160px_160px_56px] gap-4"
                  >
                    <input
                      value={row.subject}
                      onChange={(event) => updateCommonRow(row.id, "subject", event.target.value)}
                      placeholder="Recess"
                      className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="time"
                      value={row.start}
                      onChange={(event) => updateCommonRow(row.id, "start", event.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="time"
                      value={row.end}
                      onChange={(event) => updateCommonRow(row.id, "end", event.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeCommonRow(row.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                      aria-label="Delete common timing row"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCommonRows((current) => [...current, newCommonRow()])}
                className="mt-5 inline-flex items-center rounded-md px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
              >
                <IoMdAddCircleOutline className="mr-2" />
                Add Row
              </button>
            </div>

            <div className="border-t px-6 py-5">
              <button
                type="button"
                onClick={() => saveCommonTime.mutate()}
                disabled={saveCommonTime.isPending}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveCommonTime.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
