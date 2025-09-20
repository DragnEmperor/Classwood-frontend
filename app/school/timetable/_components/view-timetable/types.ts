import { TimeTable } from "@/types/api";

export type TimetablePeriod = TimeTable | null;

export type TimetableRow =
  | {
      kind: "periods";
      key: string;
      start_time: string;
      end_time: string;
      periods: TimetablePeriod[];
    }
  | {
      kind: "common";
      key: string;
      start_time: string;
      end_time: string;
      subject: string;
    };