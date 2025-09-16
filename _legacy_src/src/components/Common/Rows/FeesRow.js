import React from "react";
import PopUpMenu from "../../UI/PopUpMenu";

export default function FeesRow({
  feesData,
  index,
setSelectedTest,
setPageState
}) {
  console.log(feesData);
  function viewResult() {
    setPageState("singleResult")
    setSelectedTest(feesData);
  }
  const ClassroomPopUpData = [
    {
      title: "View Result",
      function: viewResult,
    }
  ];
  return (
    <div className="grid w-full grid-cols-3 p-2 py-4 font-semibold text-gray-800 bg-white border-b-2">
      <span>{feesData.className}</span>
      <span>{feesData.amount}</span>
      <span>{0}</span>
      <span>
        {/* <PopUpMenu menuList={ClassroomPopUpData} /> */}
      </span>
    </div>
  );
}
