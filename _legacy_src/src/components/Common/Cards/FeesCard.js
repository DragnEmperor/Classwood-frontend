import React from "react";
import { TfiBlackboard } from "react-icons/tfi";
import PopUpMenu from "../../UI/PopUpMenu";
import PaidFeesIcon from "../../../assets/icons/PaidFeesIcon";
import PendingFeesIcon from "../../../assets/icons/PendingFeesIcon";
export default function FeesCard({
  feesData,
  index,
  setSelectedTest,
  setPageState
}) {
  function viewResult() {
    setPageState("singleResult")
    setSelectedTest(feesData);
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
         
          <span className="ml-2 text-xl font-semibold ">
            {feesData.className}
          </span>
        </div>
        {/* <PopUpMenu
          menuList={TestPopupData}
        /> */}
      </div>
      <div className="flex flex-row items-center justify-between mt-6 text-md">
        <span className="font-semibold text-gray-500 flex flex-row"> <span className="mr-2">
            <PaidFeesIcon /> 
            </span>
            Total Fees </span>
        <span className="font-semibold text-gray-500">
          {feesData.amount}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between mt-1 text-md">
        <span className="font-semibold text-gray-500 flex flex-row"> <span className="mr-2">
            <PendingFeesIcon /> 
            </span>
            Paid Student </span>
        <span className="font-semibold text-gray-500">
          0
        </span>
      </div>

      
    </div>
  );
}
