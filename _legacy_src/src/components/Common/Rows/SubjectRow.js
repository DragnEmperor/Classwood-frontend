import React from "react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import VerticalDots from "../../../assets/icons/VerticalDots";
export default function SubjectRow({ subject, downloadFile }) {
  return (
    <div className="grid w-full grid-cols-4 p-2 py-4 font-semibold text-gray-800 bg-white border-b-2">
      <span>{subject.classroom_name}</span>
      <span>{subject.subject_name}</span>
      <span
        onClick={() => {
          downloadFile(subject);
        }}
      >
        <HiOutlineDocumentDownload className="w-6 h-6 mr-4 text-indigo-600" />
      </span>
      <VerticalDots className="flex justify-center w-6 h-6" />
    </div>
  );
}
