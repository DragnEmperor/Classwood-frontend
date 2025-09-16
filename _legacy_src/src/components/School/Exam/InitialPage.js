import React from 'react'
import examImage from "../../../assets/graduation-hat.png";
import testImage from "../../../assets/test.png";
export default function InitialPage({setPageState}) {
  return (
    <div className="flex flex-col items-center justify-center w-full mt-16 ">
        <p className="text-4xl font-bold ">Want to add student marks ?</p>
        <p className="mt-4 font-gray-500">
          Select between exam and test, so that you can add marks for a call
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center mt-20">
          <div className="w-full md:w-auto p-4 rounded-xl [background:linear-gradient(154deg,_rgba(223,_218,_255,_0.015),_rgba(188,_158,_255,_98.3))] mb-10 md:mb-0 md:mr-16 cursor-pointer flex flex-col items-center " onClick={()=> setPageState("Exam")}>
            <p className="text-[#745FFF] font-semibold text-4xl pt-4 text-start w-full">Exam</p>
            <img
              src={examImage}
              alt="exam"
              className="relative -mt-14 top-14"
            />
          </div>
          <div className="p-4 rounded-xl [background:linear-gradient(154deg,_rgba(232,_197,_159,_0.065),_rgba(229,_192,_154,_0.97))] cursor-pointer flex flex-col items-center " onClick={()=> setPageState("Test")}>
            <p className="text-[#F1A551] font-semibold text-4xl pt-4 text-start w-full">Test</p>
            <img
              src={testImage}
              alt="exam"
              className="relative -mt-20 top-20"
            />
          </div>
        </div>
        <div className='mt-16 flex flex-col justify-center items-center '>
        <div className='text-gray-500 my-4 flex justify-center flex-row items-center overflow-x-hidden max-w-full'>
        <svg className='w-[40%] md:w-auto' height="1" viewBox="0 0 311 1" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="0.5" y1="0.5" x2="311" y2="0.5" stroke="#E2E8F0"/>
</svg>

          <span className='mx-4'> Or</span>
          <svg className='w-[40%] md:w-auto' height="1" viewBox="0 0 311 1" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="0.5" y1="0.5" x2="311" y2="0.5" stroke="#E2E8F0"/>
</svg>

        </div>
        <p className="text-2xl font-bold mb-6">Previously Uploaded Marks</p>
        <button onClick={()=> setPageState("result")} className="mt-4 flex items-center px-4 py-3 font-medium text-lg text-white bg-[#4F46E5] rounded-md">
            View All Previous Uploads
          </button>

        </div>
      </div>
  )
}
