import React from "react";

export default function Offering() {
  return (
    <div>
      <div id="about" className=" pt-[120px] lg:pt-[150px] pb-[110px] bg-white">
        <div className="container mx-auto lg:max-w-7xl">
          <div className="flex flex-wrap">
            <div className="w-full px-4 lg:w-5/12">
              <div className="mx-4 hero-content">
                <h1
                  className="
                   mx-auto
                     text-dark
                     font-bold
                     text-4xl
                     2xl:text-6xl
                     sm:text-[42px]
                     leading-snug
                     mb-3
                   "
                >
                  What <br />
                  are we <br />
                  Offering
                </h1>
                <p className="text-base mb-8 text-gray-500 max-w-[480px]">
                  With TailGrids, business and students thrive together.
                  Business can perfectly match their staffing to changing demand
                  throughout the dayed.
                </p>
                <ul className="flex flex-wrap items-center">
                  <li>
                    {/* <a href="{%url 'dashboard'%}" className="inline-flex items-center justify-center px-6 py-4 text-base text-center text-white duration-300 ease-in-out bg-black border-4 border-black rounded-lg sm:px-10 lg:px-8 xl:px-10 hover:bg-transparent hover:text-black">
                           Dashboard
                        </a> */}
                    <a
                      href="{%url 'school_signup'%}"
                      className="inline-flex items-center justify-center px-6 py-4 text-base text-center text-white duration-300 ease-in-out bg-black border-4 border-black rounded-lg sm:px-10 lg:px-8 xl:px-10 hover:bg-transparent hover:text-black"
                    >
                      Get Started
                    </a>
                  </li>
                  <li></li>
                </ul>
                <div className="pt-4">
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <p>
                      Share timetable, information, notes, and exam results with
                      students and their parents regularly
                    </p>
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Share assignments, schedule online exams and evaluate
                    submission using automated grading system
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Send out messages to the entire institute, a particular
                    batch, or a single student
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Automate student attendance without wasting time ticking
                    names on a register
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Store all student info on a digital, safe, cloud-based
                    platform
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Send automatic reminders to parents and ensure fees is
                    collected before deadlines
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Hassle-free way for students to enquire and secure instant
                    admission
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Share timetable, information, notes, and exam results with
                    students and their parents regularly
                  </div>
                  <div className="flex items-center pt-2">
                    <svg
                      className="mr-4"
                      width="20"
                      style={{ minWidth: "20px" }}
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="url(#paint0_linear_37_681)"
                      />
                      <path
                        d="M6.17804 10.5459L8.36195 12.7299L13.8217 7.27008"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37_681"
                          x1="0"
                          y1="0"
                          x2="22.4251"
                          y2="3.24598"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#CEE9C1" />
                          <stop offset="1" stopColor="#83C8DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Systematically track and engage with new enquiries
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden px-4 lg:block lg:w-1/12"></div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:text-right lg:ml-auto">
                <div className="relative z-10 hidden md:inline-block pt-11 lg:pt-0">
                  <img
                    src="https://cdn.tailgrids.com/1.0/assets/images/hero/hero-image-01.png"
                    alt="hero"
                    className="max-w-full lg:ml-auto"
                  />
                  <span className="absolute -left-8 -bottom-8 z-[-1]">
                    <svg
                      width="93"
                      height="93"
                      viewBox="0 0 93 93"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
