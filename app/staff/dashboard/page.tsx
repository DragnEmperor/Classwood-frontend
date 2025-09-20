"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AiOutlineBank,
  AiOutlineCalendar,
  AiOutlineFileText,
  AiOutlineSchedule,
  AiOutlineTeam,
} from "react-icons/ai";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import type { Classroom, Staff, TimeTable } from "@/types/api";
import StatCard from "@/app/_components/stat-card";
import Loading from "@/app/_components/loader";
import CenteredText from "@/app/_components/centered-text";

function attendancePercentage(values?: number[]) {
  if (!values?.length) return 0;
  const marked = values.filter(Boolean);
  if (!marked.length) return 0;
  const present = marked.filter((value) => value === 2).length;
  return Math.round((present / marked.length) * 100);
}

export default function StaffDashboardPage() {
  const staffQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: () => clientFetch<Staff>("staff/me"),
  });

  const classroomsQuery = useQuery({
    queryKey: ["staff", "classrooms"],
    queryFn: () => clientFetchPage<Classroom>("staff/classroom/", { pageSize: 6 }),
  });

  const timetableQuery = useQuery({
    queryKey: ["staff", "timetable", "all"],
    queryFn: () => clientFetchPage<TimeTable>("staff/timeTable/", { pageSize: 30 }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.results ?? [], [classroomsQuery.data]);
  const periods = useMemo(() => timetableQuery.data?.results ?? [], [timetableQuery.data]);
  const staff = staffQuery.data;

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    for (const period of periods) {
      if (period.subject) subjects.add(period.subject);
    }
    return [...subjects].sort();
  }, [periods]);

  const todaysPeriods = useMemo(() => {
    const day = new Date().getDay();
    const staffDay = day === 0 ? -1 : day - 1;
    return periods
      .filter((period) => Number(period.day) === staffDay)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [periods]);

  if (staffQuery.isPending || classroomsQuery.isPending || timetableQuery.isPending) {
    return <Loading />;
  }

  if (staffQuery.isError || classroomsQuery.isError || timetableQuery.isError) {
    return <CenteredText className="text-red-600" text="Unable to load staff dashboard." />;
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Assigned Classes"
          value={classroomsQuery.data?.count ?? classrooms.length}
          Icon={AiOutlineBank}
          href="/staff/classroom"
        />
        <StatCard
          label="Subjects Today"
          value={todaysPeriods.length}
          Icon={AiOutlineSchedule}
          href="/staff/timetable"
        />
        <StatCard
          label="Attendance"
          value={`${attendancePercentage(staff?.month_attendance)}%`}
          Icon={AiOutlineCalendar}
        />
        <StatCard
          label="Known Subjects"
          value={uniqueSubjects.length}
          Icon={AiOutlineFileText}
          href="/staff/test"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-md border bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Assigned Classrooms</h1>
              <p className="mt-1 text-sm text-gray-500">Classes where you teach or are in charge.</p>
            </div>
            <Link href="/staff/classroom" className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All
            </Link>
          </div>

          {classrooms.length === 0 ? (
            <CenteredText text="No classrooms assigned yet." />
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {classrooms.slice(0, 6).map((classroom) => (
                <ClassroomPreview key={classroom.id} classroom={classroom} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-md border bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Today&apos;s Schedule</h2>
              <p className="mt-1 text-sm text-gray-500">Only your current school session timetable.</p>
            </div>
            <AiOutlineSchedule className="h-6 w-6 text-indigo-700" />
          </div>

          {todaysPeriods.length === 0 ? (
            <CenteredText text="No periods scheduled today." />
          ) : (
            <div className="mt-5 space-y-3">
              {todaysPeriods.slice(0, 8).map((period) => (
                <div key={period.id} className="rounded-md border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{period.subject ?? "Subject"}</div>
                      <div className="mt-1 text-sm text-gray-500">{period.classroom}</div>
                    </div>
                    <div className="shrink-0 text-sm font-medium text-gray-700">
                      {period.start_time.slice(0, 5)} - {period.end_time.slice(0, 5)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <QuickAction
          href="/staff/classroom"
          title="Open students"
          description="Review class lists and mark student attendance."
          Icon={AiOutlineTeam}
        />
        <QuickAction
          href="/staff/test"
          title="Upload marks"
          description="Create tests or exams and add manual or CSV results."
          Icon={AiOutlineFileText}
        />
        <QuickAction
          href="/staff/timetable"
          title="Check timetable"
          description="View day-wise class periods and common periods."
          Icon={AiOutlineSchedule}
        />
      </div>
    </div>
  );
}

function ClassroomPreview({ classroom }: { classroom: Classroom }) {
  return (
    <Link href={`/staff/classroom?classroom=${classroom.id}`} className="rounded-md border p-4 hover:border-indigo-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{classLabel(classroom)}</div>
          <div className="mt-1 text-sm text-gray-500">{classroom.class_teacher ?? "Class teacher not assigned"}</div>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {classroom.strength ?? 0} students
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-50 px-3 py-2">
          <div className="text-gray-500">Subjects</div>
          <div className="font-semibold">{classroom.no_of_subjects ?? "-"}</div>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-2">
          <div className="text-gray-500">Teachers</div>
          <div className="font-semibold">{classroom.no_of_teachers ?? "-"}</div>
        </div>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  title,
  description,
  Icon,
}: {
  href: string;
  title: string;
  description: string;
  Icon: typeof AiOutlineBank;
}) {
  return (
    <Link href={href} className="rounded-md border bg-white p-5 hover:border-indigo-300">
      <Icon className="h-7 w-7 text-indigo-700" />
      <div className="mt-4 text-lg font-semibold">{title}</div>
      <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
    </Link>
  );
}
