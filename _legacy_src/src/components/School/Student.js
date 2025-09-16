import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Rings } from "react-loader-spinner";
import ProfileCard from "../Common/Cards/ProfileCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { API_URL } from "../../helpers/URL";
import ProfileSideBar from "../Common/SideBars/ProfileSideBar";
import AddStudent from "../Common/SideBars/AddStudentSidebar";
export default function Student() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [singleStudent, setDataOfStudent] = useState({});
  const [openProfile, setOpenProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddStudent, setOpenAddStudent] = useState(false);
  function fliterStudents(student) {
    return (student.first_name + " " + student.last_name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  }

  async function getStudents() {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (localStorage.getItem("classId")) {
      let res = await axios.get(API_URL + "staff/student/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          classroom: localStorage.getItem("classId"),
        },
      });
      setStudents(res.data);
    } else {
      let res = await axios.get(API_URL + "staff/student/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(res.data);
    }
    setLoading(false);
  }
  function removeStudent(student){
    const finalStudents = students.filter(function rmvStudent(stnd){
      return stnd.user.id !== student.user.id
    });
    setStudents(finalStudents);
  }
  useEffect(() => {
    getStudents();
  }, []);
  return (
    <Layout>

      {loading ? <div className="w-full flex h-screen justify-center items-center">
      <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            
            ariaLabel="loading"
          />
      </div> : <div className="px-0 md:px-10">
        {openProfile  ? (
          <ProfileSideBar
            profileType="student"
            setOpenAddProfile={setOpenAddStudent}
            setProfileData={setDataOfStudent}
            data={singleStudent}
            setOpenProfile={setOpenProfile}
          />
        ) : undefined}
        
        {openAddStudent ? (
        <AddStudent
          // subjects={subjects}
          // classroom={classrooms[selectedClass]}
          studentData={singleStudent}
          setOpenAddProfile={setOpenAddStudent}
        />
      ) : undefined}
        <div className="flex justify-between my-4">
          {localStorage.getItem("className") ? (
            <p className="text-xl font-semibold ">
              CLass {localStorage.getItem("className")} Student
            </p>
          ) : (
            <p className="text-xl font-semibold">All Students</p>
          )}
          {/* <button className="flex items-center px-4 py-1 font-medium text-white bg-indigo-600 rounded-md">
            <IoMdAddCircleOutline className="mr-2" />
            Add New Student
          </button> */}
        </div>

        <div className="flex flex-row my-8">
          <div className="relative mr-4 text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <AiOutlineSearch />
            </span>
            <input
              type="search"
              name="q"
              className="py-2 pl-10 text-sm text-gray-900 bg-white rounded-md focus:outline-none"
              placeholder="Search a staff member"
              autoComplete="off"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center px-2 py-1 font-medium text-gray-800 bg-gray-200 rounded-md sm:px-4">
            <FiFilter className="sm:mr-2" />
            <span className="hidden sm:flex">Fliter</span>
          </button>
        </div>
        {students.length !== 0 ? (
          <div className="grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.filter(fliterStudents).map((student, index) => {
              return (
                <ProfileCard
                  type="student"
                  attendance={student.month_attendance}
                  key={index}
                  index={index}
                  studentId={student.user.id}
                  name={student.first_name + " " + student.last_name}
                  allData={student}
                  setDataOfStaff={setDataOfStudent}
                  id={student.roll_no}
                  StclassName={student.classroom}
                  grade={"A"}
                  setOpenProfile={setOpenProfile}
                  removeStudent={removeStudent}
                  setOpenAddProfile={setOpenAddStudent}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-96">
            <p>No students In Class Right Now</p>
          </div>
        )}
      </div>}
    </Layout>
  );
}
