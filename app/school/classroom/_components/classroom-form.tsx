"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import type { Classroom, Staff} from "@/types/api";
import { useToast } from "@/app/_components/toast-provider";
import { FiTrash2} from "react-icons/fi";
import Field from "@/app/_components/field";
import Modal from "@/app/_components/modal";
import {TeacherSelect, staffLabel} from "./teacher-select";
import {
  AiFillFileExcel
} from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import ModalActions from "./modal-actions";

const CLASS_OPTIONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "LKG",
  "UKG",
  "Nursery",
  "Pre Nursery",
];

interface ClassFormState {
  className: string;
  sectionName: string;
  classTeacherId: string;
  subClassTeacherId: string;
}

interface ClassroomCreateResponse {
  message: string;
  data: Classroom;
}

interface SubjectDraft {
  id: string;
  name: string;
  teacherId: string;
}

function findStaffByName(staff: Staff[], name: string | undefined) {
  if (!name || name === "not assigned") return null;
  return staff.find((item) => staffLabel(item) === name) ?? null;
}

function newSubjectDraft(staff: Staff[]): SubjectDraft {
  return {
    id: crypto.randomUUID(),
    name: "",
    teacherId: String(staff[0]?.user.id ?? ""),
  };
}

export default function ClassroomFormModal({
  mode,
  classroom,
  staff,
  onClose,
}: {
  mode: "add" | "edit";
  classroom: Classroom | null;
  staff: Staff[];
  onClose: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const existingClassTeacher = findStaffByName(staff, classroom?.class_teacher);
  const existingSubTeacher = findStaffByName(staff, classroom?.sub_class_teacher);
  const [form, setForm] = useState<ClassFormState>({
    className: classroom?.class_name ?? CLASS_OPTIONS[0],
    sectionName: classroom?.section_name ?? "",
    classTeacherId: existingClassTeacher ? String(existingClassTeacher.user.id) : String(staff[0]?.user.id ?? ""),
    subClassTeacherId: existingSubTeacher ? String(existingSubTeacher.user.id) : String(staff[0]?.user.id ?? ""),
  });
  const [subjectDrafts, setSubjectDrafts] = useState<SubjectDraft[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const section = form.sectionName.trim().toUpperCase();
      if (!section) throw new Error("Class section is required");
      if (section.length > 3) throw new Error("Class section is too long");
      if (!form.classTeacherId || !form.subClassTeacherId) throw new Error("Select class teachers");
      for (const subject of subjectDrafts) {
        if (!subject.name.trim() || !subject.teacherId) {
          throw new Error("Complete or remove every optional subject row");
        }
      }

      const body = {
        class_name: form.className,
        section_name: section,
        class_teacher: form.classTeacherId,
        sub_class_teacher: form.subClassTeacherId,
      };

      if (mode === "edit" && classroom) {
        return clientFetch(`list/classroom/${classroom.id}/`, { method: "PATCH", body });
      }

      const created = await clientFetch<ClassroomCreateResponse>("list/classroom/", {
        method: "POST",
        body,
      });
      const classroomId = created.data.id;

      for (const subject of subjectDrafts) {
        await clientFetch("staff/subject/", {
          method: "POST",
          body: {
            name: subject.name.trim(),
            teacher: subject.teacherId,
            classroom: classroomId,
          },
        });
      }

      if (csvFile) {
        const formData = new FormData();
        formData.append("classroom", classroomId);
        formData.append("csv_file", csvFile);
        await clientFetch("staff/student/", {
          method: "POST",
          body: formData,
        });
      }

      return created;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
        queryClient.invalidateQueries({ queryKey: ["subjects"] }),
        queryClient.invalidateQueries({ queryKey: ["students"] }),
      ]);
      toast.success(mode === "add" ? "Classroom created" : "Classroom updated");
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to save classroom");
    },
  });

  return (
    <Modal title={mode === "add" ? "Add Class" : "Edit Class"} onClose={onClose}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Class">
          <select
            value={form.className}
            onChange={(event) => setForm((current) => ({ ...current, className: event.target.value }))}
            className="input"
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Section">
          <input
            value={form.sectionName}
            onChange={(event) => setForm((current) => ({ ...current, sectionName: event.target.value }))}
            className="input"
            placeholder="A"
          />
        </Field>
        <Field label="Class Teacher">
          <TeacherSelect
            staff={staff}
            value={form.classTeacherId}
            onChange={(value) => setForm((current) => ({ ...current, classTeacherId: value }))}
          />
        </Field>
        <Field label="Sub Teacher">
          <TeacherSelect
            staff={staff}
            value={form.subClassTeacherId}
            onChange={(value) => setForm((current) => ({ ...current, subClassTeacherId: value }))}
          />
        </Field>
      </div>

      {mode === "add" ? (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Subjects</h3>
              <p className="mt-1 text-sm text-gray-500">Optional while creating the class.</p>
            </div>
            <button
              type="button"
              onClick={() => setSubjectDrafts((current) => [...current, newSubjectDraft(staff)])}
              className="inline-flex items-center rounded-md px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
            >
              <IoMdAddCircleOutline className="mr-2" />
              Add Subject
            </button>
          </div>

          {subjectDrafts.length > 0 ? (
            <div className="mt-4 space-y-3">
              {subjectDrafts.map((subject) => (
                <div key={subject.id} className="grid gap-3 md:grid-cols-[1fr_1fr_44px]">
                  <input
                    value={subject.name}
                    onChange={(event) =>
                      setSubjectDrafts((current) =>
                        current.map((item) =>
                          item.id === subject.id ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                    className="input"
                    placeholder="Subject"
                  />
                  <TeacherSelect
                    staff={staff}
                    value={subject.teacherId}
                    onChange={(value) =>
                      setSubjectDrafts((current) =>
                        current.map((item) =>
                          item.id === subject.id ? { ...item, teacherId: value } : item,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSubjectDrafts((current) => current.filter((item) => item.id !== subject.id))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                    aria-label="Remove subject"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Students CSV</h3>
                <p className="mt-1 text-sm text-gray-500">Optional bulk upload after the class is created.</p>
              </div>
              <a
                href="/Test-Student.csv"
                download
                className="inline-flex items-center rounded-md border border-dashed border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              >
                <AiFillFileExcel className="mr-2" />
                Download Example
              </a>
            </div>
            <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
              <AiFillFileExcel className="mb-2 h-8 w-8 text-gray-400" />
              <span className="font-semibold text-gray-600">
                {csvFile ? csvFile.name : "Click to upload student CSV"}
              </span>
              <span className="mt-1 text-xs text-gray-500">CSV format only</span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>
      ) : null}

      <ModalActions
        submitLabel={mutation.isPending ? "Saving..." : mode === "add" ? "Create Class" : "Update"}
        disabled={mutation.isPending}
        onSubmit={() => mutation.mutate()}
      />
    </Modal>
  );
}