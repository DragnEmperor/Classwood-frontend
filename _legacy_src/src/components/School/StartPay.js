import React, { useState, useRef } from "react";
import Layout from "./Layout";

export default function StartPay() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [noOfStudent, setNoOfStudent] = useState("");
  const [noOfStaff, setNoOfStaff] = useState("");
  const yearRef = useRef(null);
  return (
    <Layout>
      <div className="flex flex-col m-4 md:flex-row">
        <div className="m-8 md:w-2/3">
          <label className="font-semibold text-md ">
            No. of Students in the School
          </label>
          <input
            type="number"
            placeholder="No of Student"
            className="w-full px-2 py-1 my-8 mb-8 rounded-md md:m-8 focus:outline-none"
            onChange={(e) => setNoOfStudent(e.target.value)}
          />

          <label className="mt-8 font-semibold text-md">
            No. of Staff in the School
          </label>
          <input
            type="number"
            placeholder="No of Staff"
            className="w-full px-2 py-1 my-8 mb-8 rounded-md md:m-8 focus:outline-none"
            onChange={(e) => setNoOfStaff(e.target.value)}
          />

          <div className="flex items-center justify-start">
            <span className="font-semibold text-md">
              Total Cost for you Regesteration{" "}
            </span>{" "}
            <span className="ml-4 text-lg font-bold">${noOfStudent * 10}</span>
          </div>
        </div>
        <div className="flex flex-col m-4 mr-8 md:w-1/3">
          <span className="text-lg font-semibold ">Card Details</span>
          <input
            type="text"
            placeholder="Card Holder Name"
            className="w-full px-2 py-1 my-4 rounded-md md:m-4 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Card Number"
            className="w-full px-2 py-1 my-4 rounded-md md:m-4 focus:outline-none"
          />
          <label className="font-semibold text-md ">Expiery Date</label>
          <div className="flex flex-row ">
            <input
              type="number"
              maxLength={2}
              value={month}
              onChange={(e) => {
                if (e.target.value <= 12) setMonth(e.target.value);
                else {
                  console.log("clicked");
                  yearRef.current.focus();
                }
              }}
              placeholder="MONTH"
              className="w-20 px-2 py-1 mx-4 rounded-md md:m-4 focus:outline-none"
            />
            <input
              type="number"
              ref={yearRef}
              onChange={(e) => setYear(e.target.value)}
              maxLength={4}
              value={year}
              placeholder="YEAR"
              className="w-20 px-2 py-1 mx-4 rounded-md md:m-4 focus:outline-none"
            />
          </div>
          <label className="font-semibold text-md ">Expiery CVV</label>
          <input
            type="password"
            placeholder="CVV"
            className="w-full px-2 py-1 m-4 rounded-md focus:outline-none"
          />
          <button className="w-full py-2 m-4 mt-8 font-semibold text-white bg-indigo-500 text-md rounded-xl">
            Pay Now
          </button>
        </div>
      </div>
    </Layout>
  );
}
