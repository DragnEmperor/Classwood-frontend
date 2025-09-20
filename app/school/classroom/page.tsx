"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AiOutlineAppstore,
  AiOutlineBars,
  AiOutlineSearch,
} from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiBlackboard } from "react-icons/tfi";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import ClassroomFormModal from "./_components/classroom-form";
import SubjectFormModal from "./_components/subject-form";
import {classLabel, matchesClassGroup} from "@/lib/utils";
import {DEFAULT_TAB, CLASS_GROUPS} from "@/lib/constants";
import ClassroomDetailsDrawer from "./_components/details-drawer";
import StudentDrawer from "./_components/student-drawer";
import StudentCsvDrawer from "./_components/student-csv-drawer";
import StudentsListDrawer from "./_components/student-list-drawer";
import CenteredText from "@/app/_components/centered-text";
import type { Classroom, Staff } from "@/types/api";
import PaginationControls from "@/app/_components/pagination";

const CLASS_ORDER = [...CLASS_GROUPS.values()].flat().sort((a, b) =>  a.localeCompare(b));

export default function ClassroomPage() {
  const [viewState, setViewState] = useState<"grid" | "list">("grid");
  const [tabState, setTabState] = useState(DEFAULT_TAB);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [classModal, setClassModal] = useState<"add" | "edit" | null>(null);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [studentDrawerOpen, setStudentDrawerOpen] = useState(false);
  const [studentCsvDrawerOpen, setStudentCsvDrawerOpen] = useState(false);
  const [studentListClassroom, setStudentListClassroom] = useState<Classroom | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = viewState === "grid" ? 12 : 10;

  const TABS: string[] = [DEFAULT_TAB, ...CLASS_GROUPS.keys()]

  useEffect(() => {
    setPage(1);
  }, [searchQuery, tabState, viewState]);

  const classroomsQuery = useQuery({
    queryKey: ["classrooms", page, pageSize],
    queryFn: () => clientFetchPage<Classroom>("list/classroom/", { page, pageSize }),
  });

  const staffQuery = useQuery({
    queryKey: ["staff"],
    queryFn: () => clientFetchPage<Staff>("list/staff/", { pageSize: 100 }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.results ?? [], [classroomsQuery.data]);
  const staff = useMemo(() => staffQuery.data?.results ?? [], [staffQuery.data]);

  const filteredClassrooms = useMemo(
    () =>
      classrooms
        .filter((classroom) => matchesClassGroup(classroom.class_name, tabState))
        .filter((classroom) =>
          classLabel(classroom).toLowerCase().includes(searchQuery.trim().toLowerCase()),
        ),
    [classrooms, searchQuery, tabState],
  );

  const isPending = classroomsQuery.isPending || staffQuery.isPending;
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

  if (isPending) {
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
            onClick={() => setTabState(tab)}
            className={`mx-4 border-b-2 px-1 pb-2 font-semibold ${
              tabState === tab
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
        <CenteredText text="No staff found. Add staff members before creating classrooms." className="w-full h-96" />
      ) : filteredClassrooms.length === 0 ? (
        <CenteredText text="No classroom found." className="w-full h-96" />
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

      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={classroomsQuery.data?.count ?? 0}
          isLoading={classroomsQuery.isFetching}
          onPageChange={setPage}
        />
      </div>

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
