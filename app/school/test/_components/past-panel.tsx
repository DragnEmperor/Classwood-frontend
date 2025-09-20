"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientFetchPage } from "@/lib/client-api";
import type { Exam } from "@/types/api";
import { AiOutlineSearch } from "react-icons/ai";
import { FiEye, FiFileText } from "react-icons/fi";
import Loading from "@/app/_components/loader";
import CenteredText from "@/app/_components/centered-text";
import PaginationControls from "@/app/_components/pagination";

const EXAMS_PAGE_SIZE = 12;

export default function PastExamsPanel({ onOpen }: { onOpen: (exam: Exam) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const examsQuery = useQuery({
    queryKey: ["exams", page, EXAMS_PAGE_SIZE],
    queryFn: () => clientFetchPage<Exam>("staff/exam/", { page, pageSize: EXAMS_PAGE_SIZE }),
  });
  const exams = useMemo(() => examsQuery.data?.results ?? [], [examsQuery.data]);
  const filtered = useMemo(
    () =>
      exams.filter((exam) =>
        `${exam.classroom_name} ${exam.subject_name} ${exam.tag}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [exams, searchQuery],
  );

  if (examsQuery.isPending) return <Loading />;
  if (examsQuery.isError) return <CenteredText className="text-red-600" text="Unable to load exams." />;

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative text-gray-600 focus-within:text-gray-500">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <AiOutlineSearch />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-md border bg-white py-2 pl-10 pr-3 text-sm text-gray-900 focus:outline-none sm:w-[320px]"
            placeholder="Search exams"
            autoComplete="off"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <CenteredText text="No test found." />
      ) : (
        <div className="grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((exam) => (
            <button key={exam.id} type="button" onClick={() => onOpen(exam)} className="rounded-md border bg-white p-4 text-left shadow-sm hover:border-indigo-300">
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <div className="text-lg font-semibold">{exam.tag}</div>
                  <div className="text-sm text-gray-500">{exam.classroom_name} · {exam.subject_name}</div>
                </div>
                <FiFileText className="h-6 w-6 text-indigo-700" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Date</div>
                  <div className="font-semibold">{exam.date_of_exam}</div>
                </div>
                <div>
                  <div className="text-gray-500">Marks</div>
                  <div className="font-semibold">{exam.max_marks}</div>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-indigo-700">
                <FiEye className="mr-2" />
                View Results
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={EXAMS_PAGE_SIZE}
          total={examsQuery.data?.count ?? 0}
          isLoading={examsQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
