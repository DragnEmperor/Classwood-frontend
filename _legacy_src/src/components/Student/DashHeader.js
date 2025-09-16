import React, {useEffect, useState} from "react";
import { FiSettings, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfilePopUpMenu from "../UI/ProfilePopUpMenu";
import { getAllDatatForStudentUser } from "./helper/dataFeatcher";
import ProfileSideBar from "../Common/SideBars/ProfileSideBar";
export default function DashHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const studentData = useSelector((state) => state.studentUser.studentData);
  const [openProfile, setOpenProfile] = useState(false);
  useEffect(()=>{
    if(!studentData.first_name) getAllDatatForStudentUser(dispatch);
  },[])
  console.log(studentData)
  const Logout = () => {
    localStorage.removeItem("UserType");
    localStorage.removeItem("token");
    navigate(`/`);
  };
  function setStudentData(){}
  const viewProfile = () => {
    setOpenProfile(true);
  };
  const ClassroomPopUpData = [
    {
      title: "View Profile",
      function: viewProfile,
    },

    {
      title: "logout",
      function: Logout,
      deleteType: true,
    },
  ];
  return (
    <div className="flex items-center justify-between w-full p-10 py-6 bg-white  border-b-[0.5px] border-[#D9D9D9]">
      <p className="text-2xl font-semibold sm:text-4xl">Hello {studentData.first_name ? studentData.first_name + " " + studentData.last_name + " " : "Student "} !</p>
      {openProfile && <ProfileSideBar 
            profileType="student"
            setStaffData={setStudentData}
            data={studentData}
            setOpenProfile={setOpenProfile}
      /> }
      <div className="flex flex-row items-center justify-center">
        <button
          className="hidden px-8 py-4 text-lg text-white rounded-full sm:flex text-medium"
          style={{
            background: "linear-gradient(180deg, #76C9EF 0%, #467CE5 100%)",
          }}
        >
          Contact School
        </button>
        <div className="p-2 min-[480px]:p-4  md:p-4 ml-2 sm:ml-4 bg-[#F6F8FE] rounded-full">
          <FiSettings className="h-4 w-4 min-[480px]:h-6 min-[480px]:w-6 sm:w-4 sm:h-4 md:w-7 md:h-7 text-[#5F6368]" />
        </div>
        <div className="p-2 min-[480px]:p-4  md:p-4 ml-2 bg-[#F6F8FE] rounded-full">
          <FiBell className="h-4 w-4 min-[480px]:h-6 min-[480px]:w-6 sm:w-4 sm:h-4 md:w-7 md:h-7 text-[#5F6368]" />
        </div>

        <ProfilePopUpMenu menuList={ClassroomPopUpData} />
      </div>
    </div>
  );
}
