import React from "react";
import ClassroomCard from "./Cards/ClassroomCard";
export default function ClassroomCardSection({
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
        <div className="mt-2 flex flex-col">
          <span className="ml-2 text-2xl font-medium text-gray-800 my-3 flex">
            {classCumilativeName} Standard
          </span>
          <div className="mb-10 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sectionData.filter(filterTabs).map((classData, index) => {
              return (
                <ClassroomCard
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
