"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AiFillFileExcel,
  AiOutlineAppstore,
  AiOutlineBars,
  AiOutlineSearch,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { FiEdit2, FiMoreHorizontal, FiX } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdClass, MdOutlineSchool } from "react-icons/md";
import { TfiBlackboard } from "react-icons/tfi";
import { clientFetch } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import Field from "@/app/_components/field";
import ClassroomFormModal from "./_components/classroom-form";
import SubjectFormModal from "./_components/subject-form";
import {normalizeList} from "@/lib/utils";
import type { Classroom, PaginatedResponse, Staff, Student, Subject } from "@/types/api";

const TABS = [
  "All Classes",
  "Senior Secondary",
  "Secondary",
  "Middle",
  "Primary",
  "Pre Primary",
];

const CLASS_ORDER = [
  "12",
  "11",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "1",
  "LKG",
  "UKG",
  "Nursery",
  "Pre Nursery",
];

const GENDERS = [
  { id: "1", name: "Male" },
  { id: "2", name: "Female" },
  { id: "3", name: "Other" },
];

function classLabel(classroom: Classroom | null | undefined) {
  if (!classroom) return "";
  return `${classroom.class_name} ${classroom.section_name ?? classroom.section ?? ""}`.trim();
}

function todayAttendance(students: Student[]) {
  const index = new Date().getDate() - 1;
  return students.reduce(
    (acc, student) => {
      const value = student.month_attendance?.[index];
      if (value === 2) acc.present += 1;
      if (value === 1) acc.absent += 1;
      return acc;
    },
    { present: 0, absent: 0 },
  );
}

function matchesTab(classroom: Classroom, tabIndex: number) {
  const name = classroom.class_name;
  if (tabIndex === 0) return true;
  if (tabIndex === 1) return name === "11" || name === "12";
  if (tabIndex === 2) return name === "9" || name === "10";
  if (tabIndex === 3) return ["6", "7", "8"].includes(name);
  if (tabIndex === 4) return ["1", "2", "3", "4", "5"].includes(name);
  return ["LKG", "UKG", "Nursery", "Pre Nursery"].includes(name);
}

const emptyStudentForm = {
  first_name: "",
  last_name: "",
  father_name: "",
  mother_name: "",
  gender: "1",
  contact_email: "",
  parent_mobile_number: "",
  date_of_birth: "",
  date_of_admission: "",
  roll_no: "",
  admission_no: "",
  address: "",
  parent_account_no: "",
};

