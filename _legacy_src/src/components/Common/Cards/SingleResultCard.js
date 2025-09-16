import React from 'react'
import {TfiBlackboard} from 'react-icons/tfi'
export default function SingleResultCard({result, totalScore}) {
    console.log("This is result", result)
  return (
    <div className="flex flex-col p-4 bg-white border rounded-xl">
      <div className="flex flex-row items-center justify-between pb-2 border-b-[1px]">
        <div className="flex flex-row items-center justify-between pb-2">
          <span className="p-2 bg-indigo-200 rounded-lg">
            <TfiBlackboard className="w-4 h-4 text-indigo-600" />
          </span>
          <span className="ml-2 text-xl font-semibold ">
            {result.student_name}
          </span>
        </div>
      
      </div>
      <div className="flex flex-row items-center justify-between mt-6 text-md">
        <span className="font-semibold text-gray-500"> Total Marks </span>
        <span className="font-semibold text-gray-500">
          {totalScore}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between mt-1 text-md">
        <span className="font-semibold text-gray-500"> Marks Gained </span>
        <span className="font-semibold text-gray-500">
          {result.score}
        </span>
      </div>

      
    </div>
  )
}
