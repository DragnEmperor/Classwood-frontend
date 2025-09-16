import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { API_URL } from "../../helpers/URL";
import TeacherDropdown from "./helpers/TeacherDropDown";
import { setSuccessToast, setWarningToast } from "../../store/generalUser";

export default function AddSubject({ setOpen, classroom }) {
  
  const dispatch = useDispatch();
  const [subjectName, setSubjectName] = useState("");
  const [subjectImage, setSubjectImage] = useState(null);
  const staff = useSelector((state) => state.staff.allStaff);
  const [subjectTeacher, setSubjectTeacher] = useState(staff[0]);

  const addNewSubject = async () => {
    setOpen(false);
    const token = localStorage.getItem("token");
    try {
      if (subjectName.length === 0)
        dispatch(setWarningToast("Please give the subject a Name"));
      else if (!subjectImage)
        dispatch(setWarningToast("Please select a Image"));
      else {
        const formData = new FormData();
        formData.append("name", subjectName);
        formData.append("subject_pic", subjectImage);
        formData.append("school", staff[0].school);
        formData.append("teacher", subjectTeacher.user.id);
        formData.append("classroom", classroom.id);
        let resp = await axios.post(API_URL + "staff/subject/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params : {
            session :localStorage.getItem("session")
          }
        });
        console.log("res : ", resp);
        if (resp.status === 201)
          dispatch(setSuccessToast("Subject Added Successfully"));
      }
    } catch (e) {
      console.warn("Error  ::::::::", e.msg);
    }
  };
  return (
    <div className="fixed left-0 right-0 flex items-center justify-center w-full h-full bg-gray-400 z-[100] bg-opacity-40">
      <div className="z-50 p-4 md:inset-0 ">
        <div className="relative w-full h-full max-w-2xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-start justify-between p-4 border-b rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 ">
                Add New Subject
              </h3>
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
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
            <div className="p-6 space-y-6">
              <div className="flex flex-col mt-10">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col w-full px-8">
                    <label className="mb-4 text-lg font-semibold text-gray-800">
                      Subject*
                    </label>
                    <input
                      value={subjectName}
                      type="text"
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="Subject"
                      className="flex px-3 py-4 font-medium border-2 border-gray-400 border-[1px] rounded-lg placeholder:font-normal w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full px-8">
                    <label className="mb-4 text-lg font-semibold text-gray-800">
                      Teacher*
                    </label>
                    <TeacherDropdown
                      //   id={index + 1}
                      inputList={staff}
                      labelTitle=""
                      DivWidth="full"
                      selected={subjectTeacher}
                      setSelected={setSubjectTeacher}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full p-8 pt-2">
                  <span className="mb-4 font-semibold text-gray-800 text-md">
                    Subject Image
                  </span>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100   "
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 ">
                          <span className="text-xl font-semibold">
                            {" "}
                            {subjectImage ? subjectImage.name : "Subject Image"}
                          </span>
                        </p>

                        <p className="mb-2 text-sm text-gray-500 ">
                          <span className="font-semibold">
                            {subjectImage
                              ? "Click to Change"
                              : "Click to upload"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 ">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if(e.target.files[0].size < 1000000) setSubjectImage(e.target.files[0]);
                          else dispatch(setWarningToast("Please select an image smaller than 1MB"))
                        
                          
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
              <button
                onClick={() => addNewSubject()}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center   "
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