export default function ClassroomPage() {
  const [viewState, setViewState] = useState<"grid" | "list">("grid");
  const [tabState, setTabState] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [classModal, setClassModal] = useState<"add" | "edit" | null>(null);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [studentDrawerOpen, setStudentDrawerOpen] = useState(false);
  const [studentCsvDrawerOpen, setStudentCsvDrawerOpen] = useState(false);
  const [studentListClassroom, setStudentListClassroom] = useState<Classroom | null>(null);

  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => clientFetch<Classroom[] | PaginatedResponse<Classroom>>("list/classroom/"),
  });

  const staffQuery = useQuery({
    queryKey: ["staff"],
    queryFn: () => clientFetch<Staff[] | PaginatedResponse<Staff>>("list/staff/"),
  });

  const classrooms = useMemo(() => normalizeList(classroomsQuery.data), [classroomsQuery.data]);
  const staff = useMemo(() => normalizeList(staffQuery.data), [staffQuery.data]);

  const filteredClassrooms = useMemo(
    () =>
      classrooms
        .filter((classroom) => matchesTab(classroom, tabState))
        .filter((classroom) =>
          classLabel(classroom).toLowerCase().includes(searchQuery.trim().toLowerCase()),
        ),
    [classrooms, searchQuery, tabState],
  );

  const isLoading = classroomsQuery.isLoading || staffQuery.isLoading;
  const hasError = classroomsQuery.isError || staffQuery.isError;

  function openDetails(classroom: Classroom) {
    setSelectedClassroom(classroom);
  }

  function openEdit(classroom: Classroom) {
    setSelectedClassroom(classroom);
    setClassModal("edit");
  }

  function openStudents(classroom: Classroom) {
    setSelectedClassroom(null);
    setStudentListClassroom(classroom);
  }

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
        Unable to load classroom data.
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">All Classroom</h1>
        <button
          type="button"
          onClick={() => setClassModal("add")}
          className="inline-flex w-fit items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          <IoMdAddCircleOutline className="mr-2" />
          Add Class
        </button>
      </div>

      <div className="mt-6 hidden w-full border-b-2 md:flex">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            onClick={() => setTabState(index)}
            className={`mx-4 border-b-2 px-1 pb-2 font-semibold ${
              tabState === index
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="my-6 flex flex-row">
          <div className="relative text-gray-600 focus-within:text-gray-500">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <AiOutlineSearch />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-md border bg-white py-2 pl-10 pr-3 text-sm text-gray-900 focus:outline-none sm:w-[320px]"
              placeholder="Search a class"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex w-fit flex-row rounded-md bg-slate-100 p-1">
          <button
            type="button"
            className={`flex items-center rounded-md px-4 py-2 ${
              viewState === "grid" ? "bg-white font-semibold" : "text-gray-600"
            }`}
            onClick={() => setViewState("grid")}
          >
            <AiOutlineAppstore className="mr-2" />
            Grid
          </button>
          <button
            type="button"
            className={`flex items-center rounded-md px-4 py-2 ${
              viewState === "list" ? "bg-white font-semibold" : "text-gray-600"
            }`}
            onClick={() => setViewState("list")}
          >
            <AiOutlineBars className="mr-2" />
            List
          </button>
        </div>
      </div>

      {staff.length === 0 ? (
        <EmptyState message="No staff found. Add staff members before creating classrooms." />
      ) : filteredClassrooms.length === 0 ? (
        <EmptyState message="No classroom found." />
      ) : viewState === "grid" ? (
        <ClassroomGrid
          classrooms={filteredClassrooms}
          onView={openDetails}
          onEdit={openEdit}
          onViewStudents={openStudents}
        />
      ) : (
        <ClassroomList
          classrooms={filteredClassrooms}
          onView={openDetails}
          onEdit={openEdit}
          onViewStudents={openStudents}
        />
      )}

      {selectedClassroom &&
      !classModal &&
      !subjectModalOpen &&
      !studentDrawerOpen &&
      !studentCsvDrawerOpen &&
      !studentListClassroom ? (
        <ClassroomDetailsDrawer
          classroom={selectedClassroom}
          onClose={() => setSelectedClassroom(null)}
          onEdit={() => setClassModal("edit")}
          onAddSubject={() => setSubjectModalOpen(true)}
          onAddStudent={() => setStudentDrawerOpen(true)}
          onUploadStudents={() => setStudentCsvDrawerOpen(true)}
          onViewStudents={() => openStudents(selectedClassroom)}
        />
      ) : null}

      {classModal ? (
        <ClassroomFormModal
          mode={classModal}
          classroom={classModal === "edit" ? selectedClassroom : null}
          staff={staff}
          onClose={() => setClassModal(null)}
        />
      ) : null}

      {subjectModalOpen && selectedClassroom ? (
        <SubjectFormModal
          classroom={selectedClassroom}
          staff={staff}
          onClose={() => setSubjectModalOpen(false)}
        />
      ) : null}

      {studentDrawerOpen && selectedClassroom ? (
        <StudentDrawer
          classroom={selectedClassroom}
          onClose={() => setStudentDrawerOpen(false)}
        />
      ) : null}

      {studentCsvDrawerOpen && selectedClassroom ? (
        <StudentCsvDrawer
          classroom={selectedClassroom}
          onClose={() => setStudentCsvDrawerOpen(false)}
        />
      ) : null}

      {studentListClassroom ? (
        <StudentsListDrawer
          classroom={studentListClassroom}
          onClose={() => setStudentListClassroom(null)}
        />
      ) : null}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-96 w-full items-center justify-center text-gray-600">
      {message}
    </div>
  );
}

function ClassroomGrid({
  classrooms,
  onView,
  onEdit,
  onViewStudents,
}: {
  classrooms: Classroom[];
  onView: (classroom: Classroom) => void;
  onEdit: (classroom: Classroom) => void;
  onViewStudents: (classroom: Classroom) => void;
}) {
  return (
    <div>
      {CLASS_ORDER.map((className) => {
        const sectionData = classrooms.filter((classroom) => classroom.class_name === className);
        if (sectionData.length === 0) return null;

        return (
          <section key={className} className="mt-2 flex flex-col">
            <h2 className="my-3 ml-2 flex text-2xl font-medium text-gray-800">
              {className} Standard
            </h2>
            <div className="mb-10 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sectionData.map((classroom) => (
                <ClassroomCard
                  key={classroom.id}
                  classroom={classroom}
                  onView={() => onView(classroom)}
                  onEdit={() => onEdit(classroom)}
                  onViewStudents={() => onViewStudents(classroom)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ClassroomCard({
  classroom,
  onView,
  onEdit,
  onViewStudents,
}: {
  classroom: Classroom;
  onView: () => void;
  onEdit: () => void;
  onViewStudents: () => void;
}) {
  return (
    <div className="flex flex-col rounded-md border bg-white p-4 shadow-sm">
      <div className="flex flex-row items-center justify-between border-b pb-3">
        <button type="button" onClick={onView} className="flex items-center text-left">
          <span className="rounded-md bg-indigo-100 p-2">
            <TfiBlackboard className="h-4 w-4 text-indigo-600" />
          </span>
          <span className="ml-3 text-xl font-semibold">{classLabel(classroom)}</span>
        </button>
        <ClassroomActions
          classroom={classroom}
          onView={onView}
          onEdit={onEdit}
          onViewStudents={onViewStudents}
        />
      </div>
      <ClassroomMetric label="Total Subject" value={classroom.no_of_subjects ?? 0} />
      <ClassroomMetric label="Teacher Assigned" value={classroom.no_of_teachers ?? 0} />
      <div className="mt-5 border-t pt-2">
        <ClassroomMetric label="Students" value={classroom.strength ?? 0} compact />
      </div>
    </div>
  );
}

function ClassroomMetric({
  label,
  value,
  compact,
}: {
  label: string;
  value: string | number;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between text-sm ${compact ? "" : "mt-5"}`}>
      <span className="font-semibold uppercase text-gray-500">{label}</span>
      <span className="font-semibold text-gray-600">{value}</span>
    </div>
  );
}

