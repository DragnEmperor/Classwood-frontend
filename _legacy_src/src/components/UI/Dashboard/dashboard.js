import React, { useState } from "react";
import StudentSideBar from "../../Student/Sidebar";
import SchoolSideBar from "../../School/Sidebar";
import StaffSideBar from "../../Staff/Sidebar";
import {GiHamburgerMenu} from 'react-icons/gi';
import {RxCross2} from 'react-icons/rx';
export default function Dashboard({children}) {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  return (
    <div>
      <div className="flex">
        <div
          className="cursor-pointer fixed z-20 p-2 bg-[#F6F8FE] rounded-full lg:hidden left-4 top-4 h-max bg-opacity-70"
          onClick={() => setSideBarOpen((prev) => !prev)}
        >
          <GiHamburgerMenu className={`w-6 h-6 text-indigo-600 ${sideBarOpen ? 'hidden' : undefined}`} />
          <RxCross2 className={`w-6 h-6 text-indigo-600 ${!sideBarOpen ? 'hidden' : undefined}`} />
        </div>
        <aside
          className={`fixed top-0 left-0 z-10 flex flex-col items-center h-screen overflow-y-scroll  bg-[#1E293B]  dash  lg:flex lg:w-[21rem] lg:p-10 lg:px-4 ${
            sideBarOpen ? "w-[21rem]" : undefined
          }`}
          style={{ overflowY: "scroll", minHeight: "100%" }}
          id="side-bar"
        >
          <div
            className={`flex-col items-center ${
              sideBarOpen ? undefined : "hidden"
            } w-full h-full lg:flex`}
            id="inner"
          >
            {localStorage.getItem("UserType")==="School" ?  <SchoolSideBar /> :  localStorage.getItem("UserType")==="Student" ? <StudentSideBar />: <StaffSideBar />}
          </div>
        </aside>
        <main
          className="flex-1 bga-[rgb(248,248,248)] lg:ml-[21rem]"
          style={{ maxWidth: "100%", minHeight: "100vh" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
