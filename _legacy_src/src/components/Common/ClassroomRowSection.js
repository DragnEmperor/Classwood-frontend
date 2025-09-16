import React from "react";
import ClassroomRow from "./Rows/ClassroomRow";
export default function ClassroomRowSection({
  classCumilativeName,
  sectionData,
  setOpenSidebar,
  setSelectedClassroom,
  setOpenEditClassroom,
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
          <div className="grid w-full grid-cols-7 p-2 text-md font-semibold text-gray-500 bg-slate-50 pl-6">
            <span>Class</span>
            <span>Class Teacher</span>
            <span>Secondary Teacher</span>
            <span>Total Subjects</span>
            <span>Teachers Assigned</span>
            <span>Students</span>
            <span>Actions</span>
          </div>
            {sectionData.filter(filterTabs).map((classData, index) => {
              return (
                <ClassroomRow
                  key={index}
                  classData={classData}
                  index={index}
                  setOpenSidebar={setOpenSidebar}
                  setSelectedClassroom={setSelectedClassroom}
                  setOpenEditClassroom={setOpenEditClassroom}
                />
              );
            })}
        </div>
        </div>
      )}
    </>
  );
}
