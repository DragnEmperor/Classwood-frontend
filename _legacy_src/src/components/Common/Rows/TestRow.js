import React from "react";
import PopUpMenu from "../../UI/PopUpMenu";

export default function TestRow({
  testData,
  index,
setSelectedTest,
setPageState
}) {
  console.log(testData);
  function viewResult() {
    setPageState("singleResult")
    setSelectedTest(testData);
  }
  const ClassroomPopUpData = [
    {
      title: "View Result",
      function: viewResult,
    }
  ];
  return (
    <div className="grid w-full grid-cols-4 p-2 py-4 font-semibold text-gray-800 bg-white border-b-2">
      <span>{testData.tag}</span>
      <span>{testData.classroom_name}</span>
      <span>{testData.subject_name}</span>
      <span>
        <PopUpMenu menuList={ClassroomPopUpData} />
      </span>
    </div>
  );
}
