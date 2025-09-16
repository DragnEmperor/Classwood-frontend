import React, {useState, useEffect} from "react";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import PopUpMenu from "../../UI/PopUpMenu";
export default function AttendanceCard({ classData }) {

  const [today, setToday] = useState(0);
  const [presents, setPresents] = useState("");
  const [absents, setAbsents] = useState("");
  useEffect(() => {
    const date = new Date();
    setToday(date.getDate());
  }, []);

  const getAllClassStudent = async () => {
    if(today){
      const token = localStorage.getItem("token");
      let res = await axios.get(API_URL + "staff/student/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          classroom: classData.id,
        },
      });
      // console.log("Res", res.data)
      let presents = 0;
      let absents = 0;
      for(let i in res.data){
        let val = res.data[i].month_attendance[today-1];
        console.log(val)
        if(val===2) presents++;
        if(val===1) absents++;
      }
      setPresents(presents);
      setAbsents(absents)
    }

  }
  function viewStudentDetails() {
    localStorage.setItem("classId", classData.id);
    localStorage.setItem(
      "className",
      classData.class_name + " " + classData.section_name
    );
    // setSelectedClass(index);
  }
  const ClassroomPopUpData = [{
    title : "View Attendence",
    function : viewStudentDetails
  }]
  useEffect(()=>{
    getAllClassStudent();
  },[today])
  return (
    <div className="flex flex-col p-4 bg-white rounded-xl border">
      <div className="flex flex-row items-center justify-between pb-2 border-b-[1px]">
        <div className="flex flex-row items-center justify-between pb-2">
          <span className="p-2 bg-indigo-200 rounded-lg"></span>
          <span className="ml-2 text-xl font-semibold ">
            {classData.class_name + " " + classData.section_name}
          </span>
        </div>
        <PopUpMenu
          menuList={ClassroomPopUpData}
        />
      </div>
      <div className="flex flex-row items-center justify-between mt-6 ">
        <span className="font-semibold text-gray-500 flex flex-row justify-center items-center">
          <svg
          className="mr-2"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Icon/Outline/present" clipPath="url(#clip0_228_14583)">
              <path
                id="Vector"
                d="M5.99967 14.6663H9.99967C13.333 14.6663 14.6663 13.333 14.6663 9.99967V5.99967C14.6663 2.66634 13.333 1.33301 9.99967 1.33301H5.99967C2.66634 1.33301 1.33301 2.66634 1.33301 5.99967V9.99967C1.33301 13.333 2.66634 14.6663 5.99967 14.6663Z"
                stroke="#2DD4BF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                id="Vector_2"
                opacity="0.4"
                d="M10.3337 6.5C10.5989 6.5 10.8532 6.39464 11.0408 6.20711C11.2283 6.01957 11.3337 5.76522 11.3337 5.5C11.3337 5.23478 11.2283 4.98043 11.0408 4.79289C10.8532 4.60536 10.5989 4.5 10.3337 4.5C10.0684 4.5 9.81409 4.60536 9.62655 4.79289C9.43902 4.98043 9.33366 5.23478 9.33366 5.5C9.33366 5.76522 9.43902 6.01957 9.62655 6.20711C9.81409 6.39464 10.0684 6.5 10.3337 6.5ZM5.66699 6.5C5.93221 6.5 6.18656 6.39464 6.3741 6.20711C6.56164 6.01957 6.66699 5.76522 6.66699 5.5C6.66699 5.23478 6.56164 4.98043 6.3741 4.79289C6.18656 4.60536 5.93221 4.5 5.66699 4.5C5.40178 4.5 5.14742 4.60536 4.95989 4.79289C4.77235 4.98043 4.66699 5.23478 4.66699 5.5C4.66699 5.76522 4.77235 6.01957 4.95989 6.20711C5.14742 6.39464 5.40178 6.5 5.66699 6.5ZM5.60033 8.86667H10.4003C10.7337 8.86667 11.0003 9.13333 11.0003 9.46667C11.0003 11.1267 9.66033 12.4667 8.00033 12.4667C6.34033 12.4667 5.00033 11.1267 5.00033 9.46667C5.00033 9.13333 5.26699 8.86667 5.60033 8.86667Z"
                stroke="#2DD4BF"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_228_14583">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Present Student{" "}
        </span>
        <span className="font-semibold text-gray-500">
{presents}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between mt-1 ">
        <span className="flex flex-row items-center justify-between font-semibold text-gray-500">
          <svg
          className="mr-2"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_228_14590)">
              <path
                d="M5.99967 14.6663H9.99967C13.333 14.6663 14.6663 13.333 14.6663 9.99967V5.99967C14.6663 2.66634 13.333 1.33301 9.99967 1.33301H5.99967C2.66634 1.33301 1.33301 2.66634 1.33301 5.99967V9.99967C1.33301 13.333 2.66634 14.6663 5.99967 14.6663Z"
                stroke="#FB7185"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                opacity="0.34"
                d="M4.66699 5.83301C5.33366 5.16634 6.42033 5.16634 7.09366 5.83301M8.90699 5.83301C9.57366 5.16634 10.6603 5.16634 11.3337 5.83301M5.60033 11.7997H10.4003C10.7337 11.7997 11.0003 11.533 11.0003 11.1997C11.0003 9.53967 9.66033 8.19967 8.00033 8.19967C6.34033 8.19967 5.00033 9.53967 5.00033 11.1997C5.00033 11.533 5.26699 11.7997 5.60033 11.7997Z"
                stroke="#FB7185"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_228_14590">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Absent Students{" "}
        </span>
        <span className="font-semibold text-gray-500">
          {absents}
        </span>
      </div>
    </div>
  );
}
