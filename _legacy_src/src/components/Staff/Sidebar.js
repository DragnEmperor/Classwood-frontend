import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiFileText,
  FiEdit3,
  FiSend,
  FiCreditCard,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import TimeTableIcon from "../../assets/icons/TimeTableIcon";
import ClassroomIcons from "../../assets/icons/ClassroomIcon";
import ExamIcon from "../../assets/icons/ExamIcon";

import {useLocation} from 'react-router-dom'
import { BiChalkboard } from "react-icons/bi";
import SideBar from "../UI/Dashboard/SideBar";
export default function SchoolSidebar() {
  const location = useLocation();
  console.log(location.pathname.substring(7));
  return (
    <SideBar>
      <div className="w-full pb-10 mt-12 text-gray-200 gap-y-2">
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(7)==="dashboard" ? "bg-gray-700" : ""}`}

            to="/staff/dashboard"
          >
            <DashboardIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Dashboard</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(7)==="classroom" ? "bg-gray-700" : ""}`}
            
            to="/staff/classroom"
          >
            <ClassroomIcons className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Classroom</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(7)==="test" ? "bg-gray-700" : ""}`}

            to="/staff/test"
          >
            <ExamIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Test/Exam</span>
          </Link>
        </div>
        {/* <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 my-2 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="/"
          >
            <FiSend className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Message</span>
          </Link>
        </div> */}
        {/* <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 my-2 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="/staff/salary"
          >
            <FiCreditCard className="w-6 h-6 " />

            <span className="ml-4 text-lg font-medium select-none">Salary</span>
          </Link>
        </div> */}
         <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(7)==="timetable" ? "bg-gray-700" : ""}`}

            to="/staff/timetable"
          >
            <TimeTableIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Timetable</span>
          </Link>
        </div>
      </div>
    </SideBar>
  );
}
