"use client";
import { useState } from "react";
import { TimetableEditor } from "./_components/add-timetable";
import { ViewTimetable } from "./_components/view-timetable";

export default function SchoolTimetablePage() {
  const [timetableState, setTimetableState] = useState<0 | 1>(0);

  return (
    <div>
      {timetableState ? (
        <TimetableEditor setTimetableState={setTimetableState} />
      ) : (
        <ViewTimetable setTimetableState={setTimetableState} />
      )}
    </div>
  );
}
