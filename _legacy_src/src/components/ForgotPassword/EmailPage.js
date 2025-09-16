import React from "react";

export default function EmailPage({ email, setEmail, forgotPassword, loading }) {
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
          <label className="mt-2 font-semibold">Email*</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex px-3 py-2 font-medium border-2 rounded-lg border-slate-200 md:px-4 md:py-3 placeholder:font-normal"
          />
        </div>

        <button
          onClick={() => forgotPassword()}
          disabled={loading}
          className="my-8 flex items-center justify-center flex-none px-3 py-2 font-medium text-white bg-[#4F46E5] border-2 border-[#4F46E5] rounded-lg md:px-4 md:py-3"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
