import { DAYS } from "@/lib/constants";
import type { TimeTable, CommonTime } from "@/types/api";
import type { TimetableRow, TimetablePeriod } from "./types";

export function formatTime(value: string) {
  return value.slice(0, 5);
}

export function buildTimetableRows(periods: TimeTable[], commonRows: CommonTime[]): TimetableRow[] {
  const grouped = new Map<string, TimetableRow>();

  for (const period of periods) {
    const key = `${period.start_time}-${period.end_time}`;
    const existing = grouped.get(key);
    const row =
      existing?.kind === "periods"
        ? existing
        : {
            kind: "periods" as const,
            key,
            start_time: period.start_time,
            end_time: period.end_time,
            periods: Array<TimetablePeriod>(DAYS.length).fill(null),
          };

    const dayIndex = Number.parseInt(period.day, 10);
    if (dayIndex >= 0 && dayIndex < DAYS.length) row.periods[dayIndex] = period;
    grouped.set(key, row);
  }

  const common = commonRows.map<TimetableRow>((row) => ({
    kind: "common",
    key: `common-${row.id}`,
    start_time: row.start_time,
    end_time: row.end_time,
    subject: row.subject,
  }));

  return [...grouped.values(), ...common].sort((a, b) =>
    `${a.start_time}-${a.end_time}`.localeCompare(`${b.start_time}-${b.end_time}`),
  );
}