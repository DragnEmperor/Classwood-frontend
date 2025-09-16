import React from "react";
import ClassroomCard from "./Cards/ClassroomCard";
import TestCard from "./Cards/TestCard";
export default function PastResultCardSection({
  classCumilativeName,
  sectionData,
  setSelectedTest,
  setPageState
}) {
    function filterTabs(classData) {
        return classData.classroom_name.split(" ")[0] === classCumilativeName;
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
                <TestCard
                  key={index}
                  testData={classData}
                  index={index}
                  setSelectedTest={setSelectedTest}
                  setPageState={setPageState}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
