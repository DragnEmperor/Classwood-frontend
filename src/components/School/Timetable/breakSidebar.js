import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import BreakSingleRow from "./breakSingleRow";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import { setSuccessToast, setWarningToast } from "../../../store/generalUser";
import { useDispatch, useSelector } from "react-redux";
import { Rings } from "react-loader-spinner";
import TimeDropDown from "./TimeDropDown";
import { IoMdAddCircleOutline } from "react-icons/io";
import { addCommonTimeTableRow } from "../../../store/School/timetableSlice";
export default function BreakSidebar({ setOpenUpload, classID }) {
  const dispatch = useDispatch();
  const timetableRows = useSelector((state) => state.timetable.commonTiming);

  const [loading, setLoading] = useState(false);

  const addRow = () => {
    dispatch(addCommonTimeTableRow());
  };
  async function creatCommonTime() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Time Table Rows", localStorage.getItem("session"));

      const res = await axios.post(
        API_URL + "staff/commontime/",
        {
          common: timetableRows,
          classroom: classID,
          session : localStorage.getItem("session")
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params : {
            session : localStorage.getItem("session")
          }
        }
      );
      console.log(res);
      if (res.status === 200)
        dispatch(setWarningToast("Error in adding Timetable"));
      else if (res.status === 201)
        dispatch(setSuccessToast("Timetable added Succesfully"));
    } catch (e) {
      console.warn(e);
    }
    setLoading(false);
  }
  return (
    <div className="z-40 fixed top-0 right-0 pt-8 overflow-y-scroll bg-white w-[55rem] flex flex-col h-full shadow-md">
      <div
        onClick={() => setOpenUpload(false)}
        className="absolute p-2 bg-gray-200 rounded-full cursor-pointer top-8 left-8"
      >
        <RxCross1 />
      </div>
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
          <div className="mt-10 text-lg font-semibold text-black">
            <span className="mt-16 ml-8 text-lg font-semibold text-black">
              Common School Timing
            </span>
          </div>
          <div className="flex flex-col justify-between flex-1 mx-8 mt-8">
            <div className="flex flex-col">

           
            <div className="flex flex-col">
              <div className="grid grid-cols-3 gap-8 mt-8 mb-4 text-lg font-semibold">
                <span>Subject</span>
                <span>Start Time</span>
                <span>End Time</span>
              </div>
              {timetableRows.map((dayRow, index) => {
                return (
                  <BreakSingleRow
                    key={index}
                    rowIndex={index}
                    dayRow={dayRow}
                  />
                );
              })}
            </div>
            <div className="flex mt-4">
              <div
                onClick={() => addRow()}
                className="flex items-center justify-between px-4 py-3 mx-4 font-medium text-indigo-700 rounded-md cursor-pointer hover:bg-indigo-100"
              >
                <IoMdAddCircleOutline className="mr-2" />
                Add Row
              </div>
            </div>
            </div>
            <button
              onClick={() => creatCommonTime()}
              className="self-end w-full py-2 mt-8 mb-8 font-semibold text-white bg-indigo-500 rounded-md text-md "
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}
