import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { useDispatch } from "react-redux";
import { setWarningToast } from "../../store/generalUser";
export default function OTPPage({ password, setPassword, updatePassword,OTP, setOTP, loading }) {
  const dispatch = useDispatch();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [OTPVisibility, setOTPVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const submitOTP = () => {
    if (confirmPassword === password) {
      updatePassword();
    } else
      dispatch(setWarningToast("Password and COnfirm Password must be same"));
  };
  return (
    <div className="flex flex-col justify-center flex-1 max-w-2xl space-y-5">
      <div className="flex flex-col space-y-2 text-start">
        <h2 className="mb-4 text-3xl font-bold md:text-7xl">Forgot Password</h2>
        <p className="text-md md:text-xl">
          Enter yur email bellow to recive a password reset OTP on your email ID
        </p>
      </div>
      <div className="flex flex-col max-w-2xl">
      <div className="flex flex-col max-w-2xl mt-4">
          <label className="mt-2 font-semibold">OTP*</label>
          <div className="relative flex max-w-2xl">
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setOTPVisibility((prev) => !prev)}
            >
              {OTPVisibility ? (
                <AiOutlineEyeInvisible className="w-5 h-5 text-red-500" />
              ) : (
                <AiOutlineEye className="w-5 h-5" />
              )}
            </span>
            <input
              type={OTPVisibility ? "text" : "password"}
              placeholder="********"
              value={OTP}
              className="flex w-full px-3 py-2 font-medium border-2 rounded-lg border-slate-200 md:px-4 md:py-3 placeholder:font-normal"
              onChange={(e) => setOTP(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col max-w-2xl mt-4">
          <label className="mt-2 font-semibold">Password*</label>
          <div className="relative flex max-w-2xl">
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setPasswordVisibility((prev) => !prev)}
            >
              {passwordVisibility ? (
                <AiOutlineEyeInvisible className="w-5 h-5 text-red-500" />
              ) : (
                <AiOutlineEye className="w-5 h-5" />
              )}
            </span>
            <input
              type={passwordVisibility ? "text" : "password"}
              placeholder="********"
              value={password}
              className="flex w-full px-3 py-2 font-medium border-2 rounded-lg border-slate-200 md:px-4 md:py-3 placeholder:font-normal"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col max-w-2xl mt-4">
          <label className="mt-2 font-semibold">Confirm Password*</label>
          <div className="relative flex max-w-2xl">
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setConfirmPasswordVisibility((prev) => !prev)}
            >
              {confirmPasswordVisibility ? (
                <AiOutlineEyeInvisible className="w-5 h-5 text-red-500" />
              ) : (
                <AiOutlineEye className="w-5 h-5" />
              )}
            </span>
          <input
            type={confirmPasswordVisibility ? "text" : "password"}
            placeholder="********"
            value={confirmPassword}
            className="flex w-full px-3 py-2 font-medium border-2 rounded-lg border-slate-200 md:px-4 md:py-3 placeholder:font-normal"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        </div>
        <button
          onClick={() => updatePassword()}
          disabled={loading}

          className="my-8 flex items-center justify-center flex-none px-3 py-2 font-medium text-white bg-[#4F46E5] border-2 border-[#4F46E5] rounded-lg md:px-4 md:py-3"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
