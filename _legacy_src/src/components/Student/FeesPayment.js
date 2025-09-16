import React from "react";
import Layout from "./StudentLayout";
import { MdNavigateNext } from "react-icons/md";
import { FiCreditCard } from "react-icons/fi";
import {HiOutlineBookOpen} from 'react-icons/hi';
export default function Subjects() {
  return (
    <Layout>
      <div className="flex flex-col my-10 min-[1200px]:flex-row md:px-10 min-[1200px]:px-0">
        <div className="w-full min-[1200px]:ml-10 2xl:pl-0 xl:w-3/5 2xl:w-3/4 2xl:mx-10">
          <p className="mb-4 text-3xl font-semibold">Fee Structure</p>
          <div className="w-full py-10 text-black h-max rounded-2xl">
            <div className="flex flex-col items-center justify-between p-4 pr-8 bg-white rounded-t-2xl">
            <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex bg-[#3399FF] p-2 rounded-full self-start mr-2">
                    <HiOutlineBookOpen className="w-6 h-6 text-white" />
                  </div>
                <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-[#5F6368]">
                    Admission Fees
                  </p>
                  <p className="text-2xl font-medium text-black">
                    Rs. 10,000
                  </p>
                 
                </div>
                <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-[#5F6368]">
                    Monthly Instalment
                  </p>
                  <p className="text-2xl font-medium text-black">
                    Rs. 10,000
                  </p>
                 
                </div>
                <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-[#5F6368]">
                    Extra Charge
                  </p>
                  <p className="text-2xl font-medium text-black">
                    Rs. 10,000
                  </p>
                 
                </div>
              
              </div>
            </div>

            <div className="flex flex-col items-center justify-between p-4 bg-white rounded-b-2xl">
              <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex bg-[#3399FF] p-2 rounded-full self-start mr-2">
                    <FiCreditCard className="w-6 h-6 text-white" />
                  </div>
                <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-[#5F6368]">
                    Total Fees
                  </p>
                  <p className="text-2xl font-medium text-black">
                    Rs. 80,000
                  </p>
                 
                </div>
                <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-[#5F6368]">
                    Pending Fees
                  </p>
                  <p className="text-2xl font-medium text-black">
                    Rs. 10,000
                  </p>
                 
                </div>
                <div className="flex">
                  <p className="text-sm text-[#5F6368]  font-semibold text-center bg-[#F6F8FE] border-[1px] border-gray-400 py-3 px-6 rounded-full mr-4">
                    <span className="text-black">Last Date: </span> 12 Jan 2023
                  </p>
                  <span className="text-sm text-center bg-[#61C26B] rounded-full self-start  px-4 py-3  text-white">
                    Pay Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full my-10 min-[1200px]:w-2/5 xl:w-1/3 2xl:w-1/4 min-[1200px]:mx-10 min-[480px]:px-10 min-[1600px]:ml-0 min-[1200px]:px-0 min-[1200px]:my-0">
          <p className="mb-4 text-3xl font-semibold">Shop Books</p>
          <div className="md:rounded-[30px] bg-white text-black p-4 md:p-6 w-full  py-10 h-max">
            <a href="/">
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl">
                <div className="flex flex-col">
                  <span className="font-sans font-medium text-black uppercase text-md sm:text-xl">
                    Invoice
                  </span>
                  <p className="pt-2 text-xs  sm:text-sm text-[#8A8A8A]">
                    INA 11011
                  </p>
                </div>
                <span className="text-sm text-center bg-[#61C26B] rounded-full self-start  w-36 py-2  text-white">
                  Download
                </span>
              </div>
            </a>

            <a href="/">
              <div className="mt-4 rounded-[20px] bg-gray-200 bg-opacity-25 p-4 hover:bg-opacity-75 duration-300 ease-in-out">
                <span className="font-sans font-medium uppercase">See All</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
