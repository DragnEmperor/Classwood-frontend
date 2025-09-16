import React, { useState } from "react";
import SubjectDropDown from "../helpers/SubjectDropDown";
import TimeDropDown from "./TimeDropDown";
import { minuteList, hou, hourList } from "../../../helpers/inputLists";
import {
  updateTimetableSell,
  
} from "../../../store/School/timetableSlice";
import { useSelector, useDispatch } from "react-redux";

export default function SingleRow({
  dayRow,
  allSubjects,
  rowIndex,
  day
}) {
  const dispatch = useDispatch();
  const setSelected = (value) => {
    console.log(value);

    dispatch(
      updateTimetableSell({
        columnIndex: rowIndex,
        day: day,
        value: value,
        type : "subject"
      })
    );
  };
  const setTime = (value,timetype, HorM) =>{
    dispatch(
      updateTimetableSell({
        columnIndex: rowIndex,
        day: day,
        value: value,
        type : timetype,
        HorM : HorM
      })
    );
  }
  return (
    <div className="grid grid-cols-4 gap-8 mb-4">
<SubjectDropDown
              //   id={index}
              inputList={allSubjects}
              labelTitle=""
              DivWidth="full"
              type="timetable"
              selected={dayRow.subject}
              setSelected={setSelected}
            />
    <span className="flex items-center px-4 border-2 rounded bg-slate-50">{dayRow.teacher}</span>
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