function ClassroomList({
  classrooms,
  onView,
  onEdit,
  onViewStudents,
}: {
  classrooms: Classroom[];
  onView: (classroom: Classroom) => void;
  onEdit: (classroom: Classroom) => void;
  onViewStudents: (classroom: Classroom) => void;
}) {
  return (
    <div>
      {CLASS_ORDER.map((className) => {
        const sectionData = classrooms.filter((classroom) => classroom.class_name === className);
        if (sectionData.length === 0) return null;

        return (
          <section key={className} className="mb-6 flex flex-col">
            <h2 className="my-3 ml-2 flex text-2xl font-medium text-gray-800">
              {className} Standard
            </h2>
            <div className="overflow-x-auto rounded-md border bg-white">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-7 bg-slate-50 p-4 text-sm font-semibold text-gray-500">
                  <span>Class</span>
                  <span>Class Teacher</span>
                  <span>Secondary Teacher</span>
                  <span>Total Subjects</span>
                  <span>Teachers Assigned</span>
                  <span>Students</span>
                  <span>Actions</span>
                </div>
                {sectionData.map((classroom) => (
                  <div
                    key={classroom.id}
                    className="grid grid-cols-7 border-t p-4 text-sm font-semibold text-gray-800"
                  >
                    <button type="button" onClick={() => onView(classroom)} className="text-left">
                      {classLabel(classroom)}
                    </button>
                    <span>{classroom.class_teacher ?? "Not assigned"}</span>
                    <span>{classroom.sub_class_teacher ?? "Not assigned"}</span>
                    <span>{classroom.no_of_subjects ?? 0}</span>
                    <span>{classroom.no_of_teachers ?? 0}</span>
                    <span>{classroom.strength ?? 0}</span>
                    <span>
                      <ClassroomActions
                        classroom={classroom}
                        onView={() => onView(classroom)}
                        onEdit={() => onEdit(classroom)}
                        onViewStudents={() => onViewStudents(classroom)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ClassroomActions({
  classroom,
  onView,
  onEdit,
  onViewStudents,
}: {
  classroom: Classroom;
  onView: () => void;
  onEdit: () => void;
  onViewStudents: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const deleteClassroom = useMutation({
    mutationFn: () =>
      clientFetch(`list/classroom/${classroom.id}/`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      toast.success("Deleted classroom");
    },
    onError: () => toast.error("Unable to delete classroom"),
  });

  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
        aria-label="Classroom actions"
      >
        <FiMoreHorizontal />
      </button>
      <div className="invisible absolute right-0 top-9 z-20 w-48 rounded-md border bg-white py-1 text-sm shadow-lg group-focus-within:visible group-hover:visible">
        <button type="button" onClick={onView} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
          View Class Details
        </button>
        <button
          type="button"
          onClick={onViewStudents}
          className="block w-full px-4 py-2 text-left hover:bg-gray-50"
        >
          View Class Students
        </button>
        <button type="button" onClick={onEdit} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
          Edit Class
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${classLabel(classroom)}?`)) deleteClassroom.mutate();
          }}
          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
        >
          Delete Class
        </button>
      </div>
    </div>
  );
}

function ClassroomDetailsDrawer({
  classroom,
  onClose,
  onEdit,
  onAddSubject,
  onAddStudent,
  onUploadStudents,
  onViewStudents,
}: {
  classroom: Classroom;
  onClose: () => void;
  onEdit: () => void;
  onAddSubject: () => void;
  onAddStudent: () => void;
  onUploadStudents: () => void;
  onViewStudents: () => void;
}) {
  const subjectsQuery = useQuery({
    queryKey: ["subjects", classroom.id],
    queryFn: () =>
      clientFetch<Subject[] | PaginatedResponse<Subject>>(`staff/subject/?classroom=${classroom.id}`),
  });
  const studentsQuery = useQuery({
    queryKey: ["students", classroom.id],
    queryFn: () =>
      clientFetch<Student[] | PaginatedResponse<Student>>(`staff/student/?classroom=${classroom.id}`),
  });

  const subjects = useMemo(() => normalizeList(subjectsQuery.data), [subjectsQuery.data]);
  const students = useMemo(() => normalizeList(studentsQuery.data), [studentsQuery.data]);
  const attendance = todayAttendance(students);

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl">
        <div className="relative border-b px-6 py-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close class details"
          >
            <FiX />
          </button>
          <h2 className="mt-10 text-center text-3xl font-semibold">{classLabel(classroom)}</h2>
        </div>

        <div className="flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4 border-b pb-5">
            <InfoCard icon={<BsBriefcase />} label="Class Teacher" value={classroom.class_teacher ?? "Not assigned"} />
            <InfoCard icon={<MdOutlineSchool />} label="Total Students" value={classroom.strength ?? 0} />
          </div>

          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Attendance</h3>
            <div className="mt-3 space-y-3 text-sm font-semibold text-gray-500">
              <div className="flex items-center justify-between rounded-md bg-green-50 px-4 py-3">
                <span>Present Student</span>
                <span>{attendance.present}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-red-50 px-4 py-3">
                <span>Absent Students</span>
                <span>{attendance.absent}</span>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Subject Detail</h3>
            {subjectsQuery.isLoading ? (
              <div className="mt-4 text-gray-500">Loading subjects...</div>
            ) : subjects.length === 0 ? (
              <div className="mt-4 text-gray-500">No subjects added.</div>
            ) : (
              <div className="mt-3 space-y-2">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center rounded-md px-3 py-2 hover:bg-gray-50">
                    <MdClass className="mr-4 h-7 w-7 text-indigo-700" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.teacher}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="border-t px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center rounded-md border border-indigo-500 px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
            >
              <FiEdit2 className="mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={onAddSubject}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              <IoMdAddCircleOutline className="mr-2" />
              Add Subject
            </button>
          </div>
          <button
            type="button"
            onClick={onAddStudent}
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            <AiOutlineUserAdd className="mr-2" />
            Add Student
          </button>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onUploadStudents}
              className="inline-flex items-center justify-center rounded-md border border-indigo-500 px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
            >
              <AiFillFileExcel className="mr-2" />
              Upload CSV
            </button>
            <button
              type="button"
              onClick={onViewStudents}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              View Students
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
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

function StudentDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyStudentForm);

  const mutation = useMutation({
    mutationFn: () => {
      const required: Array<keyof typeof emptyStudentForm> = [
        "first_name",
        "last_name",
        "father_name",
        "mother_name",
        "date_of_birth",
        "date_of_admission",
        "roll_no",
        "admission_no",
        "address",
      ];
      for (const key of required) {
        if (!form[key].trim()) throw new Error("Complete the required student fields");
      }

      return clientFetch("staff/student/", {
        method: "POST",
        body: {
          ...form,
          classroom: classroom.id,
        },
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students", classroom.id] }),
        queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
      ]);
      toast.success("Student added successfully");
      setForm(emptyStudentForm);
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to add student"),
  });

  function update(key: keyof typeof emptyStudentForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Add Student</h2>
            <p className="mt-1 text-sm text-gray-500">{classLabel(classroom)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close student drawer"
          >
            <FiX />
          </button>
        </div>
        <div className="flex-1 px-6 py-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="First Name">
              <input className="input" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
            </Field>
            <Field label="Last Name">
              <input className="input" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
            </Field>
            <Field label="Father's Name">
              <input className="input" value={form.father_name} onChange={(e) => update("father_name", e.target.value)} />
            </Field>
            <Field label="Mother's Name">
              <input className="input" value={form.mother_name} onChange={(e) => update("mother_name", e.target.value)} />
            </Field>
            <Field label="Gender">
              <select className="input" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                {GENDERS.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Email">
              <input className="input" type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
            </Field>
            <Field label="Parent Phone">
              <input className="input" value={form.parent_mobile_number} onChange={(e) => update("parent_mobile_number", e.target.value)} />
            </Field>
            <Field label="Parent Account No">
              <input className="input" value={form.parent_account_no} onChange={(e) => update("parent_account_no", e.target.value)} />
            </Field>
            <Field label="Date of Birth">
              <input className="input" type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} />
            </Field>
            <Field label="Date of Admission">
              <input className="input" type="date" value={form.date_of_admission} onChange={(e) => update("date_of_admission", e.target.value)} />
            </Field>
            <Field label="Roll No">
              <input className="input" value={form.roll_no} onChange={(e) => update("roll_no", e.target.value)} />
            </Field>
            <Field label="Admission No">
              <input className="input" value={form.admission_no} onChange={(e) => update("admission_no", e.target.value)} />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Address">
              <textarea
                className="input min-h-24"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
          </div>
        </div>
        <div className="border-t px-6 py-5">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : "Save Student"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function StudentCsvDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!csvFile) throw new Error("Select a student CSV file");
      const formData = new FormData();
      formData.append("classroom", classroom.id);
      formData.append("csv_file", csvFile);
      return clientFetch("staff/student/", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students", classroom.id] }),
        queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
      ]);
      toast.success("Students uploaded successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to upload students"),
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Upload Students CSV</h2>
            <p className="mt-1 text-sm text-gray-500">{classLabel(classroom)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close CSV upload drawer"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 px-6 py-6">
          <a
            href="/Test-Student.csv"
            download
            className="inline-flex items-center rounded-md border border-dashed border-indigo-300 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
          >
            <AiFillFileExcel className="mr-2 h-5 w-5" />
            Download Example
          </a>

          <label className="mt-6 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center hover:bg-gray-100">
            <AiFillFileExcel className="mb-3 h-10 w-10 text-gray-400" />
            <span className="text-xl font-semibold text-gray-600">
              {csvFile ? csvFile.name : "Student CSV"}
            </span>
            <span className="mt-2 font-medium text-gray-500">
              {csvFile ? "Click to change" : "Click to upload"}
            </span>
            <span className="mt-1 text-xs text-gray-500">Only CSV format allowed</span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="border-t px-6 py-5">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Uploading..." : "Upload Students"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function StudentsListDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const studentsQuery = useQuery({
    queryKey: ["students", classroom.id],
    queryFn: () =>
      clientFetch<Student[] | PaginatedResponse<Student>>(`staff/student/?classroom=${classroom.id}`),
  });
  const students = useMemo(() => normalizeList(studentsQuery.data), [studentsQuery.data]);

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
          {studentsQuery.isLoading ? (
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
      </aside>
    </div>
  );
}
