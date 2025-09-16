import React from "react";
import { TfiBlackboard } from "react-icons/tfi";
import PopUpMenu from "../../UI/PopUpMenu";

export default function TestCard({
  testData,
  index,
  setSelectedTest,
  setPageState
}) {
  function viewResult() {
    setPageState("singleResult")
    setSelectedTest(testData);
  }
  const TestPopupData = [
    {
      title: "View Result",
      function: viewResult,
    }
  ];

  return (
    <div className="flex flex-col p-4 bg-white border rounded-xl">
      <div className="flex flex-row items-center justify-between pb-2 border-b-[1px]">
        <div className="flex flex-row items-center justify-between pb-2">
          <span className="p-2 bg-indigo-200 rounded-lg">
            <TfiBlackboard className="w-4 h-4 text-indigo-600" />
          </span>
          <span className="ml-2 text-xl font-semibold ">
            {testData.tag}
          </span>
        </div>
        <PopUpMenu
          menuList={TestPopupData}
        />
      </div>
      <div className="flex flex-row items-center justify-between mt-6 text-md">
        <span className="font-semibold text-gray-500"> Classroom </span>
        <span className="font-semibold text-gray-500">
          {testData.classroom_name}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between mt-1 text-md">
        <span className="font-semibold text-gray-500"> Subject </span>
        <span className="font-semibold text-gray-500">
          {testData.subject_name}
        </span>
      </div>

      
    </div>
  );
}
