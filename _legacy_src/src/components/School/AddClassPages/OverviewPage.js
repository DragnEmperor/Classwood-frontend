import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

export default function OverviewPage({
  setPageState,
  classTeacher,
  subClassTeacher,
  classSection,
  classTitle,
  addClass
}) {
  const subjects = useSelector((state) => state.classroom.addClassSubject);

  return (
    <div className="flex flex-col h-full mx-4 flex-1 justify-between">
        <div className="flex flex-col h-full">

      <span className="text-xl font-semibold py-4 border-b-[1px]">
        Create New Class
      </span>

      <div className="flex flex-row justify-between my-8 items-center">
        <div className="flex flex-row items-center justify-center">
          <span className="flex items-center justify-center w-6 h-6 text-gray-200 bg-indigo-600 border-2 border-indigo-600 rounded-full text-md">
            1
          </span>
          <span className="ml-2 font-semibold text-indigo-600 text-md">
            {" "}
            Class Detail
          </span>
        </div>
        <div className="flex-1 border h-0 mx-4 border-indigo-600"></div>

        <div className="flex flex-row items-center justify-center">
          <span className="flex items-center justify-center w-6 h-6 text-gray-200 bg-indigo-600 border-2 border-indigo-600 rounded-full text-md">
            2
          </span>
          <span className="ml-2 font-semibold text-indigo-600 text-md">
            {" "}
            Subject Detail
          </span>
        </div>
        <div className="flex-1 border h-0 mx-4 border-indigo-600"></div>

        <div className="flex flex-row items-center justify-center">
          <span className="flex items-center justify-center w-6 h-6 text-gray-200 bg-indigo-600 border-2 border-indigo-600 rounded-full text-md">
            3
          </span>
          <span className="ml-2 font-semibold text-indigo-600 text-md">
            {" "}
            Student Detail
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center w-full p-2 pt-2 sm:p-8">
        <span className="mb-4 text-xl font-semibold text-black">
          Class Detail
        </span>
        <div className="flex flex-row items-center justify-center justify-around w-full">
          <div className="flex flex-col justify-start">
            <span className="text-lg font-semibold text-gray-500">
              CLASS NAME
            </span>
            <span className="text-black text-md">{classTitle}</span>
          </div>
          <div className="flex flex-col justify-start">
            <span className="text-lg font-semibold text-gray-500">
              CLASS SECTION
            </span>
            <span className="text-black text-md">{classSection}</span>
          </div>
          <div className="flex flex-col justify-start">
            <span className="text-lg font-semibold text-gray-500">
              CLASS TEACHER
            </span>
            <span className="text-black text-md">{classTeacher.first_name + " " + classTeacher.last_name}</span>
          </div>
          <div className="flex flex-col justify-start">
            <span className="text-lg font-semibold text-gray-500">
              SUB CLASS TEACHER
            </span>
            <span className="text-black text-md">{subClassTeacher.first_name + " " + subClassTeacher.last_name}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center w-full p-2 pt-2 sm:p-8">
        <span className="mb-4 text-xl font-semibold text-black">Subjects</span>

        <div className="relative w-full overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500   border-[1px] rounded-2xl">
            <thead className="text-xs text-lg text-gray-600 uppercase bg-gray-50   rounded-t-2xl">
              <tr>
                <th scope="col" className="px-6 py-3 text-sm">
                  SNo.
                </th>
                <th scope="col" className="px-6 py-3 text-sm">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-sm">
                  Teacher
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                return (
                  <tr key={index} className="bg-white border-b ">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {index}
                    </th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {subject.subjectname}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {subject.teacher.first_name + " " +  subject.teacher.last_name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      <div className="mb-8 flex flex-row items-center justify-around">
        <button
          onClick={() => setPageState(1)}
          className="flex items-center justify-center w-2/5 py-4 mx-8 mt-16 font-semibold text-gray-800 duration-300 bg-gray-200 rounded-lg justify-self-end hover:bg-gray-700 hover:text-gray-200 easy-in-out"
        >
          <FiEdit2 className="mr-2" /> Edit
        </button>
        <button
          onClick={() => addClass()}
          className="flex items-center font-semibold w-2/5 justify-center py-4 mx-8 mt-16 text-white duration-300 bg-[#4F46E5] rounded-lg justify-self-end hover:bg-gray-700 hover:text-gray-200 easy-in-out"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
