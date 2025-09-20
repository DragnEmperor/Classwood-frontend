"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineBook, AiOutlineSearch } from "react-icons/ai";
import { clientFetchPage } from "@/lib/client-api";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import type { Subject, Syllabus } from "@/types/api";
import PaginationControls from "@/app/_components/pagination";

const SUBJECTS_PAGE_SIZE = 12;

export default function StudentSubjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const subjectsQuery = useQuery({
    queryKey: ["student", "subjects", page, SUBJECTS_PAGE_SIZE],
    queryFn: () => clientFetchPage<Subject>("student/subjects", { page, pageSize: SUBJECTS_PAGE_SIZE }),
  });
  const syllabusQuery = useQuery({
    queryKey: ["student", "syllabus"],
    queryFn: () => clientFetchPage<Syllabus>("student/syllabus", { pageSize: 100 }),
  });

  const subjects = useMemo(() => subjectsQuery.data?.results ?? [], [subjectsQuery.data]);
  const syllabi = useMemo(() => syllabusQuery.data?.results ?? [], [syllabusQuery.data]);
  const filteredSubjects = useMemo(
    () =>
      subjects.filter((subject) =>
        `${subject.name} ${subject.teacher ?? ""}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [searchQuery, subjects],
  );

  if (subjectsQuery.isPending || syllabusQuery.isPending) return <Loading />;
  if (subjectsQuery.isError || syllabusQuery.isError) return <CenteredText className="text-red-600" text="Unable to load subjects." />;

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">My Courses</h1>
          <p className="mt-1 text-sm text-gray-500">Subjects, teachers, and uploaded syllabus.</p>
        </div>
      </div>

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
            placeholder="Search subjects"
            autoComplete="off"
          />
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <CenteredText text="No subjects found." />
      ) : (
        <div className="grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSubjects.map((subject) => {
            const subjectSyllabus = syllabi.filter((item) => item.subject === subject.id || item.subject_name === subject.name);
            return (
              <div key={subject.id} className="rounded-md border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div>
                    <div className="text-lg font-semibold">{subject.name}</div>
                    <div className="mt-1 text-sm text-gray-500">{subject.teacher ?? "Teacher not assigned"}</div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
                    <AiOutlineBook className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500">Syllabus</div>
                  {subjectSyllabus.length === 0 ? (
                    <div className="mt-2 text-sm text-gray-600">No syllabus uploaded.</div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {subjectSyllabus.map((item) => (
                        <div key={item.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                          <div className="font-medium">{item.tag || item.subject_name}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            {item.attachments?.length ? `${item.attachments.length} attachment(s)` : "No attachments"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={SUBJECTS_PAGE_SIZE}
          total={subjectsQuery.data?.count ?? 0}
          isLoading={subjectsQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
