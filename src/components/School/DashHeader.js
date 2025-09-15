import React, {useCallback, useEffect, useState} from "react";
import NotificationIcon from "../../assets/icons/NotificationIcon"
import { useSelector, useDispatch } from "react-redux";
import ProfilePopUpMenu from "../UI/ProfilePopUpMenu";
import { useNavigate } from "react-router-dom";
import SessionDropDown from "../Common/SessionDropdown";
import { setSession } from "../../store/generalUser";
import { API_URL, buildMediaUrl } from "../../helpers/URL";
import SchoolProfile from "./SchoolProfile";
import axios from "axios";
import { setAllSession } from "../../store/School/sessionSlice";
import defaultProfile from "../../assets/profile.png";

const getPreferredSession = (sessions = []) =>
  sessions.find((session) => session.is_active) ||
  [...sessions].sort((first, second) => new Date(second.start_date) - new Date(first.start_date))[0];

export default function DashHeader({setLoading}) {
  const [openProfile,setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const session = useSelector((state) => state.user.session);
  const sessionList = useSelector((state)=> state.session.session);
  const userData = useSelector((state) => state.user.userProfileData);
  const schoolLogo = buildMediaUrl(userData.school_logo_url) || defaultProfile;

  const getSessions = useCallback(async () => {
    const token = localStorage.getItem("token");
    const sessionRes =  await axios.get(API_URL + "list/session/",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setAllSession(sessionRes.data));

    const preferredSession = getPreferredSession(sessionRes.data);
    if(preferredSession?.id){
      localStorage.setItem("session", preferredSession.id);
      dispatch(setSession(preferredSession));
    }
  }, [dispatch]);

  const Logout = ()=>{
    localStorage.removeItem("UserType");
    localStorage.removeItem("token");
    localStorage.removeItem("Payed");
    localStorage.removeItem("session");
    navigate(`/`);
  }
  useEffect(()=>{
    getSessions()

  },[getSessions])
useEffect(()=>{
  const preferredSession = getPreferredSession(sessionList);
  if(preferredSession?.id){
    localStorage.setItem("session", preferredSession.id);
    dispatch(setSession(preferredSession))
  }
},[dispatch, sessionList])
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

  return (
    <div className="flex items-center justify-between w-full p-10 py-6 bg-white  border-b-[0.5px] border-[#D9D9D9]">
      {openProfile ? <SchoolProfile data={userData} setOpenProfile={setOpenProfile} /> : undefined}
      <div className="flex flex-row items-center">
      <img
        src={schoolLogo}
        className="object-cover w-14 h-14 mr-4 rounded-full border"
        alt={`${userData.school_name || "School"} logo`}
      />
      <p className="text-2xl font-semibold sm:text-4xl">Hello {userData.school_name}!</p>
      </div>
      <div className="flex flex-row items-center justify-center">
      <div className="mr-8">

      <SessionDropDown
      setLoading={setLoading}
        inputList={sessionList}
        selected={session}
        setSelected={setSession}
        dispatch={dispatch}
        />
                  </div>
                  <div className="h-10 w-10 mr-4">

        < NotificationIcon className=" min-[480px]:h-6 min-[480px]:w-6 sm:w-4 sm:h-4 md:w-10 md:h-10 text-[#5F6368]" />
                  </div>
        
        
        <ProfilePopUpMenu menuList={ClassroomPopUpData} />

      </div>
    </div>
  );
}
