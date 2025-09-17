"use client";

import { FiX } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import { useToast } from "@/app/_components/toast-provider";
import type { Staff } from "@/types/api";
import { useState } from "react";
import Field from "@/app/_components/field";


const GENDERS = [
  { id: "1", name: "Male" },
  { id: "2", name: "Female" },
  { id: "3", name: "Other" },
];

const emptyStaffForm = {
  first_name: "",
  last_name: "",
  gender: "1",
  mobile_number: "",
  contact_email: "",
  date_of_joining: "",
  date_of_birth: "",
  address: "",
  account_no: "",
  ifsc_code: "",
  staff_id: "",
  is_teaching_staff: true,
};

export default function StaffFormDrawer({ staff, onClose }: { staff: Staff | null; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    ...emptyStaffForm,
    first_name: staff?.first_name ?? "",
    last_name: staff?.last_name ?? "",
    gender: staff?.gender === "Female" ? "2" : staff?.gender === "Other" ? "3" : "1",
    mobile_number: staff?.mobile_number ?? "",
    contact_email: staff?.contact_email ?? "",
    date_of_joining: staff?.date_of_joining ?? "",
    date_of_birth: staff?.date_of_birth ?? "",
    address: staff?.address ?? "",
    account_no: staff?.account_no ?? "",
    ifsc_code: staff?.ifsc_code ?? "",
    staff_id: staff?.staff_id ?? "",
    is_teaching_staff: staff?.is_teaching_staff ?? true,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  function update<K extends keyof typeof emptyStaffForm>(key: K, value: (typeof emptyStaffForm)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const mutation = useMutation({
    mutationFn: () => {
      if (!form.first_name.trim() || !form.last_name.trim() || !form.date_of_joining || !form.account_no.trim()) {
        throw new Error("Fill the required details");
      }
      if (form.mobile_number.length < 10 || form.mobile_number.length > 13) {
        throw new Error("Mobile number should be 10 to 13 digits");
      }
      if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
        throw new Error("Invalid email address");
      }

      const formData = new FormData();
      if (profileImage) formData.append("profile_pic", profileImage);
      for (const [key, value] of Object.entries(form)) {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }

      if (staff) {
        return clientFetch(`list/staff/${staff.user.id}/`, {
          method: "PATCH",
          body: formData,
        });
      }
      return clientFetch("list/staff/", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success(staff ? "Staff updated" : "Staff added successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to save staff"),
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-4xl flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-semibold">{staff ? "Edit Staff" : "Add New Staff"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Close staff form"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 px-6 py-5">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => update("is_teaching_staff", true)}
              className={`rounded-md border px-4 py-3 font-medium ${
                form.is_teaching_staff ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 bg-gray-50"
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => update("is_teaching_staff", false)}
              className={`rounded-md border px-4 py-3 font-medium ${
                !form.is_teaching_staff ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 bg-gray-50"
              }`}
            >
              Non Teacher
            </button>
          </div>

          <h3 className="mb-4 text-xl font-semibold text-gray-800">Personal Details</h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="First Name*">
              <input className="input" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
            </Field>
            <Field label="Last Name*">
              <input className="input" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
            </Field>
            <Field label="Phone Number*">
              <input className="input" value={form.mobile_number} onChange={(e) => update("mobile_number", e.target.value)} />
            </Field>
            <Field label="Email Address">
              <input className="input" type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
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
            <Field label="Date of Birth">
              <input className="input" type="date" value={form.date_of_birth ?? ""} onChange={(e) => update("date_of_birth", e.target.value)} />
            </Field>
            <Field label="Aadhar Number">
              <input className="input" placeholder="Optional" />
            </Field>
            <Field label="Staff ID">
              <input className="input" value={form.staff_id} onChange={(e) => update("staff_id", e.target.value)} />
            </Field>
            <Field label="Account Number*">
              <input className="input" value={form.account_no} onChange={(e) => update("account_no", e.target.value)} />
            </Field>
            <Field label="IFSC Code">
              <input className="input" value={form.ifsc_code} onChange={(e) => update("ifsc_code", e.target.value)} />
            </Field>
            <Field label="Date of Joining*">
              <input className="input" type="date" value={form.date_of_joining} onChange={(e) => update("date_of_joining", e.target.value)} />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Address">
              <textarea className="input min-h-24" value={form.address} onChange={(e) => update("address", e.target.value)} />
            </Field>
          </div>

          <div className="mt-6">
            <span className="mb-2 block font-semibold text-gray-800">Profile Picture</span>
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
              <span className="font-semibold text-gray-600">
                {profileImage ? profileImage.name : "Staff profile image"}
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
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </aside>
    </div>
  );
}