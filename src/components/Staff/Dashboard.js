import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { BiBook } from "react-icons/bi";
import { MdNavigateNext } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import NoticePannel from "../Common/NoticePannel";
import EventPannel from "../Common/EventPannel";
import { API_URL } from "../../helpers/URL";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [recentPayments, setRecentPayments] = useState([]);
  const [staffData, setStaffData] = useState({ subjects: [] });

  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_URL + "list/payments/?limit=10", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setRecentPayments(res.data.payments || []);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchRecentPayments();
  }, []);
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
            <div className="flex justify-between mt-8">
              {staffData.subjects && staffData.subjects.map((subject, index)=>{
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

              <div className="px-6 py-4 text-center">1</div>
              <div className="px-6 py-4 text-center">Rs 11000</div>
              <div className="px-6 py-4 text-center">11 jan</div>

              <div className="col-span-3 px-6 py-4 text-center">
                No Payment History Found
              </div>
            </div>
          </div>
        </div>
        <div className="w-full my-10 xl:w-2/5 2xl:w-1/3 min-[1200px]:mx-10 px-10 min-[1200px]:px-0 min-[1200px]:my-0">
          <a href="/">
            <div className=" rounded-[30px] md:rounded-[30px] bg-white p-6 w-full ">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <PieChart
                  data={[{ title: "One", value: 30, color: "#61C26B" }]}
                  lengthAngle={180}
                  lineWidth={32}
                  startAngle={180}
                  totalValue={100}
                  rounded={true}
                  animate={true}
                  background="#D9D9D9"
                />
                <div className="flex flex-col items-center justify-center -mt-40 min-[1500px]:-mt-56">
                  <span className="text-2xl font-semibold text-center md:text-5xl">
                    30%
                  </span>
                  <h1 className="my-2 mt-4 text-2xl text-center text-[#8A8A8A]">
                    Attendance
                  </h1>
                </div>
              </div>
            </div>
          </a>
          <div>
           
            <NoticePannel />
            <EventPannel />
          </div>
        </div>
      </div>
    </Layout>
  );
}
