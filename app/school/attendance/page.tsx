"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineAppstore, AiOutlineBars, AiOutlineSearch } from "react-icons/ai";
import { clientFetchPage } from "@/lib/client-api";
import type { Classroom } from "@/types/api";
import {classLabel, matchesClassGroup} from "@/lib/utils";
import { AttendanceDrawer } from "./_components/drawer";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import {CLASS_GROUPS, DEFAULT_TAB} from "@/lib/constants";
import PaginationControls from "@/app/_components/pagination";

export default function AttendancePage() {
  const [tabState, setTabState] = useState(DEFAULT_TAB);
  const [viewState, setViewState] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = viewState === "grid" ? 12 : 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, tabState, viewState]);

  const classroomsQuery = useQuery({
    queryKey: ["classrooms", "attendance", page, pageSize],
    queryFn: () => clientFetchPage<Classroom>("list/classroom/", { page, pageSize }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.results ?? [], [classroomsQuery.data]);
  const filteredClassrooms = useMemo(
    () =>
      classrooms
        .filter((classroom) => matchesClassGroup(classLabel(classroom), tabState))
        .filter((classroom) => classLabel(classroom).toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [classrooms, searchQuery, tabState],
  );

  const TABS = [DEFAULT_TAB, ...CLASS_GROUPS.keys()];
  const CLASS_ORDER = [...CLASS_GROUPS.values()].flat().sort((a, b) =>  a.localeCompare(b));

  if (classroomsQuery.isPending) {
    return <Loading />;
  }

  if (classroomsQuery.isError) {
    return <CenteredText className="text-red-600" text="Unable to load classrooms." />;
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">Attendance</h1>
      </div>

      <div className="mt-6 hidden w-full border-b-2 md:flex">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`mx-4 border-b-2 px-1 pb-2 font-semibold ${
              tabState === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400"
            }`}
            onClick={() => setTabState(tab)}
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
        <CenteredText text="No classroom found." />
      ) : viewState === "grid" ? (
        <div>
          {CLASS_ORDER.map((className) => {
            const data = filteredClassrooms.filter((classroom) => classroom.class_name === className);
            if (!data.length) return null;
            return (
              <section key={className} className="mt-2 flex flex-col">
                <h2 className="my-3 ml-2 flex text-2xl font-medium text-gray-800">{className} Standard</h2>
                <div className="mb-10 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.map((classroom) => (
                    <ClassAttendanceCard key={classroom.id} classroom={classroom} onOpen={() => setSelectedClassroom(classroom)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>Class</span>
              <span>Students</span>
              <span>Teacher</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {filteredClassrooms.map((classroom) => (
              <div key={classroom.id} className="grid grid-cols-5 border-t px-4 py-3 text-sm text-gray-800">
                <span className="font-semibold">{classLabel(classroom)}</span>
                <span>{classroom.strength ?? 0}</span>
                <span>{classroom.class_teacher ?? "Not assigned"}</span>
                <span>Ready</span>
                <button type="button" onClick={() => setSelectedClassroom(classroom)} className="text-left font-medium text-indigo-700">
                  Mark Attendance
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
        <AttendanceDrawer classroom={selectedClassroom} onClose={() => setSelectedClassroom(null)} />
      ) : null}
    </div>
  );
}

function ClassAttendanceCard({ classroom, onOpen }: { classroom: Classroom; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="rounded-md border bg-white p-4 text-left shadow-sm hover:border-indigo-300">
      <div className="flex items-center justify-between border-b pb-3">
        <span className="text-xl font-semibold">{classLabel(classroom)}</span>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{classroom.strength ?? 0} students</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <Stat label="Subjects" value={classroom.no_of_subjects ?? 0} tone="green" />
        <Stat label="Teachers" value={classroom.no_of_teachers ?? 0} tone="red" />
        <Stat label="Status" value="Open" tone="amber" />
      </div>
    </button>
  );
}


function Stat({ label, value, tone }: { label: string; value: string | number; tone: "green" | "red" | "amber" }) {
  const classes = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className={`rounded-md px-2 py-3 ${classes[tone]}`}>
      <div className="text-lg font-bold">{value}</div>
      <div>{label}</div>
    </div>
  );
}
