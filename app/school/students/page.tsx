"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { FiMoreHorizontal, FiX } from "react-icons/fi";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import PaginationControls from "@/app/_components/pagination";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import type { Classroom, Student } from "@/types/api";
import { useToast } from "@/app/_components/toast-provider";
import AttendanceBadge from "@/app/school/staff/_components/badge";
import StudentDrawer from "@/app/school/classroom/_components/student-drawer";

const PAGE_SIZE = 12;
const PROFILE_PLACEHOLDER = "/assets/profile.png";

function studentName(student: Student) {
  return `${student.first_name} ${student.last_name}`.trim();
}

function attendanceState(student: Student) {
  const todayIndex = new Date().getDate() - 1;
  return student.month_attendance?.[todayIndex] ?? 0;
}

function generatedPassword(student: Student) {
  const first = student.first_name.toLowerCase().padEnd(5, "5").slice(0, 5);
  const phone = student.parent_mobile_number ?? "";
  const date = student.date_of_admission ? new Date(student.date_of_admission) : null;
  if (!date || Number.isNaN(date.getTime()) || phone.length < 2) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${first}${day}${month}${phone.slice(-2)}`;
}

function attendanceSummary(student: Student) {
  const marked = student.month_attendance?.filter(Boolean) ?? [];
  const present = marked.filter((entry) => entry === 2).length;
  const absent = marked.filter((entry) => entry === 1).length;
  const percentage = marked.length ? Math.round((present / marked.length) * 100) : 0;
  return { present, absent, percentage };
}

function studentsPath(page: number, classroomId: string, searchQuery: string) {
  const params = new URLSearchParams();
  if (classroomId !== "all") params.set("classroom", classroomId);
  if (searchQuery.trim()) params.set("search", searchQuery.trim());
  const query = params.toString();
  return query ? `list/student/?${query}` : "list/student/";
}

export default function SchoolStudentsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [classroomId, setClassroomId] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    setPage(1);
  }, [classroomId, searchQuery]);

  const classroomsQuery = useQuery({
    queryKey: ["classrooms", "students-filter"],
    queryFn: () => clientFetchPage<Classroom>("list/classroom/", { pageSize: 100 }),
  });

  const studentsQuery = useQuery({
    queryKey: ["school", "students", page, PAGE_SIZE, classroomId, searchQuery],
    queryFn: () => clientFetchPage<Student>(studentsPath(page, classroomId, searchQuery), { page, pageSize: PAGE_SIZE }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.results ?? [], [classroomsQuery.data]);
  const students = useMemo(() => studentsQuery.data?.results ?? [], [studentsQuery.data]);

  if (studentsQuery.isPending || classroomsQuery.isPending) return <Loading />;

  if (studentsQuery.isError || classroomsQuery.isError) {
    return <CenteredText className="text-red-600" text="Unable to load students." />;
  }

  return (
    <div className="w-full px-4 py-8 md:px-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">All Students</h1>
          <p className="mt-1 text-sm text-gray-500">School-wide student directory filtered by classroom.</p>
        </div>
        <div className="rounded-md border bg-white px-4 py-3">
          <div className="text-xs font-medium uppercase text-gray-500">Students</div>
          <div className="text-2xl font-semibold text-indigo-700">{studentsQuery.data?.count ?? 0}</div>
        </div>
      </div>

      <div className="my-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative text-gray-600 focus-within:text-gray-500">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <AiOutlineSearch />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-md border bg-white py-2 pl-10 pr-3 text-sm text-gray-900 focus:outline-none sm:w-[320px]"
            placeholder="Search name, roll no, admission no"
            autoComplete="off"
          />
        </div>

        <select
          value={classroomId}
          onChange={(event) => setClassroomId(event.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none md:w-64"
        >
          <option value="all">All classrooms</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classLabel(classroom)}
            </option>
          ))}
        </select>
      </div>

      {students.length === 0 ? (
        <CenteredText text="No students found." />
      ) : (
        <div className="mb-8 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {students.map((student) => (
            <StudentCard
              key={student.user.id}
              student={student}
              onView={() => setSelectedStudent(student)}
              onEdit={() => setEditingStudent(student)}
            />
          ))}
        </div>
      )}

      <PaginationControls
        page={page}
        pageSize={PAGE_SIZE}
        total={studentsQuery.data?.count ?? 0}
        isLoading={studentsQuery.isFetching}
        onPageChange={setPage}
      />

      {selectedStudent ? <StudentProfileDrawer student={selectedStudent} onClose={() => setSelectedStudent(null)} /> : null}
      {editingStudent ? (
        <StudentDrawer
          student={editingStudent}
          classrooms={classrooms}
          onClose={() => setEditingStudent(null)}
        />
      ) : null}
    </div>
  );
}

function StudentCard({
  student,
  onView,
  onEdit,
}: {
  student: Student;
  onView: () => void;
  onEdit: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const state = attendanceState(student);

  const invalidateStudents = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["school", "students"] }),
      queryClient.invalidateQueries({ queryKey: ["students"] }),
      queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
    ]);
  };

  const deleteStudent = useMutation({
    mutationFn: () => clientFetch(`staff/student/${student.user.id}/`, { method: "DELETE" }),
    onSuccess: async () => {
      await invalidateStudents();
      toast.success("Deleted student");
    },
    onError: () => toast.error("Unable to delete student"),
  });

  const markAttendance = useMutation({
    mutationFn: (present: boolean) => {
      if (!student.classroom_id) throw new Error("Student classroom is missing");
      return clientFetch("staff/studentAttendance/", {
        method: "POST",
        body: {
          date: new Date().toISOString().slice(0, 10),
          present,
          student: student.user.id,
          classroom: student.classroom_id,
        },
      });
    },
    onSuccess: async () => {
      await invalidateStudents();
      toast.success("Attendance marked successfully");
    },
    onError: () => toast.error("Attendance already marked or could not be saved"),
  });

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-300 bg-white p-4 shadow-sm">
      <div className="flex flex-row justify-between border-b border-dotted border-gray-200 pb-3">
        <button type="button" onClick={onView} className="flex flex-col text-left">
          <Image
            className="mb-2 h-10 w-10 rounded-md object-cover"
            src={
              student.profile_pic ||
              PROFILE_PLACEHOLDER
            }
            width={40}
            height={40}
            alt=""
          />
          <span className="font-semibold text-black">{studentName(student)}</span>
          <span className="text-sm text-gray-400">id: {student.user.id}</span>
        </button>

        <div className="flex flex-col items-end justify-between">
          <div className="group relative inline-flex">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
              aria-label="Student actions"
            >
              <FiMoreHorizontal />
            </button>
            <div className="invisible absolute right-0 top-9 z-20 w-44 rounded-md border bg-white py-1 text-sm shadow-lg group-focus-within:visible group-hover:visible">
              <button type="button" onClick={onView} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
                View Profile
              </button>
              <button type="button" onClick={onEdit} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete ${studentName(student)}?`)) deleteStudent.mutate();
                }}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Delete Profile
              </button>
            </div>
          </div>
          <AttendanceBadge state={state} />
        </div>
      </div>

      <div className="mt-3 flex flex-row justify-between text-gray-700">
        <div className="flex flex-col">
          <span className="text-sm">Roll Number</span>
          <span className="font-semibold">{student.roll_no || "-"}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm">Class Assigned</span>
          <span className="font-semibold">{student.classroom ?? "None"}</span>
        </div>
      </div>

      {!state ? (
        <div className="mt-4 flex flex-col">
          <span className="mb-3 font-medium">Mark Attendance</span>
          <div className="flex flex-row justify-between gap-3">
            <button
              type="button"
              disabled={markAttendance.isPending}
              onClick={() => markAttendance.mutate(true)}
              className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              Present
            </button>
            <button
              type="button"
              disabled={markAttendance.isPending}
              onClick={() => markAttendance.mutate(false)}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              Absent
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StudentProfileDrawer({ student, onClose }: { student: Student; onClose: () => void }) {
  const summary = attendanceSummary(student);
  const password = generatedPassword(student);

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          aria-label="Close student profile"
        >
          <FiX />
        </button>

        <div className="flex flex-col items-center justify-center border-b px-6 py-8">
          <Image
            className="mb-3 h-16 w-16 rounded-full object-cover"
            src={
              student.profile_pic ||
              PROFILE_PLACEHOLDER
            }
            width={64}
            height={64}
            alt=""
          />
          <span className="font-semibold">{studentName(student)}</span>
          <span className="text-gray-400">id: {student.user.id}</span>
          <StudentAttendanceBadge state={attendanceState(student)} />
        </div>

        <div className="grid grid-cols-2 gap-4 border-b px-6 py-5">
          <InfoCard icon={<AiOutlineUser />} label="Class" value={student.classroom ?? "Not assigned"} />
          <InfoCard icon={<AiOutlineUser />} label="Roll No" value={student.roll_no || "-"} />
          <InfoCard icon={<AiOutlineUser />} label="Admission No" value={student.admission_no || "-"} />
          <InfoCard icon={<AiOutlineUser />} label="Attendance" value={`${summary.percentage}%`} />
        </div>

        <div className="px-6 py-5">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Student Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Detail label="Email" value={student.user.email} />
            <Detail label="Password" value={password} />
            <Detail label="Gender" value={student.gender} />
            <Detail label="Father" value={student.father_name} />
            <Detail label="Mother" value={student.mother_name} />
            <Detail label="Parent Mobile" value={student.parent_mobile_number} />
            <Detail label="Contact Email" value={student.contact_email} />
            <Detail label="Address" value={student.address} wide />
          </div>
        </div>

        <div className="border-t px-6 py-5">
          <h3 className="mb-3 text-xl font-semibold text-gray-800">Subjects</h3>
          {student.subjects?.length ? (
            <div className="flex flex-wrap gap-2">
              {student.subjects.map((subject) => (
                <span key={subject} className="rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                  {subject}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No subjects assigned.</span>
          )}
        </div>
      </aside>
    </div>
  );
}

function StudentAttendanceBadge({ state }: { state: number }) {
  const copy = state === 2 ? "Present" : state === 1 ? "Absent" : "Not Marked";
  const className =
    state === 2
      ? "bg-green-50 text-green-700"
      : state === 1
        ? "bg-red-50 text-red-700"
        : "bg-gray-100 text-gray-600";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{copy}</span>;
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col rounded-md bg-slate-50 p-4">
      <span className="mb-2 text-2xl text-indigo-600">{icon}</span>
      <span className="mb-2 font-semibold">{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

function Detail({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 break-words font-semibold text-gray-800">{value || "-"}</div>
    </div>
  );
}
