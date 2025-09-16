import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../helpers/URL";
import { useSelector, useDispatch } from "react-redux";
import { setNotice } from "../../store/generalUser";
import { GrNext } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import SideRectange from "../../assets/icons/SideRetangle";
import AnnouncementIcon from "../../assets/icons/AnnouncementIcon";
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apl",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
export default function NoticePannel({ setOpenAddNoticeModal }) {
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.user.notices);
  const session = useSelector((state) => state.user.session);
 
  const [noticeArraLength, setNoticeArrayLength] = useState(4);

  return (
    <div className="mt-10 md:shadow-lg md:rounded-xl py-4 min-h-[23.5rem]">
      <div className="absolute -l-4 ">
        <SideRectange />
      </div>
      <div className=" px-4">
        <div className="pb-2 flex justify-between items-center border-b mx-2">
          <h1 className=" text-2xl font-semibold text-left">
            Announcement board
          </h1>
          <span
            onClick={() => setOpenAddNoticeModal(true)}
            className={`flex flex-row text-indigo-600 items-center font-semibold cursor-pointer ${
              localStorage.getItem("UserType") === "School"
                ? undefined
                : " hidden "
            }`}
          >
            {" "}
            <IoMdAddCircleOutline className="mr-2 w-6 h-6" /> Add New{" "}
          </span>
        </div>
        <div className=" bg-white text-black pt-4 md:pt-6 w-full h-max">
          {notices.slice(0, noticeArraLength).map((notice, index) => {
            const noticeDate = new Date(notice.date_posted);
            return (
              <Link
                key={index}
                to={
                  localStorage.getItem("UserType") === "Staff"
                    ? "/staff/notice/" + index
                    : localStorage.getItem("UserType") === "School"
                    ? "/school/notice/" + index
                    : "/student/notice/" + index
                }
              >
                <div className="flex justify-start pt-4 items-center">
                  <div className="flex flex-col">
                    <span className="font-sans font-medium uppercase text-md sm:text-xl text-[#020410] flex flex-row items-center">
                      <div className="mr-4">
                        <AnnouncementIcon />
                      </div>{" "}
                      {notice.title}
                    </span>
                    <p className="ml-8 pt-1 text-xs  sm:text-sm text-[#8A8A8A]">
                      {noticeDate.getDate()} {monthNames[noticeDate.getMonth()]}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}

          {notices.length > 4 ? (
            <div
              onClick={() =>
                setNoticeArrayLength((prev) =>
                  prev === 4 ? notices.length : 4
                )
              }
              className="mt-4 cursor-pointer  border-t bg-opacity-25 pt-4 flex justify-between items-center"
            >
              <span className="font-sans font-medium uppercase">
                {noticeArraLength === 4 ? "View More" : "View Less"}
              </span>
              <GrNext />
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}
