import React, { useEffect, useState } from "react";
import Layout from "./StudentLayout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../helpers/URL";
import { setNotice } from "../../store/generalUser";
import { useSelector, useDispatch } from "react-redux";
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
    console.log("these are notices : ", res.data);
    dispatch(setNotice(res.data));
  }
  useEffect(() => {
    fetchNotice();
  }, []);
  useEffect(() => {
    setCurrentNotice(notices[id]);
    if (notices[id]) {
      const date = new Date(notices[id].date_posted);
      console.log(date);
      setDate(
        date.getDate() + "/" + (date.getMonth() + 1 + "/" + date.getFullYear())
      );
    }
  }, [notices]);
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
        </div>
      </div>
    </Layout>
  );
}
