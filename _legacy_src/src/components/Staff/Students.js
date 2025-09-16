import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import ProfileCard from "../Common/Cards/ProfileCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { API_URL } from "../../helpers/URL";
import { useSelector, useDispatch } from "react-redux";
import { setClassStudents } from "../../store/generalUser";
import ProfileSideBar from "../Common/SideBars/ProfileSideBar";
import { Rings } from "react-loader-spinner";
export default function Student() {
  const dispatch = useDispatch();
  
  const students = useSelector((state) => state.user.classStudents);
  const staff = useSelector((state) => state.staffUser.staffData);
  
  const [canMark, setCanMark] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [singleStudent, setDataOfStudent] = useState({});
  const [openProfile, setOpenProfile] = useState(-1);
  const [classroomId, setClassId] = useState("");
  const [loading, setLoading]  = useState(false);
  useEffect(()=>{
    setClassId(localStorage.getItem("classId"));
  }, [])
  function fliterStudents(student) {
    return (student.first_name + " " + student.last_name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  }
  async function getStudents() {
    setLoading(true);
    const token = localStorage.getItem("token");
    let res = await axios.get(API_URL + "staff/student/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classroom: localStorage.getItem("classId"),
      },
    });
    dispatch(setClassStudents(res.data));
    setLoading(false);

  }
  
  useEffect(() => {
    if (staff.first_name) {
      let markable = staff.sub_incharge_of.map((x) => x);
      markable.push(staff.incharge_of);
      setCanMark(markable);
    }
  }, [staff]);
  useEffect(() => {
    // if (!students.length) {
      getStudents();
    // }
  }, [classroomId]);

  return (
    <Layout>
      {loading ? 
       <div className="flex items-center justify-center w-full h-screen">

       <Rings
               height="220"
               width="220"
               // radius="9"
               color="rgb(30 64 175)"
               
               ariaLabel="loading"
             /> </div>
      : <div className="px-0 md:px-10">
        {openProfile !== -1 ? (
          <ProfileSideBar
            profileType="student"
            // setOpenAddProfile={setOpenAddProfile}
            setStaffData={setDataOfStudent}
            data={singleStudent}
            setOpenProfile={setOpenProfile}
          />
        ) : undefined}
        <div className="flex justify-between my-4">
          <div className="flex flex-row ">
            <div className="relative mr-4 text-gray-600 focus-within:text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <AiOutlineSearch />
              </span>
              <input
                type="search"
                name="q"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 text-sm text-gray-900 bg-white rounded-md focus:outline-none"
                placeholder="Search a staff member"
                autoComplete="off"
              />
            </div>
            <button className="flex items-center px-2 py-1 font-medium text-gray-800 bg-gray-200 rounded-md sm:px-4">
              <FiFilter className="sm:mr-2" />
              <span className="hidden sm:flex">Fliter</span>
            </button>
          </div>
        </div>

        <p className="my-4 mt-8 text-xl font-semibold">
          CLass {localStorage.getItem("className")} Student
        </p>
        {students.length === 0 ? (
          <div className="flex items-center justify-center w-full h-96">
            <span className="text-lg font-medium">
              This Class Don't Have Students yet
            </span>
          </div>
        ) : (
          <div className="grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.filter(fliterStudents).map((student, index) => {
              return (
                <ProfileCard
                  type="student"
                  attendance={student.month_attendance}
                  school={student.school}
                  key={index}
                  index={index}
                  studentId={student.user.id}
                  classTeacherOff={canMark}
                  name={student.first_name + " " + student.last_name}
                  allData={student}
                  setDataOfStaff={setDataOfStudent}
                  id={student.roll_no}
                  StclassName={student.classroom}
                  grade={"A"}
                  setOpenProfile={setOpenProfile}
                />
              );
            })}
          </div>
        )}
      </div> }
      
    </Layout>
  );
}
