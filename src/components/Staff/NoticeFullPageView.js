import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL, buildMediaUrl } from "../../helpers/URL";
import { setNotice } from "../../store/generalUser";
import { useSelector, useDispatch } from "react-redux";
import { saveAs } from "file-saver";
import { AiFillFileExcel } from "react-icons/ai";
export default function NoticeFullPageView() {
  const [Notice, setCurrentNotice] = useState({});
  const [date, setDate] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const notices = useSelector((state) => state.user.notices);

  async function fetchNotice() {
    const token = localStorage.getItem("token");

    let res = await axios.get(API_URL + "list/notice/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setNotice(res.data));
  }
  useEffect(() => {
    fetchNotice();
  }, []);
  useEffect(() => {
    setCurrentNotice(notices[id]);
    if (notices[id]) {
      const date = new Date(notices[id].date_posted);
      setDate(
        date.getDate() + "/" + (date.getMonth() + 1 + "/" + date.getFullYear())
      );
    }
  }, [notices]);

  const downloadFile = (index) => {
    const element =
      buildMediaUrl(Notice.attachments[index]);
    saveAs(element, Notice.title + index + ".pdf");
  };
  console.log(Notice);
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
            <div className="flex flex-row">
              {Notice.attachments.map((attachment, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => downloadFile(index)}
                    className=" text-blue-600  ml-8 my-4 border-dashed border-2 py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    <AiFillFileExcel className="mr-4 w-6 h-6" />
                    {attachment}
                  </button>
                );
              })}
            </div>
          ) : undefined}
        </div>
      </div>
    </Layout>
  );
}
