import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { Link } from "react-router-dom";
import { setWarningToast } from "../../store/generalUser";
import { useDispatch } from "react-redux";
export default function EmailTab({
  email,
  password,
  setEmail,
  setPassword,
  setPageState,
  confirmpassword,
  setConfirmPassword,
  schoolName,
  setSchoolName,
}) {
  const dispatch = useDispatch();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  function goToNextPage() {
    if (schoolName.length === 0 || email.length === 0) {
      dispatch(setWarningToast("Please fill details completely!"));
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      dispatch(setWarningToast("Invalid email address"));
    } else if (password.length < 8)
      dispatch(setWarningToast("Password must be at least 8 characters long"));
    else if (password !== confirmpassword)
      dispatch(setWarningToast("Password and confirm password do not match"));
    else setPageState(1);
  }
  return (
    <div className="flex flex-col justify-center flex-1 max-w-2xl space-y-5">
      <div className="flex flex-col space-y-2 text-start">
        <h2 className="text-3xl font-bold md:text-6xl">Create an account</h2>
        <p className="text-md md:text-2xl">
          We would love to welcome you to a network where school, teachers
          students are all connect with each other.
        </p>
      </div>
      <div className="flex flex-col max-w-2xl space-y-5">
        <div className="flex flex-col max-w-2xl mt-4">
          <label className="font-semibold mt-2">School Name*</label>
          <input
            type="text"
            placeholder="School Name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="flex px-3 py-2 font-medium border-2 border-slate-200  rounded-lg md:px-4 md:py-3 placeholder:font-normal"
          />
        </div>
        <div className="flex flex-col max-w-2xl mt-4">
          <label className="font-semibold mt-2">Email*</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex px-3 py-2 font-medium border-2 border-slate-200  rounded-lg md:px-4 md:py-3 placeholder:font-normal"
          />
        </div>
        <div className="flex flex-col max-w-2xl mt-4">
          <label className="font-semibold mt-2">Password*</label>
          <div className="relative flex max-w-2xl">
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setPasswordVisibility((prev) => !prev)}
            >
              {passwordVisibility ? (
                <AiOutlineEyeInvisible className="text-red-500 h-5 w-5" />
              ) : (
                <AiOutlineEye className="h-5 w-5" />
              )}
            </span>
            <input
              type={passwordVisibility ? "text" : "password"}
              placeholder="********"
              value={password}
              className="flex px-3 py-2 font-medium border-2 border-slate-200  rounded-lg md:px-4 md:py-3 placeholder:font-normal w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col max-w-2xl mt-4">
          <label className="font-semibold mt-2">Confirm Password*</label>
          <div className="relative flex max-w-2xl">
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setConfirmPasswordVisibility((prev) => !prev)}
            >
              {confirmPasswordVisibility ? (
                <AiOutlineEyeInvisible className="text-red-500 h-5 w-5" />
              ) : (
                <AiOutlineEye className="h-5 w-5" />
              )}
            </span>
            <input
              type={confirmPasswordVisibility ? "text" : "password"}
              placeholder="********"
              value={confirmpassword}
              className="flex px-3 py-2 font-medium border-2 border-slate-200  rounded-lg md:px-4 md:py-3 placeholder:font-normal w-full"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => goToNextPage()}
          className="flex items-center justify-center flex-none px-3 py-2 font-medium text-white  bg-[#4F46E5] border-2 border-[#4F46E5] rounded-lg md:px-4 md:py-3"
        >
          Next
        </button>
        <div className="flex flex-row justify-center mt-8 items-end space-x-2 sm:items-center sm:flex-row">
          <span>Already have a Account</span>
          <Link to="/login" className="underline font-medium text-[#070eff]">
            Sign in now
          </Link>
        </div>
      </div>
    </div>
  );
}
