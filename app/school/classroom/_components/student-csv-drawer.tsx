"use client";

import { FiX } from "react-icons/fi";
import { AiFillFileExcel } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import { useState } from "react";
import { classLabel } from "@/lib/utils";
import type { Classroom } from "@/types/api";

export default function StudentCsvDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!csvFile) throw new Error("Select a student CSV file");
      const formData = new FormData();
      formData.append("classroom", classroom.id);
      formData.append("csv_file", csvFile);
      return clientFetch("staff/student/", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students", classroom.id] }),
        queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
      ]);
      toast.success("Students uploaded successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to upload students"),
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Upload Students CSV</h2>
            <p className="mt-1 text-sm text-gray-500">{classLabel(classroom)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close CSV upload drawer"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 px-6 py-6">
          <a
            href="/Test-Student.csv"
            download
            className="inline-flex items-center rounded-md border border-dashed border-indigo-300 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
          >
            <AiFillFileExcel className="mr-2 h-5 w-5" />
            Download Example
          </a>

          <label className="mt-6 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center hover:bg-gray-100">
            <AiFillFileExcel className="mb-3 h-10 w-10 text-gray-400" />
            <span className="text-xl font-semibold text-gray-600">
              {csvFile ? csvFile.name : "Student CSV"}
            </span>
            <span className="mt-2 font-medium text-gray-500">
              {csvFile ? "Click to change" : "Click to upload"}
            </span>
            <span className="mt-1 text-xs text-gray-500">Only CSV format allowed</span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="border-t px-6 py-5">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Uploading..." : "Upload Students"}
          </button>
        </div>
      </aside>
    </div>
  );
}