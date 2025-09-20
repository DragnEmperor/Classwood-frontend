"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineAcademicCap,
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineXMark,
} from "react-icons/hi2";
import { clientFetch } from "@/lib/client-api";
import type { SchoolProfile, Staff, Student, UserType } from "@/types/api";

type ProfileData = SchoolProfile | Staff | Student;

interface AuthState {
  userType?: UserType;
}

function readAuthState(): AuthState {
  if (typeof document === "undefined") return {};
  const raw = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("auth_state="))
    ?.split("=")[1];
  if (!raw) return {};

  try {
    return JSON.parse(decodeURIComponent(raw)) as AuthState;
  } catch {
    return {};
  }
}

function profilePath(role: UserType | undefined) {
  if (role === "Staff") return "staff/me";
  if (role === "Student") return "student/me";
  return "account/";
}

function isSchoolProfile(profile: ProfileData): profile is SchoolProfile {
  return "school_name" in profile;
}

function isStudentProfile(profile: ProfileData): profile is Student {
  return "admission_no" in profile;
}

function fullName(profile: ProfileData) {
  if (isSchoolProfile(profile)) return profile.school_name;
  return `${profile.first_name} ${profile.last_name}`.trim();
}

function subtitle(profile: ProfileData, role: UserType | undefined) {
  if (isSchoolProfile(profile)) return profile.school_board ?? "School account";
  if (isStudentProfile(profile)) return `Admission No. ${profile.admission_no}`;
  return role === "Staff" ? profile.staff_id ? `Staff ID ${profile.staff_id}` : "Staff account" : "Profile";
}

function avatarUrl(profile: ProfileData) {
  const raw = isSchoolProfile(profile)
    ? profile.school_logo_url ?? profile.school_logo
    : profile.profile_pic_url ?? profile.profile_pic;

  if (!raw) return "/assets/profile.png";
  if (raw.startsWith("http") || raw.startsWith("/")) return raw;
  return "/assets/profile.png";
}

function absentCount(values?: number[]) {
  return values?.filter((value) => value === 1).length ?? 0;
}

function presentCount(values?: number[]) {
  return values?.filter((value) => value === 2).length ?? 0;
}

function valueOrDash(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

export function ProfileMenu() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [profileOpen, setProfileOpen] = useState(false);
  const queryClient = useQueryClient();
  const role = useMemo(() => readAuthState().userType, []);

  const profileQuery = useQuery({
    queryKey: ["profile-menu", role],
    queryFn: () => clientFetch<ProfileData>(profilePath(role)),
    enabled: profileOpen,
  });

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      queryClient.clear();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] hover:bg-gray-100">
        <HiOutlineUserCircle className="h-8 w-8" />
      </MenuButton>
      <MenuItems className="absolute right-0 z-20 mt-2 w-44 rounded-lg border bg-white py-2 shadow-lg focus:outline-none">
        <MenuItem>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            View Profile
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 disabled:opacity-60"
          >
            {pending ? "Logging out…" : "Logout"}
          </button>
        </MenuItem>
      </MenuItems>

      {profileOpen ? (
        <ProfileDrawer
          role={role}
          profile={profileQuery.data}
          loading={profileQuery.isLoading}
          error={profileQuery.isError}
          onClose={() => setProfileOpen(false)}
        />
      ) : null}
    </Menu>
  );
}

function ProfileDrawer({
  role,
  profile,
  loading,
  error,
  onClose,
}: {
  role: UserType | undefined;
  profile: ProfileData | undefined;
  loading: boolean;
  error: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30">
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-500">{role ?? "Account"} details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            aria-label="Close profile"
          >
            <HiOutlineXMark className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            </div>
          ) : error || !profile ? (
            <div className="flex h-72 items-center justify-center text-red-600">Unable to load profile.</div>
          ) : (
            <ProfileContent role={role} profile={profile} />
          )}
        </div>
      </aside>
    </div>
  );
}

function ProfileContent({ role, profile }: { role: UserType | undefined; profile: ProfileData }) {
  return (
    <div>
      <div className="flex flex-col items-center border-b pb-6 text-center">
        <div
          className="h-20 w-20 rounded-full border bg-cover bg-center"
          style={{ backgroundImage: `url("${avatarUrl(profile)}")` }}
          aria-hidden
        />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">{fullName(profile)}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle(profile, role)}</p>
      </div>

      {isSchoolProfile(profile) ? (
        <SchoolProfileContent profile={profile} />
      ) : isStudentProfile(profile) ? (
        <StudentProfileContent profile={profile} />
      ) : (
        <StaffProfileContent profile={profile} />
      )}
    </div>
  );
}

