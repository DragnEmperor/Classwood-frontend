import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Layout from "../Layout";
import { API_URL } from "../../../helpers/URL";
import { Rings } from "react-loader-spinner";
import { getAllImportantData } from "../helper/getData";
import { useNavigate } from "react-router-dom";
import ViewSubjectEntry from "./ViewSubjectEntry";
import { setWarningToast } from "../../../store/generalUser";

function sortTimeTable(a, b) {
  return a.start_time > b.start_time;
}

export default function TimeTable({ setTimetableState }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classrooms = useSelector((state) => state.classroom.allClasses);
  const [selectedClass, setSelectedClass] = useState({
    class_name: "No Class",
    section_name: "No Section",
  });

  const [loading, setLoading] = useState(false);
  const [timetable, setTimetable] = useState([]);
  function sortTimetable(a, b) {
    return a.start_time < b.start_time;
  }
  function filterTimetable(arr) {
    let finalPeriodArray = [{}, {}, {}, {}, {}, {}];
    for (let i in arr) {
      finalPeriodArray[parseInt(arr[i].day)] = arr[i];
    }
    return finalPeriodArray;
  }
  async function getTimeTable() {
    setLoading(true);
    try{
      var timetable = [];
      const token = localStorage.getItem("token");
  
      const res = await axios.get(API_URL + "staff/timeTable/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
     
      });
      const commonRes = await axios.get(API_URL + "staff/commontime/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
     
      });
  
      if (res.data.length) {
        const timearray = res.data.sort(sortTimetable);
        var starttime = timearray[0].start_time;
        var endtime = timearray[0].end_time;
        var arr = [];
        for (let i in timearray) {
          if (timearray[i].start_time === starttime) arr.push(timearray[i]);
          if (starttime !== timearray[i].start_time) {
            timetable.push({
              start_time: starttime,
              end_time: endtime,
              periods: filterTimetable(arr),
            });
            starttime = timearray[i].start_time;
            endtime = timearray[i].end_time;
            arr = [];
          }
        }
        timetable.push({
          start_time: starttime,
          end_time: endtime,
          periods: filterTimetable(arr),
        });
        setTimetable(timetable.concat(commonRes.data).sort(sortTimeTable));
        console.log("The result", commonRes.data, timetable);
      }
    }
    catch(e){
      dispatch(setWarningToast("Error in loading timetable"))
    }
    finally{

      setLoading(false);
    }

  }
  useEffect(() => {
    setTimetable([]);
    getTimeTable();
  }, [selectedClass]);
  useEffect(() => {
    if (classrooms.length === 0)
    getAllImportantData(dispatch, navigate, setLoading);
  }, []);
  useEffect(() => {
    if (classrooms.length > 0) setSelectedClass(classrooms[0]);
  }, [classrooms]);
  return (
    <Layout>
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
      ) :  (
        <div className="px-4 md:px-10">
          <div className="flex flex-col items-center justify-between my-4 md:flex-row">
            <p className="mt-8 text-2xl font-semibold">TimeTable</p>
            
          </div>
          <div className="flex flex-row px-4">
            
          </div>
          <div className="flex flex-col mx-4 my-8 ">
            <span className="text-xl font-semibold">
              {selectedClass
                ? selectedClass.class_name + " " + selectedClass.section_name
                : undefined}
            </span>
            {timetable.length === 0 ? (
              <div className="flex h-[50vh] w-full justify-center items-center">
                <span>No Time Table For this class</span>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-7 gap-4 mt-6">
                  <div className="text-gray-500 text-md"> </div>
                  <div className="text-center ">Monday</div>
                  <div className="text-center ">Tuesday</div>
                  <div className="text-center ">Wednesday</div>
                  <div className="text-center ">Thusday</div>
                  <div className="text-center ">Friday</div>
                  <div className="text-center ">Satarday</div>
                </div>
                {timetable.map((timetableRow, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-7 gap-4 border-b-2 border-dashed divide-x"
                    >
                      <div className="py-2 text-gray-500 text-md">
                        {" "}
                        {timetableRow.start_time} {" - "}{" "}
                        {timetableRow.end_time}{" "}
                      </div>
                      {timetableRow.periods ? (
                        timetableRow.periods.map((period, index) => {
                          return (
                            <ViewSubjectEntry
                              key={index}
                              period={period}
                              index={index}
                            />
                          );
                        })
                      ) : (
                        <div className="col-span-6">
                          <div className="py-2 text-center " index={index}>
                            <div className="mx-2 my-2 rounded-lg  bg-[#FEF3C7] shadow-xl border-l-4 py-4  px-3 border-[#F59E0B] flex flex-col justify-start items-start">
                              <span className="text-md text-font-semibold">
                                {timetableRow.subject}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
