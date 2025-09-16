import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSettings, FiBell, FiUser } from "react-icons/fi";
import { getAllDatatForStaffUser } from "./helper/getData";
import ProfilePopUpMenu from "../UI/ProfilePopUpMenu";
import { useNavigate } from "react-router-dom";
import SelectionDropdown from "../UI/SelectionDropdown";
import ProfileSideBar from "../Common/SideBars/ProfileSideBar";

export default function DashHeader() {
  const [openProfile, setOpenProfile] = useState(false);
  function setStatffData (){

  }
  const dispatch = useDispatch();
  useEffect(() => {
    if (!staff.first_name) {
      getAllDatatForStaffUser(dispatch);
    }
  });

  const navigate = useNavigate();

  const Logout = ()=>{
    localStorage.removeItem("UserType");
    localStorage.removeItem("token");
    navigate(`/`);

  }

  const viewProfile=()=>{
    setOpenProfile(true);
  }
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

  const staff = useSelector((state) => state.staffUser.staffData);
  console.log(staff);
  return (
    <div className="flex items-center justify-between w-full p-10 py-6 bg-white  border-b-[0.5px] border-[#D9D9D9]">
      {openProfile && <ProfileSideBar 
            profileType="staff"
            setStaffData={setStatffData}
            data={staff}
            setOpenProfile={setOpenProfile}
      /> }
      <p className="text-2xl font-semibold sm:text-4xl">
        Hello {staff.first_name ? staff.first_name + " " + staff.last_name : "Staff Member"}{" "}
      </p>
      <div className="flex flex-row items-center justify-center">
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
