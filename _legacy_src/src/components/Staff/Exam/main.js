import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import InitialPage from "./InitialPage";
import AddExamResult from "./AddExamResult";
import AddTestResult from "./AddTestResult";
import { getAllImportantData } from "../helper/getData";
import { useSelector, useDispatch } from "react-redux";
import PastResults from "./PastResults";
import { useNavigate } from "react-router-dom";
import { Rings } from "react-loader-spinner";
export default function TestResult() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageState, setPageState] = useState("");
  const [loading, setLoading] = useState(false);
  const classrooms = useSelector((state) => state.staffUser.AllClassroom);

  useEffect(() => {
    if (classrooms.length === 0) getAllImportantData(dispatch, setLoading, navigate);
  },[]);
  return (
    <Layout>
        {loading ?  
    <div className="flex items-center justify-center w-full h-screen">

    <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            
            ariaLabel="loading"
          /> </div> : <>
      {classrooms.length === 0 ? <div className="flex h-screen w-full justify-center items-center">

        <span>Please Create a classroom first</span>
      </div> : pageState ? (
        pageState === "Exam" ? (
          <AddExamResult setPageState={setPageState} />
        ) :pageState === "Test"  ? (
          <AddTestResult setPageState={setPageState} />
        ) : (<PastResults />)
      ) : (
        <InitialPage setPageState={setPageState} />
      )}
      </> 
}
    </Layout>
  );
}
