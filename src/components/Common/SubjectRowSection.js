import React from "react";
import ClassroomRow from "./Rows/ClassroomRow";
import SubjectRow from "./Rows/SubjectRow";
import { buildMediaUrl } from "../../helpers/URL";
import { saveAs } from "file-saver";
export default function SubjectRowSection({
    classCumilativeName,
    sectionData,
    setOpenSylabusSidebar
}) {
    const downloadFile = (subject) => {
        for (let i in subject.attachments) {
          const element =
            buildMediaUrl(subject.attachments[i]);
          saveAs(element, subject.subject_name + ".pdf");
        }
      };
    
      function filterTabs(classData) {
        return classData.classroom_name.split(" ")[0] === classCumilativeName;
      }

  return (
    <>
      {sectionData.filter(filterTabs).length === 0 ? undefined : (
        <div className="mb-4 flex flex-col">
          <span className="ml-2 text-2xl font-medium text-gray-800 my-3 flex">
            {classCumilativeName} Standard
          </span>
          <div className="border-2 rounded-md">
          <div className="grid w-full grid-cols-4 p-2 text-sm font-semibold text-gray-500 bg-slate-100">
                  <span>Class</span>
                  <span>Subject</span>
                  <span>Download Sylabus</span>
                  <span>ACTIONS</span>
                </div>
            {sectionData.filter(filterTabs).map((subject, index) => {
              return (
                <SubjectRow
                downloadFile={downloadFile}
                key={index}
                index={index}
                subject={subject}
                setOpenSylabusSidebar={setOpenSylabusSidebar}
                />
              );
            })}
        </div>
        </div>
      )}
    </>
  );
}