function SchoolProfileContent({ profile }: { profile: SchoolProfile }) {
  const loginEmail = profile.user?.email;
  return (
    <div className="mt-6 space-y-6">
      <InfoGrid
        title="School Details"
        items={[
          { label: "Phone Number", value: profile.school_phone, Icon: HiOutlinePhone },
          { label: "Board", value: profile.school_board, Icon: HiOutlineAcademicCap },
          { label: "Affiliation No.", value: profile.school_affNo, Icon: HiOutlineIdentification },
          { label: "Date Established", value: profile.date_of_establishment, Icon: HiOutlineCalendarDays },
          { label: "School Head", value: profile.school_head, Icon: HiOutlineUserCircle },
          { label: "Website", value: profile.school_website, Icon: HiOutlineBuildingOffice2 },
        ]}
      />
      <InfoGrid
        title="Capacity"
        items={[
          { label: "Staff Strength", value: profile.staff_strength, Icon: HiOutlineUsers },
          { label: "Student Strength", value: profile.student_strength, Icon: HiOutlineUsers },
          { label: "Staff Limit", value: profile.staff_limit, Icon: HiOutlineUsers },
          { label: "Student Limit", value: profile.student_limit, Icon: HiOutlineUsers },
        ]}
      />
      <InfoGrid
        title="Account"
        items={[
          { label: "Login Email", value: loginEmail, Icon: HiOutlineEnvelope },
          { label: "Address", value: `${valueOrDash(profile.school_address)}, ${valueOrDash(profile.school_city)}, ${valueOrDash(profile.school_state)} ${valueOrDash(profile.school_zipcode)}`, Icon: HiOutlineMapPin },
        ]}
      />
    </div>
  );
}

function StaffProfileContent({ profile }: { profile: Staff }) {
  return (
    <div className="mt-6 space-y-6">
      <InfoGrid
        title="Personal Details"
        items={[
          { label: "Phone Number", value: profile.mobile_number, Icon: HiOutlinePhone },
          { label: "Date of Birth", value: profile.date_of_birth, Icon: HiOutlineCalendarDays },
          { label: "Email Address", value: profile.contact_email, Icon: HiOutlineEnvelope },
          { label: "Address", value: profile.address, Icon: HiOutlineMapPin },
        ]}
      />
      <InfoGrid
        title="Professional Details"
        items={[
          { label: "Role", value: profile.is_class_teacher ? "Class Teacher" : "Teaching Staff", Icon: HiOutlineBriefcase },
          { label: "Class Assigned", value: profile.incharge_of, Icon: HiOutlineAcademicCap },
          { label: "Sub Incharge Of", value: profile.sub_incharge_of?.join(", "), Icon: HiOutlineAcademicCap },
          { label: "Date of Joining", value: profile.date_of_joining, Icon: HiOutlineCalendarDays },
          { label: "Absences This Month", value: absentCount(profile.month_attendance), Icon: HiOutlineCalendarDays },
          { label: "Bank Account", value: profile.account_no, Icon: HiOutlineBanknotes },
          { label: "IFSC Code", value: profile.ifsc_code, Icon: HiOutlineBanknotes },
          { label: "Login Email", value: profile.user?.email, Icon: HiOutlineEnvelope },
        ]}
      />
    </div>
  );
}

function StudentProfileContent({ profile }: { profile: Student }) {
  return (
    <div className="mt-6 space-y-6">
      <InfoGrid
        title="Personal Details"
        items={[
          { label: "Parent Phone", value: profile.parent_mobile_number, Icon: HiOutlinePhone },
          { label: "Email Address", value: profile.contact_email, Icon: HiOutlineEnvelope },
          { label: "Address", value: profile.address, Icon: HiOutlineMapPin },
          { label: "Father Name", value: profile.father_name, Icon: HiOutlineUserCircle },
          { label: "Mother Name", value: profile.mother_name, Icon: HiOutlineUserCircle },
        ]}
      />
      <InfoGrid
        title="Admission Details"
        items={[
          { label: "Class", value: profile.classroom, Icon: HiOutlineAcademicCap },
          { label: "Roll No.", value: profile.roll_no, Icon: HiOutlineIdentification },
          { label: "Admission No.", value: profile.admission_no, Icon: HiOutlineIdentification },
          { label: "Subjects", value: profile.subjects?.length, Icon: HiOutlineAcademicCap },
          { label: "Present This Month", value: presentCount(profile.month_attendance), Icon: HiOutlineCalendarDays },
          { label: "Absences This Month", value: absentCount(profile.month_attendance), Icon: HiOutlineCalendarDays },
          { label: "Login Email", value: profile.user?.email, Icon: HiOutlineEnvelope },
        ]}
      />
    </div>
  );
}

function InfoGrid({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    value: unknown;
    Icon: typeof HiOutlinePhone;
  }>;
}) {
  return (
    <section>
      <h4 className="mb-3 text-lg font-semibold text-gray-900">{title}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-md bg-slate-50 p-4">
            <Icon className="mb-2 h-6 w-6 text-indigo-700" />
            <div className="text-sm font-semibold text-gray-900">{label}</div>
            <div className="mt-1 break-words text-sm text-gray-600">{valueOrDash(value)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
