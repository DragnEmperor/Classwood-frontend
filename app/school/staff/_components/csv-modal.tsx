"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import Modal from "@/app/_components/modal";
import { AiFillFileExcel } from "react-icons/ai";

export default function StaffCsvModal({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!csvFile) throw new Error("Select a staff CSV file");
      const formData = new FormData();
      formData.append("csv_file", csvFile);
      return clientFetch("list/staff/", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff uploaded successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to upload staff"),
  });

  return (
    <Modal title="Upload Staff CSV" onClose={onClose}>
      <a
        href="/Test-Staff.csv"
        download
        className="inline-flex items-center rounded-md border border-dashed border-indigo-300 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
      >
        <AiFillFileExcel className="mr-2 h-5 w-5" />
        Download Example
      </a>
      <label className="mt-6 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center hover:bg-gray-100">
        <AiFillFileExcel className="mb-3 h-10 w-10 text-gray-400" />
        <span className="text-xl font-semibold text-gray-600">
          {csvFile ? csvFile.name : "Staff CSV"}
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
      <div className="mt-6 flex justify-end border-t pt-5">
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
          className="rounded-md bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Uploading..." : "Upload Staff"}
        </button>
      </div>
    </Modal>
  );
}