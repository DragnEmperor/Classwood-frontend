"use client";

import { Exam } from "@/types/api";
import { useMemo, useState } from "react";
import { clientFetchPage } from "@/lib/client-api";
import { useQuery } from "@tanstack/react-query";
import CenteredText from "@/app/_components/centered-text";
import { FiX } from "react-icons/fi";
import { ExamResult } from "@/types/api";
import PaginationControls from "@/app/_components/pagination";

const RESULTS_PAGE_SIZE = 20;

export default function ExamResultsDrawer({ exam, onClose }: { exam: Exam; onClose: () => void }) {
  const [page, setPage] = useState(1);
  const resultsQuery = useQuery({
    queryKey: ["results", exam.id, page, RESULTS_PAGE_SIZE],
    queryFn: () => clientFetchPage<ExamResult>(`staff/result/?exam=${exam.id}`, { page, pageSize: RESULTS_PAGE_SIZE }),
  });
  const results = useMemo(() => resultsQuery.data?.results ?? [], [resultsQuery.data]);

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-4xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">{exam.tag}</h2>
            <p className="mt-1 text-sm text-gray-500">{exam.classroom_name} · {exam.subject_name} · {exam.date_of_exam}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <FiX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {resultsQuery.isPending ? (
            <CenteredText text="Loading results..." />
          ) : results.length === 0 ? (
            <CenteredText text="No results found." />
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[1fr_160px_160px] bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
                  <span>Student</span>
                  <span>Total Marks</span>
                  <span>Marks Gained</span>
                </div>
                {results.map((result) => (
                  <div key={result.id} className="grid grid-cols-[1fr_160px_160px] border-t px-4 py-3 text-sm">
                    <span className="font-semibold">{result.student_name}</span>
                    <span>{exam.max_marks}</span>
                    <span>{result.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-t px-6 py-5">
          <PaginationControls
            page={page}
            pageSize={RESULTS_PAGE_SIZE}
            total={resultsQuery.data?.count ?? 0}
            isLoading={resultsQuery.isFetching}
            onPageChange={setPage}
          />
        </div>
      </aside>
    </div>
  );
}
