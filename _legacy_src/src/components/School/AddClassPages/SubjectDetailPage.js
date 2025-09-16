import React, { useEffect, useState } from "react";
import SelectionDropdown from "../../UI/SelectionDropdown";
import { useSelector, useDispatch } from "react-redux";
import { GrNext } from "react-icons/gr";
import { CgAdd } from "react-icons/cg";
import {
  addNewClassSubjectsTecher,
  addNewClassSubjectsName,
  addAWholeSubject,
} from "../../../store/School/classroomSlice";
import TeacherDropdown from "../helpers/TeacherDropDown";

export default function SubjectDetailPage({  setPageState,staff }) {
  const subjects = useSelector((state) => state.classroom.addClassSubject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addNewClassSubjectsTecher({
        id: 0,
        value: staff[0],
      })
    );
  }, [staff]);

  const selectTeacher = (value, id) => {
    dispatch(
      addNewClassSubjectsTecher({
        id: id - 1,
        value: value,
      })
    );
  };

  const setSubjectName = (value, id) => {
    dispatch(
      addNewClassSubjectsName({
        id: id,
        value: value,
      })
    );
  };
  const addNewSubjectInputs = () => {
    dispatch(
      addAWholeSubject({
        teacher: staff[0],
        subjectname: "",
      })
    );
  };
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
          <span className="flex items-center justify-center w-6 h-6 text-gray-200 bg-gray-700 border-2 border-gray-700 rounded-full text-md">
            2
          </span>
          <span className="ml-2 font-semibold text-gray-700 text-md">
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
      {subjects.map((subject, index) => {
        return (
          <div key={index} className="flex flex-col mt-10">
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full px-8">
                <label className="mb-4 text-lg font-semibold text-gray-800">
                  Subject*
                </label>
                <input
                  value={subject.subjectname}
                  type="text"
                  onChange={(e) => setSubjectName(e.target.value, index)}
                  placeholder="Subject"
                  className="flex px-3 py-4 font-medium border-2 border-gray-400 border-[1px] rounded-lg placeholder:font-normal w-full"
                />
              </div>
              <div className="flex flex-col w-full px-8">
                <label className="mb-4 text-lg font-semibold text-gray-800">
                  Teacher*
                </label>
                <TeacherDropdown
                  id={index + 1}
                  inputList={staff}
                  labelTitle=""
                  DivWidth="full"
                  selected={subject.teacher}
                  setSelected={selectTeacher}
                />
              </div>
            </div>
          </div>
        );
      })}

      <span
        onClick={() => addNewSubjectInputs()}
        className="flex flex-row items-center px-4 py-2 mt-4 ml-4 text-indigo-700 duration-200 ease-in-out rounded cursor-pointer hover:bg-indigo-100 hover:text-indigo-500 w-max"
      >
        {" "}
        <CgAdd className="mr-2" /> Add new Subject
      </span>
      </div>
      <button
        onClick={() => setPageState(3)}
        className="mb-8 flex items-center justify-center py-4 mx-8 mt-16 text-indigo-700 duration-300  rounded-lg justify-self-end border border-indigo-700 hover:bg-indigo-700 hover:text-gray-50 easy-in-out"
      >
        Save and Next <GrNext className="ml-2" />
      </button>
    </div>
  );
}
