"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineSearch } from "react-icons/ai";
import { clientFetchPage } from "@/lib/client-api";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import SyllabusUploadForm from "@/app/school/syllabus/_components/upload-form";
import type { Syllabus } from "@/types/api";
import PaginationControls from "@/app/_components/pagination";

const SYLLABUS_PAGE_SIZE = 12;

export default function StaffSyllabusPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const syllabusQuery = useQuery({
    queryKey: ["staff", "syllabus", page, SYLLABUS_PAGE_SIZE],
    queryFn: () => clientFetchPage<Syllabus>("staff/syllabus/", { page, pageSize: SYLLABUS_PAGE_SIZE }),
  });

  const syllabi = useMemo(() => syllabusQuery.data?.results ?? [], [syllabusQuery.data]);
  const filtered = useMemo(
    () =>
      syllabi.filter((item) =>
        `${item.classroom_name} ${item.subject_name} ${item.tag ?? ""}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [searchQuery, syllabi],
  );

  if (syllabusQuery.isPending) return <Loading />;
  if (syllabusQuery.isError) return <CenteredText className="text-red-600" text="Unable to load syllabus." />;

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Syllabus</h1>
          <p className="mt-1 text-sm text-gray-500">Syllabus entries for classes you teach or manage.</p>
        </div>
        <button type="button" onClick={() => setOpenForm(true)} className="w-fit rounded-md bg-indigo-600 px-4 py-2 font-medium text-white">
          Add Syllabus
        </button>
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
            placeholder="Search syllabus"
            autoComplete="off"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <CenteredText text="No syllabus found." />
      ) : (
        <div className="grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-md border bg-white p-4 shadow-sm">
              <div className="border-b pb-3">
                <div className="text-lg font-semibold">{item.tag || item.subject_name}</div>
                <div className="mt-1 text-sm text-gray-500">{item.classroom_name} · {item.subject_name}</div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {item.attachments?.length ? `${item.attachments.length} attachment(s)` : "No attachments"}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={SYLLABUS_PAGE_SIZE}
          total={syllabusQuery.data?.count ?? 0}
          isLoading={syllabusQuery.isFetching}
          onPageChange={setPage}
        />
      </div>

      {openForm ? <SyllabusUploadForm onClose={() => setOpenForm(false)} scope="staff"/> : null}
    </div>
  );
}
