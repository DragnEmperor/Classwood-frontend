"use client";

import { useEffect, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/_components/toast-provider";
import type { Classroom, Student } from "@/types/api";
import CenteredText from "@/app/_components/centered-text";
import PaginationControls from "@/app/_components/pagination";

const STUDENTS_PAGE_SIZE = 20;

export default function ClassroomDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const studentsQuery = useQuery({
    queryKey: ["staff", "students", classroom.id, page, STUDENTS_PAGE_SIZE],
    queryFn: () => clientFetchPage<Student>(`staff/student/?classroom=${classroom.id}`, { page, pageSize: STUDENTS_PAGE_SIZE }),
  });
  const students = useMemo(() => studentsQuery.data?.results ?? [], [studentsQuery.data]);
  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        `${student.roll_no} ${student.first_name} ${student.last_name}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [students, searchQuery],
  );

  const todayDate = new Date().toISOString().slice(0, 10);
  const todayIndex = new Date().getDate() - 1;

  const mutation = useMutation({
    mutationFn: async () => {
      const entries = students.filter((student) => attendance[String(student.user.id)] !== undefined);
      if (!entries.length) throw new Error("Mark at least one student.");
      for (const student of entries) {
        await clientFetch("staff/studentAttendance/", {
          method: "POST",
          body: {
            date: todayDate,
            present: attendance[String(student.user.id)],
            student: student.user.id,
            classroom: classroom.id,
          },
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff", "students", classroom.id] });
      toast.success("Attendance saved successfully");
      setAttendance({});
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to save attendance"),
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-4xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">{classLabel(classroom)}</h2>
            <p className="mt-1 text-sm text-gray-500">Students and attendance for {todayDate}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <FiX />
          </button>
        </div>

        <div className="border-b px-6 py-4">
          <div className="relative text-gray-600 focus-within:text-gray-500">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <AiOutlineSearch />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-md border bg-white py-2 pl-10 pr-3 text-sm text-gray-900 focus:outline-none"
              placeholder="Search students"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {studentsQuery.isPending ? (
            <CenteredText text="Loading students..." />
          ) : filteredStudents.length === 0 ? (
            <CenteredText text="No students found." />
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const key = String(student.user.id);
                const existing = student.month_attendance?.[todayIndex];
                return (
                  <div key={key} className="flex flex-col gap-3 rounded-md border px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold">
                        {student.roll_no} · {student.first_name} {student.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {existing === 2 ? "Already present" : existing === 1 ? "Already absent" : "Not marked"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAttendance((current) => ({ ...current, [key]: true }))}
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                          attendance[key] === true ? "bg-green-600 text-white" : "bg-green-50 text-green-700"
                        }`}
                      >
                        <FiCheck className="mr-1" />
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendance((current) => ({ ...current, [key]: false }))}
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                          attendance[key] === false ? "bg-red-600 text-white" : "bg-red-50 text-red-700"
                        }`}
                      >
                        <FiX className="mr-1" />
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 border-t px-6 py-5">
          <PaginationControls
            page={page}
            pageSize={STUDENTS_PAGE_SIZE}
            total={studentsQuery.data?.count ?? 0}
            isLoading={studentsQuery.isFetching}
            onPageChange={setPage}
          />
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </aside>
    </div>
  );
}
