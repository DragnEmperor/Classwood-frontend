import React,{useState} from 'react'
import {BiArrowBack} from "react-icons/bi";
import Layout from "./StudentLayout"

import MessageSidebar from './MessageSidebar'
const chatList = [
  {
  icon:"T",
  name:"Cuberto",
  desc:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, doloribus?"
},
{
  icon:"T",
  name:"Albert",
  desc:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, doloribus?"
}
]
export default function Message() {
  const [selectedChat, setSelectedChat] = useState(-1);


  return (
    <Layout>
    <div className="flex flex-row h-screen antialiased text-gray-800">
      <MessageSidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} chatList={chatList} />
        <div className={`flex-col w-full h-full px-4 py-6 bg-white  ${selectedChat!== -1 ? "flex":"hidden"} lg:flex`}>
          <div className="flex flex-row items-center px-6 py-4 shadow rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 mr-8 text-gray-100 bg-gray-400 rounded-full cursor-pointer lg:hidden" onClick={()=> setSelectedChat(-1)}>
              <BiArrowBack />
            </div>

            <div className="flex items-center justify-center w-10 h-10 text-pink-100 bg-pink-500 rounded-full">
              T
            </div>
            <div className="flex flex-col ml-3">
              <div className="text-sm font-semibold">UI Art Design</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
         
          </div>
          <div className="h-full py-4 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-12 gap-y-2">
               
                <div className="col-start-1 col-end-13 p-3 rounded-lg sm:col-end-8 lg:col-end-12 xl:col-end-8">
                  <div className="flex flex-row items-center">
                    <div
                        className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full"
                    >
                      A
                    </div>
                    <div
                        className="relative px-4 py-2 ml-3 text-sm bg-white shadow rounded-xl"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Vel ipsa commodi illum saepe numquam maxime
                        asperiores voluptate sit, minima perspiciatis.
                      </div>
                    </div>
                  </div>
                </div>
           
                <div className="col-start-2 col-end-13 p-3 rounded-lg sm:col-start-6 lg:col-start-2 xl:col-start-6">
                  <div className="flex flex-row-reverse items-center justify-start">
                    <div
                        className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full"
                    >
                      A
                    </div>
                    <div
                        className="relative px-4 py-2 mr-3 text-sm bg-indigo-100 shadow rounded-xl"
                    >
                      <div>
                        Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                      </div>
                      <div
                          className="absolute bottom-0 right-0 mr-2 -mb-5 text-xs text-gray-500"
                      >
                        Seen
                      </div>
                    </div>
                  </div>
                </div>
                
                
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div className="flex flex-row items-center w-full h-12 px-2 border rounded-3xl">
              <button className="flex items-center justify-center w-10 h-10 ml-1 text-gray-400">
                <svg className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
              <div className="w-full">
                <input type="text"
                       className="flex items-center w-full h-10 text-sm border border-transparent focus:outline-none" placeholder="Type your message...."/>
              </div>
              <div className="flex flex-row">
                <button className="flex items-center justify-center w-8 h-10 text-gray-400">
                  <svg className="w-5 h-5"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </button>
                <button className="flex items-center justify-center w-8 h-10 ml-1 mr-2 text-gray-400">
                  <svg className="w-5 h-5"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="ml-6">
              <button className="flex items-center justify-center w-10 h-10 text-indigo-800 bg-gray-200 rounded-full hover:bg-gray-300">
                <svg className="w-5 h-5 -mr-px transform rotate-90"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div></Layout>
  )
}
