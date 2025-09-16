import React from 'react'
import {Link} from 'react-router-dom';
export default function Hero() {
  return (
    <div>
         <section className="flex items-center justify-center pb-20 mb-20 -mt-20 bg-auto base_bg md:pb-0 md:bg-cover">
      <div className="flex w-full overflow-hidden relativ">
         <div className="mx-auto mt-10  md:mt-0">
            <div
               className="relative z-10 h-full pb-8 sm:pb-16 md:pb-20 lg:max-w-xl 2xl:max-w-5xl lg:w-full lg:pb-28 xl:pb-32">
               
               <main className="px-4 mx-auto mt-10 sm:mt-0 sm:pt-12 md:pt-50 xl:pt-60 sm:px-6 m lg:px-8">
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
                           <Link to="/"
                              className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-black border-4 border-black rounded-md hover:bg-transparent hover:text-black md:py-4 md:text-lg md:px-10">
                              Dashboard </Link>
                           {/* <a href="{%url 'school_signup'%}"
                              className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-black border-4 border-black rounded-md hover:bg-transparent hover:text-black md:py-4 md:text-lg md:px-10">
                              Get started </a> */}

                        </div>

                     </div>
                  </div>
               </main>
            </div>
         </div>
         <div className="hidden mt-20  lg:w-1/2 md:flex">
            <img className="object-cover w-full  sm:h-72 md:h-96 lg:w-full lg:h-full rounded-bl-2xl"
               src="https://images.unsplash.com/photo-1584697964156-deca98e4439d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
               alt="" />
         </div>
      </div>
   </section>
    </div>
  )
}
