import React, { useState, useEffect } from "react";
import { GoDotFill, GoLocation } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import { BsBriefcase } from "react-icons/bs";
import { MdOutlineSchool } from "react-icons/md";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { MdClass } from "react-icons/md";
import { Rings } from "react-loader-spinner";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import { useSelector } from "react-redux";
import { IoMdAddCircleOutline } from "react-icons/io";
import PresentIcon from "../../../assets/icons/PresentIcon";
import AbsentIcon from "../../../assets/icons/AbsentIcons";
export default function ClassroomSideBar({
  setOpen,
  setOpenSidebar,
  data,
  setOpenAddStudent,
  setSubjects,
}) {
  console.log(data);
  const [classSubjects, setClassSubject] = useState([]);
  const [classTeacher, setClassTeacher] = useState({});
  const [loading, setLoading] = useState(false);
  const students = useSelector((state) => state.user.classStudents);
  const session = useSelector((state) => state.user.session);

  async function fetchSubjects() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const classroomSubjects = await axios.get(API_URL + "staff/subject/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classroom: localStorage.getItem("classId"),
        session : session.id
      },
    });
    console.log(classroomSubjects.data);
    setClassSubject(classroomSubjects.data);
    setLoading(false);
  }
  async function getClassTeacher() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const Teachers = await axios.get(API_URL + "list/staff/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classroom: localStorage.getItem("classId"),
      },
    });
    console.log("Teacher :", Teachers);
    const classroomTeacher = Teachers.data.filter((teacher) => {
      return teacher.user.id === data.class_teacher;
    });
    setClassTeacher(classroomTeacher[0]);
    setLoading(false);
  }
  
  useEffect(() => {
    fetchSubjects();
    // getClassTeacher();
  }, [data]);

  const [today, setToday] = useState(0);
  const [presents, setPresents] = useState("");
  const [absents, setAbsents] = useState("");
  useEffect(() => {
    const date = new Date();
    setToday(date.getDate());
  }, []);

  const getAllClassStudent = async () => {
    if(today){
      const token = localStorage.getItem("token");
      let res = await axios.get(API_URL + "staff/student/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          classroom: data.id,
        },
      });
      // console.log("Res", res.data)
      let presents = 0;
      let absents = 0;
      for(let i in res.data){
        let val = res.data[i].month_attendance[today-1];
        console.log(val)
        if(val===2) presents++;
        if(val===1) absents++;
      }
      setPresents(presents);
      setAbsents(absents)
    }

  }
  useEffect(()=>{
    getAllClassStudent();
  },[today]);


  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col justify-between h-full pt-8 overflow-y-scroll bg-white w-[28rem] shadow-md">
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            ariaLabel="loading"
          />{" "}
        </div>
      ) : (
        <>
          <div>
            <div
              onClick={() => setOpenSidebar(-1)}
              className="cursor-pointer absolute p-2 bg-gray-200 rounded-full top-8 left-8"
            >
              <RxCross1 />
            </div>

            <div className="flex flex-col items-center justify-center w-full mt-8">
              <span className="text-2xl md:text-4xl mb-8 font-semibold ">
                {data.class_name + " " + data.section_name}
              </span>
            </div>
            <div className="flex gap-8 flex-row justify-around mt-4 border-b-[1px] border-gray-200 pb-4 mx-4">
              <div className="w-full flex flex-col p-4 bg-slate-50 rounded-lg">
                <BsBriefcase className="w-6 h-6 mb-2 text-indigo-600" />
                <span className="mb-2 font-semibold text-md">
                  Class Teacher
                </span>
                <span>
                  {data.class_teacher}
                </span>
              </div>
              <div className="flex flex-col w-full p-4 bg-slate-50 rounded-lg">
                <MdOutlineSchool className="w-6 h-6 mb-2  text-indigo-600" />
                <span className="mb-2 font-semibold text-md">
                  Total Students
                </span>
                <span>{data.strength}</span>
              </div>
            </div>
            <div className=" flex flex-col mx-4 mt-4 ">
              <p className="mb-4 text-xl md:text-2xl font-semibold text-gray-800">
                Attendence
              </p>
              <div className="mb-6">
                <div className="px-4 flex flex-col  items-start justify-start mt-2 ">
                  <span className="font-semibold text-gray-500 flex flex-row justify-center items-center">
                    <PresentIcon />
                    Present Student{" "}
                  </span>
                  <span className="font-semibold text-gray-500 ml-8">{presents}</span>
                </div>
                <div className="mt-4 px-4 flex flex-col items-start justify-between ">
                  <span className="flex flex-row items-center justify-between font-semibold text-gray-500">
                    < AbsentIcon />
                    Absent Students{" "}
                  </span>
                  <span className="font-semibold text-gray-500 ml-8">{absents}</span>
                </div>
              </div>

              <p className="mb-4 text-xl md:text-2xl font-semibold text-gray-800">
                Subject Detail
              </p>
              {classSubjects.map((subject, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col px-4 py-2 m-2 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="flex flex-row items-center mt-2">
                      <MdClass className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
                      <div className="flex flex-col items-start justify-center">
                        <span className="mb-1 font-semibold text-gray-500 text-md">
                          {subject.name}
                        </span>
                        <span className="text-gray-500">{subject.teacher}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            {localStorage.getItem("UserType") === "School" ? (
              <div className="mb-4">
                <div className="flex flex-row justify-between mx-4 my-4">
                  <button
                    className=" w-[47%] justify-center flex items-center px-4 py-2 font-medium border-indigo-500 border-[1px] text-indigo-600 duration-300 ease-in-out bg-gray-50 rounded-md hover:bg-gray-500 hover:text-white"
                    onClick={() => {
                      setOpenSidebar(-1);
                    }}
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="w-[47%] flex items-center px-4 py-2 font-medium text-white duration-300 ease-in-out bg-indigo-600 rounded-md hover:bg-indigo-800"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <IoMdAddCircleOutline className="mr-2" />
                    Add Subject
                  </button>
                </div>
                <div className="flex items-center justify-center w-full">
                  <button
                    className="flex items-center px-4 py-2 mx-4 font-medium text-white duration-300 ease-in-out bg-indigo-600 rounded-md hover:bg-indigo-800"
                    onClick={() => {
                      setSubjects(classSubjects);
                      setOpenAddStudent(true);
                      setOpenSidebar(-1);
                    }}
                  >
                    <IoMdAddCircleOutline className="mr-2" />
                    Add Student
                  </button>
                </div>
              </div>
            ) : undefined}
          </div>
        </>
      )}
    </div>
  );
}
