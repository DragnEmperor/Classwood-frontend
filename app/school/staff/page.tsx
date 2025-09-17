"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AiFillBank,
  AiFillFileExcel,
  AiOutlineCalendar,
  AiOutlinePhone,
  AiOutlineSearch,
  AiOutlineStar,
} from "react-icons/ai";
import { BsBriefcase, BsFillPersonFill } from "react-icons/bs";
import { FiEdit2, FiX } from "react-icons/fi";
import { GoLocation } from "react-icons/go";
import { HiOutlineCake } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineSchool } from "react-icons/md";
import { clientFetch } from "@/lib/client-api";
import type { PaginatedResponse, Staff } from "@/types/api";
import {normalizeList} from "@/lib/utils";
import {StaffCard, attendanceState, staffName} from "./_components/card";
import AttendanceBadge from "./_components/badge";
import StaffFormDrawer from "./_components/form";
import StaffCsvModal from "./_components/csv-modal";

const TABS = ["Teaching Staff", "Non-Teaching Staff"];

function generatedPassword(staff: Staff) {
  const first = staff.first_name.toLowerCase().padEnd(5, "5").slice(0, 5);
  const phone = staff.mobile_number ?? "";
  const date = staff.date_of_joining ? new Date(staff.date_of_joining) : null;
  if (!date || Number.isNaN(date.getTime()) || phone.length < 2) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${first}${day}${month}${phone.slice(-2)}`;
}

function absentCount(staff: Staff) {
  return staff.month_attendance?.filter((entry) => entry === 1).length ?? 0;
}

export default function StaffPage() {
  const [tabState, setTabState] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formStaff, setFormStaff] = useState<Staff | null>(null);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);

  const staffQuery = useQuery({
    queryKey: ["staff"],
    queryFn: () => clientFetch<Staff[] | PaginatedResponse<Staff>>("list/staff/"),
  });

  const staff = useMemo(() => normalizeList(staffQuery.data), [staffQuery.data]);
  const filteredStaff = useMemo(
    () =>
      staff
        .filter((item) => (tabState === 0 ? item.is_teaching_staff : !item.is_teaching_staff))
        .filter((item) => staffName(item).toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [searchQuery, staff, tabState],
  );

  if (staffQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  if (staffQuery.isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-red-600">
        Unable to load staff data.
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 md:px-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">All Staff</h1>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setCsvOpen(true)}
            className="inline-flex items-center rounded-md border border-indigo-500 px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
          >
            <AiFillFileExcel className="mr-2" />
            Upload CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setFormStaff(null);
              setStaffFormOpen(true);
            }}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            <IoMdAddCircleOutline className="mr-2" />
            Add New Staff
          </button>
        </div>
      </div>

      <div className="mt-6 hidden w-full border-b-2 md:flex">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`mx-4 border-b-2 px-1 pb-2 font-semibold ${
              tabState === index
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => setTabState(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="my-8 flex flex-row">
        <div className="relative text-gray-600 focus-within:text-gray-500">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <AiOutlineSearch />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-md border bg-white py-2 pl-10 pr-3 text-sm text-gray-900 focus:outline-none sm:w-[320px]"
            placeholder="Search a staff member"
            autoComplete="off"
          />
        </div>
      </div>

      {staff.length === 0 ? (
        <EmptyState message="No staff till now. Add staff members." />
      ) : filteredStaff.length === 0 ? (
        <EmptyState message="No staff present." />
      ) : (
        <div className="mb-8 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStaff.map((item) => (
            <StaffCard
              key={item.user.id}
              staff={item}
              onView={() => setSelectedStaff(item)}
              onEdit={() => {
                setFormStaff(item);
                setStaffFormOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {selectedStaff ? (
        <StaffProfileDrawer
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onEdit={() => {
            setFormStaff(selectedStaff);
            setSelectedStaff(null);
            setStaffFormOpen(true);
          }}
        />
      ) : null}

      {staffFormOpen ? (
        <StaffFormDrawer
          staff={formStaff}
          onClose={() => setStaffFormOpen(false)}
        />
      ) : null}

      {csvOpen ? <StaffCsvModal onClose={() => setCsvOpen(false)} /> : null}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-96 w-full items-center justify-center text-gray-600">
      {message}
    </div>
  );
}

function StaffProfileDrawer({
  staff,
  onClose,
  onEdit,
}: {
  staff: Staff;
  onClose: () => void;
  onEdit: () => void;
}) {
  const password = generatedPassword(staff);
  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          aria-label="Close profile"
        >
          <FiX />
        </button>

        <div className="flex flex-col items-center justify-center border-b px-6 py-8">
          <img
            className="mb-3 h-16 w-16 rounded-full object-cover"
            src={
              staff.profile_pic_url ||
              staff.profile_pic ||
              "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=200&q=80"
            }
            alt=""
          />
          <span className="font-semibold">{staffName(staff)}</span>
          <span className="text-gray-400">id: {staff.staff_id || staff.user.id}</span>
          <AttendanceBadge state={attendanceState(staff)} />
        </div>

        <div className="grid grid-cols-2 gap-4 border-b px-6 py-5">
          <InfoCard icon={<MdOutlineSchool />} label="Class Assigned" value={staff.incharge_of ?? "None"} />
          <InfoCard icon={<BsBriefcase />} label="Role" value={staff.is_class_teacher ? "Class Teacher" : "Not A Class Teacher"} />
        </div>

        <div className="px-6 py-5">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Personal Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Detail icon={<AiOutlinePhone />} label="Phone Number" value={staff.mobile_number} />
            <Detail icon={<HiOutlineCake />} label="Date of Birth" value={staff.date_of_birth} />
            <Detail icon={<BsBriefcase />} label="Email Address" value={staff.contact_email} wide />
            <Detail icon={<GoLocation />} label="Address" value={staff.address} wide />
          </div>
        </div>

        <div className="px-6 py-5">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Professional Details</h3>
          <div className="space-y-4">
            <Detail icon={<AiOutlineCalendar />} label="Date of Joining" value={staff.date_of_joining} />
            <Detail icon={<AiOutlineStar />} label="Holiday Taken" value={absentCount(staff)} />
            <Detail icon={<AiFillBank />} label="Bank Account" value={staff.account_no} />
            <Detail icon={<BsFillPersonFill />} label="Login Email" value={staff.user.email} />
            <Detail icon={<BsFillPersonFill />} label="Login Password" value={password || "Unavailable"} />
          </div>
        </div>

        <div className="mt-auto border-t px-6 py-5">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-800 hover:bg-gray-200"
          >
            <FiEdit2 className="mr-2" />
            Edit Staff
          </button>
        </div>
      </aside>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex flex-col rounded-md bg-slate-50 p-4">
      <span className="mb-2 text-2xl text-indigo-700">{icon}</span>
      <span className="mb-2 font-semibold">{label}</span>
      <span className="text-gray-600">{value ?? "Not assigned"}</span>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  wide,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  wide?: boolean;
}) {
  return (
    <div className={`flex flex-row items-start ${wide ? "md:col-span-2" : ""}`}>
      <span className="mr-4 mt-1 text-2xl text-indigo-700">{icon}</span>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{label}</span>
        <span className="break-words text-gray-600">{value || "Not provided"}</span>
      </div>
    </div>
  );
}
