import React from "react";
import { GoLocation } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import {BsFillPersonFill} from 'react-icons/bs';
import { BsBriefcase, BsGlobe2 } from "react-icons/bs";
import { MdOutlineSchool } from "react-icons/md";
import { AiOutlinePhone, AiOutlineCalendar,AiOutlineBank } from "react-icons/ai";
import {HiOutlineCake} from "react-icons/hi";
import { useSelector } from "react-redux";
import { buildMediaUrl } from "../../helpers/URL";
import defaultProfile from "../../assets/profile.png";

const displayValue = (value) => value || "Not provided";

export default function SchoolProfile({data, setOpenProfile}) {
  const noOfStudent = useSelector((state) => state.student.noOfStudent);
  const noOfStaffMenber = useSelector((state) => state.staff.noOfStaffMember);
  const schoolLogo = buildMediaUrl(data.school_logo_url) || defaultProfile;
  
  return (
    <div className="fixed top-0 right-0 z-50 h-full pt-8 overflow-y-scroll bg-white w-[32rem]">
      <div onClick={()=>setOpenProfile(false)} className="cursor-pointer absolute p-2 bg-gray-200 rounded-full top-8 left-8">
        <RxCross1 />
      </div>

      <div className="mt-16 flex flex-col items-center justify-center w-full">
        <img
          className="object-cover w-16 h-16 mb-2 rounded-full"
          src={schoolLogo}
          alt={`${data.school_name || "School"} logo`}
        />
        <span className="font-semibold text-md ">{data.school_name}</span>
        <span className="text-gray-400">Affiliation No. {displayValue(data.school_affNo)}</span>
       
      </div>
      <div className="flex flex-row gap-8 justify-around mt-4 border-b-[1px] border-gray-200 pb-4 mx-4">
       
        <div className="flex flex-col w-full p-4 bg-[#F8FAFC] rounded-lg">
          <MdOutlineSchool className="w-6 h-6 mb-2 text-indigo-800" />
          <span className="mb-2 font-semibold text-md">No of Staff </span>
          <span>{noOfStaffMenber}</span>
        </div>
        <div className="flex flex-col w-full p-4 bg-[#F8FAFC] rounded-lg">
          <BsBriefcase className="w-6 h-6 mb-2 text-indigo-800" />
          <span className="mb-2 font-semibold text-md">No. of Students </span>
          <span>{noOfStudent}</span>
        </div>
      </div>
      <div className="flex flex-col mx-4 mt-4">
        <p className="mb-4 text-xl font-semibold text-gray-800">School Details</p>
        <div className="grid grid-cols-2">

        <div className="flex flex-row items-center mt-2">
          <AiOutlinePhone className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Phone Number</span>
            <span>{data.school_phone}</span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-2">
          <HiOutlineCake className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Established On</span>
            <span>{displayValue(data.date_of_establishment)}</span>
          </div>
        </div>
        </div>

        <div className="flex flex-row items-center mt-4">
          <BsBriefcase className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">Email Address</span>
            <span>{displayValue(data.user?.email)}</span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <BsGlobe2 className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">School Website</span>
            <span>{displayValue(data.school_website)}</span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <GoLocation className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Address</span>
            <span>{displayValue(data.school_address)}</span>
            <div>

            <span>{displayValue(data.school_city)}</span>
            <span>{data.school_state ? `, ${data.school_state}` : ""}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-4 mt-4">
        <p className="mb-4 text-xl font-semibold text-gray-800">Admisstrative Details</p>
        <div className="flex flex-row items-center mt-2">
          <AiOutlineCalendar className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Date of Establishment </span>
            <span> {displayValue(data.date_of_establishment)}</span>
          </div>
        </div>
       
        <div className="flex flex-row items-center mt-4">
          <AiOutlineBank className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Board</span>
            <span> {displayValue(data.school_board)} </span>
          </div>
        </div>
      <div className="flex flex-row items-center mt-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">School Head</span>
            <span>{displayValue(data.school_head)} </span>
          </div>
        </div>
       
      </div>
      <div className="mx-4 my-4">

      </div>
    </div>
  )
}
