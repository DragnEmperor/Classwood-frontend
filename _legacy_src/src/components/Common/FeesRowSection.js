import React from "react";
import FeesRow from "./Rows/FeesRow";
export default function FeesRowSection({
    classCumilativeName,
    sectionData,
    setSelectedTest,
    setPageState
}) {

    
      function filterTabs(classData) {
        return classData.className.split(" ")[0] === classCumilativeName;
      }

  return (
    <>
      {sectionData.filter(filterTabs).length === 0 ? undefined : (
        <div className="mb-4 flex flex-col">
          <span className="ml-2 text-2xl font-medium text-gray-800 my-3 flex">
            {classCumilativeName} Standard
          </span>
          <div className="border-2 rounded-md">
          <div className="grid w-full grid-cols-3 p-2 text-sm font-semibold text-gray-500 bg-slate-100">
                  <span>Fees</span>
                  <span>Total Fees</span>
                  <span>Paid Student</span>
                </div>
            {sectionData.filter(filterTabs).map((classData, index) => {
              return (
                <FeesRow
          
                key={index}
                feesData={classData}
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
