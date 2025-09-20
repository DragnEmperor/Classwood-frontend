"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientFetch, clientFetchPage } from "@/lib/client-api";
import { classLabel } from "@/lib/utils";
import { useToast } from "@/app/_components/toast-provider";
import Modal from "@/app/_components/modal";
import Field from "@/app/_components/field";
import type { Classroom, Subject } from "@/types/api";

export default function SyllabusUploadForm({ onClose, scope = "school" }: { onClose: () => void; scope?: "school" | "staff" }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [classroomId, setClassroomId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [tag, setTag] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const classroomQueryKey = scope === "school" ? ["classrooms"] : ["staff", "classrooms"];
  const classroomQueryUrl = scope === "school" ? "list/classroom/" : "staff/classroom/";

  const classroomsQuery = useQuery({
    queryKey: classroomQueryKey,
    queryFn: () => clientFetchPage<Classroom>(classroomQueryUrl, { pageSize: 100 }),
  });
  const classrooms = classroomsQuery.data?.results ?? [];
  const selectedClassroomId = classroomId || classrooms[0]?.id || "";

  const subjectsQuery = useQuery({
    queryKey: ["staff", "subjects",  selectedClassroomId],
    queryFn: () => clientFetchPage<Subject>(`staff/subject/?classroom=${selectedClassroomId}`, { pageSize: 100 }),
    enabled: Boolean(selectedClassroomId),
  });
  const subjects = subjectsQuery.data?.results ?? [];

  const mutation = useMutation({
    mutationFn: async () => {
      const finalClassroom = selectedClassroomId;
      const finalSubject = subjectId || subjects[0]?.id || "";
      if (!finalClassroom || !finalSubject) throw new Error("Select class and subject.");

      const formData = new FormData();
      formData.append("classroom", finalClassroom);
      formData.append("subject", finalSubject);
      if (tag.trim()) formData.append("tag", tag.trim());
      Array.from(files ?? []).forEach((file) => formData.append("attachments", file));

      await clientFetch("staff/syllabus/", { method: "POST", body: formData });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff", "syllabus"] });
      toast.success("Syllabus saved successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to save syllabus"),
  });

  return (
    <Modal title="Add Syllabus" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid gap-5 md:grid-cols-2">
        <Field label="Class">
          <select
            value={selectedClassroomId}
            onChange={(event) => {
              setClassroomId(event.target.value);
              setSubjectId("");
            }}
            className="input"
          >
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classLabel(classroom)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Subject">
          <select value={subjectId || subjects[0]?.id || ""} onChange={(event) => setSubjectId(event.target.value)} className="input">
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </Field>
        </div>
        <Field label="Title/Tag">
          <input value={tag} onChange={(event) => setTag(event.target.value)} className="input" placeholder="Optional chapter or term name" />
        </Field>
        <Field label="Attachment">
            <label className="mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
        <span className="font-semibold text-gray-600">{files?.[0] ? files[0].name : "Click to upload syllabus file"}</span>
        <span className="mt-1 text-sm text-gray-500">PDF, image, or document</span>
        <input type="file" className="hidden" onChange={(event) => setFiles(event.target.files)} />
      </label>
        </Field>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t pt-4">
        <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 font-medium text-gray-700">
          Cancel
        </button>
        <button
          type="button"
          disabled={mutation.isPending || classroomsQuery.isPending || subjectsQuery.isPending}
          onClick={() => mutation.mutate()}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}
