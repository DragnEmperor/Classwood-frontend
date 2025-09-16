import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineUpload , AiOutlinePlayCircle} from "react-icons/ai";
import {TfiBook} from 'react-icons/tfi';
import { API_URL } from "../../../helpers/URL";
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import { saveAs } from 'file-saver';
import PopUpMenu from "../../UI/PopUpMenu";
import VerticalDots from "../../../assets/icons/VerticalDots";
export default function SubjectCard({index, subject, downloadFile, setOpenSylabusSidebar}) {
  
  function viewSylabus (){
    setOpenSylabusSidebar(true);
  }
  const subjectPopUlList = [
    {
      title: "View Sylabus Details",
      function: viewSylabus,
    },
  ]

  return (
    <div key={index} className="flex flex-col p-4 duration-200 ease-in-out bg-white border rounded-xl hover:drop-shadow-md">
    
      <div className="flex flex-row items-center justify-between">
        <span className="text-xl font-semibold ">{subject.classroom_name}</span>
        {/* <PopUpMenu
          menuList={subjectPopUlList}
        /> */}
      </div>

      
      <div className="flex flex-col mt-4">
      <div className="flex flex-row justify-between font-semibold">
        <span className="flex">
        <TfiBook className="w-6 h-6 mr-4 text-indigo-700" />

        {subject.subject_name}
        </span>
        
      </div>
     
      <span onClick={()=> downloadFile(subject)} className="flex items-center px-2 py-2 pt-4 mt-4 font-semibold border-t-2 border-dotted rounded-md cursor-pointer hover:bg-gray-200">
        {" "}
        <HiOutlineDocumentDownload  className="w-6 h-6 mr-4 text-indigo-600" /> Download Syllabus
      </span>
      </div>
    </div>
  );
}
