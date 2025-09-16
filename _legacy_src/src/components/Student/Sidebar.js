import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiEdit3,
  FiSend,
  FiCreditCard,
  FiBriefcase,
} from "react-icons/fi";
import MainSideBar from "../UI/Dashboard/SideBar";
export default function StudentSidebar() {
  return (
    <MainSideBar>
      <div className="w-full pb-10 mt-12 text-gray-200 gap-y-2">
        <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="/student/dashboard"
          >
            <FiHome className=" text-[#5F6368] w-6 h-6" />

            <span className="ml-4 text-lg font-medium select-none">Dashboard</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="/student/subject"
          >
            <FiBookOpen className=" text-[#5F6368] w-6 h-6" />

            <span className="ml-4 text-lg font-medium select-none">My Cource</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="/student/test"
          >
            <FiEdit3 className=" text-[#5F6368] w-6 h-6" />

            <span className="ml-4 text-lg font-medium select-none">Test/Exam</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="/student/message"
          >
            <FiSend className=" text-[#5F6368] w-6 h-6" />

            <span className="ml-4 text-lg font-medium select-none">Message</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="/student/fees"
          >
            <FiCreditCard className=" text-[#5F6368] w-6 h-6" />

            <span className="ml-4 text-lg font-medium select-none">Fee Payment</span>
          </Link>
        </div>
        <div className="flex w-full">
          <Link
            className="flex items-center justify-start w-full p-4 mx-4 my-1 text-center duration-300 ease-in-out rounded-xl hover:bg-gray-700"
            to="{% url 'dashboard' %}"
          >
            <FiBriefcase className=" text-[#5F6368] w-6 h-6" />

            <span className="ml-4 text-lg font-medium select-none">Administration</span>
          </Link>
        </div>
      </div>
    </MainSideBar>
  );
}
