import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";

import api from "../api/client";
import { endpoints } from "../api/endpoints";
import { useLoginMutation } from "../api/hooks/useLoginMutation";
import useAuth from "../hooks/useAuth";
import { setWarningToast, setProfileData } from "../store/generalUser";
import { getAllDatatForStaffUser } from "../components/Staff/helper/getData";
import loginBg from "../assets/CLASSWOOD Login Cover.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login: setAuthState } = useAuth();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { schoolName: "", email: "", password: "" } });

  const loginMutation = useLoginMutation({
    onSuccess: async (data) => {
      if (data.message === "Invalid email or password") {
        dispatch(setWarningToast(data.message));
        return;
      }

      const userType = data.user_type;
      const token = data.tokens.access;

      setAuthState({
        token,
        userType,
        isPaid: userType === "School",
      });

      if (userType === "School") {
        try {
          const sessionRes = await api.get(endpoints.school.sessions);
          if (sessionRes.data.length) {
            setAuthState({ sessionId: String(sessionRes.data[0].id) });
          }
          const accountRes = await api.get(endpoints.auth.account);
          dispatch(setProfileData(accountRes.data));
        } catch (err) {
          console.warn("School bootstrap failed", err);
        }
      } else if (userType === "Staff") {
        getAllDatatForStaffUser(dispatch);
      }

      navigate(`/${userType.toLowerCase()}/dashboard`);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Login failed. Please try again.";
      dispatch(setWarningToast(msg));
    },
  });

  const onSubmit = (values) =>
    loginMutation.mutate({ email: values.email, password: values.password });

  if (loginMutation.isPending) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <Rings height="220" width="220" color="rgb(30 64 175)" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="flex min-h-screen">
        <div className="flex flex-row w-full">
          <div className="relative flex flex-col items-center justify-center flex-1 px-4 sm:px-10">
            <div className="flex items-center justify-between w-full py-4 lg:hidden"></div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center flex-1 max-w-2xl space-y-5"
            >
              <div className="flex flex-col space-y-2 text-start">
                <h2 className="mb-4 text-3xl font-bold md:text-7xl">Welcome Back !!</h2>
                <p className="text-md md:text-xl">
                  We would love to welcome you to a network where school, teachers students
                  are all connect with each other.
                </p>
              </div>
              <div className="flex flex-col max-w-2xl">
                <div className="flex flex-col max-w-2xl mt-4">
                  <label className="mt-2 font-semibold">School Name*</label>
                  <input
                    type="text"
                    placeholder="School Name"
                    {...register("schoolName")}
                    className="flex px-3 py-2 font-medium border-2 rounded-lg border-slate-200 md:px-4 md:py-3 placeholder:font-normal w-full"
                  />
                </div>
                <div className="flex flex-col max-w-2xl mt-4">
                  <label className="mt-2 font-semibold">Email*</label>
                  <input
                    type="text"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                    className="flex px-3 py-2 font-medium border-2 rounded-lg border-slate-200 md:px-4 md:py-3 placeholder:font-normal"
                  />
                  {errors.email && (
                    <span className="mt-1 text-sm text-red-600">{errors.email.message}</span>
                  )}
                </div>
                <div className="flex flex-col max-w-2xl mt-4">
                  <div className="flex flex-row justify-between">
                    <label className="mt-2 font-semibold">Password*</label>
                    <Link
                      to="/forgot-password"
                      className="underline font-medium text-[#070eff]"
                    >
                      Forgot Password ?
                    </Link>
                  </div>
                  <div className="relative flex max-w-2xl">
                    <button
                      type="button"
                      aria-label={passwordVisibility ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-2"
                      onClick={() => setPasswordVisibility((v) => !v)}
                    >
                      {passwordVisibility ? (
                        <AiOutlineEyeInvisible className="text-red-500 h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                    <input
                      type={passwordVisibility ? "text" : "password"}
                      placeholder="********"
                      {...register("password", { required: "Password is required" })}
                      className="flex px-3 py-2 font-medium border-2 rounded-lg border-slate-200 md:px-4 md:py-3 placeholder:font-normal w-full"
                    />
                  </div>
                  {errors.password && (
                    <span className="mt-1 text-sm text-red-600">{errors.password.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="my-8 flex items-center justify-center flex-none px-3 py-2 font-medium text-white bg-[#4F46E5] border-2 border-[#4F46E5] rounded-lg md:px-4 md:py-3"
                >
                  Login
                </button>

                <div className="flex flex-row items-end justify-center mt-8 space-x-2 sm:items-center sm:flex-row">
                  <span>Don't have a Account</span>
                  <Link to="/register" className="underline font-medium text-[#070eff]">
                    Sign up now
                  </Link>
                </div>
              </div>
            </form>
          </div>
          <div className="flex-col justify-between hidden lg:flex bg-slate-200 lg:max-w-sm xl:max-w-lg">
            <img
              src={loginBg}
              className="object-cover w-full h-full opacity-80"
              alt="Classwood login"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
