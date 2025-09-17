import type { Staff} from "@/types/api";

export function staffLabel(staff: Staff | null | undefined) {
  if (!staff) return "Not assigned";
  return `${staff.first_name} ${staff.last_name}`.trim();
}

export function TeacherSelect({
  staff,
  value,
  onChange,
}: {
  staff: Staff[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="input">
      {staff.map((teacher) => (
        <option key={teacher.user.id} value={String(teacher.user.id)}>
          {staffLabel(teacher)}
        </option>
      ))}
    </select>
  );
}