import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { BiBook } from "react-icons/bi";
import { MdNavigateNext } from "react-icons/md";
import Layout from "./StudentLayout";
import NoticePannel from "../Common/NoticePannel";
import EventPannel from "../Common/EventPannel";
import { getAllDatatForStudentUser } from "./helper/dataFeatcher";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_URL } from "../../helpers/URL";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const studentData = useSelector((state) => state.studentUser.studentData);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(()=>{
    if(!studentData.first_name) getAllDatatForStudentUser(dispatch);
    fetchRecentPayments();
  },[])
  function findNoOfAbsents(month_attendance){
    let count = 0;
    for( let i in month_attendance) if(month_attendance[i]===1) count++;
    return count
  }
  function findNoOfPresent(month_attendance){
    let count = 0;
    for( let i in month_attendance) if(month_attendance[i]===2) count++;
    return count;
  }
  const fetchRecentPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL + "list/payments/?limit=10", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.status === 200) {
        setRecentPayments(res.data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };
  return (
    <Layout>
      <div className="flex flex-col my-10 min-[1200px]:flex-row md:px-10 min-[1200px]:px-0">
        <div className="w-full min-[1200px]:ml-10 2xl:pl-0 xl:w-3/5 2xl:w-2/3 2xl:mx-10">
          {/* Add flex */}
          <div className="h-72 md:rounded-[30px] bg-[#D9D9D9] p-6 w-full "></div>

          {/* Subject */}
          <div className="mx-4 mt-10 md:mx-0">
            <div className="flex justify-between">
              <p className="text-3xl font-semibold">Subjects</p>
              <p className="text-lg text-[#5F6368] flex flex-row items-center">
                View All <MdNavigateNext />{" "}
              </p>
            </div>
            <div className="flex justify-start gap-8 mt-8">
              {studentData.subjects && studentData.subjects.map((subject, index)=>{
                return <div key={index} className="flex flex-col p-4 bg-white rounded-xl border-[1px] border-[#D9D9D9] w-56 min-[1200px]:w-40 xl:w-56 min-[1700px]:w-64 mr-4">
                <div className="bg-[#3399FF] p-2 rounded-full self-end">
                  <BiBook className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl text-[#5F6368] font-medium mt-2">
                  {subject}
                </p>
                <Link to="/student/subject" className="text-lg text-[#5F6368] flex flex-row items-center">
                  View Subjects <MdNavigateNext />
                </Link>
              </div>
              })}
              
           
            </div>
          </div>
          {/* shop and roadmaps */}

          <div className="flex mt-10 "></div>
          {/* fees history */}
          <div className="h-72 md:rounded-[30px] bg-gray-200 p-6 w-full mt-10">
            <h1 className="text-2xl text-center md:text-4xl">
              Payment History
            </h1>
            <div className="grid grid-cols-3 mt-4">
              <div className="py-3 font-bold text-center text-gray-700 uppercase text-md lg:text-lg">
                Serial
              </div>
              <div className="py-3 font-bold text-center text-gray-700 uppercase text-md lg:text-lg">
                Amount
              </div>
              <div className="py-3 font-bold text-center text-gray-700 uppercase text-md lg:text-lg">
                Date
              </div>

              {recentPayments && recentPayments.length > 0 ? (
                recentPayments.map((payment, index) => (
                  <React.Fragment key={payment.id}>
                    <div className="px-6 py-4 text-center">{index + 1}</div>
                    <div className="px-6 py-4 text-center">{payment.student_name}</div>
                    <div className="px-6 py-4 text-center">Rs {payment.amount_paid}</div>
                    <div className="px-6 py-4 text-center">{new Date(payment.payment_date).toLocaleDateString()}</div>
                  </React.Fragment>
                ))
              ) : (
                <div className="col-span-4 px-6 py-4 text-center">
                  No Payment History Found
                </div>
              )}
            </div>
            {recentPayments && recentPayments.length > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => navigate("/school/payments")}
                  className="py-2 px-6 bg-[#372ed1] rounded-md text-white font-semibold hover:bg-[#2c24a3] transition-colors"
                >
                  View All Payments
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full my-10 xl:w-2/5 2xl:w-1/3 min-[1200px]:mx-10 px-10 min-[1200px]:px-0 min-[1200px]:my-0">
          <a href="/">
            <div className=" rounded-[30px] md:rounded-[30px] bg-white p-6 w-full ">
              <div className="flex flex-col items-center justify-center w-full h-full">
                {studentData.month_attendance && <PieChart
                  data={[{ title: "One", value: findNoOfPresent(studentData.month_attendance), color: "#61C26B" },{ title: "One", value: findNoOfAbsents(studentData.month_attendance), color: "red" }]}
                  lengthAngle={180}
                  lineWidth={32}
                  startAngle={180}
                  totalValue={studentData.month_attendance.length}
                  rounded={true}
                  animate={true}
                  background="#D9D9D9"
                />}
                <div className="flex flex-col items-center justify-center -mt-40 min-[1500px]:-mt-56">
                  <span className="text-2xl font-semibold text-center md:text-5xl">
                  {studentData.month_attendance && Math.round(findNoOfPresent(studentData.month_attendance)/(studentData.month_attendance.length) * 100)} {"%"}
                  </span>
                  <h1 className="my-2 mt-4 text-2xl text-center text-[#8A8A8A]">
                    Attendance
                  </h1>
                </div>
              </div>
            </div>
          </a>
         <NoticePannel />
         <EventPannel />
        </div>
      </div>
    </Layout>
  );
}
