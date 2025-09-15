import React, { useState, useEffect } from "react";
import classNames from "classnames";
import {Link} from "react-router-dom";
import logo from "../../assets/CLASSWOOD_Logo.png";
export default function Header() {
  const [careerDrop, setCareerDrop] = useState(false);
  const [featureDrop, setFeatureDrop] = useState(false);
  const [menuDrop, setmenuDrop] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(localStorage.getItem("UserType") ? true : false);
  const [scrolled, setScrolled] = useState();
  const userType = localStorage.getItem("UserType") || "";
  const dashboardPath = userType ? `/${userType.toLowerCase()}/dashboard` : "/login";
  const classes = classNames("header", {
    scrolled: scrolled,
  });
  const logout = () => {
    localStorage.removeItem("UserType");
    localStorage.removeItem("Payed");
    localStorage.removeItem("token");
    setIsLogedIn(false);
  };
  useEffect((_) => {
    const handleScroll = (_) => {
      if (window.pageYOffset > 1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={" top-0 z-50 sticky " + classes}
      id="navbar"
    >
      <div className="px-2 mx-auto sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>

              <svg
                onClick={() => setmenuDrop((prev) => !prev)}
                className="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className="hidden w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
            <div className="flex items-center flex-shrink-0">
              <img
                className="w-auto h-6 mx-auto"
                src={logo}
                alt="Classwood"
              />
            </div>
            <div className="hidden sm:flex sm:ml-6 ">
              <div className="flex items-center justify-center space-x-4 links">
                <Link
                  to="#"
                  id="homelink"
                  className="px-3 py-2 text-sm font-medium text-white bg-black rounded-md "
                  aria-current="page"
                >
                  Home
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setCareerDrop(false);
                    setFeatureDrop((prev) => !prev);
                  }}
                  id="homelink"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-black hover:text-white"
                  aria-current="page"
                >
                  Our Features
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setFeatureDrop(false);
                    setCareerDrop((prev) => !prev);
                  }}
                  id="homelink"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-black hover:text-white"
                  aria-current="page"
                >
                  {" "}
                  Career
                </Link>

                <Link
                  to="#feature"
                  id="featurelink"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-black hover:text-white active:bg-black active:text-white"
                >
                  Features
                </Link>

                <Link
                  to="#about"
                  id="aboutlink"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-black hover:text-white"
                >
                  About Us
                </Link>

                <Link
                  to="#"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-black hover:text-white"
                >
                  Help
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
             {isLogedIn ?  <>
              <Link
                  className="cursor-pointer hidden sm:inline-flex text-white bg-black hover:bg-transparent hover:text-black border-4 border-black focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4 rounded-l-full "
                  to={dashboardPath}

                >
                  Dashboard
                </Link>
                <span
                  className="cursor-pointer hidden sm:inline-flex text-black hover:text-white bg-transparent border-black border-4 hover:bg-black   focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 rounded-r-full"
                  onClick={logout}
                  >
                  Logout
                </span>
                  </> :
              <>
              <Link
                className="hidden sm:inline-flex text-white bg-black hover:bg-transparent hover:text-black border-4 border-black focus:ring-none focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4 rounded-l-full "
                to="/register"
                >
                Get started
              </Link>
              <Link
                className="hidden sm:inline-flex text-black hover:text-white bg-transparent border-black border-4 hover:bg-black   focus:ring-none focus:outline-none focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 rounded-r-full"
                to="/login"
                >
                Login
              </Link>
                </>}
            </div>
          </div>
        </div>
      </div>

      <div className={`${menuDrop ? "" : "hidden"} bg-white sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="#"
            className="block px-3 py-2 text-base font-medium text-white bg-black rounded-md"
            aria-current="page"
          >
            Home
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 text-base font-medium text-black rounded-md hover:bg-black hover:text-white"
          >
            Features
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 text-base font-medium text-black rounded-md hover:bg-black hover:text-white"
          >
            About Us
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 text-base font-medium text-black rounded-md hover:bg-black hover:text-white"
          >
            Help
          </Link>
          {/* {% if user.is_authenticated %} */}
          {isLogedIn ? <>
          <Link
            className="flex width-full text-white bg-black border-4 border-black hover:bg-transparent hover:text-black  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0  mb-4 "
            to={dashboardPath}
          >
            Dashboard
          </Link>
          <button
            className="flex width-full text-black hover:text-white border-4 border-black bg-transparent hover:bg-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
            onClick={logout}
          >
            Logout
          </button></> : <>
          <Link
            className="flex width-full text-white bg-black border-4 border-black hover:bg-transparent hover:text-black  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0  mb-4 "
            to="/register"
          >
            Get started
          </Link>
          <Link
            className="flex width-full text-black hover:text-white border-4 border-black bg-transparent hover:bg-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
            to="/login"
          >
            Login
          </Link>
          </>}
          {/* {% endif %} */}
        </div>
      </div>
      <div className={featureDrop ? "h-72" : "hidden "} id="featuredrop">
        <div className="flex flex-wrap items-center justify-start h-20 mx-auto mt-20 bg-white">
          <div className="flex flex-row w-[30%] mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxLjY2NjcgMTYuNjY2M1YzLjMzMzAxTDUgMjMuMzMzSDE2LjY2NjdMMjEuNjY2NyAxNi42NjYzWiIgZmlsbD0iI0ZBQjczQiIgZmlsbC1vcGFjaXR5PSIwLjQiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMi40NzUyIDEuMDYzMzhDMjIuODY2IDEuMjA5NDkgMjMuMTI1IDEuNTgyODUgMjMuMTI1IDIuMDAwMDVWMTVIMzdDMzcuMzkxOCAxNSAzNy43NDc1IDE1LjIyODggMzcuOTEgMTUuNTg1NEMzOC4wNzI1IDE1Ljk0MTkgMzguMDExOCAxNi4zNjA0IDM3Ljc1NDcgMTYuNjU2MUwxOC42Mjk3IDM4LjY1NjFDMTguMzU2IDM4Ljk3MSAxNy45MTU2IDM5LjA4MjggMTcuNTI0OCAzOC45MzY3QzE3LjEzNCAzOC43OTA2IDE2Ljg3NSAzOC40MTcyIDE2Ljg3NSAzOFYyNUgzLjAwMDAyQzIuNjA4MjIgMjUgMi4yNTI1MiAyNC43NzEyIDIuMDkwMDUgMjQuNDE0N0MxLjkyNzU4IDI0LjA1ODIgMS45ODgyNyAyMy42Mzk3IDIuMjQ1MzIgMjMuMzQ0TDIxLjM3MDMgMS4zNDM5N0MyMS42NDQgMS4wMjkxMSAyMi4wODQ1IDAuOTE3MjY3IDIyLjQ3NTIgMS4wNjMzOFpNNS4xOTQzNyAyM0gxNy44NzVDMTguNDI3MyAyMyAxOC44NzUgMjMuNDQ3OCAxOC44NzUgMjRWMzUuMzI1NUwzNC44MDU3IDE3SDIyLjEyNUMyMS41NzI3IDE3IDIxLjEyNSAxNi41NTIzIDIxLjEyNSAxNlY0LjY3NDU5TDUuMTk0MzcgMjNaIiBmaWxsPSIjMUExODFFIi8+Cjwvc3ZnPgo="
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">Scholarship Program</h1>
              <p>Start your Scholarship Journey with ClassWood</p>
            </div>
          </div>
          <div className="flex flex-row w-[30%] mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM2IDVINEMyLjg5NTQzIDUgMiA1Ljg5NTQzIDIgN1Y5QzIgMTAuMTA0NiAyLjg5NTQzIDExIDQgMTFIMzZDMzcuMTA0NiAxMSAzOCAxMC4xMDQ2IDM4IDlWN0MzOCA1Ljg5NTQzIDM3LjEwNDYgNSAzNiA1WiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEgN0MxIDUuMzQzMTUgMi4zNDMxNSA0IDQgNEgzNkMzNy42NTY5IDQgMzkgNS4zNDMxNSAzOSA3VjMzQzM5IDM0LjY1NjkgMzcuNjU2OSAzNiAzNiAzNkg0QzIuMzQzMTUgMzYgMSAzNC42NTY5IDEgMzNWN1pNNCA2QzMuNDQ3NzIgNiAzIDYuNDQ3NzIgMyA3VjMzQzMgMzMuNTUyMyAzLjQ0NzcyIDM0IDQgMzRIMzZDMzYuNTUyMyAzNCAzNyAzMy41NTIzIDM3IDMzVjdDMzcgNi40NDc3MiAzNi41NTIzIDYgMzYgNkg0WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBkPSJNMjcuMzEyNyAyMS44NTg4TDE0LjcwMyAxNi4zMTA2QzE0LjQ1MjYgMTYuMjAwNCAxNC4xOTc0IDE2LjQ1NTUgMTQuMzA3NiAxNi43MDZMMTkuODI5IDI5LjI1NDVDMTkuOTQxMyAyOS41MDk4IDIwLjMxMDggMjkuNDg3MSAyMC4zOTA5IDI5LjIxOTlMMjEuNzkzNyAyNC41NDQxQzIxLjgyMDkgMjQuNDUzNCAyMS44ODk0IDI0LjM4MDggMjEuOTc4NSAyNC4zNDg0TDI3LjI5NDQgMjIuNDE1M0MyNy41NDg2IDIyLjMyMjkgMjcuNTYwMyAyMS45Njc3IDI3LjMxMjcgMjEuODU4OFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy4zOTU1IDE3LjEwOUMxMi45MTggMTYuMDIzNyAxNC4wMjM3IDE0LjkxOCAxNS4xMDkgMTUuMzk1NUwyNy43MTg3IDIwLjk0MzhDMjguNzkxNSAyMS40MTU4IDI4Ljc0MDkgMjIuOTU0OSAyNy42Mzk0IDIzLjM1NTRMMjIuNjUzNyAyNS4xNjg0TDIxLjM1MiAyOS41MDc1QzIxLjAwNDcgMzAuNjY1MiAxOS40MDM3IDMwLjc2MzggMTguOTE2OSAyOS42NTc1TDEzLjM5NTUgMTcuMTA5Wk0xNS45NTExIDE3Ljk1MTFMMTkuOTgyMyAyNy4xMTI5TDIwLjgzOSAyNC4yNTcxQzIwLjk1NzEgMjMuODYzNyAyMS4yNTQgMjMuNTQ5MiAyMS42NCAyMy40MDg5TDI1LjMxNjYgMjIuMDcxOUwxNS45NTExIDE3Ljk1MTFaIiBmaWxsPSIjMUExODFFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMiAxMUMyIDEwLjQ0NzcgMi40NDc3MiAxMCAzIDEwSDM3QzM3LjU1MjMgMTAgMzggMTAuNDQ3NyAzOCAxMUMzOCAxMS41NTIzIDM3LjU1MjMgMTIgMzcgMTJIM0MyLjQ0NzcyIDEyIDIgMTEuNTUyMyAyIDExWiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBkPSJNNyA4QzcgOC41NTIyOCA2LjU1MjI4IDkgNiA5QzUuNDQ3NzIgOSA1IDguNTUyMjggNSA4QzUgNy40NDc3MiA1LjQ0NzcyIDcgNiA3QzYuNTUyMjggNyA3IDcuNDQ3NzIgNyA4WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBkPSJNMTAgOEMxMCA4LjU1MjI4IDkuNTUyMjggOSA5IDlDOC40NDc3MiA5IDggOC41NTIyOCA4IDhDOCA3LjQ0NzcyIDguNDQ3NzIgNyA5IDdDOS41NTIyOCA3IDEwIDcuNDQ3NzIgMTAgOFoiIGZpbGw9IiMxQTE4MUUiLz4KPHBhdGggZD0iTTEzIDhDMTMgOC41NTIyOCAxMi41NTIzIDkgMTIgOUMxMS40NDc3IDkgMTEgOC41NTIyOCAxMSA4QzExIDcuNDQ3NzIgMTEuNDQ3NyA3IDEyIDdDMTIuNTUyMyA3IDEzIDcuNDQ3NzIgMTMgOFoiIGZpbGw9IiMxQTE4MUUiLz4KPC9zdmc+Cg=="
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">For Institutes</h1>
              <p>An intigrated Platform for School Management</p>
            </div>
          </div>
          <div className="flex flex-row w-[30%] mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDZDMSA0Ljg5NTQzIDEuODk1NDMgNCAzIDRIMjZDMjcuMTA0NiA0IDI4IDQuODk1NDMgMjggNlYyNS42NjY3QzI4IDI2Ljc3MTIgMjcuMTA0NiAyNy42NjY3IDI2IDI3LjY2NjdIM0MxLjg5NTQzIDI3LjY2NjcgMSAyNi43NzEyIDEgMjUuNjY2N1Y2Wk0yNiA2TDMgNlYyNS42NjY3TDI2IDI1LjY2NjdWNloiIGZpbGw9IiMxQTE4MUUiLz4KPHBhdGggZD0iTTIgMTlDMiAxOC40NDc3IDIuNDQ3NzIgMTggMyAxOEgyNkMyNi41NTIzIDE4IDI3IDE4LjQ0NzcgMjcgMTlWMjVDMjcgMjUuNTUyMyAyNi41NTIzIDI2IDI2IDI2SDNDMi40NDc3MiAyNiAyIDI1LjU1MjMgMiAyNVYxOVoiIGZpbGw9IiM3QTM3MTEiIGZpbGwtb3BhY2l0eT0iMC40Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjYgMTIuMzM0SDMxLjY2NjdDMzIuMDk5NCAxMi4zMzQgMzIuNTIwNSAxMi40NzQzIDMyLjg2NjcgMTIuNzM0TDM4Ljg2NjcgMTcuMjM0QzM5LjM3MDMgMTcuNjExNyAzOS42NjY3IDE4LjIwNDUgMzkuNjY2NyAxOC44MzRWMjUuNjY3M0MzOS42NjY3IDI2Ljc3MTkgMzguNzcxMiAyNy42NjczIDM3LjY2NjcgMjcuNjY3M0gyNlYxMi4zMzRaTTI4IDE0LjMzNFYyNS42NjczSDM3LjY2NjdWMTguODM0TDMxLjY2NjcgMTQuMzM0SDI4WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjE2NjcgMjcuNjY2QzguNDE3NzYgMjcuNjY2IDcgMjkuMDgzOCA3IDMwLjgzMjdDNyAzMi41ODE2IDguNDE3NzYgMzMuOTk5MyAxMC4xNjY3IDMzLjk5OTNDMTEuOTE1NiAzMy45OTkzIDEzLjMzMzMgMzIuNTgxNiAxMy4zMzMzIDMwLjgzMjdDMTMuMzMzMyAyOS4wODM4IDExLjkxNTYgMjcuNjY2IDEwLjE2NjcgMjcuNjY2Wk01IDMwLjgzMjdDNSAyNy45NzkyIDcuMzEzMiAyNS42NjYgMTAuMTY2NyAyNS42NjZDMTMuMDIwMSAyNS42NjYgMTUuMzMzMyAyNy45NzkyIDE1LjMzMzMgMzAuODMyN0MxNS4zMzMzIDMzLjY4NjIgMTMuMDIwMSAzNS45OTkzIDEwLjE2NjcgMzUuOTk5M0M3LjMxMzIgMzUuOTk5MyA1IDMzLjY4NjIgNSAzMC44MzI3WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMxLjgzMDcgMjcuNjY2QzMwLjA4MTggMjcuNjY2IDI4LjY2NDEgMjkuMDgzOCAyOC42NjQxIDMwLjgzMjdDMjguNjY0MSAzMi41ODE2IDMwLjA4MTggMzMuOTk5MyAzMS44MzA3IDMzLjk5OTNDMzMuNTc5NiAzMy45OTkzIDM0Ljk5NzQgMzIuNTgxNiAzNC45OTc0IDMwLjgzMjdDMzQuOTk3NCAyOS4wODM4IDMzLjU3OTYgMjcuNjY2IDMxLjgzMDcgMjcuNjY2Wk0yNi42NjQxIDMwLjgzMjdDMjYuNjY0MSAyNy45NzkyIDI4Ljk3NzMgMjUuNjY2IDMxLjgzMDcgMjUuNjY2QzM0LjY4NDIgMjUuNjY2IDM2Ljk5NzQgMjcuOTc5MiAzNi45OTc0IDMwLjgzMjdDMzYuOTk3NCAzMy42ODYyIDM0LjY4NDIgMzUuOTk5MyAzMS44MzA3IDM1Ljk5OTNDMjguOTc3MyAzNS45OTkzIDI2LjY2NDEgMzMuNjg2MiAyNi42NjQxIDMwLjgzMjdaIiBmaWxsPSIjMUExODFFIi8+Cjwvc3ZnPgo="
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">Shops</h1>
              <p>
                Order Your School uniform and Stationaries at your Door Step
              </p>
            </div>
          </div>
          <div className="flex flex-row w-[30%] mt-10 mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MSA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1IDIwQzM1IDI2LjYyNzQgMjkuNjI3NCAzMiAyMyAzMkMxNi4zNzI2IDMyIDExIDI2LjYyNzQgMTEgMjBDMTEgMTMuMzcyNiAxNi4zNzI2IDggMjMgOEMyOS42Mjc0IDggMzUgMTMuMzcyNiAzNSAyMFoiIGZpbGw9IiNGQUI3M0IiIGZpbGwtb3BhY2l0eT0iMC40Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMi4xNjQwNiAzLjMzNDY0QzIuMTY0MDYgMi42OTAzIDIuNjg2NCAyLjE2Nzk3IDMuMzMwNzMgMi4xNjc5N0gxOS45OTc0QzIwLjY0MTcgMi4xNjc5NyAyMS4xNjQxIDIuNjkwMyAyMS4xNjQxIDMuMzM0NjRDMjEuMTY0MSAzLjk3ODk3IDIwLjY0MTcgNC41MDEzIDE5Ljk5NzQgNC41MDEzSDMuMzMwNzNDMi42ODY0IDQuNTAxMyAyLjE2NDA2IDMuOTc4OTcgMi4xNjQwNiAzLjMzNDY0WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIuMTY0MDYgMTAuMDAxNkMyLjE2NDA2IDkuMzU3MyAyLjY4NjQgOC44MzQ5NiAzLjMzMDczIDguODM0OTZIOS45OTc0QzEwLjY0MTcgOC44MzQ5NiAxMS4xNjQxIDkuMzU3MyAxMS4xNjQxIDEwLjAwMTZDMTEuMTY0MSAxMC42NDYgMTAuNjQxNyAxMS4xNjgzIDkuOTk3NCAxMS4xNjgzSDMuMzMwNzNDMi42ODY0IDExLjE2ODMgMi4xNjQwNiAxMC42NDYgMi4xNjQwNiAxMC4wMDE2WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIuMTY0MDYgMTYuNjY3NkMyLjE2NDA2IDE2LjAyMzMgMi42ODY0IDE1LjUwMSAzLjMzMDczIDE1LjUwMUg2LjY2NDA2QzcuMzA4MzkgMTUuNTAxIDcuODMwNzMgMTYuMDIzMyA3LjgzMDczIDE2LjY2NzZDNy44MzA3MyAxNy4zMTIgNy4zMDgzOSAxNy44MzQzIDYuNjY0MDYgMTcuODM0M0gzLjMzMDczQzIuNjg2NCAxNy44MzQzIDIuMTY0MDYgMTcuMzEyIDIuMTY0MDYgMTYuNjY3NloiIGZpbGw9IiMxQTE4MUUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yLjE2NDA2IDIzLjMzNDZDMi4xNjQwNiAyMi42OTAzIDIuNjg2NCAyMi4xNjggMy4zMzA3MyAyMi4xNjhINi42NjQwNkM3LjMwODM5IDIyLjE2OCA3LjgzMDczIDIyLjY5MDMgNy44MzA3MyAyMy4zMzQ2QzcuODMwNzMgMjMuOTc5IDcuMzA4MzkgMjQuNTAxMyA2LjY2NDA2IDI0LjUwMTNIMy4zMzA3M0MyLjY4NjQgMjQuNTAxMyAyLjE2NDA2IDIzLjk3OSAyLjE2NDA2IDIzLjMzNDZaIiBmaWxsPSIjMUExODFFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuNzUyNiAyMEMxMi43NTI2IDE0LjE1NSAxNy40OTA5IDkuNDE2NjcgMjMuMzM1OSA5LjQxNjY3QzI5LjE4MSA5LjQxNjY3IDMzLjkxOTMgMTQuMTU1IDMzLjkxOTMgMjBDMzMuOTE5MyAyNS44NDUgMjkuMTgxIDMwLjU4MzMgMjMuMzM1OSAzMC41ODMzQzE3LjQ5MDkgMzAuNTgzMyAxMi43NTI2IDI1Ljg0NSAxMi43NTI2IDIwWk0yMy4zMzU5IDcuMjVDMTYuMjk0MyA3LjI1IDEwLjU4NTkgMTIuOTU4NCAxMC41ODU5IDIwQzEwLjU4NTkgMjcuMDQxNiAxNi4yOTQzIDMyLjc1IDIzLjMzNTkgMzIuNzVDMjYuMDY3NyAzMi43NSAyOC41OTg4IDMxLjg5MDkgMzAuNjczOCAzMC40MjgxQzMwLjcyNjUgMzAuNTUwOCAzMC44MDMgMzAuNjY1OCAzMC45MDMyIDMwLjc2NkwzNi4wMzY2IDM1Ljg5OTRDMzYuNDU5NiAzNi4zMjI0IDM3LjE0NTYgMzYuMzIyNCAzNy41Njg2IDM1Ljg5OTRDMzcuOTkxNyAzNS40NzYzIDM3Ljk5MTcgMzQuNzkwNCAzNy41Njg2IDM0LjM2NzNMMzIuNDM1MyAyOS4yMzRDMzIuMzgzNSAyOS4xODIxIDMyLjMyNzcgMjkuMTM2NiAzMi4yNjg5IDI5LjA5NzVDMzQuNjI0NyAyNi43ODQgMzYuMDg1OSAyMy41NjI3IDM2LjA4NTkgMjBDMzYuMDg1OSAxMi45NTg0IDMwLjM3NzYgNy4yNSAyMy4zMzU5IDcuMjVaIiBmaWxsPSIjMUExODFFIi8+Cjwvc3ZnPgo="
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">Free Online Cources</h1>
              <p>Free cources to help your School Journey</p>
            </div>
          </div>
        </div>
      </div>
      <div className={careerDrop ? "h-72" : "hidden"} id="careerdrop">
        <div className="flex flex-wrap items-center justify-start h-20 mx-auto mt-20 bg-white">
          <div className="flex flex-row w-[30%] mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDIwQzEgOS41MDY1OSA5LjUwNjU5IDEgMjAgMUMzMC40OTM0IDEgMzkgOS41MDY1OSAzOSAyMEMzOSAzMC40OTM0IDMwLjQ5MzQgMzkgMjAgMzlIMVYyMFoiIGZpbGw9IiNGOEM3QTUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDIwQzEgOS41MDY1OSA5LjUwNjU5IDEgMjAgMUMzMC40OTM0IDEgMzkgOS41MDY1OSAzOSAyMEMzOSAzMC40OTM0IDMwLjQ5MzQgMzkgMjAgMzlIMVYyMFpNMjAgM0MxMC42MTEyIDMgMyAxMC42MTEyIDMgMjBWMzdIMjBDMjkuMzg4OCAzNyAzNyAyOS4zODg4IDM3IDIwQzM3IDEwLjYxMTIgMjkuMzg4OCAzIDIwIDNaIiBmaWxsPSIjMUExODFFIi8+CjxwYXRoIGQ9Ik0yMC40ODE1IDEzLjEyODlWMTUuMzYzNUgxNy43NzEyVjEzLjEyODlIMjAuNDgxNVpNMjEuNzM3OSAyNS41NTg0VjI3LjEyODlIMTYuNTk1NlYyNS41NTg0TDE3Ljg2MDkgMjUuMjg5MlYxOS4yNjc0TDE2LjQ2MDkgMTguOTk4MVYxNy40MTg3SDIwLjQ4MTVWMjUuMjg5MkwyMS43Mzc5IDI1LjU1ODRaIiBmaWxsPSIjMUExODFFIi8+Cjwvc3ZnPgo="
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">About</h1>
              <p>Know more about Classwood</p>
            </div>
          </div>
          <div className="flex flex-row w-[30%] mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1IDE3LjVDMzUgMjQuOTU1OCAyNy42MTI3IDMxIDE4LjUgMzFDMTQuNzQwNSAzMSAxMS4yNzQ2IDI5Ljk3MTMgOC41IDI4LjIzOUM4LjA1NDUyIDI3Ljk2MDkgNS4zMTg2MyAyOS4wMzE2IDMuODgwOTQgMjkuNjI2OUMzLjYwOTM2IDI5LjczOTMgMy4zNDA1NSAyOS40MyAzLjQ4NjU2IDI5LjE3NDhDNC4xOTM1NCAyNy45Mzk1IDUuMzgxMTEgMjUuNzA2NyA1IDI1LjI2MzlDMy4xMDk5MSAyMy4wNjc5IDIgMjAuMzkgMiAxNy41QzIgMTAuMDQ0MiA5LjM4NzMgNCAxOC41IDRDMjcuNjEyNyA0IDM1IDEwLjA0NDIgMzUgMTcuNVoiIGZpbGw9IiMxNDZFQjQiIGZpbGwtb3BhY2l0eT0iMC40Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMyAxNy41QzMgMTAuNzc0NyA5Ljc0MjYgNSAxOC41IDVDMjcuMjU3NCA1IDM0IDEwLjc3NDcgMzQgMTcuNUMzNCAyNC4yMjUzIDI3LjI1NzQgMzAgMTguNSAzMEMxNC45MjExIDMwIDExLjYzOTggMjkuMDIwNCA5LjAyOTU4IDI3LjM5MDhDOC43MDU3IDI3LjE4ODYgOC4zNTMyNyAyNy4xOTAxIDguMjAwODIgMjcuMTk0OUM3Ljk5OTQyIDI3LjIwMTMgNy43ODc2MiAyNy4yMzQ3IDcuNTkwMjEgMjcuMjc1NUM3LjE5MDg3IDI3LjM1OCA2LjcxODQ0IDI3LjQ5ODkgNi4yNDU1MyAyNy42NTdDNS45MTkyMSAyNy43NjYxIDUuNTc5MjkgMjcuODg3OSA1LjI0NDI0IDI4LjAxM0M1LjM1ODI0IDI3Ljc4MjEgNS40Njc2NCAyNy41NTAxIDUuNTY2NzUgMjcuMzI0NkM1Ljc0NDA0IDI2LjkyMTQgNS45MDcyNyAyNi40OTcyIDUuOTk2ODggMjYuMTE4MkM2LjA0MTI0IDI1LjkzMDYgNi4wNzg2NiAyNS43MDkzIDYuMDczMDggMjUuNDgzN0M2LjA2NzkyIDI1LjI3NTIgNi4wMjI3MiAyNC45MTkyIDUuNzU3OTMgMjQuNjExNkM0LjAwNTMxIDIyLjU3NTMgMyAyMC4xMjM0IDMgMTcuNVpNMTguNSAzQzkuMDMyIDMgMSA5LjMxMzYgMSAxNy41QzEgMjAuNTUyOCAyLjEzNTk0IDIzLjM2OTIgNC4wNDQ2OSAyNS42ODIxQzMuOTk0MjIgMjUuODgzOCAzLjg4OTk2IDI2LjE2OTIgMy43MzU4NyAyNi41MTk3QzMuNDE5OTMgMjcuMjM4NCAyLjk2NzM2IDI4LjA2ODggMi42MTg2NCAyOC42NzgxQzIuMDA5NjggMjkuNzQyMSAzLjA5MTE4IDMxLjAzNjIgNC4yNjM0OSAzMC41NTA4QzQuOTc2MTkgMzAuMjU1NyA1Ljk5MzkgMjkuODQ5OSA2Ljg3OTU3IDI5LjU1MzlDNy4zMjYwMyAyOS40MDQ2IDcuNzEwOTUgMjkuMjkyOCA3Ljk5NDgxIDI5LjIzNDJDOC4wNjI1NiAyOS4yMjAyIDguMTE3NTEgMjkuMjEwNyA4LjE2MDggMjkuMjA0NUMxMC41ODIgMzAuNjc0IDEzLjQ3MDMgMzEuNjM1NiAxNi41OTcgMzEuOTE1NEMxOC45MDMgMzQuNDI2IDIyLjUwNDUgMzYuMDAxNCAyNi41IDM2LjAwMTRDMjkuMTk4NCAzNi4wMDE0IDMxLjcxMDEgMzUuMjgzOSAzMy43NjYxIDM0LjA1MDFDMzMuOTQ5NiAzNC4wODkgMzQuMjA3OCAzNC4xNjQ3IDM0LjUxNzQgMzQuMjY5NkMzNS4xMzIzIDM0LjQ3OCAzNS44NDAzIDM0Ljc2MzcgMzYuMzMxMSAzNC45NjkzQzM3LjQwODUgMzUuNDIwNiAzOC40MDk5IDM0LjIzNzEgMzcuODUwNSAzMy4yNTMxQzM3LjYxIDMyLjgzIDM3LjI5NTQgMzIuMjQ5MyAzNy4wNzY0IDMxLjc0OTVDMzcuMDAxNSAzMS41Nzg2IDM2Ljk0NiAzMS40MzU2IDM2LjkwODkgMzEuMzIzM0MzOC4yMTkzIDI5LjY3MTIgMzkgMjcuNjcwMSAzOSAyNS41MDE0QzM5IDIyLjg0MiAzNy44MjgyIDIwLjQ0MTggMzUuOTQ5MyAxOC42MjE2QzM1Ljk4MjkgMTguMjUyIDM2IDE3Ljg3OCAzNiAxNy41QzM2IDkuMzEzNiAyNy45NjggMyAxOC41IDNaTTM1LjQ2NzUgMjEuMDg0MkMzMy42MjQyIDI3LjE0MDggMjcuMjE0NiAzMS41NDMxIDE5LjY5MTUgMzEuOTY2NUMyMS41MTE3IDMzLjIyNTQgMjMuODgxNyAzNC4wMDE0IDI2LjUgMzQuMDAxNEMyOC45Mzc3IDM0LjAwMTQgMzEuMTY3NCAzMy4zMjc2IDMyLjkzNjUgMzIuMjEyNUMzMy4yNDY5IDMyLjAxNjggMzMuNTc2NiAzMi4wMjM3IDMzLjY5MzIgMzIuMDI3N0MzMy44NTk5IDMyLjAzMzUgMzQuMDI4NCAzMi4wNjE1IDM0LjE3NTggMzIuMDkyNUMzNC40NzUyIDMyLjE1NTYgMzQuODIyIDMyLjI2MTEgMzUuMTU5NCAzMi4zNzU0TDM1LjE3MDggMzIuMzc5M0MzNS4wNyAzMi4xMzU4IDM0Ljk3ODEgMzEuODgwOSAzNC45MjE1IDMxLjY0M0MzNC44ODY4IDMxLjQ5NzUgMzQuODU0MiAzMS4zMTM4IDM0Ljg1ODEgMzEuMTE5NkMzNC44NjE2IDMwLjk0NDIgMzQuODk3MyAzMC42MTAzIDM1LjE0ODEgMzAuMzE2MUMzNi4zMjg5IDI4LjkzMDkgMzcgMjcuMjcxMyAzNyAyNS41MDE0QzM3IDIzLjkwMDQgMzYuNDQ5OCAyMi4zODU0IDM1LjQ2NzUgMjEuMDg0MlpNOC4yODgxMiAyOS4xOTQ0QzguMjg3NjUgMjkuMTk0OCA4LjI3OTYyIDI5LjE5NTEgOC4yNjU0MiAyOS4xOTM5QzguMjgxNDkgMjkuMTkzNCA4LjI4ODU5IDI5LjE5NCA4LjI4ODEyIDI5LjE5NDRaIiBmaWxsPSIjMUExODFFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEgMTVDMTEgMTQuNDQ3NyAxMS40NDc3IDE0IDEyIDE0SDI1QzI1LjU1MjMgMTQgMjYgMTQuNDQ3NyAyNiAxNUMyNiAxNS41NTIzIDI1LjU1MjMgMTYgMjUgMTZIMTJDMTEuNDQ3NyAxNiAxMSAxNS41NTIzIDExIDE1WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTExIDIwQzExIDE5LjQ0NzcgMTEuNDQ3NyAxOSAxMiAxOUgyNEMyNC41NTIzIDE5IDI1IDE5LjQ0NzcgMjUgMjBDMjUgMjAuNTUyMyAyNC41NTIzIDIxIDI0IDIxSDEyQzExLjQ0NzcgMjEgMTEgMjAuNTUyMyAxMSAyMFoiIGZpbGw9IiMxQTE4MUUiLz4KPC9zdmc+Cg=="
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">Help Center</h1>
              <p>Contact our support team for any query</p>
            </div>
          </div>
          <div className="flex flex-row w-[30%] mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMC41IDNDMTYuOTEwMSAzIDE0IDUuOTEwMTUgMTQgOS41QzE0IDEzLjA4OTkgMTYuOTEwMSAxNiAyMC41IDE2QzI0LjA4OTkgMTYgMjcgMTMuMDg5OSAyNyA5LjVDMjcgNS45MTAxNSAyNC4wODk5IDMgMjAuNSAzWk0xMiA5LjVDMTIgNC44MDU1OCAxNS44MDU2IDEgMjAuNSAxQzI1LjE5NDQgMSAyOSA0LjgwNTU4IDI5IDkuNUMyOSAxNC4xOTQ0IDI1LjE5NDQgMTggMjAuNSAxOEMxNS44MDU2IDE4IDEyIDE0LjE5NDQgMTIgOS41WiIgZmlsbD0iIzFBMTgxRSIvPgo8cGF0aCBkPSJNMzMgMzEuMTgxOEMzMyAzNy45NTk5IDI3LjE3OTcgMzggMjAgMzhDMTIuODIwMyAzOCA3IDM3Ljk1OTkgNyAzMS4xODE4QzcgMjQuNDAzOCAxMi44MjAzIDE3IDIwIDE3QzI3LjE3OTcgMTcgMzMgMjQuNDAzOCAzMyAzMS4xODE4WiIgZmlsbD0iI0ZBQjczQiIgZmlsbC1vcGFjaXR5PSIwLjQiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS41NjEzIDIyLjIwNjNDOS4zNDY5OSAyNC43NDYgOCAyOC4wNjQgOCAzMS4xODE4QzggMzIuNzM0NSA4LjMzMjQ4IDMzLjc5MzYgOC44NDU2NyAzNC41NDAxQzkuMzU2MzcgMzUuMjgzIDEwLjExNDIgMzUuODE1NyAxMS4xNSAzNi4xOTMxQzEzLjI5OTUgMzYuOTc2NCAxNi4zNDQyIDM3IDIwIDM3QzIzLjY1NTggMzcgMjYuNzAwNSAzNi45NzY0IDI4Ljg1IDM2LjE5MzFDMjkuODg1OCAzNS44MTU3IDMwLjY0MzYgMzUuMjgzIDMxLjE1NDMgMzQuNTQwMUMzMS42Njc1IDMzLjc5MzYgMzIgMzIuNzM0NSAzMiAzMS4xODE4QzMyIDI4LjA2NCAzMC42NTMgMjQuNzQ2IDI4LjQzODcgMjIuMjA2M0MyNi4yMjcyIDE5LjY2OTkgMjMuMjM0IDE4IDIwIDE4QzE2Ljc2NiAxOCAxMy43NzI4IDE5LjY2OTkgMTEuNTYxMyAyMi4yMDYzWk0xMC4wNTM5IDIwLjg5MkMxMi41NDc1IDE4LjAzMiAxNi4wNTQzIDE2IDIwIDE2QzIzLjk0NTcgMTYgMjcuNDUyNSAxOC4wMzIgMjkuOTQ2MSAyMC44OTJDMzIuNDM2OCAyMy43NDg2IDM0IDI3LjUyMTYgMzQgMzEuMTgxOEMzNCAzMy4wMTgxIDMzLjYwNDkgMzQuNTA1OCAzMi44MDI1IDM1LjY3MzFDMzEuOTk3NSAzNi44NDQxIDMwLjg1MTYgMzcuNTkyNCAyOS41MzQ4IDM4LjA3MjJDMjYuOTg4OCAzOSAyMy41NDk3IDM5IDIwLjAzOTUgMzlIMTkuOTYwNUMxNi40NTAzIDM5IDEzLjAxMTIgMzkgMTAuNDY1MiAzOC4wNzIyQzkuMTQ4NDUgMzcuNTkyNCA4LjAwMjUxIDM2Ljg0NDEgNy4xOTc1NCAzNS42NzMxQzYuMzk1MDYgMzQuNTA1OCA2IDMzLjAxODEgNiAzMS4xODE4QzYgMjcuNTIxNiA3LjU2MzE2IDIzLjc0ODYgMTAuMDUzOSAyMC44OTJaIiBmaWxsPSIjMUExODFFIi8+Cjwvc3ZnPgo="
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">Careers</h1>
              <p>Join our team to build a career</p>
            </div>
          </div>
          <div className="flex flex-row w-[30%] mt-10 mx-4 px-4">
            <img
              className="mr-2"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIgOUMyIDYuNzkwODYgMy43OTA4NiA1IDYgNUgyNkMyOC4yMDkxIDUgMzAgNi43OTA4NiAzMCA5VjE2SDJWOVoiIGZpbGw9IiNERjFFNUIiIGZpbGwtb3BhY2l0eT0iMC40Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNiA0QzMuMjM4NTggNCAxIDYuMjM4NTggMSA5VjE3VjMyQzEgMzQuNzYxNCAzLjIzODU4IDM3IDYgMzdIMzRDMzYuNzYxNCAzNyAzOSAzNC43NjE0IDM5IDMyVjE0QzM5IDEyLjM0MzEgMzcuNjU2OSAxMSAzNiAxMUgzMVY5QzMxIDYuMjM4NTggMjguNzYxNCA0IDI2IDRINlpNMzcgMzJDMzcgMzMuNjU2OSAzNS42NTY5IDM1IDM0IDM1QzMyLjM0MzEgMzUgMzEgMzMuNjU2OSAzMSAzMlYxN1YxNi41VjEzSDM2QzM2LjU1MjMgMTMgMzcgMTMuNDQ3NyAzNyAxNFYzMlpNMjkgMzJWMTdIM1YzMkMzIDMzLjY1NjkgNC4zNDMxNSAzNSA2IDM1SDI5Ljk5OTZDMjkuMzcxOSAzNC4xNjQzIDI5IDMzLjEyNTYgMjkgMzJaTTMgMTVIMjlWMTFWOUMyOSA3LjM0MzE1IDI3LjY1NjkgNiAyNiA2SDZDNC4zNDMxNSA2IDMgNy4zNDMxNSAzIDlWMTVaTTcgMjNDNyAyMi40NDc3IDcuNDQ3NzIgMjIgOCAyMkgyM0MyMy41NTIzIDIyIDI0IDIyLjQ0NzcgMjQgMjNDMjQgMjMuNTUyMyAyMy41NTIzIDI0IDIzIDI0SDhDNy40NDc3MiAyNCA3IDIzLjU1MjMgNyAyM1pNOCAyN0M3LjQ0NzcyIDI3IDcgMjcuNDQ3NyA3IDI4QzcgMjguNTUyMyA3LjQ0NzcyIDI5IDggMjlIMTZDMTYuNTUyMyAyOSAxNyAyOC41NTIzIDE3IDI4QzE3IDI3LjQ0NzcgMTYuNTUyMyAyNyAxNiAyN0g4WiIgZmlsbD0iIzFBMTgxRSIvPgo8L3N2Zz4K"
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-semibold">Blog</h1>
              <p>Write your own blog</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
