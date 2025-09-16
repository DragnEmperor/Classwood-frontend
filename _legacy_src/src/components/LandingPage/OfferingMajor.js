import React from 'react'

export default function OfferingMajor() {
  return (
    <div>
        <section className="p-10 m-20 bg-cover rounded-lg above-footer">
      <div className="sm:text-center lg:text-left">
         <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Integrated School Platform</span>
            
         </h1>
         <p
            className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            A multiplatform application to manage all your school neeeds and usecases on a single
            platform</p>
         <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
               {/* <a href="{%url 'dashboard'%}"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-black border-4 border-black rounded-md hover:bg-transparent hover:text-black md:py-4 md:text-lg md:px-10">
                  Dashboard </a> */}
               <a href="{%url 'school_signup'%}"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-black border-4 border-black rounded-md hover:bg-transparent hover:text-black md:py-4 md:text-lg md:px-10">
                  Get started </a>

            </div>

         </div>
      </div>
   </section>
    </div>
  )
}
