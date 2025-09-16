import React from "react";
import SelectionDropdown from "../../UI/SelectionDropdown";
import { GrNext } from "react-icons/gr";
import TeacherDropdown from "../helpers/TeacherDropDown";
import { classNameList } from "../../../helpers/inputLists";
export default function ClassDetailPage({
  classTeacher,
  setClassTeacher,
  subClassTeacher,
  setSubClassTeacher,
  setPageState,
  classTitle,
  setClassTitle,
  classSection,
  setClassSection,
  staff
}) {
  function filterClassTeachers(staffMember){
    return !staffMember.is_class_teacher;
  }
  console.log("These are staff", staff)
  return (
    <div className="flex flex-col h-full mx-4 flex-1 justify-between">
      <div className="flex flex-col h-full">

      <span className="text-xl font-semibold py-4 border-b-[1px]">
        Create New Class
      </span>

      <div className="flex flex-row justify-between my-8 items-center">
        <div className="flex flex-row items-center justify-center">
          <span className="flex items-center justify-center w-6 h-6 text-gray-200 bg-gray-700 border-2 border-gray-700 rounded-full text-md">
            1
          </span>
          <span className="ml-2 font-semibold text-gray-700 text-md">
            {" "}
            Class Detail
          </span>
        </div>
        <div className="flex-1 border h-0 mx-4"></div>

        <div className="flex flex-row items-center justify-center">
          <span className="flex items-center justify-center w-6 h-6 text-gray-500 bg-white border-2 border-gray-500 rounded-full text-md">
            2
          </span>
          <span className="ml-2 font-semibold text-gray-500 text-md">
            {" "}
            Subject Detail
          </span>
        </div>
        <div className="flex-1 border h-0 mx-4"></div>

        <div className="flex flex-row items-center justify-center">
          <span className="flex items-center justify-center w-6 h-6 text-gray-500 bg-white border-2 border-gray-500 rounded-full text-md">
            3
          </span>
          <span className="ml-2 font-semibold text-gray-500 text-md">
            {" "}
            Student Detail
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full px-8">
            <label className="mb-4 text-lg font-semibold text-gray-800">
              Class*
            </label>
            <SelectionDropdown
              inputList={classNameList}
              labelTitle=""
              DivWidth="full"
              selected={classTitle}
              setSelected={setClassTitle}
            />
            {/* <input
              value={classTitle}
              onChange={(e) => setClassTitle(e.target.value)}
              type="text"
              placeholder="Class"
              className="flex px-3 py-4 font-medium border-2 border-gray-400 border-[1px] rounded-lg placeholder:font-normal w-full"
            /> */}
          </div>
          <div className="flex flex-col w-full px-8">
            <label className="mb-4 text-lg font-semibold text-gray-800">
              Section*
            </label>
            <input
              value={classSection}
              onChange={(e) => setClassSection(e.target.value)}
              type="text"
              placeholder="Section"
              className="flex px-3 py-4 font-medium border-2 border-gray-400 border-[1px] rounded-lg placeholder:font-normal w-full"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full px-8">
            <label className="mb-4 text-lg font-semibold text-gray-800">
              Class Teacher
            </label>
            <TeacherDropdown
              inputList={staff.filter(filterClassTeachers)}
              labelTitle=""
              DivWidth="full"
              selected={classTeacher}
              setSelected={setClassTeacher}
            />
          </div>
          <div className="flex flex-col w-full px-8">
            <label className="mb-4 text-lg font-semibold text-gray-800">
              Secondary Class Teacher
            </label>
            <TeacherDropdown
              inputList={staff}
              labelTitle=""
              DivWidth="full"
              selected={subClassTeacher}
              setSelected={setSubClassTeacher}
            />
          </div>
        </div>
      </div>
      </div>

      <button
        onClick={() => setPageState(2)}
        className="mb-8 flex border border-indigo-700 items-center justify-center py-4 mx-8 mt-16 text-indigo-700 duration-300  rounded-lg justify-self-end hover:bg-indigo-700 hover:text-gray-50 easy-in-out"
      >
        Save and Next <GrNext className="ml-2" />
      </button>
    </div>
  );
}
