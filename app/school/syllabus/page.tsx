"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineAppstore, AiOutlineBars, AiOutlineSearch, AiOutlineUpload } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { clientFetchPage } from "@/lib/client-api";
import type { Syllabus } from "@/types/api";
import {matchesClassGroup} from "@/lib/utils";
import {CLASS_GROUPS, DEFAULT_TAB} from "@/lib/constants";
import SyllabusUploadForm from "./_components/upload-form";
import CenteredText from "@/app/_components/centered-text";
import Loading from "@/app/_components/loader";
import PaginationControls from "@/app/_components/pagination";

function classNameFromLabel(label: string) {
  return label.split(/[- ]/)[0]?.trim() ?? "";
}

export default function SyllabusPage() {
  const TABS: string[] = [DEFAULT_TAB, ...CLASS_GROUPS.keys()]

  const [uploadOpen, setUploadOpen] = useState(false);
  const [tabState, setTabState] = useState(DEFAULT_TAB);
  const [viewState, setViewState] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = viewState === "grid" ? 12 : 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, tabState, viewState]);

  const syllabusQuery = useQuery({
    queryKey: ["syllabus", page, pageSize],
    queryFn: () => clientFetchPage<Syllabus>("staff/syllabus/", { page, pageSize }),
  });

  const syllabus = useMemo(() => syllabusQuery.data?.results ?? [], [syllabusQuery.data]);
  const filteredSyllabus = useMemo(
    () =>
      syllabus
        .filter((item) => matchesClassGroup(classNameFromLabel(item.classroom_name), tabState))
        .filter((item) =>
          `${item.classroom_name} ${item.subject_name} ${item.tag ?? ""}`
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
        ),
    [searchQuery, syllabus, tabState],
  );
  const visibleGroups = tabState === DEFAULT_TAB ? [...CLASS_GROUPS.keys()] : [tabState];

  if (syllabusQuery.isPending) return <Loading />;
  if (syllabusQuery.isError) return <CenteredText className="text-red-600" text="Unable to load syllabus." />;

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">Syllabus</h1>
        <button type="button" onClick={() => setUploadOpen(true)} className="inline-flex w-fit items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
          <AiOutlineUpload className="mr-2 h-5 w-5" />
          Upload Syllabus
        </button>
      </div>

      <div className="mt-6 hidden w-full border-b-2 md:flex">
        {TABS.map((tab, index) => (
          <button key={tab} type="button" onClick={() => setTabState(tab)} className={`mx-4 border-b-2 px-1 pb-2 font-semibold ${tabState === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="my-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
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
        <div className="flex w-fit flex-row rounded-md bg-slate-100 p-1">
          <button type="button" className={`flex items-center rounded-md px-4 py-2 ${viewState === "grid" ? "bg-white font-semibold" : "text-gray-600"}`} onClick={() => setViewState("grid")}>
            <AiOutlineAppstore className="mr-2" />
            Grid
          </button>
          <button type="button" className={`flex items-center rounded-md px-4 py-2 ${viewState === "list" ? "bg-white font-semibold" : "text-gray-600"}`} onClick={() => setViewState("list")}>
            <AiOutlineBars className="mr-2" />
            List
          </button>
        </div>
      </div>

      {filteredSyllabus.length === 0 ? (
        <CenteredText text="No syllabus found." />
      ) : viewState === "grid" ? (
        <div>
          {visibleGroups.map((className) => {
            const data = filteredSyllabus.filter((item) => matchesClassGroup(classNameFromLabel(item.classroom_name), className));
            if (!data.length) return null;
            return (
              <section key={className} className="mt-2 flex flex-col">
                <h2 className="my-3 ml-2 flex text-2xl font-medium text-gray-800">{className} Standard</h2>
                <div className="mb-10 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.map((item) => <SyllabusCard key={item.id} syllabus={item} />)}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[780px]">
            <div className="grid grid-cols-5 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>Class</span>
              <span>Subject</span>
              <span>Tag</span>
              <span>Files</span>
              <span>Action</span>
            </div>
            {filteredSyllabus.map((item) => (
              <div key={item.id} className="grid grid-cols-5 border-t px-4 py-3 text-sm text-gray-800">
                <span>{item.classroom_name}</span>
                <span className="font-semibold">{item.subject_name}</span>
                <span>{item.tag ?? "-"}</span>
                <span>{item.attachments?.length ?? 0}</span>
                <AttachmentLinks attachments={item.attachments} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={syllabusQuery.data?.count ?? 0}
          isLoading={syllabusQuery.isFetching}
          onPageChange={setPage}
        />
      </div>

      {uploadOpen ? <SyllabusUploadForm onClose={() => setUploadOpen(false)} /> : null}
    </div>
  );
}

function SyllabusCard({ syllabus }: { syllabus: Syllabus }) {
  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <div className="text-lg font-semibold">{syllabus.subject_name}</div>
          <div className="text-sm text-gray-500">{syllabus.classroom_name}</div>
        </div>
        <FiFileText className="h-7 w-7 text-indigo-700" />
      </div>
      <div className="mt-4 text-sm text-gray-600">{syllabus.tag || "No tag"}</div>
      <div className="mt-4">
        <AttachmentLinks attachments={syllabus.attachments} />
      </div>
    </div>
  );
}

function AttachmentLinks({ attachments }: { attachments?: string[] }) {
  if (!attachments?.length) return <span className="text-sm text-gray-500">No files</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment, index) => (
        <a key={`${attachment}-${index}`} href={attachment} target="_blank" rel="noreferrer" className="rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
          File {index + 1}
        </a>
      ))}
    </div>
  );
}
