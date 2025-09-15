import React, {useState, useEffect} from "react";
import { GoDotFill, GoLocation } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import {BsFillPersonFill} from 'react-icons/bs';
import { BsBriefcase } from "react-icons/bs";
import { MdOutlineSchool } from "react-icons/md";
import { AiOutlinePhone, AiOutlineCalendar,AiOutlineBank ,AiOutlineStar, AiOutlineUser} from "react-icons/ai";
import {HiOutlineCake} from "react-icons/hi";
import {FiEdit2} from "react-icons/fi";
import { API_URL } from "../../../helpers/URL";
import axios from "axios";
export default function ProfileSideBar({setOpenProfile, data, setProfileData, setOpenAddProfile, profileType}) {
  const [password, setPassword] = useState("");

  function findNoOfAbsents(str){
    let count = 0;
    for( let i = 0;i< str.length;i++) if(str[i]==="1") count++;
    return count
  }
  console.log(data)
  async function getStaffAttandence(){
    const token = localStorage.getItem("token");
    let res = await axios.get(API_URL + "list/staffAttendance/", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log("Attendence", res)
  }
  useEffect(()=>{
    getStaffAttandence();
  })
  function getEmailAndPassword(){
    if(profileType==="student"){
      let firstName = data.first_name.toLowerCase();
      let phoneNumber = data.parent_mobile_number
      let dateOfAdmission = new Date(data.date_of_admission)
      if(firstName.length > 5) firstName = firstName.substring(0,5);
      else while(firstName.length < 5) firstName += "5";
      phoneNumber = phoneNumber.substring(phoneNumber.length - 2);
      let month = dateOfAdmission.getMonth() + 1;
      let date = dateOfAdmission.getDate() ;
  
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      const pass = firstName + date+ month + phoneNumber;
      setPassword(pass)
    }
    else {
      let firstName = data.first_name.toLowerCase();
      let phoneNumber = data.mobile_number
      let dateOfJoining = new Date(data.date_of_joining)
      if(firstName.length > 5) firstName = firstName.substring(0,5);
      else while(firstName.length < 5) firstName += "5";
      phoneNumber = phoneNumber.substring(phoneNumber.length - 2);
      let month = dateOfJoining.getMonth() + 1;
      let date = dateOfJoining.getDate() ;
  
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      const pass = firstName + date+ month + phoneNumber;
      setPassword(pass)
    }
    
  }
  useEffect(()=>{
    getEmailAndPassword();
  },[data])
  console.log("User data", data);
  return (
    <div className="fixed top-0 right-0 z-50 h-full pt-8 overflow-y-scroll bg-white w-[32rem]">
      <div onClick={()=>setOpenProfile(false)} className="cursor-pointer absolute p-2 bg-gray-200 rounded-full top-8 left-8">
        <RxCross1 />
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <img
          className="object-cover w-16 h-16 mb-2 rounded-full"
          src={data.profile_pic ? data.profile_pic : "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}
        />
        <span className="font-semibold text-md ">{data.first_name + " " + data.last_name}</span>
        <span className="text-gray-400">{profileType==="student" ? "Admission No. "+  data.admission_no : "id: 1111"}</span>
        <span className="flex items-center text-green-500">
          <GoDotFill className="w-4 h-4 mr-2" /> Present
        </span>
      </div>
      <div className="flex flex-row gap-8 justify-around mt-4 border-b-[1px] border-gray-200 pb-4 mx-4">
       
        <div className="flex flex-col w-full p-4 bg-[#F8FAFC] rounded-lg">
          <MdOutlineSchool className="w-6 h-6 mb-2 text-indigo-800" />
          <span className="mb-2 font-semibold text-md">{profileType==="student" ? "Student Of" : "Class Assigned"}</span>
          <span>{profileType==="student" ? data.classroom : "10 - C"}</span>
        </div>
        <div className="flex flex-col w-full p-4 bg-[#F8FAFC] rounded-lg">
          <BsBriefcase className="w-6 h-6 mb-2 text-indigo-800" />
          <span className="mb-2 font-semibold text-md">{profileType==="student" ? "No. of Subjects" : "Role"}</span>
          <span>{profileType==="student" ? data.subjects.length : data.is_class_teacher ? "Class Teacher" : "Not A Class Teacher"}</span>
        </div>
      </div>
      <div className="flex flex-col mx-4 mt-4">
        <p className="mb-4 text-xl font-semibold text-gray-800">Personal Details</p>
        <div className="grid grid-cols-2">

        <div className="flex flex-row items-center mt-2">
          <AiOutlinePhone className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Phone Number</span>
            <span>{profileType==="student" ? data.parent_mobile_number : data.mobile_number}</span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-2">
          <HiOutlineCake className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Date of Birth</span>
            <span>{data.date_of_birth}</span>
          </div>
        </div>
        </div>

        {profileType==="student" ? 
        <div >

           <div className="flex flex-row items-center mt-2">
           <AiOutlineUser className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
           <div className="flex flex-col items-start justify-center">
             <span className="mb-1 font-semibold text-gray-800 text-md">Father Name</span>
             <span>{data.father_name}</span>
           </div>
           </div>
           <div className="flex flex-row items-center mt-2">
           <AiOutlineUser className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
           <div className="flex flex-col items-start justify-center">
             <span className="mb-1 font-semibold text-gray-800 text-md">Mother Name</span>
             <span>{data.mother_name}</span>
           </div>
           </div>
          </div> : undefined}
        <div className="flex flex-row items-center mt-4">
          <BsBriefcase className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">Email Address</span>
            <span>{data.contact_email}</span>
          </div>
        </div>
       
        <div className="flex flex-row items-center mt-4">
          <GoLocation className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Address</span>
            <span>{data.address}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-4 mt-4">
        <p className="mb-4 text-xl font-semibold text-gray-800">{profileType !== "student" ? "Professional Details" : "Admission Details"}</p>
        <div className="flex flex-row items-center mt-2">
          <AiOutlineCalendar className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">{profileType==="student" ? "Date of Admisssion" : "Date of Joining"}</span>
            <span> { profileType==="student" ? data.date_of_admission : data.date_of_joining}</span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <AiOutlineStar className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">Holiday Taken</span>
            <span>{findNoOfAbsents(data.month_attendance)}</span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <AiOutlineBank className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Bank Account</span>
            <span>{profileType==="student" ? data.parent_account_no : data.account_no} </span>
          </div>
        </div>
      <div className="flex flex-row items-center mt-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Login Email</span>
            <span>{data.user.email} </span>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">Login Password</span>
            <span>{password} </span>
          </div>
        </div>
      </div>
      <div className="mx-4 my-4">

      {localStorage.getItem("UserType")==="School" && <button className="flex items-center px-4 py-1 font-medium text-gray-800 bg-gray-100 rounded-md" onClick={()=>{
        setProfileData(data);
        setOpenAddProfile(true)
        setOpenProfile(false)

      }}>
              <FiEdit2 className="mr-2" />
              {profileType === "student" ? "Edit Student" : "Edit Staff"}
            </button>}
      </div>
    </div>
  );
}
