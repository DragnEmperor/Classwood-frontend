"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const otpSchema = z
  .object({
    otp: z.string().min(1, "OTP is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type EmailValues = z.infer<typeof emailSchema>;
type OtpValues = z.infer<typeof otpSchema>;

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: T & { message?: string } = await res.json().catch(() => ({} as T));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Request failed");
  return data;
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0);
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", password: "", confirm_password: "" },
  });

  const sendOtp = useMutation({
    mutationFn: (values: EmailValues) =>
      postJson<{ message?: string }>("/api/auth/forgot-password", values),
    onSuccess: (_data, vars) => {
      setEmail(vars.email);
      setStep(1);
    },
  });

  const verifyOtp = useMutation({
    mutationFn: (values: OtpValues) =>
      postJson<{ message?: string }>("/api/auth/verify-otp", {
        email,
        otp: values.otp,
        password: values.password,
      }),
    onSuccess: () => {
      setSuccessMsg("Password updated. Redirecting to login…");
      setTimeout(() => router.push("/login"), 1200);
    },
  });

  const inputClass =
    "flex w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-medium placeholder:font-normal md:px-4 md:py-3";
  const labelClass = "mt-2 font-semibold";
  const fieldClass = "mt-4 flex max-w-2xl flex-col";

  if (step === 0) {
    return (
      <form
        onSubmit={emailForm.handleSubmit((v) => sendOtp.mutate(v))}
        className="flex flex-col"
        noValidate
      >
        <div className="flex flex-col space-y-2 text-start">
          <h2 className="mb-4 text-3xl font-bold md:text-7xl">Forgot Password</h2>
          <p className="text-md md:text-xl">
            Enter your email below to receive a password reset OTP.
          </p>
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Email*</label>
          <input
            type="email"
            placeholder="Email"
            {...emailForm.register("email")}
            className={inputClass}
          />
          {emailForm.formState.errors.email && (
            <span className="mt-1 text-sm text-red-600">
              {emailForm.formState.errors.email.message}
            </span>
          )}
        </div>

        {sendOtp.error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {sendOtp.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={sendOtp.isPending}
          className="my-8 flex flex-none items-center justify-center rounded-lg border-2 border-[#4F46E5] bg-[#4F46E5] px-3 py-2 font-medium text-white disabled:opacity-60 md:px-4 md:py-3"
        >
          {sendOtp.isPending ? "Sending…" : "Send OTP"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={otpForm.handleSubmit((v) => verifyOtp.mutate(v))}
      className="flex flex-col"
      noValidate
    >
      <div className="flex flex-col space-y-2 text-start">
        <h2 className="mb-4 text-3xl font-bold md:text-7xl">Reset Password</h2>
        <p className="text-md md:text-xl">
          Enter the OTP sent to <span className="font-semibold">{email}</span> and choose a new password.
        </p>
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>OTP*</label>
        <div className="relative flex max-w-2xl">
          <button
            type="button"
            aria-label={showOtp ? "Hide OTP" : "Show OTP"}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            onClick={() => setShowOtp((v) => !v)}
          >
            {showOtp ? (
              <AiOutlineEyeInvisible className="h-5 w-5 text-red-500" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
          <input
            type={showOtp ? "text" : "password"}
            placeholder="******"
            {...otpForm.register("otp")}
            className={inputClass}
          />
        </div>
        {otpForm.formState.errors.otp && (
          <span className="mt-1 text-sm text-red-600">
            {otpForm.formState.errors.otp.message}
          </span>
        )}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>New Password*</label>
        <div className="relative flex max-w-2xl">
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5 text-red-500" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="********"
            {...otpForm.register("password")}
            className={inputClass}
          />
        </div>
        {otpForm.formState.errors.password && (
          <span className="mt-1 text-sm text-red-600">
            {otpForm.formState.errors.password.message}
          </span>
        )}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Confirm Password*</label>
        <div className="relative flex max-w-2xl">
          <button
            type="button"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? (
              <AiOutlineEyeInvisible className="h-5 w-5 text-red-500" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="********"
            {...otpForm.register("confirm_password")}
            className={inputClass}
          />
        </div>
        {otpForm.formState.errors.confirm_password && (
          <span className="mt-1 text-sm text-red-600">
            {otpForm.formState.errors.confirm_password.message}
          </span>
        )}
      </div>

      {verifyOtp.error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {verifyOtp.error.message}
        </p>
      )}
      {successMsg && <p className="mt-4 text-sm text-green-600">{successMsg}</p>}

      <button
        type="submit"
        disabled={verifyOtp.isPending}
        className="my-8 flex flex-none items-center justify-center rounded-lg border-2 border-[#4F46E5] bg-[#4F46E5] px-3 py-2 font-medium text-white disabled:opacity-60 md:px-4 md:py-3"
      >
        {verifyOtp.isPending ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}
