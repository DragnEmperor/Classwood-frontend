import React from 'react'
import PopUpMenu from "../../UI/PopUpMenu";

export default function AttendenceRow({classData}) {
    function viewAttendece() {}
    const ClassroomPopUpData = [
      {
        title: "View Class Attendence",
        function: viewAttendece,
      },
    ];
  return (
    <div className="grid w-full grid-cols-5 p-2 py-4 font-semibold text-gray-800 bg-white border-b-2">
      <span>{classData.class_name + " " + classData.section_name}</span>
      <span>{classData.no_of_subjects}</span>
      <span>{classData.no_of_subjects}</span>
      <span> {classData.strength}</span>
      <span>
        <PopUpMenu menuList={ClassroomPopUpData} />
      </span>
    </div>
  )
}
