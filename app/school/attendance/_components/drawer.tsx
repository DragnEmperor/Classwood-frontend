"use client";

import { FiX } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import {useToast} from "@/app/_components/toast-provider";
import { Classroom } from "@/types/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import { useState, useMemo } from "react";
import type { Student } from "@/types/api";
import {classLabel} from "@/lib/utils";
import CenteredText from "@/app/_components/centered-text";
import PaginationControls from "@/app/_components/pagination";

const STUDENTS_PAGE_SIZE = 20;

export function AttendanceDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const studentsQuery = useQuery({
    queryKey: ["students", classroom.id, page, STUDENTS_PAGE_SIZE],
    queryFn: () => clientFetchPage<Student>(`staff/student/?classroom=${classroom.id}`, { page, pageSize: STUDENTS_PAGE_SIZE }),
  });
  const students = useMemo(() => studentsQuery.data?.results ?? [], [studentsQuery.data]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const todayDate = new Date().toISOString().slice(0, 10);
  const todayIndex = new Date().getDate() - 1

  const mutation = useMutation({
    mutationFn: async () => {
      const entries = students.filter((student) => attendance[String(student.user.id)] !== undefined);
      if (!entries.length) throw new Error("Mark at least one student");
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
      await queryClient.invalidateQueries({ queryKey: ["students", classroom.id] });
      toast.success("Attendance marked successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to mark attendance"),
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Mark Attendance</h2>
            <p className="mt-1 text-sm text-gray-500">{classLabel(classroom)} · {todayDate}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <FiX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {studentsQuery.isPending ? (
            <CenteredText text="Loading students..." />
          ) : students.length === 0 ? (
            <CenteredText text="No students in this class." />
          ) : (
            <div className="space-y-2">
              {students.map((student) => {
                const key = String(student.user.id);
                const existing = student.month_attendance?.[todayIndex];
                return (
                  <div key={key} className="flex items-center justify-between rounded-md border px-4 py-3">
                    <div>
                      <div className="font-semibold">{student.roll_no} · {student.first_name} {student.last_name}</div>
                      <div className="text-sm text-gray-500">{existing === 2 ? "Already present" : existing === 1 ? "Already absent" : "Not marked"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAttendance((current) => ({ ...current, [key]: true }))} className={`rounded-md px-3 py-2 text-sm font-medium ${attendance[key] === true ? "bg-green-600 text-white" : "bg-green-50 text-green-700"}`}>
                        Present
                      </button>
                      <button type="button" onClick={() => setAttendance((current) => ({ ...current, [key]: false }))} className={`rounded-md px-3 py-2 text-sm font-medium ${attendance[key] === false ? "bg-red-600 text-white" : "bg-red-50 text-red-700"}`}>
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
          <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate()} className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
            {mutation.isPending ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </aside>
    </div>
  );
}
