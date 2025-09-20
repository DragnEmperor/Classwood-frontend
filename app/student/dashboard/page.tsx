"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AiOutlineBook,
  AiOutlineCalendar,
  AiOutlineCreditCard,
  AiOutlineEdit,
} from "react-icons/ai";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import StatCard from "@/app/_components/stat-card";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import type {
  ExamResult,
  Notice,
  SchoolEvent,
  Student,
  StudentFeesResponse,
  Subject,
  ThoughtOfTheDay,
} from "@/types/api";

function money(value?: string | number) {
  return `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function attendanceStats(values?: number[]) {
  const marked = values?.filter(Boolean) ?? [];
  const present = marked.filter((value) => value === 2).length;
  const absent = marked.filter((value) => value === 1).length;
  const percentage = marked.length ? Math.round((present / marked.length) * 100) : 0;
  return { present, absent, percentage };
}

export default function StudentDashboardPage() {
  const studentQuery = useQuery({
    queryKey: ["student", "me"],
    queryFn: () => clientFetch<Student>("student/me"),
  });
  const subjectsQuery = useQuery({
    queryKey: ["student", "subjects"],
    queryFn: () => clientFetchPage<Subject>("student/subjects", { pageSize: 6 }),
  });
  const resultsQuery = useQuery({
    queryKey: ["student", "results"],
    queryFn: () => clientFetchPage<ExamResult>("student/result", { pageSize: 6 }),
  });
  const feesQuery = useQuery({
    queryKey: ["student", "fees"],
    queryFn: () => clientFetch<StudentFeesResponse>("student/fees"),
  });
  const noticesQuery = useQuery({
    queryKey: ["student", "notices"],
    queryFn: () => clientFetchPage<Notice>("list/notice/", { pageSize: 5 }),
  });
  const eventsQuery = useQuery({
    queryKey: ["student", "events"],
    queryFn: () => clientFetchPage<SchoolEvent>("list/event/", { pageSize: 5 }),
  });
  const thoughtQuery = useQuery({
    queryKey: ["student", "thought"],
    queryFn: () => clientFetch<ThoughtOfTheDay>("student/thoughtDay"),
    retry: false,
  });

  const student = studentQuery.data;
  const subjects = subjectsQuery.data?.results ?? [];
  const results = resultsQuery.data?.results ?? [];
  const notices = noticesQuery.data?.results ?? [];
  const events = eventsQuery.data?.results ?? [];
  const attendance = attendanceStats(student?.month_attendance);

  if (studentQuery.isPending || subjectsQuery.isPending || resultsQuery.isPending || feesQuery.isPending) {
    return <Loading />;
  }

  if (studentQuery.isError) {
    return <CenteredText className="text-red-600" text="Unable to load student dashboard." />;
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance" value={`${attendance.percentage}%`} Icon={AiOutlineCalendar} />
        <StatCard label="Subjects" value={subjectsQuery.data?.count ?? subjects.length} Icon={AiOutlineBook} href="/student/subject" />
        <StatCard label="Results" value={resultsQuery.data?.count ?? results.length} Icon={AiOutlineEdit} href="/student/test" />
        <StatCard label="Balance Due" value={money(feesQuery.data?.balance_due)} Icon={AiOutlineCreditCard} href="/student/fees" />
      </div>

      {thoughtQuery.data?.content ? (
        <section className="mt-8 rounded-md border bg-white p-5">
          <div className="text-sm font-medium text-gray-500">Thought of the day</div>
          <p className="mt-2 text-xl font-semibold text-gray-900">{thoughtQuery.data.content}</p>
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <section className="rounded-md border bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">My Subjects</h1>
              <p className="mt-1 text-sm text-gray-500">{student?.classroom ?? "Current class"}</p>
            </div>
            <Link href="/student/subject" className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All
            </Link>
          </div>

          {subjects.length === 0 ? (
            <CenteredText text="No subjects found." />
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {subjects.slice(0, 6).map((subject) => (
                <Link key={subject.id} href="/student/subject" className="rounded-md border p-4 hover:border-indigo-300">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{subject.name}</div>
                      <div className="mt-1 text-sm text-gray-500">{subject.teacher ?? "Teacher not assigned"}</div>
                    </div>
                    <AiOutlineBook className="h-6 w-6 text-indigo-700" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-md border bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Results</h2>
              <p className="mt-1 text-sm text-gray-500">Latest uploaded marks.</p>
            </div>
            <Link href="/student/test" className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Open
            </Link>
          </div>

          {results.length === 0 ? (
            <CenteredText text="No results found." />
          ) : (
            <div className="mt-5 space-y-3">
              {results.slice(0, 6).map((result) => (
                <div key={result.id} className="rounded-md border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{result.exam_tag ?? `Exam ${result.exam}`}</div>
                      <div className="mt-1 text-sm text-gray-500">{result.subject_name ?? "Subject"}</div>
                    </div>
                    <div className="shrink-0 font-semibold text-indigo-700">
                      {result.score}/{result.max_marks ?? "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <FeedPanel title="Notices" items={notices.slice(0, 5).map((item) => ({ id: item.id, title: item.title, meta: item.date_posted, body: item.description }))} loading={noticesQuery.isPending} />
        <FeedPanel title="Events" items={events.slice(0, 5).map((item) => ({ id: item.id, title: item.title, meta: item.date, body: item.description }))} loading={eventsQuery.isPending} />
      </div>
    </div>
  );
}

function FeedPanel({
  title,
  items,
  loading,
}: {
  title: string;
  items: Array<{ id: string | number; title: string; meta: string; body?: string }>;
  loading: boolean;
}) {
  return (
    <section className="rounded-md border bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      {loading ? (
        <CenteredText text="Loading..." />
      ) : items.length === 0 ? (
        <CenteredText text={`No ${title.toLowerCase()} found.`} />
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border px-4 py-3">
              <div className="font-semibold">{item.title}</div>
              <div className="mt-1 text-xs text-gray-500">{item.meta}</div>
              {item.body ? <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.body}</p> : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
