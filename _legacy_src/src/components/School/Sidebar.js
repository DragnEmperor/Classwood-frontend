import React from "react";
import { Link } from "react-router-dom";

import DashboardIcon from "../../assets/icons/DashboardIcon";
import TimeTableIcon from "../../assets/icons/TimeTableIcon";
import ClassroomIcons from "../../assets/icons/ClassroomIcon";
import StaffIcon from "../../assets/icons/StaffIcon";
import AttendenceIcon from "../../assets/icons/AttendenceIcon";
import FeesIcon from "../../assets/icons/FeesIcon";
import ExamIcon from "../../assets/icons/ExamIcon";
import SyllabusIcon from "../../assets/icons/SyllabusIcon";

import SideBar from "../UI/Dashboard/SideBar";
import { useLocation } from "react-router-dom";
export default function SchoolSidebar() {
  const location = useLocation();
  return (
    <SideBar>
      <div className="w-full pb-10 mt-12 text-gray-200 gap-y-2">
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="dashboard" ? "bg-gray-700" : ""}`}
            to="/school/dashboard"
          >
            <DashboardIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Dashboard</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="timetable" ? "bg-gray-700" : ""}`}
            to="/school/timetable"
          >
            <TimeTableIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Time Table</span>
          </Link>
        </div>
       
      
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="classroom" ? "bg-gray-700" : ""}`}
            to="/school/classroom"
          >
            <ClassroomIcons className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Classroom</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="fees" ? "bg-gray-700" : ""}`}
            to="/school/fees"
          >
            <FeesIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Fee Management</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="attendence" ? "bg-gray-700" : ""}`}
           
            to="/school/attendence"
          >
            <AttendenceIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Attendence</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="subject" ? "bg-gray-700" : ""}`}
            to="/school/subject"
          >
            <SyllabusIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Syllabus</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="test" ? "bg-gray-700" : ""}`}
            to="/school/test"
          >
            <ExamIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Exam and Test</span>
          </Link>
        </div>
        
        {/* <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="dashboard" ? "bg-gray-700" : ""}`}
            onClick={() => {
              localStorage.removeItem("classId");
              localStorage.removeItem("className");
            }}
            to="/school/students"
          >
            <HiOutlineUserGroup className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Student Management</span>
          </Link>
        </div> */}
      
        <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="staff" ? "bg-gray-700" : ""}`}
            to="/school/staff"
          >
            <StaffIcon className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Staff</span>
          </Link>
        </div>
        
        {/* <div className="flex w-full">
          <Link
            className={`flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700 ${location.pathname.substring(8)==="dashboard" ? "bg-gray-700" : ""}`}
            to="{% url 'dashboard' %}"
          >
            <FiBriefcase className="w-6 h-6 " />
            <span className="ml-4 text-lg font-medium select-none">Administration</span>
          </Link>
        </div> */}
      </div>
    </SideBar>
  );
}
