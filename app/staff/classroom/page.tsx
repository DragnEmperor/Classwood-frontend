"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineAppstore, AiOutlineBars, AiOutlineSearch } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import type { Classroom } from "@/types/api";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import ClassroomDrawer from "./_components/drawer";
import PaginationControls from "@/app/_components/pagination";

export default function StaffClassroomPage() {
  const [viewState, setViewState] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = viewState === "grid" ? 12 : 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, viewState]);

  const classroomsQuery = useQuery({
    queryKey: ["staff", "classrooms", page, pageSize],
    queryFn: () => clientFetchPage<Classroom>("staff/classroom/", { page, pageSize }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.results ?? [], [classroomsQuery.data]);
  const filteredClassrooms = useMemo(
    () =>
      classrooms.filter((classroom) =>
        `${classLabel(classroom)} ${classroom.class_teacher ?? ""}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [classrooms, searchQuery],
  );

  if (classroomsQuery.isPending) return <Loading />;
  if (classroomsQuery.isError) return <CenteredText className="text-red-600" text="Unable to load classrooms." />;

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Classrooms</h1>
          <p className="mt-1 text-sm text-gray-500">Assigned classes, students, and attendance.</p>
        </div>
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
            className={`flex items-center rounded-md px-4 py-2 ${viewState === "grid" ? "bg-white font-semibold" : "text-gray-600"}`}
            onClick={() => setViewState("grid")}
          >
            <AiOutlineAppstore className="mr-2" />
            Grid
          </button>
          <button
            type="button"
            className={`flex items-center rounded-md px-4 py-2 ${viewState === "list" ? "bg-white font-semibold" : "text-gray-600"}`}
            onClick={() => setViewState("list")}
          >
            <AiOutlineBars className="mr-2" />
            List
          </button>
        </div>
      </div>

      {filteredClassrooms.length === 0 ? (
        <CenteredText text="No classroom assigned." />
      ) : viewState === "grid" ? (
        <div className="grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredClassrooms.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} onOpen={() => setSelectedClassroom(classroom)} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[780px]">
            <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>Class</span>
              <span>Students</span>
              <span>Subjects</span>
              <span>Class Teacher</span>
              <span>Action</span>
            </div>
            {filteredClassrooms.map((classroom) => (
              <div key={classroom.id} className="grid grid-cols-5 border-t px-4 py-3 text-sm text-gray-800">
                <span className="font-semibold">{classLabel(classroom)}</span>
                <span>{classroom.strength ?? 0}</span>
                <span>{classroom.no_of_subjects ?? "-"}</span>
                <span>{classroom.class_teacher ?? "Not assigned"}</span>
                <button type="button" onClick={() => setSelectedClassroom(classroom)} className="text-left font-medium text-indigo-700">
                  View Students
                </button>
              </div>
            ))}
          </div>
        </div>
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

      {selectedClassroom ? (
        <ClassroomDrawer classroom={selectedClassroom} onClose={() => setSelectedClassroom(null)} />
      ) : null}
    </div>
  );
}

function ClassroomCard({ classroom, onOpen }: { classroom: Classroom; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="rounded-md border bg-white p-4 text-left shadow-sm hover:border-indigo-300">
      <div className="flex items-start justify-between gap-3 border-b pb-3">
        <div>
          <div className="text-xl font-semibold">{classLabel(classroom)}</div>
          <div className="mt-1 text-sm text-gray-500">{classroom.class_teacher ?? "Not assigned"}</div>
        </div>
        <FiUser className="h-6 w-6 text-indigo-700" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <MiniStat label="Students" value={classroom.strength ?? 0} />
        <MiniStat label="Subjects" value={classroom.no_of_subjects ?? "-"} />
        <MiniStat label="Teachers" value={classroom.no_of_teachers ?? "-"} />
      </div>
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-3">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}
