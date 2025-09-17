import {Staff} from "@/types/api";
import {FiMoreHorizontal} from "react-icons/fi";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {clientFetch} from "@/lib/client-api";
import {useToast} from "@/app/_components/toast-provider";
import AttendanceBadge from "./badge";

export function attendanceState(staff: Staff) {
  const todayIndex = new Date().getDate() - 1;
  return staff.month_attendance?.[todayIndex] ?? 0;
}

export function staffName(staff: Staff) {
  return `${staff.first_name} ${staff.last_name}`.trim();
}

export function StaffCard({
  staff,
  onView,
  onEdit,
}: {
  staff: Staff;
  onView: () => void;
  onEdit: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const state = attendanceState(staff);

  const deleteStaff = useMutation({
    mutationFn: () => clientFetch(`list/staff/${staff.user.id}/`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Deleted staff member");
    },
    onError: () => toast.error("Unable to delete staff member"),
  });

  const markAttendance = useMutation({
    mutationFn: (present: boolean) =>
      clientFetch("list/staffAttendance/", {
        method: "POST",
        body: {
          date: new Date().toISOString().slice(0, 10),
          present,
          staff: staff.user.id,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Attendance marked successfully");
    },
    onError: () => toast.error("Attendance already marked or could not be saved"),
  });

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-300 bg-white p-4 shadow-sm">
      <div className="flex flex-row justify-between border-b border-dotted border-gray-200 pb-3">
        <button type="button" onClick={onView} className="flex flex-col text-left">
          <img
            className="mb-2 h-10 w-10 rounded-md object-cover"
            src={
              staff.profile_pic_url ||
              staff.profile_pic ||
              "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=200&q=80"
            }
            alt=""
          />
          <span className="font-semibold text-black">{staffName(staff)}</span>
          <span className="text-sm text-gray-400">id: {staff.staff_id || staff.user.id}</span>
        </button>

        <div className="flex flex-col items-end justify-between">
          <div className="group relative inline-flex">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
              aria-label="Staff actions"
            >
              <FiMoreHorizontal />
            </button>
            <div className="invisible absolute right-0 top-9 z-20 w-44 rounded-md border bg-white py-1 text-sm shadow-lg group-focus-within:visible group-hover:visible">
              <button type="button" onClick={onView} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
                View Profile
              </button>
              <button type="button" onClick={onEdit} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete ${staffName(staff)}?`)) deleteStaff.mutate();
                }}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Delete Profile
              </button>
            </div>
          </div>
          <AttendanceBadge state={state} />
        </div>
      </div>

      <div className="mt-3 flex flex-row justify-between text-gray-700">
        <div className="flex flex-col">
          <span className="text-sm">Role</span>
          <span className="font-semibold">{staff.is_class_teacher ? "Class Teacher" : "Staff Member"}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm">Class Assigned</span>
          <span className="font-semibold">{staff.is_class_teacher ? staff.incharge_of ?? "None" : "None"}</span>
        </div>
      </div>

      {!state ? (
        <div className="mt-4 flex flex-col">
          <span className="mb-3 font-medium">Mark Attendance</span>
          <div className="flex flex-row justify-between gap-3">
            <button
              type="button"
              disabled={markAttendance.isPending}
              onClick={() => markAttendance.mutate(true)}
              className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              Present
            </button>
            <button
              type="button"
              disabled={markAttendance.isPending}
              onClick={() => markAttendance.mutate(false)}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              Absent
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}