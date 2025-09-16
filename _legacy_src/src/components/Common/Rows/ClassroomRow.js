import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import { removeClass } from "../../../store/School/classroomSlice";
import PopUpMenu from "../../UI/PopUpMenu";

import { setSuccessToast } from "../../../store/generalUser";
export default function ClassroomRow({
  classData,
  setOpenSidebar,
  index,
  setOpenEditClassroom,
  setSelectedClassroom
}) {
  console.log(classData);
  const dispatch = useDispatch();
  function viewClass() {
    localStorage.setItem("classId", classData.id);
    localStorage.setItem(
      "className",
      classData.class_name + " " + classData.section_name
    );
    setOpenEditClassroom(classData);
    setOpenSidebar(index);
  }
  function editClass() {
    setSelectedClassroom(classData);
    setOpenEditClassroom(true);
  }
  async function deleteClass() {
    // props.setOpenProfile(0);
    console.log("Delete called");
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const res = await axios.delete(
        API_URL + "list/classroom/" + classData.id + "/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", res);
      if (res.status === 204) {
        dispatch(removeClass(classData));
        dispatch(setSuccessToast("Deleted Classroom"));
      }
    } catch (error) {
      console.warn(error);
    }
  }
  function viewStudentDetails() {
    localStorage.setItem("classId", classData.id);
    localStorage.setItem(
      "className",
      classData.class_name + " " + classData.section_name
    );
  }
  const ClassroomPopUpData = [
    {
      title: "View Class Details",
      function: viewClass,
    },
    {
      title: "View Class Student",
      function: viewStudentDetails,
    },
    {
      title: "Edit Class",
      function: editClass,
    },
    {
      title: "Delete Class",
      function: deleteClass,
      deleteType: true,
    },
  ];
  return (
    <div className="grid w-full grid-cols-7 p-2 pl-6 py-4 font-semibold text-gray-800 bg-white border-b-2">
      <span>{classData.class_name + " " + classData.section_name}</span>
      <span>{classData.class_teacher}</span>
      <span>{classData.sub_class_teacher}</span>
      <span>{classData.no_of_subjects}</span>
      <span>{classData.no_of_subjects}</span>
      <span> {classData.strength}</span>
      <span>
        <PopUpMenu menuList={ClassroomPopUpData} />
      </span>
    </div>
  );
}
