import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { classNameList } from "../../helpers/inputLists";
import ClassDetailPage from "./AddClassPages/ClassDetailPage";
import SubjectDetailPage from "./AddClassPages/SubjectDetailPage";
import StudentDetailPage from "./AddClassPages/StudentDetailPage";
import OverviewPage from "./AddClassPages/OverviewPage";
import { setSuccessToast, setWarningToast } from "../../store/generalUser";
import { getAllSchoolData, getLatestClassroom } from "./helpers/dataFetcher";
import { API_URL } from "../../helpers/URL";

export default function AddClass() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classTeacher, setClassTeacher] = useState("");
  const [subClassTeacher, setSubClassTeacher] = useState("");
  const [classTitle, setClassTitle] = useState(classNameList[0]);
  const [classSection, setClassSection] = useState("");
  const [pageState, setPageState] = useState(1);
  const [CSVFile, setCSVFile] = useState(null);

  const staff = useSelector((state) => state.staff.allStaff);
  const subjects = useSelector((state) => state.classroom.addClassSubject);
  const session = useSelector((state) => state.user.session);

  useEffect(() => {
    if (!staff || staff.length === 0) getAllSchoolData(dispatch, navigate, setLoading,session);
    if (staff.length) setClassTeacher(staff[0]);
    if (staff.length) setSubClassTeacher(staff[0]);
  }, [staff]);
  const propogateToPage2 = (val) => {
    if ( classSection.length === 0) {
      
      dispatch(setWarningToast("Please Fill Complete Details"));
    } 
    else if (classSection.length !== 1) dispatch(setWarningToast("Class section can only be of one letter"));
    else setPageState(val);
  };
  const propogateToPage3 = async (val) => {
    for (var subject of subjects) {
      if (subject.subjectname.length === 0) {
        dispatch(setWarningToast("Please fill names of subject properly !"));
        return;
      }
    }
    setPageState(val);
  };
  const addClass = async () => {
    try {
      const token = localStorage.getItem("token");
     
      const res = await axios.post(
        API_URL + "list/classroom/",
        {
          class_name: classTitle.name,
          section_name: classSection,
          class_teacher: classTeacher.user.id,
          sub_class_teacher: subClassTeacher.user.id,
          school: staff[0].school,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params : {
            session : localStorage.getItem("session")
          }
        }
      );
      console.log("Created Class", res);
      if (
        res.status === 200 &&
        res.data.message === "Class Teacher Already Assigned"
      ) {
        dispatch(setWarningToast("Teacher already assigned as Classteacher"));
      } else if (
        res.status === 200 &&
        res.data.non_field_errors[0] ===
          "The fields class_name, section_name, school must make a unique set."
      ) {
        dispatch(setWarningToast("Class and section should be unique"));
      } else if (res.status === 201) {
        for (let subject of subjects) {
          let SubjectResponse = await axios.post(
            API_URL + "staff/subject/",
            {
              name: subject.subjectname,
              // subject_pic: null,
              school: staff[0].school,
              teacher: subject.teacher.user.id,
              classroom: res.data.data.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Subjects Added",SubjectResponse);
          if(SubjectResponse.status=== 201){
          const formData = new FormData();
     
          formData.append("school", staff[0].school);
          formData.append("classroom", res.data.data.id);
          formData.append("csv_file", CSVFile);
          
            const studentRes = await axios.post(
              API_URL + "staff/student/",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("Student Response", studentRes);
            if(studentRes.status===201){
              dispatch(setSuccessToast("classroom Created successfully"));
              getLatestClassroom(dispatch, navigate, setLoading);
              navigate("/school/classroom");
              
            }
            else if(studentRes.status===200){
              dispatch(setWarningToast("Classroom Created but issue in Adding Some students"));
              getLatestClassroom(dispatch, navigate, setLoading);
              navigate("/school/classroom");
            }
          }
        }
      }
    } catch (e) {
      console.warn("Error :::::::", e);
    }
  };
  return (
    <Layout>
      {staff.length ? (
        pageState === 1 ? (
          <ClassDetailPage
            staff={staff}
            classTeacher={classTeacher}
            setClassTeacher={setClassTeacher}
            subClassTeacher={subClassTeacher}
            classTitle={classTitle}
            setClassTitle={setClassTitle}
            classSection={classSection}
            setClassSection={setClassSection}
            setSubClassTeacher={setSubClassTeacher}
            setPageState={propogateToPage2}
          />
        ) : pageState === 2 ? (
          <SubjectDetailPage staff={staff} setPageState={propogateToPage3} />
        ) : pageState === 3 ? (
          <StudentDetailPage setPageState={setPageState} 
          CSVFile={CSVFile} setCSVFile={setCSVFile}
          />
        ) : (
          <OverviewPage
            setPageState={setPageState}
            classTeacher={classTeacher}
            subClassTeacher={subClassTeacher}
            addClass={addClass}
            classSection={classSection}
            classTitle={classTitle.name}
          />
        )
      ) : (
        <span className="flex items-center h-full justigy-center">
          Please Create Staff first
        </span>
      )}
    </Layout>
  );
}
