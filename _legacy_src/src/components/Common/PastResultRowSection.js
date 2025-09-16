import React from "react";
import TestRow from "./Rows/TestRow";
export default function PastResultRowSection({
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
        <div className="mb-4 flex flex-col">
          <span className="ml-2 text-2xl font-medium text-gray-800 my-3 flex">
            {classCumilativeName} Standard
          </span>
          <div className="border-2 rounded-md">
          <div className="grid w-full grid-cols-4 p-2 text-sm font-semibold text-gray-500 bg-slate-100">
          <span>Test name</span>
                  <span>Classroom</span>
                  <span>Subject</span>
                  <span>Actions</span>
                </div>
            {sectionData.filter(filterTabs).map((classData, index) => {
              return (
                <TestRow
          
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
