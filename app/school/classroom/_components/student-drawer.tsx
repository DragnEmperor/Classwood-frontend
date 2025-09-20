"use client";

import { FiX } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import { useState } from "react";
import Field from "@/app/_components/field";
import { classLabel } from "@/lib/utils";
import type { Classroom } from "@/types/api";

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

export default function StudentDrawer({ classroom, onClose }: { classroom: Classroom; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyStudentForm);

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

      return clientFetch("staff/student/", {
        method: "POST",
        body: {
          ...form,
          classroom: classroom.id,
        },
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students", classroom.id] }),
        queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
      ]);
      toast.success("Student added successfully");
      setForm(emptyStudentForm);
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to add student"),
  });

  function update(key: keyof typeof emptyStudentForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Add Student</h2>
            <p className="mt-1 text-sm text-gray-500">{classLabel(classroom)}</p>
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
        </div>
        <div className="border-t px-6 py-5">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : "Save Student"}
          </button>
        </div>
      </aside>
    </div>
  );
}