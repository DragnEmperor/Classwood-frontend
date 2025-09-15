import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { API_URL } from "../../helpers/URL";
import TeacherDropdown from "./helpers/TeacherDropDown";
import { setSuccessToast, setWarningToast } from "../../store/generalUser";

export default function EditClassroom({ setOpen,classroom }) {
  
    console.log(classroom)
  const staff = useSelector((state) => state.staff.allStaff);
  const [classTeacher, setClassTeacher] = useState(staff[0]);
  const [subClassTeacher, setSubClassTeacher] = useState(staff[0]);
    useEffect(()=>{
 
        const clsTchr = staff.filter((tchr)=>{
            return tchr.first_name + " " + tchr.last_name === classroom.class_teacher
        })
        const subclsTchr = staff.filter((tchr)=>{
            return tchr.first_name + " " + tchr.last_name === classroom.sub_class_teacher
        })
        console.log(clsTchr, subclsTchr);
        setClassTeacher(clsTchr[0]);
        setSubClassTeacher(subclsTchr[0]);
    },[])
  const updateClassroom =async ()=>{
      const token = localStorage.getItem("token");
      const res = await axios.put(API_URL + "list/classroom/" + classroom.id + "/",{
        class_teacher: classTeacher.user.id,
        sub_class_teacher: subClassTeacher.user.id,
        class_name : classroom.class_name,
        school : classroom.school,
        section_name : classroom.section_name
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("res : ", res);
  }
  return (
    <div className="fixed left-0 right-0 flex items-center justify-center w-full h-full bg-gray-400 z-[100] bg-opacity-40">
      <div className="z-50 p-4 md:inset-0 ">
        <div className="relative w-full h-full max-w-2xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-start justify-between p-4 border-b rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 ">
                Edit Class
              </h3>
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                data-modal-hide="defaultModal"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 ">
              <div className="flex flex-row">
                <div className="flex flex-row w-full">
                  
                  <div className="flex flex-col w-full px-8 min-w-[16rem]">
                    <label className="mb-4 text-lg font-semibold text-gray-800">
                      New Class Teacher
                    </label>
                    <TeacherDropdown
                      inputList={staff}
                      labelTitle=""
                      DivWidth="full"
                      selected={classTeacher}
                      setSelected={setClassTeacher}
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full ">
                  
                  <div className="flex flex-col w-full px-8 min-w-[16rem]">
                    <label className="mb-4 text-lg font-semibold text-gray-800">
                      New Sub Teacher
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
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
              <button
              onClick={updateClassroom}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
