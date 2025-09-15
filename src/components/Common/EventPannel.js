import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../helpers/URL";
import { useSelector, useDispatch } from "react-redux";
import { setEvents } from "../../store/generalUser";
import {GrNext} from "react-icons/gr";
import {IoMdAddCircleOutline} from 'react-icons/io';
import SideRectange from "../../assets/icons/SideRetangle";
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
export default function EventPannel({setOpenAddEventModal}) {
  const dispatch = useDispatch();
  const [eventArraLength, setNoticeArrayLength] = useState(4);
  const session = useSelector((state) => state.user.session);
  const events = useSelector((state) => state.user.events);
  async function fetchNotice() {
    const token = localStorage.getItem("token");

    let res = await axios.get(API_URL + "list/event/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        session: session.id,
    },
    });
    dispatch(setEvents(res.data));
  }
  useEffect(() => {
    fetchNotice();
  }, []);
  return (
    <div className="mt-10 md:shadow-lg md:rounded-xl py-4 min-h-[23.5rem]">
       <div className="absolute -l-4 ">

<SideRectange />
</div>
<div className=" px-4">


      <div className="pb-2 flex justify-between items-center border-b mx-2">
      
<h1 className=" text-2xl font-semibold text-left">
  Upcoming Event
</h1>
<span
onClick={()=> setOpenAddEventModal(true)}
className={`flex flex-row text-indigo-600 items-center font-semibold cursor-pointer ${localStorage.getItem("UserType") ==="School" ? undefined : ' hidden '}`}> <IoMdAddCircleOutline className="mr-2 w-6 h-6" /> Add New </span>
</div>
      <div className=" bg-white text-black pt-4 md:pt-6 w-full h-max">
        {events.slice(0,eventArraLength).map((event, index) => {
          const eventDate = new Date(event.date);
          return (
            <Link key={index} to={localStorage.getItem("UserType") ==="Staff" ? "/staff/event/" + index : localStorage.getItem("UserType") ==="School" ? "/school/event/" + index :  "/student/event/" + index}>
              <div className="flex justify-start pt-4 ">
              <div
                    className="text-sm text-[#76A5FF] bg-[#F0F7FD] rounded-md self-start  px-4 py-2 mr-6 flex justify-center items-center flex-col font-semibold">
                    <span>{eventDate.getDate()}
                      </span>
                      <span>{monthNames[eventDate.getMonth()]}
                      </span>
                  </div>
              
                <div className="flex flex-col">
                  <span className="font-sans font-medium uppercase text-md sm:text-xl text-[#020410]">
                    {event.title}
                  </span>
                  <p className="pt-4 text-xs  sm:text-sm text-[#8A8A8A]">
                    {event.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

{events.length > 4 ? <div onClick={()=> setNoticeArrayLength(prev=> prev===4 ? events.length : 4)} className="mt-4 cursor-pointer  border-t bg-opacity-25 pt-4 flex justify-between items-center">
                  <span className="font-sans font-medium uppercase">
                    {eventArraLength===4 ? "View More"  : "View Less"}
                  </span>
                  <GrNext />
                </div>: undefined}
      </div>
    </div>
    </div>
  );
}
