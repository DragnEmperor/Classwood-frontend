import React, { useState } from "react";
import axios from 'axios'
import { Rings } from "react-loader-spinner";
import Layout from "./Layout";
import { useDispatch } from "react-redux";
import { API_URL } from "../../helpers/URL";
import { setWarningToast, setSuccessToast } from "../../store/generalUser";
import { RxCross1 } from "react-icons/rx";
export default function AddNoticeSidebar({setOpenAddNoticeModal}) {
  
  const dispatch = useDispatch();
  const [noticeImage, addNoticeImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const date = new Date();
  async function submit(){
    if(!noticeImage){
      dispatch(setWarningToast("Notice files Missing"));
    }
    else if(title.length==0 || content.length===0){
      dispatch(setWarningToast("Complete all the Details"));

    } else{
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", content);
      console.log(noticeImage)
      const Attachments = Array.from(noticeImage)
      Attachments.forEach((item) => formData.append("attachments", item));
      const res =  await axios.post(API_URL + "list/notice/",formData,{
          headers: {
            Authorization: `Bearer ${token}`,
          }
      });
      if(res.status===201) {
        dispatch(setSuccessToast("Notice Added Successfully"))
        setTitle("");
        setContent("");
        addNoticeImage(null);
        setOpenAddNoticeModal(false);
      }
    }
    setLoading(false);
  }
  return (
    <div className="z-20 fixed top-0 right-0 h-full pt-8 overflow-y-scroll bg-white w-[35rem] shadow-lg">
       <div
        onClick={() => setOpenAddNoticeModal(false)}
        className="cursor-pointer absolute p-2 bg-gray-200 duration-200 ease-in-out hover:bg-gray-400 rounded-full top-8 left-8"
      >
        <RxCross1 />
      </div>
      {loading ?  
    <div className="flex items-center justify-center w-full h-screen">

    <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            
            ariaLabel="loading"
          /> </div> : <>
      <div className="flex flex-col mt-16">
        <span className=" text-2xl font-semibold text-center">Add Notice</span>
        <span className="text-lg ml-8 font-medium mt-4">
        Date : {date.getDate() + " - " + (date.getMonth() + 1) + " - " + date.getFullYear()}
        </span>
        <div className="flex flex-col w-full px-8 my-4 ">
          <label className="mb-4 text-xl font-semibold text-gray-800">
            Title
          </label>
          <input
            value={title}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="flex px-3 py-4 font-medium border-2 border-gray-400 border-[1px] rounded-lg placeholder:font-normal w-full"
          />
        </div>
        <div className="flex flex-col w-full px-8 my-4">
          <label className="mb-4 text-xl font-semibold text-gray-800">
            Content
          </label>
          <textarea
            value={content}
            type="text"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="flex px-3 py-4 font-medium border-gray-400 border-[1px] rounded-lg placeholder:font-normal w-full"
          />
        </div>
        <div className="flex flex-col items-start justify-center w-full p-8 pt-2">
          <span className="mb-4 text-xl font-semibold text-gray-800">
            Notice Attachment
          </span>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex noticeImage flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100   "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 ">
                  <span className="text-xl font-semibold">
                    {" "}
                    {noticeImage  ? "Files Selected": "Select File"}
                  </span>
                </p>

                <p className="mb-2 text-sm text-gray-500 ">
                  <span className="font-semibold">
                    {noticeImage ? "Click to Change" : "Click to upload"}
                  </span>
                </p>
                <p className="text-xs text-gray-500 ">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                multiple="multiple"
                className="hidden"
                onChange={(e) => {
                  let arr = [];
              
                  for (let i in e.target.files){
                    if(e.target.files[i].type==="application/pdf" && e.target.files[i].size < 1000000) arr.push(e.target.files[i]);
                  }
                  if(arr.length) addNoticeImage(arr);
                  else dispatch(setWarningToast("Please select PDF documents smaller than 1 MB only"));
                }}
              />
            </label>
          </div>
        </div>
        <div className="flex w-full p-6 border-t border-gray-200 rounded-b">
          <button
            onClick={() => submit()}
            type="button"
            className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center   "
          >
            Upload
          </button>
        </div>
      </div>
      </> }
      </div>
  );
}
