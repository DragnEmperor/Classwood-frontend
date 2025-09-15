import React, { useState, useEffect, Fragment } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Menu, Transition } from "@headlessui/react";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeStaffMember } from "../../../store/School/staffSlice";
import { API_URL } from "../../../helpers/URL";
import { formatDate } from "../../../helpers/helperFunctions";
import { setWarningToast, setSuccessToast } from "../../../store/generalUser";
import PopUpMenu from "../../UI/PopUpMenu";
import { Rings } from "react-loader-spinner";
export default function ProfileCard(props) {
  const dispatch = useDispatch();
  const [today, setToday] = useState(0);
  const [attendanceState, setAttendanceState] = useState(0);
  const [loading, setLoading] = useState(false);
  function viewProfile(){
    props.setDataOfStaff(props.allData);
    props.setOpenProfile(true);
  }
  function EditProfile(){
    props.setDataOfStaff(props.allData);
    props.setOpenAddProfile(true);


  }
  async function DeleteProfile(){
    
    const token = localStorage.getItem("token");
    if(props.type === "student"){

      const res =  await axios.delete(API_URL + "staff/student/" + props.studentId + "/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response",res);
      if(res.status==204){
        props.removeStudent(props.allData);
      }
    }
    else {
      const res =  await axios.delete(API_URL + "list/staff/" + props.allData.user.id + "/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response",res);
      if(res.status===204 ){
        dispatch(removeStaffMember(props.allData))
      }
    }

  }
  const ProfilePopUpMenu = [{
    title : "View Profile",
    function : viewProfile
  },
{
  title : "Edit Profile",
  function : EditProfile
},
{
  title :"Delete Profile",
  function : DeleteProfile,
  deleteType: true
}];
const deleteFunction = {
  title :"Delete Function",
  function : DeleteProfile,
  
}
  useEffect(() => {
    const date = new Date();
    setToday(date.getDate());
  }, []);

  useEffect(() => {
    if (props.type === "student")
      setAttendanceState(props.attendance[today - 1]);
    else setAttendanceState(props.allData.month_attendance[today - 1]);
    
  }, [today]);


  async function markAttendance(val) {
    setLoading(true);
    const token = localStorage.getItem("token");
    const date = new Date();
   
    try {
      if(props.type==="student"){
        const res = await axios.post(
          API_URL + "staff/studentAttendance/",
          {
            date: formatDate(date),
            present: val,
            student: props.studentId,
            classroom: localStorage.getItem("classId"),
            school: props.school,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("res : ", res);
        if (res.status === 201)
          dispatch(setSuccessToast("Attendance Marked Succesfully"));
        setAttendanceState(val ? 2 : 1);
        if (
          res.status === 200 &&
          res.data.non_field_errors[0] ===
            "The fields student, date must make a unique set."
        )dispatch
          (setWarningToast("Attendance marked for the day"));
      }
      else {
        const res = await axios.post(
          API_URL + "list/staffAttendance/",
          {
            date: formatDate(date),
            present: val,
            staff: props.allData.user.id,
            school: props.allData.school,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("res : ", res);
        if (res.status === 201)
          dispatch(setSuccessToast("Attendance Marked Succesfully"));
        setAttendanceState(val ? 2 : 1);
        if (
          res.status === 200 &&
          res.data.non_field_errors[0] ===
            "The fields student, date must make a unique set."
        )dispatch
          (setWarningToast("Attendance marked for the day"));
      }
     
    } catch (e) {
      console.warn("Error ::: ", e);
    }
    setLoading(false);
  }

  return (

    <div className="border-[1px]  border-gray-400 rounded-lg flex flex-col p-4 w-full">
    { loading ?  <div className="w-full h-full flex justify-center items-center">
      <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            ariaLabel="loading"
          />{" "}
    </div> : <>
      <div className="flex flex-row justify-between border-b-[1px] border-gray-200 pb-2 border-dotted">
        <div className="flex flex-col">
          <img
            className="object-cover w-10 h-10 mb-2 rounded-md"
          src={props.allData.profile_pic ? props.allData.profile_pic : "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}
            
          />

          <span className="font-semibold text-black">{props.name}</span>
          <span className="text-gray-400"> id: {props.id}</span>
        </div>
        <div className="flex flex-col items-end justify-between">
          <PopUpMenu menuList={ProfilePopUpMenu} deleteFunction={deleteFunction} />
         
          {props.type  ? (
            attendanceState === 2 ? (
              <span className="flex items-center text-green-500">
                <GoDotFill className="w-4 h-4 mr-2" /> Present
              </span>
            ) : attendanceState === 1 ? (
              <span className="flex items-center text-red-500">
                <GoDotFill className="w-4 h-4 mr-2" /> Absent
              </span>
            ) : (
              <span className="text-red-500">Attendance Due</span>
            )
          ) : undefined}
        </div>
      </div>
      {props.type==="student"? <div className="flex flex-row justify-between mt-2 text-gray-700">
      <div className="flex flex-col">
        <span>Class</span>
        <span>{props.StclassName}</span>
      </div>
      <div className="flex flex-col items-end">
        <span>Grade</span>
        <span>{props.grade}</span>
      </div>
    </div> : 

<div className="flex flex-row justify-between mt-2 text-gray-700">
        <div className="flex flex-col">
          <span className="text-sm">Role</span>
          <span className="font-semibold">{props.isIncharge ? "Class Teacher" : "Staff Member"}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm">Class Assigned</span>
          <span className="font-semibold" >{props.isIncharge ? props.incharge : "None"}</span>
        </div>
      </div>

      }
      {!attendanceState && ((props.type === "student" &&
      localStorage.getItem("classId") &&
      (localStorage.getItem("UserType") === "School" ||
        props.classTeacherOff.includes(props.StclassName))) || props.type==="staff") ? (
        <div className="flex flex-col">
          <span className="mt-4 mb-4 font-medium text-md">Mark Attendence</span>
          <div className="flex flex-row justify-between">
            <button
              onClick={() => markAttendance(true)}
              className="flex items-center px-4 py-1 mx-4 text-sm font-medium text-white duration-300 ease-in-out bg-green-600 rounded-md hover:bg-green-800"
            >
              Present
            </button>
            <button className=""></button>
            <button
              onClick={() => markAttendance(false)}
              className="flex items-center px-4 py-1 mx-4 font-medium text-white duration-300 ease-in-out bg-red-600 rounded-md hover:bg-red-800"
            >
              Absent
            </button>
          </div>
        </div>
      ) : undefined}
    </>}

    </div>
  );
}
