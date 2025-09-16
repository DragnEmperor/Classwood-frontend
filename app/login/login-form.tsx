"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const loginSchema = z.object({
  schoolName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  userType: "School" | "Staff" | "Student";
  isPaid: boolean;
}

interface LoginError {
  message?: string;
  detail?: string;
}

async function postLogin(values: LoginValues): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: values.email, password: values.password }),
  });
  const data: LoginResponse | LoginError = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as LoginError;
    throw new Error(err.message ?? err.detail ?? "Login failed. Please try again.");
  }
  return data as LoginResponse;
}

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { schoolName: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      const target = nextPath ?? `/${data.userType.toLowerCase()}/dashboard`;
      router.push(target);
      router.refresh();
    },
  });

  const onSubmit = (values: LoginValues) => mutation.mutate(values);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col"
      noValidate
    >
      <div className="mt-4 flex max-w-2xl flex-col">
        <label className="mt-2 font-semibold">School Name</label>
        <input
          type="text"
          placeholder="School Name"
          {...register("schoolName")}
          className="flex w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-medium placeholder:font-normal md:px-4 md:py-3"
        />
      </div>

      <div className="mt-4 flex max-w-2xl flex-col">
        <label className="mt-2 font-semibold">Email*</label>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          {...register("email")}
          className="flex rounded-lg border-2 border-slate-200 px-3 py-2 font-medium placeholder:font-normal md:px-4 md:py-3"
        />
        {errors.email && (
          <span className="mt-1 text-sm text-red-600">{errors.email.message}</span>
        )}
      </div>

      <div className="mt-4 flex max-w-2xl flex-col">
        <div className="flex flex-row justify-between">
          <label className="mt-2 font-semibold">Password*</label>
          <Link href="/forgot-password" className="font-medium text-[#070eff] underline">
            Forgot Password ?
          </Link>
        </div>
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
            autoComplete="current-password"
            placeholder="********"
            {...register("password")}
            className="flex w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-medium placeholder:font-normal md:px-4 md:py-3"
          />
        </div>
        {errors.password && (
          <span className="mt-1 text-sm text-red-600">{errors.password.message}</span>
        )}
      </div>

      {mutation.error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {mutation.error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="my-8 flex flex-none items-center justify-center rounded-lg border-2 border-[#4F46E5] bg-[#4F46E5] px-3 py-2 font-medium text-white disabled:opacity-60 md:px-4 md:py-3"
      >
        {mutation.isPending ? "Signing in…" : "Login"}
      </button>

      <div className="mt-8 flex flex-row items-end justify-center space-x-2 sm:flex-row sm:items-center">
        <span>Don&apos;t have a Account</span>
        <Link href="/register" className="font-medium text-[#070eff] underline">
          Sign up now
        </Link>
      </div>
    </form>
  );
}
