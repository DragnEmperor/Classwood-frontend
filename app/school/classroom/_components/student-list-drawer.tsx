import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import type { Classroom, Student } from "@/types/api";
import PaginationControls from "@/app/_components/pagination";

const STUDENTS_PAGE_SIZE = 20;

export default function StudentsListDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const [page, setPage] = useState(1);
  const studentsQuery = useQuery({
    queryKey: ["students", classroom.id, page, STUDENTS_PAGE_SIZE],
    queryFn: () =>
      clientFetchPage<Student>(`staff/student/?classroom=${classroom.id}`, { page, pageSize: STUDENTS_PAGE_SIZE }),
  });
  const students = useMemo(() => studentsQuery.data?.results ?? [], [studentsQuery.data]);

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-4xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Class Students</h2>
            <p className="mt-1 text-sm text-gray-500">{classLabel(classroom)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close students list"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {studentsQuery.isPending ? (
            <div className="flex h-60 items-center justify-center text-gray-500">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-gray-500">
              No students found for this class.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[110px_1fr_150px_150px_140px] bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
                  <span>Roll No</span>
                  <span>Name</span>
                  <span>Admission No</span>
                  <span>Gender</span>
                  <span>Email</span>
                </div>
                {students.map((student) => (
                  <div
                    key={student.user.id}
                    className="grid grid-cols-[110px_1fr_150px_150px_140px] border-t px-4 py-3 text-sm text-gray-800"
                  >
                    <span className="font-semibold">{student.roll_no}</span>
                    <span>{`${student.first_name} ${student.last_name}`}</span>
                    <span>{student.admission_no}</span>
                    <span>{student.gender}</span>
                    <span className="truncate">{student.user.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-t px-6 py-5">
          <PaginationControls
            page={page}
            pageSize={STUDENTS_PAGE_SIZE}
            total={studentsQuery.data?.count ?? 0}
            isLoading={studentsQuery.isFetching}
            onPageChange={setPage}
          />
        </div>
      </aside>
    </div>
  );
}
