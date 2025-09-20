"use client";

import { FiX } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import { useState } from "react";
import Field from "@/app/_components/field";
import { classLabel } from "@/lib/utils";
import type { Classroom, Student } from "@/types/api";

const GENDERS = [
  { id: "1", name: "Male" },
  { id: "2", name: "Female" },
  { id: "3", name: "Other" },
];

const emptyStudentForm = {
  first_name: "",
  last_name: "",
  father_name: "",
  mother_name: "",
  gender: "1",
  contact_email: "",
  parent_mobile_number: "",
  date_of_birth: "",
  date_of_admission: "",
  roll_no: "",
  admission_no: "",
  address: "",
  parent_account_no: "",
};

function genderId(value?: string) {
  if (value === "Male") return "1";
  if (value === "Female") return "2";
  if (value === "Other") return "3";
  return value ?? "1";
}

function initialStudentForm(student?: Student | null) {
  if (!student) return emptyStudentForm;
  return {
    first_name: student.first_name ?? "",
    last_name: student.last_name ?? "",
    father_name: student.father_name ?? "",
    mother_name: student.mother_name ?? "",
    gender: genderId(student.gender),
    contact_email: student.contact_email ?? "",
    parent_mobile_number: student.parent_mobile_number ?? "",
    date_of_birth: student.date_of_birth ?? "",
    date_of_admission: student.date_of_admission ?? "",
    roll_no: student.roll_no ?? "",
    admission_no: student.admission_no ?? "",
    address: student.address ?? "",
    parent_account_no: student.parent_account_no ?? "",
  };
}

export default function StudentDrawer({
  classroom,
  classrooms = classroom ? [classroom] : [],
  student = null,
  onClose,
}: {
  classroom?: Classroom;
  classrooms?: Classroom[];
  student?: Student | null;
  onClose: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initialStudentForm(student));
  const [classroomId, setClassroomId] = useState(student?.classroom_id ?? classroom?.id ?? classrooms[0]?.id ?? "");
  const mode = student ? "edit" : "add";
  const selectedClassroom = classrooms.find((item) => item.id === classroomId) ?? classroom ?? null;

  const mutation = useMutation({
    mutationFn: () => {
      const required: Array<keyof typeof emptyStudentForm> = [
        "first_name",
        "last_name",
        "father_name",
        "mother_name",
        "date_of_birth",
        "date_of_admission",
        "roll_no",
        "admission_no",
        "address",
      ];
      for (const key of required) {
        if (!form[key].trim()) throw new Error("Complete the required student fields");
      }
      if (!classroomId) throw new Error("Select a classroom");

      const formData = new FormData();
      if (profileImage) formData.append("profile_pic", profileImage);
      for (const [key, value] of Object.entries(form)) {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
      formData.append("classroom", classroomId);

      return clientFetch(mode === "edit" ? `staff/student/${student?.user.id}/` : "staff/student/", {
        method: mode === "edit" ? "PATCH" : "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students"] }),
        queryClient.invalidateQueries({ queryKey: ["school", "students"] }),
        queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
      ]);
      toast.success(mode === "edit" ? "Student updated successfully" : "Student added successfully");
      setForm(emptyStudentForm);
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to save student"),
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  function update(key: keyof typeof emptyStudentForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">{mode === "edit" ? "Edit Student" : "Add Student"}</h2>
            <p className="mt-1 text-sm text-gray-500">{selectedClassroom ? classLabel(selectedClassroom) : "Select classroom"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close student drawer"
          >
            <FiX />
          </button>
        </div>
        <div className="flex-1 px-6 py-5">
          <div className="grid gap-5 md:grid-cols-2">
            {classrooms.length > 1 ? (
              <Field label="Class">
                <select className="input" value={classroomId} onChange={(e) => setClassroomId(e.target.value)}>
                  {classrooms.map((item) => (
                    <option key={item.id} value={item.id}>
                      {classLabel(item)}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}
            <Field label="First Name">
              <input className="input" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
            </Field>
            <Field label="Last Name">
              <input className="input" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
            </Field>
            <Field label="Father's Name">
              <input className="input" value={form.father_name} onChange={(e) => update("father_name", e.target.value)} />
            </Field>
            <Field label="Mother's Name">
              <input className="input" value={form.mother_name} onChange={(e) => update("mother_name", e.target.value)} />
            </Field>
            <Field label="Gender">
              <select className="input" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                {GENDERS.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Email">
              <input className="input" type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
            </Field>
            <Field label="Parent Phone">
              <input className="input" value={form.parent_mobile_number} onChange={(e) => update("parent_mobile_number", e.target.value)} />
            </Field>
            <Field label="Parent Account No">
              <input className="input" value={form.parent_account_no} onChange={(e) => update("parent_account_no", e.target.value)} />
            </Field>
            <Field label="Date of Birth">
              <input className="input" type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} />
            </Field>
            <Field label="Date of Admission">
              <input className="input" type="date" value={form.date_of_admission} onChange={(e) => update("date_of_admission", e.target.value)} />
            </Field>
            <Field label="Roll No">
              <input className="input" value={form.roll_no} onChange={(e) => update("roll_no", e.target.value)} />
            </Field>
            <Field label="Admission No">
              <input className="input" value={form.admission_no} onChange={(e) => update("admission_no", e.target.value)} />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Address">
              <textarea
                className="input min-h-24"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-6">
            <span className="mb-2 block font-semibold text-gray-800">Profile Picture</span>
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
              <span className="font-semibold text-gray-600">
                {profileImage ? profileImage.name : "Student profile image"}
              </span>
              <span className="mt-1 text-sm text-gray-500">{profileImage ? "Click to change" : "Click to upload"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>
        <div className="border-t px-6 py-5">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : mode === "edit" ? "Update Student" : "Save Student"}
          </button>
        </div>
      </aside>
    </div>
  );
}
