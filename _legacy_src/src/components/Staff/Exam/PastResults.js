import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { API_URL } from '../../../helpers/URL';
import {AiOutlineSearch} from "react-icons/ai";
import {FiFilter} from "react-icons/fi";
import {BsGrid, BsListUl} from "react-icons/bs";
import TestCard from '../../Common/Cards/TestCard';
import TestRow from '../../Common/Rows/TestRow';
import { Rings } from 'react-loader-spinner';
import PastResultCardSection from '../../Common/PastResultCardSection';
import PastResultRowSection from '../../Common/PastResultRowSection';
const sections = ["12", "11", "10", "9","8", "7", "6","5","4","3","2","1","LKG", "UKG","Nursery", "Pre Nursery"]
export default function PastResults() {
  function filterTest(testData) {
    return (testData.classroom_name + " " +  testData.subject + testData.tag)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  }
  const [searchQuery, setSearchQuery] = useState("");
    const [selectedTest, setSelectedTest] = useState(0);
    const [pastExams, setPastExams] = useState([]);
    const [viewState, setViewState] = useState("grid");
    const [loading, setLoading] = useState(false);
    async function getPastExams() {
      setLoading(true);
        const token = localStorage.getItem("token");

        let res = await axios.get(API_URL + "staff/exam/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPastExams(res.data);
        console.log("these are notices : ", res.data);
        setLoading(false);
    };
    useEffect(()=>{
        getPastExams();
    },[])
  return (
    <>
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
        <div className="px-4 md:px-10">
        <div className="flex flex-col justify-between my-4 md:flex-row">
          <p className="my-4 mt-2 text-2xl font-semibold">All Past Exams</p>
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
                className="py-2 pl-10 text-sm text-gray-900 bg-white rounded-md focus:outline-none w-[280px] sm:w-[320px]"
                placeholder="Search a class"
                autoComplete="off"
              />
            </div>
            <button className="flex items-center px-2 py-1 font-medium text-gray-800 bg-gray-200 rounded-md sm:px-4">
              <FiFilter className="sm:mr-2" />
              <span className="hidden sm:flex">Fliter</span>
            </button>
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
        {pastExams.filter(filterTest).length == 0 ? (
          <div className="flex items-center justify-center w-full h-96">
            <span>No Test Found </span>
          </div>
        ) : viewState === "grid" ? (

          <div>
        {sections.map((classCumilativeName, index) => {
          return (
            <PastResultCardSection
              key={index}
              classCumilativeName={classCumilativeName}
              sectionData={pastExams.filter(filterTest)}
              index={index}
              setSelectedTest={setSelectedTest}
            />
          );
        })}
      </div>
        ) : (
          <div>
  
      {sections.map((classCumilativeName, index) => {
          return (
            <PastResultRowSection
            key={index}
            classCumilativeName={classCumilativeName}
            sectionData={pastExams.filter(filterTest)}
            index={index}
            setSelectedTest={setSelectedTest}
            />
          );
        })}
    
    </div>
        )}
      </div>) }
          </>
  )
}
