import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import GridButton from "../../assets/icons/GridButton";
import ListButton from "../../assets/icons/ListButton";
import { useSelector, useDispatch } from "react-redux";
import { FiFilter, FiMoreHorizontal } from "react-icons/fi";
import UploadSyllabusSidebar from "../Common/SideBars/UploadSyllabusSidebar";
import { AiOutlineSearch, AiOutlineUpload } from "react-icons/ai";
import { getAllSchoolData } from "./helpers/dataFetcher";
import { useNavigate } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import { API_URL } from "../../helpers/URL";
import { saveAs } from "file-saver";
import SubjectCardSection from "../Common/SubjectCardSection";
import SubjectRowSection from "../Common/SubjectRowSection";

const tabs = [
  "All Classes",
  "Senior Secondary",
  "Secondary",
  "Primary",
  "Middle",
  "Pre Primary",
];
const sections = ["12", "11", "10", "9","8", "7", "6","5","4","3","2","1","LKG", "UKG","Nursery", "Pre Nursery"]

export default function AllSubjects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector((state) => state.user.session);

  const [opneSylabusSidebar, setOpenSylabusSidebar] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [tabState, setTabState] = useState(0);
  const [viewState, setViewState] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQueary] = useState("");

  const allSyllabus = useSelector((state) => state.syllabus.allSyllabus);
  console.log("All Sylabus", allSyllabus);
  function filterTabs(classData) {
    if (tabState === 0) return true;
    else if (tabState === 1) {
      if (classData.classroom_name.split(" ")[0] === "12" || classData.classroom_name.split(" ")[0] === "11")
        return true;
    } else if (tabState === 2) {
      if (classData.classroom_name.split(" ")[0] === "10" || classData.classroom_name.split(" ")[0] === "9")
        return true;
    } else if (tabState === 3) {
      if (classData.classroom_name.split(" ")[0] >= "6" && classData.classroom_name.split(" ")[0] <= "8")
        return true;
    } else if (tabState === 4) {
      if (classData.classroom_name.split(" ")[0] >= "6" && classData.classroom_name.split(" ")[0] <= "8")
        return true;
    } else if (tabState === 4) {
      if (classData.classroom_name.split(" ")[0] >= "5" && classData.classroom_name.split(" ")[0] <= "1")
        return true;
    }
  }
  function fliterClassroom(classData) {
    return (classData.classroom_name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  }
  
  useEffect(() => {
    if (!allSyllabus.length) getAllSchoolData(dispatch, navigate, setLoading, session);
  }, []);
  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            ariaLabel="loading"
          />{" "}
        </div>
      ) : (
        <>
          {openUpload !== false ? (
            <UploadSyllabusSidebar setOpenUpload={setOpenUpload} />
          ) : undefined}
            
          <div className="px-0 md:px-10">
            <div className="flex justify-between my-4">
              <p className="text-2xl font-semibold ">All CLassroom</p>

              <button
                className="flex items-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-md"
                onClick={() => setOpenUpload(true)}
              >
                <AiOutlineUpload className="w-6 h-6 mr-2" />
                Upload Syllabus
              </button>
            </div>

            <div className="mt-6 flex flex-row w-full mb-4 border-b-2">
              {tabs.map((tab, index) => {
                return (
                  <span
                    key={index}
                    className={`mx-4 cursor-pointer font-semibold  ${
                      tabState === index
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-400"
                    }`}
                    onClick={() => setTabState(index)}
                  >
                    {tab}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-row items-center mt-10 mb-4">
              <div className="relative mr-4 text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <AiOutlineSearch />
                </span>
                <input
                  type="search"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQueary(e.target.value)}
                  className="border py-3 pl-10 text-sm text-gray-900 bg-white rounded-md focus:outline-none"
                  placeholder="Search a staff member"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-row justify-between w-full">
                {/* <button className="flex items-center px-2 py-1 font-medium text-gray-800 rounded-md border-[1px] bg-gray-50 sm:px-6 md:py-2 hover:bg-gray-600 hover:text-white ease-int-out duration-200">
                  <FiFilter className="sm:mr-2" />
                  <span className="hidden font-semibold text-md sm:flex">
                    Fliter
                  </span>
                </button> */}
              </div>
              <div className="flex flex-row p-1 rounded-md bg-slate-100">
                <span
                  className={`px-2 pl-4 py-2 flex items-center justify-center ${
                    viewState === "grid"
                      ? "bg-white pr-4 font-semibold"
                      : "cursor-pointer"
                  } rounded-md`}
                  onClick={() => setViewState("grid")}
                >
                  <div className="mr-2">
                    <GridButton />
                  </div>
                  Grid
                </span>
                <span
                  className={`px-2 pr-4 py-2 flex items-center justify-center ${
                    viewState === "list"
                      ? "bg-white pl-4 font-semibold"
                      : "cursor-pointer"
                  } rounded-md`}
                  onClick={() => setViewState("list")}
                >
                  <div className="mr-2">
                    <ListButton />
                  </div>
                  List
                </span>
              </div>
            </div>

            {allSyllabus.filter(filterTabs).filter(fliterClassroom).length == 0 ? (
              <div className="flex items-center justify-center w-full h-96">
                <span>No Syllabus Create A Syllabus</span>
              </div>
            ) : viewState === "grid" ? (
               <div>
               {sections.map((classCumilativeName, index) => {
                 return (
                   <SubjectCardSection
                     key={index}
                     classCumilativeName={classCumilativeName}
                     sectionData={allSyllabus.filter(filterTabs).filter(fliterClassroom)}
                     index={index}
                     setOpenSylabusSidebar={setOpenSylabusSidebar}
                   />
                 );
               })}
             </div>
            ) : (
              <div>
                 {sections.map((classCumilativeName, index) => {
                 return (
                   <SubjectRowSection
                     key={index}
                     classCumilativeName={classCumilativeName}
                     sectionData={allSyllabus.filter(filterTabs).filter(fliterClassroom)}
                     index={index}
                     setOpenSylabusSidebar={setOpenSylabusSidebar}
                   />
                 );
               })}
                </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
