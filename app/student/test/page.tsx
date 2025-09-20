"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineSearch } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { clientFetchPage } from "@/lib/client-api";
import type { ExamResult } from "@/types/api";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import PaginationControls from "@/app/_components/pagination";

const RESULTS_PAGE_SIZE = 10;

function percentage(score: number, max?: number) {
  if (!max) return "-";
  return `${Math.round((score / max) * 100)}%`;
}

export default function StudentTestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const resultsQuery = useQuery({
    queryKey: ["student", "results", page, RESULTS_PAGE_SIZE],
    queryFn: () => clientFetchPage<ExamResult>("student/result", { page, pageSize: RESULTS_PAGE_SIZE }),
  });

  const results = useMemo(() => resultsQuery.data?.results ?? [], [resultsQuery.data]);
  const filtered = useMemo(
    () =>
      results.filter((result) =>
        `${result.exam_tag ?? ""} ${result.subject_name ?? ""} ${result.date_of_exam ?? ""}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [results, searchQuery],
  );

  const average = useMemo(() => {
    const graded = results.filter((result) => result.max_marks);
    if (!graded.length) return 0;
    const total = graded.reduce((sum, result) => sum + result.score / Number(result.max_marks), 0);
    return Math.round((total / graded.length) * 100);
  }, [results]);

  if (resultsQuery.isPending) return <Loading />;
  if (resultsQuery.isError) return <CenteredText className="text-red-600" text="Unable to load results." />;

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Test and Exam</h1>
          <p className="mt-1 text-sm text-gray-500">Uploaded marks and report summary.</p>
        </div>
        <div className="rounded-md border bg-white px-4 py-3">
          <div className="text-xs font-medium uppercase text-gray-500">Page Average</div>
          <div className="text-2xl font-semibold text-indigo-700">{average}%</div>
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
            placeholder="Search results"
            autoComplete="off"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <CenteredText text="No results found." />
      ) : (
        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[1.2fr_1fr_140px_140px_140px] bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>Exam</span>
              <span>Subject</span>
              <span>Date</span>
              <span>Marks</span>
              <span>Percentage</span>
            </div>
            {filtered.map((result) => (
              <div key={result.id} className="grid grid-cols-[1.2fr_1fr_140px_140px_140px] border-t px-4 py-3 text-sm">
                <span className="inline-flex items-center font-semibold">
                  <FiFileText className="mr-2 text-indigo-700" />
                  {result.exam_tag ?? `Exam ${result.exam}`}
                </span>
                <span>{result.subject_name ?? "-"}</span>
                <span>{result.date_of_exam ?? "-"}</span>
                <span>
                  {result.score}/{result.max_marks ?? "-"}
                </span>
                <span>{percentage(result.score, result.max_marks)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={RESULTS_PAGE_SIZE}
          total={resultsQuery.data?.count ?? 0}
          isLoading={resultsQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
