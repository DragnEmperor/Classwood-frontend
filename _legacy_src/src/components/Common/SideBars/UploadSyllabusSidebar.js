import React, {useState, useEffect} from "react";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import ClassDropDown from "../../School/helpers/ClassDropDown";
import SubjectDropDown from "../../School/helpers/SubjectDropDown";
import { setWarningToast, setSuccessToast } from "../../../store/generalUser";
import { useDispatch } from "react-redux";
import { Rings } from "react-loader-spinner";

export default function UploadSyllabusSidebar({setOpenUpload}) {
  const dispatch = useDispatch();

  const classrooms = useSelector((state) => state.classroom.allClasses);
  const [classSubjects, setClassSubjects] = useState([]);
  const [setectedSubject, setSelectedSubject] = useState({
    name: "No Subject Selected",
  });
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(classrooms[0]);
  const [subjectImage, setSubjectImage] = useState(null);
  const [units, setUnits] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, [selectedClass]);

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
    setSelectedSubject({ name: "No Subject Selected" });
    setLoading(false);
  }
  async function createSyllabus(){
    try{
      setLoading(true);
      console.log(selectedClass, setectedSubject);
      if(setectedSubject.name ==="No Subject Selected"){
        dispatch(setWarningToast("Please select a subject"));
      }
      if(!subjectImage)  dispatch(setWarningToast("Please select a syllabus file"));
      else{
        const token = localStorage.getItem("token");
        const formData = new FormData();
        console.log(subjectImage)
        formData.append("classroom", selectedClass.id);
        formData.append("attachments", subjectImage);
        formData.append("subject", setectedSubject.id);
        formData.append("tag",  selectedClass.class_teacher );
        // formData.append("unit", units);
        let res = await axios.post(API_URL + "staff/syllabus/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params : {
            session : localStorage.getItem("session")
          }
        });
        console.log(res);
        if(res.status==200){
          dispatch(setWarningToast("Syllabus Adding Failed"));
  
        }
        if(res.status===201){
          dispatch(setSuccessToast("Syllabus Added successfully"));
        }
      }
     
        }
    catch(error){
      console.warn(error);
    }
    setLoading(false);
  }
  return (
    <div className="z-40 fixed top-0 right-0 pt-8 overflow-y-scroll bg-white w-[32rem] flex flex-col h-full shadow-md">
    

      <div onClick={()=>setOpenUpload(false)} className="absolute p-2 bg-gray-200 rounded-full cursor-pointer top-8 left-8">
        <RxCross1 />
      </div>
      {loading ?  
    <div className="flex items-center justify-center w-full h-screen">

    <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            
            ariaLabel="loading"
          /> </div> : <>
      <div className="mt-10 text-lg font-semibold text-black">

      <span className="mt-16 ml-8 text-lg font-semibold text-black">Create New Syllabus</span>
      </div>
      <div className="flex flex-col mx-8 mt-8 justify-between flex-1">
      <div className="flex flex-col h-full">
     <div className="mb-8">

        <ClassDropDown
          //   id={index + 1}
          inputList={classrooms}
          labelTitle="Class*"
          DivWidth="full"
          selected={selectedClass}
          setSelected={setSelectedClass}
          />
          </div>
       
        <SubjectDropDown
          //   id={index + 1}
          inputList={classSubjects}
          labelTitle="Subjects*"
          DivWidth="full"
          selected={setectedSubject}
          setSelected={setSelectedSubject}
        />
       
        <div className="flex items-center justify-center w-full mt-8">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 ">
                <span className="text-xl font-semibold"> Subject Image</span>
              </p>

              <p className="mb-2 text-sm text-gray-500 ">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500 ">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={(e)=> {
              if(e.target.files[0].size < 1000000) setSubjectImage(e.target.files[0]);
              else dispatch(setWarningToast("Please select an image smaller than 1MB"))
              
            }
              } />
          </label>
        </div>
        
    </div>
          <button onClick={()=> createSyllabus()} className="mb-8 self-end w-full py-2 mt-8 font-semibold text-white bg-indigo-500 rounded-md text-md ">Submit</button>
      </div>
      </> }
    </div>

  );
}
