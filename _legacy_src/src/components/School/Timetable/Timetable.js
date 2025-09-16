import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AddTimetable from "./AddTimeTable";
import ViewTimetible from "./ViewTimetable";
import { API_URL } from "../../../helpers/URL";
import { getAllSchoolData } from "../helpers/dataFetcher";
import { useNavigate } from "react-router-dom";
export default function Timetible() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classrooms = useSelector((state) => state.classroom.allClasses);
  const [selectedClass, setSelectedClass] = useState({class_name:"No Class",

section_name : "No Section"});


  const [loading, setLoading] = useState(false);
  const session = useSelector((state) => state.user.session);
  
 const [timetableState, setTimetableState] = useState(0);
  useEffect(() => {
    if (classrooms.length === 0)
      getAllSchoolData(dispatch, navigate, setLoading, session);
  }, []);
  useEffect(() => {
    if(classrooms.length>0)
    setSelectedClass(classrooms[0]);
  }, [classrooms]);
  return (
    <Layout>
      {timetableState ? <AddTimetable setTimetableState={setTimetableState} /> : <ViewTimetible setTimetableState={setTimetableState} />}
    </Layout>
  );
}
