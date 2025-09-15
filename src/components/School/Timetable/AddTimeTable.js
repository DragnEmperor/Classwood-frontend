import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {IoMdAddCircleOutline} from 'react-icons/io';
import axios from "axios";
import ClassDropDown from "../helpers/ClassDropDown";
import { API_URL } from "../../../helpers/URL";
import { getAllSchoolData } from "../helpers/dataFetcher";
import { useNavigate } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import SingleRow from "./SingleRow";
import BreakSidebar from "./breakSidebar";
import { addTimetableRow, refreshTimetableRow } from "../../../store/School/timetableSlice";
import { setSuccessToast, setWarningToast } from "../../../store/generalUser";

const tabs = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thusday",
  "Friday",
  "Satarday"
];

export default function AddTimetable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector((state) => state.user.session);

  const timetableRows = useSelector((state) => state.timetable.timeTableRows);
  const commonTimming = useSelector((state) => state.timetable.commonTiming);
  
  const classrooms = useSelector((state) => state.classroom.allClasses);
  const [selectedClass, setSelectedClass] = useState({
    class_name: "No Class",

    section_name: "No Section",
  });
  const [tabState, setTabState] = useState(0);
  const [classSubjects, setClassSubjects] = useState([]);
  const [openBreakSidebar, setOpenBreakSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendCommon, setSendCommon] = useState(false);
  async function uploadTimetable() {
    try{
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Time Table Rows", timetableRows);
      
      const res = await axios.post(API_URL + "staff/timeTable/", {
        timetable : timetableRows,
        classroom : selectedClass.id,
      },{
        headers : {
          Authorization: `Bearer ${token}`,
        },
        params : {
          session : localStorage.getItem("session")
        }
      })
      console.log(res);
      if(res.status===200) dispatch(setWarningToast("Error in adding Timetable"));
      else if(res.status===201) dispatch(setSuccessToast("Timetable added Succesfully"));
    } catch( e ){
      console.warn(e)
    }
    setLoading(false);
  }
  async function fetchSubjects() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const classroomSubjects = await axios.get(API_URL + "staff/subject/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classroom: selectedClass.id,
      },
    });
    setClassSubjects(classroomSubjects.data);
    dispatch(refreshTimetableRow())
 

    setLoading(false);
  }

  useEffect(() => {
    if (classrooms.length === 0)
      getAllSchoolData(dispatch, navigate, setLoading, session);
  }, []);

  useEffect(() => {
    if (classrooms.length > 0) setSelectedClass(classrooms[0]);
  }, [classrooms]);

  useEffect(() => {
    fetchSubjects();
  }, [selectedClass]);
  const addRow = ()=>{
    dispatch(addTimetableRow(tabState));
 
  }
  return (
    <>
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
      ) : classrooms.length === 0 ? (
        <div className="flex items-center justify-center w-full h-screen">
          <span>Please Create a classroom first</span>
        </div>
      ) : (
        <div className="flex flex-col flex-1 px-4 md:px-10">
          {openBreakSidebar && <BreakSidebar classID={selectedClass.id} setOpenUpload={setOpenBreakSidebar}/>}
          <div className="flex-1">
          <div className="flex flex-col items-center justify-between my-4 md:flex-row">
            <p className="mt-8 text-2xl font-semibold">TimeTable</p>
            <span
            onClick={()=> setOpenBreakSidebar(true)}
            className="flex items-center justify-between px-4 py-2 mx-8 mt-4 font-medium text-white bg-indigo-600 rounded-md cursor-pointer md:m-0"
          >
            Add Break
          </span>
          </div>
          <div className="flex flex-row px-4">
            <div className="w-full ">
              <ClassDropDown
                //   id={index + 1}
                inputList={classrooms}
                labelTitle="Class*"
                DivWidth="full"
                selected={selectedClass}
                setSelected={setSelectedClass}
              />
            </div>
          </div>
          <div className="flex flex-col mx-4 my-8 ">
            <span className="ml-4 text-2xl font-semibold">
              {selectedClass
                ? selectedClass.class_name + " " + selectedClass.section_name
                : undefined}
            </span>
                <div className="grid grid-cols-6 text-center border rounded-md ">

            {tabs.map((tab,index)=>{
              return (<div
              onClick={()=> setTabState(index)}
              className={`border-r cursor-pointer ${ tabState===index? "bg-indigo-500 text-white font-medium" :   "hover:bg-indigo-100"} duration-200 ease-in-out py-2`}>
                {tab}

              </div>)
            })}
            </div>
            
    <div className="grid grid-cols-4 gap-8 mt-8 mb-4 text-lg font-semibold">
           <span>Subject</span>
           <span>Teacher Assigned</span>
           <span>Start Time</span>
           <span>End Time</span>
           
            </div>
              {timetableRows[tabState].map((dayRow, index) =>{
                return <SingleRow
                key={index}
                allSubjects={classSubjects}
                rowIndex={index}
                dayRow={dayRow}
                day={tabState}
              />
              })}
            
          </div>
          <div className="flex">

          <div
        onClick={()=>addRow()}
        className="flex items-center justify-between px-4 py-3 mx-4 font-medium text-indigo-700 rounded-md cursor-pointer hover:bg-indigo-100"
        >
            <IoMdAddCircleOutline className="mr-2" />
            Add Row
            </div>
          </div>
          </div>
          <button
        onClick={()=>uploadTimetable()}
        disabled={loading}
        className="flex items-center justify-center px-4 py-2 mx-8 mt-8 mb-8 font-medium text-center text-white bg-indigo-600 rounded-md cursor-pointer"
        >
            Submit Timetable
            </button>
        </div>
      )}
    </>
  );
}
