import React from "react";
import ClassroomCard from "./Cards/ClassroomCard";
import SubjectCard from "./Cards/SubjectCard";
import { saveAs } from "file-saver";
import { buildMediaUrl } from "../../helpers/URL";
export default function SubjectCardSection({
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
        <div>
          <span className="ml-2 text-2xl font-medium text-gray-800 my-3 flex">
            {classCumilativeName} Standard
          </span>
          <div className="mb-10 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sectionData.filter(filterTabs).map((subject, index) => {
              return (
                <SubjectCard
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
