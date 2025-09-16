import React, { useState } from "react";
import { GrNext } from "react-icons/gr";
import { CgAdd } from "react-icons/cg";
import { setWarningToast } from "../../../store/generalUser";
import { useDispatch } from "react-redux";
import {AiFillFileExcel } from "react-icons/ai";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
export default function StudentDetailPage({ setPageState, CSVFile, setCSVFile }) {
  const dispatch = useDispatch();
  async function saveExample(){
    saveAs(process.env.PUBLIC_URL + "/Test-Student.csv", "example.csv")
  }

  
  const goToNextPage = () =>{
    if(CSVFile) setPageState(4);
    else dispatch(setWarningToast("Please Select A CSV File"));
  }
  const addNewStudent = () => {};
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
          <span className="flex items-center justify-center w-6 h-6 text-gray-200 bg-gray-700 border-2 border-gray-700 rounded-full text-md">
            3
          </span>
          <span className="ml-2 font-semibold text-gray-700 text-md">
            {" "}
            Student Detail
          </span>
        </div>
      </div>
      <div className="flex">

      <button onClick={()=> saveExample()} className=" text-blue-600  ml-8 my-4 border-dashed border-2 py-2 px-4 rounded-lg flex items-center justify-center" >
       <AiFillFileExcel className="mr-4 w-6 h-6" />
        Download Example
      </button>
      </div>
      <div className="flex flex-col items-start justify-center w-full p-8 pt-2">
        <span className="mb-4 font-semibold text-gray-800 text-md">
          Student CSV
        </span>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100   "
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
                <span className="text-xl font-semibold">{CSVFile ? CSVFile.name : "Student CSV"}</span>
              </p>

              <p className="mb-2 text-sm text-gray-500 ">
                <span className="font-semibold">{CSVFile ? "Change File" : "Click to upload" }</span>
              </p>
              <p className="text-xs text-gray-500 ">
                Only CSV format allowed
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={(e) => setCSVFile(e.target.files[0])}
            />
          </label>
        </div>
      </div>
      {/* <span
        onClick={() => addNewStudent()}
        className="flex flex-row items-center px-4 py-2 mt-4 ml-4 text-indigo-700 duration-200 ease-in-out rounded cursor-pointer hover:bg-gray-200 hover:text-indigo-500 w-max"
      >
        {" "}
        <CgAdd className="mr-2" /> Add new Student
      </span> */}
      </div>
      <button
        onClick={() => setPageState(4)}
        className="mb-8 flex border border-indigo-700 items-center justify-center py-4 mx-8 mt-16 text-indigo-700 duration-300  rounded-lg justify-self-end hover:bg-indigo-700 hover:text-gray-50 easy-in-out"
      >
        Save and Review <GrNext className="ml-2" />
      </button>
    </div>
  );
}
