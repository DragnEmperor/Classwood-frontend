import React, { useEffect, useState } from "react";
import Layout from "./StudentLayout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL, buildMediaUrl } from "../../helpers/URL";
import { AiFillFileExcel } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { saveAs } from "file-saver";
export default function EventFullPageView() {
  const [Notice, setCurrentNotice] = useState({});
  const [date, setDate] = useState("");
  const { id } = useParams();
  const events = useSelector((state) => state.user.events);

  async function fetchNotice() {
    const token = localStorage.getItem("token");

    let res = await axios.get(API_URL + "list/event/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("these are events : ", res.data);
  }
  useEffect(() => {
    fetchNotice();
  }, []);
  useEffect(() => {
    setCurrentNotice(events[id]);
    if (events[id]) {
      const date = new Date(events[id].date);
      console.log(date);
      setDate(
        date.getDate() + "/" + (date.getMonth() + 1 + "/" + date.getFullYear())
      );
    }
  }, [events]);
  console.log(Notice);
  const downloadFile = (index) => {
    const element =
      buildMediaUrl(Notice.attachments[index]);
    saveAs(element, Notice.title + index + ".pdf");
  };
  return (
    <Layout>
      <div className="flex p-8 m-8 bg-white rounded-2xl">
        <div className="flex flex-col items-center justify-center w-full">
          <p className="mb-4 text-2xl font-semibold underline">
            {Notice ? Notice.title : undefined}
          </p>
          <span className="flex justify-end w-full text-sm">{date}</span>
          <p className="mt-2 text-md">
            {Notice ? Notice.description : undefined}
          </p>
          {Notice ? (
            <div className="flex w-full text-center mt-16 flex-col  justify-center flex-wrap">
              <span className="text-xl font-semibold">Attachmenents</span>
              <div className="flex flex-row w-full justify-start mt-8 flex-wrap">
                {Notice.attachments
                  ? Notice.attachments.map((attachment, index) => {
                      return (
                        <button
                          key={index}
                          onClick={() => downloadFile(index)}
                          className=" text-blue-600  ml-8 my-4 border-dashed border-2 py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                          <AiFillFileExcel className="mr-4 w-6 h-6" />
                          File {index}
                        </button>
                      );
                    })
                  : undefined}
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </Layout>
  );
}
