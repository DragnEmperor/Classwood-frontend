import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import ClassroomCard from "../Common/Cards/ClassroomCard";
import { FiFilter } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { getAllImportantData } from "./helper/getData";
import ClassroomSideBar from "../Common/SideBars/classroomSidebar";
import { BsListUl, BsGrid } from "react-icons/bs";
import ClassroomRow from "../Common/Rows/ClassroomRow";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
export default function Classroom() {
  const navigate = useNavigate();
  const [openSidebar, setOpenSidebar] = useState(-1);
  const [selectedClass, setSelectedClass] = useState(-1);
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("grid");
  const [loading, setLoading] = useState(false);

  function fliterClassroom(classData) {
    return (classData.class_name + " " + classData.section_name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  }
  const dispatch = useDispatch();
  const classrooms = useSelector((state) => state.staffUser.AllClassroom);
  useEffect(() => {
    if (!classrooms.length) {
      getAllImportantData(dispatch, setLoading, navigate);
    }
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
          {openSidebar !== -1 ? (
            <ClassroomSideBar
              subjects={subjects}
              setSubjects={setSubjects}
              setOpenSidebar={setOpenSidebar}
              data={classrooms.filter(fliterClassroom)[openSidebar]}
            />
          ) : undefined}

          <div className="px-4 md:px-10">
            <div className="flex flex-col justify-between my-4 md:flex-row">
              <p className="my-4 mt-2 text-2xl font-semibold">All CLassroom</p>
            </div>
            <div className=" mb-8 flex flex-row items-center justify-between w-full">
              <div className="flex flex-row">
                <div className="relative mr-4 text-gray-600 focus-within:text-gray-400">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <AiOutlineSearch />
                  </span>
                  <input
                    type="search"
                    name="q"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border py-2 pl-10 text-sm text-gray-900 bg-white rounded-md focus:outline-none w-[280px] sm:w-[320px]"
                    placeholder="Search a class"
                    autoComplete="off"
                  />
                </div>
                {/* <button className="flex items-center px-2 py-1 font-medium text-gray-800 bg-gray-200 rounded-md sm:px-4">
                  <FiFilter className="sm:mr-2" />
                  <span className="hidden sm:flex">Fliter</span>
                </button> */}
              </div>
              <div className="flex flex-row p-1 rounded-md bg-slate-100 ">
                <span
                  className={`px-2 pl-4 py-2 flex items-center justify-center ${
                    viewState === "grid"
                      ? "bg-white pr-4 font-semibold cursor-pointer"
                      : "cursor-pointer"
                  } rounded-md`}
                  onClick={() => setViewState("grid")}
                >
                  <BsGrid className="mr-2" />
                  Grid
                </span>
                <span
                  className={`px-2 pr-4 py-2 flex items-center ${
                    viewState === "list"
                      ? "bg-white pl-4 font-semibold"
                      : "cursor-pointer"
                  } rounded-md`}
                  onClick={() => setViewState("list")}
                >
                  <BsListUl className="mr-2" />
                  List
                </span>
              </div>
            </div>
            {classrooms.length == 0 ? (
              <div className="flex items-center justify-center w-full h-96">
                <span>No Classroom Assigned</span>
              </div>
            ) : viewState === "grid" ? (
              <div className="mb-10 grid gap-4 min-[590px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {classrooms.filter(fliterClassroom).map((classData, index) => {
                  return (
                    <ClassroomCard
                      key={index}
                      classData={classData}
                      index={index}
                      setSelectedClass={setSelectedClass}
                      setOpenSidebar={setOpenSidebar}
                      setSubjects={setSubjects}
                      subjects={subjects}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="border-2 rounded-md">
                <div className="grid w-full grid-cols-5 p-2 text-sm font-semibold text-gray-500 bg-slate-100">
                  <span>Class</span>
                  <span>Total Subjects</span>
                  <span>Teachers Assigned</span>
                  <span>Students</span>
                  <span>Actions</span>
                </div>
                {classrooms.filter(fliterClassroom).map((classData, index) => {
                  return (
                    <ClassroomRow
                      key={index}
                      classData={classData}
                      index={index}
                      setSelectedClassroom={setSelectedClass}
                      setSelectedClass={setSelectedClass}
                      setOpenSidebar={setOpenSidebar}
                      // setOpenEditClassroom={setOpenEditClassroom}
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
