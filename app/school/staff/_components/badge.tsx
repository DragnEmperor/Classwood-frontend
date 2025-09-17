import { GoDotFill } from "react-icons/go";

export default function AttendanceBadge({ state }: { state: number }) {
  if (state === 2) {
    return (
      <span className="flex items-center text-green-600">
        <GoDotFill className="mr-1 h-4 w-4" />
        Present
      </span>
    );
  }
  if (state === 1) {
    return (
      <span className="flex items-center text-red-600">
        <GoDotFill className="mr-1 h-4 w-4" />
        Absent
      </span>
    );
  }
  return <span className="text-red-500">Attendance Due</span>;
}