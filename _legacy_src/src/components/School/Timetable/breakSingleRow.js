import React, { useState } from "react";
import SubjectDropDown from "../helpers/SubjectDropDown";
import TimeDropDown from "./TimeDropDown";
import { minuteList, hou, hourList } from "../../../helpers/inputLists";
import {
  updateCommonTiming,
  
} from "../../../store/School/timetableSlice";
import { useSelector, useDispatch } from "react-redux";

export default function BreakSingleRow({
  dayRow,
  rowIndex,
  day
}) {
  const dispatch = useDispatch();
  const setSubject = (value) => {
    console.log(value,rowIndex);

    dispatch(
      updateCommonTiming({
        columnIndex: rowIndex,
        value: value,
        type : "subject"
      })
    );
  };
  const setTime = (value,timetype, HorM) =>{
    dispatch(
      updateCommonTiming({
        columnIndex: rowIndex,
        value: value,
        type : timetype,
        HorM : HorM
      })
    );
  }
  return (
    <div className="flex grid grid-cols-3 my-2">
    <input type="text" value={dayRow.subject} onChange={(e)=> setSubject(e.target.value)} className="flex items-center px-4 border-2 rounded bg-slate-50"/>

      <div className="flex flex-row gap-4 px-4">
    <TimeDropDown
              //   id={index}
              inputList={hourList}
              labelTitle=""
              DivWidth="full"
              selected={dayRow.start.hour}
              setSelected={setTime}
              type="start"
              HorM={"hour"}
            />
            <TimeDropDown
              //   id={index}
              inputList={minuteList}
              labelTitle=""
              DivWidth="full"
              type="start"
              selected={dayRow.start.minute}
              setSelected={setTime}
              HorM={"minute"}

            />
    </div>
       
    <div className="flex flex-row gap-4 px-4">
    <TimeDropDown
              //   id={index}
              inputList={hourList}
              labelTitle=""
              DivWidth="full"
              selected={dayRow.end.hour}
              setSelected={setTime}
              type="end"
              HorM={"hour"}
            />
            <TimeDropDown
              //   id={index}
              inputList={minuteList}
              labelTitle=""
              DivWidth="full"
              type="end"
              selected={dayRow.end.minute}
              setSelected={setTime}
              HorM={"minute"}

            />
    </div>
    </div>
  );
}
