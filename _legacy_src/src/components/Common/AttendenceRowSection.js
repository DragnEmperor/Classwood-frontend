import React from "react";
import AttendenceRow from "../School/Attendance/AttendenceRow";
export default function AttendenceRowSection({
  classCumilativeName,
  sectionData,
 
}) {
  function filterTabs(classData) {
    return classData.class_name === classCumilativeName;
  }

  return (
    <>
      {sectionData.filter(filterTabs).length === 0 ? undefined : (
        <div className="mb-4 flex flex-col">
          <span className="ml-2 text-2xl font-medium text-gray-800 my-3 flex">
            {classCumilativeName} Standard
          </span>
          <div className="border-2 rounded-md">
          <div className="grid w-full grid-cols-5 p-2 text-sm font-semibold text-gray-500 bg-slate-100">
            <span>Class</span>
            <span>Total Students</span>
            <span>Students Present</span>
            <span>Students Absent</span>
            <span>Actions</span>
          </div>
            {sectionData.filter(filterTabs).map((classData, index) => {
              return (
                <AttendenceRow
                  key={index}
                  classData={classData}
                  index={index}
                 
                />
              );
            })}
        </div>
        </div>
      )}
    </>
  );
}
