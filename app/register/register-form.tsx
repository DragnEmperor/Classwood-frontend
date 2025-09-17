"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BOARD_LIST, STATE_LIST } from "@/lib/constants";

const registerSchema = z
  .object({
    school_name: z.string().min(1, "School name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your password"),
    school_board: z.enum(BOARD_LIST),
    school_affNo: z.string().min(1, "Affiliation number is required"),
    school_address: z.string().min(1, "School address is required"),
    school_city: z.string().min(1, "City is required"),
    school_state: z.enum(STATE_LIST),
    school_zipcode: z.string().regex(/^[0-9]{6,8}$/, "Enter a 6–8 digit zipcode"),
    school_phone: z.string().regex(/^[0-9]{10,13}$/, "Enter a 10–13 digit phone number"),
    school_website: z
      .string()
      .url("Enter a valid URL (https://...)")
      .optional()
      .or(z.literal("")),
    date_of_establishment: z.string().min(1, "Date is required"),
  })
  .refine((d) => d.password === d.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type RegisterValues = z.infer<typeof registerSchema>;

const STEP_FIELDS: Array<Array<keyof RegisterValues>> = [
  ["school_name", "email", "password", "confirm_password"],
  ["school_board", "school_affNo", "school_address", "school_city", "school_state", "school_zipcode"],
  ["school_phone", "school_website", "date_of_establishment"],
];

interface SignupResponse {
  userType?: "School" | "Staff" | "Student";
  message?: string;
}

async function postSignup(values: RegisterValues): Promise<SignupResponse> {
  const { confirm_password: _confirm, ...payload } = values;
  void _confirm;
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: SignupResponse = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Registration failed");
  return data;
}

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      school_name: "",
      email: "",
      password: "",
      confirm_password: "",
      school_board: BOARD_LIST[0],
      school_affNo: "",
      school_address: "",
      school_city: "",
      school_state: "Himachal Pradesh",
      school_zipcode: "",
      school_phone: "",
      school_website: "",
      date_of_establishment: "",
    },
  });

  const { register, handleSubmit, trigger, formState } = form;
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: postSignup,
    onSuccess: (data) => {
      if (data.userType) {
        router.push(`/${data.userType.toLowerCase()}/dashboard`);
        router.refresh();
      } else {
        router.push("/login");
      }
    },
  });

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEP_FIELDS.length - 1));
  };

  const onSubmit = (values: RegisterValues) => mutation.mutate(values);

  const inputClass =
    "flex w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-medium placeholder:font-normal md:px-4 md:py-3";
  const labelClass = "mt-2 font-semibold";
  const fieldClass = "mt-4 flex max-w-2xl flex-col";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" noValidate>
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <span>Step {step + 1} of 3</span>
      </div>

      {step === 0 && (
        <>
          <div className="flex flex-col space-y-2 text-start">
            <h2 className="text-3xl font-bold md:text-6xl">Create an account</h2>
            <p className="text-md md:text-2xl">
              Welcome to a network where schools, teachers and students all connect.
            </p>
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>School Name*</label>
            <input type="text" placeholder="School Name" {...register("school_name")} className={inputClass} />
            {errors.school_name && <FieldError msg={errors.school_name.message} />}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Email*</label>
            <input type="email" placeholder="Email" {...register("email")} className={inputClass} />
            {errors.email && <FieldError msg={errors.email.message} />}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Password*</label>
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
                {...register("password")}
                className={inputClass}
              />
            </div>
            {errors.password && <FieldError msg={errors.password.message} />}
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
                {...register("confirm_password")}
                className={inputClass}
              />
            </div>
            {errors.confirm_password && <FieldError msg={errors.confirm_password.message} />}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="flex flex-col space-y-2 text-start">
            <h2 className="text-3xl font-bold md:text-6xl">School Address Details</h2>
            <p className="text-md md:text-2xl">Sign up to digitalize your school</p>
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Affiliation Board*</label>
            <select {...register("school_board")} className={inputClass}>
              {BOARD_LIST.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Affiliation Number*</label>
            <input type="text" placeholder="Affiliation Number" {...register("school_affNo")} className={inputClass} />
            {errors.school_affNo && <FieldError msg={errors.school_affNo.message} />}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>School Address*</label>
            <textarea placeholder="School Address" {...register("school_address")} className={inputClass} />
            {errors.school_address && <FieldError msg={errors.school_address.message} />}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>School City*</label>
            <input type="text" placeholder="School City" {...register("school_city")} className={inputClass} />
            {errors.school_city && <FieldError msg={errors.school_city.message} />}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>School State*</label>
            <select {...register("school_state")} className={inputClass}>
              {STATE_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>School Zipcode*</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Zipcode"
              {...register("school_zipcode")}
              className={inputClass}
            />
            {errors.school_zipcode && <FieldError msg={errors.school_zipcode.message} />}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col space-y-2 text-start">
            <h2 className="text-3xl font-bold md:text-6xl">School Contact Details</h2>
            <p className="text-md md:text-2xl">Fill the contact details of your school</p>
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>School Phone Number*</label>
            <input
              type="tel"
              placeholder="School Phone No."
              {...register("school_phone")}
              className={inputClass}
            />
            {errors.school_phone && <FieldError msg={errors.school_phone.message} />}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>School Website</label>
            <input
              type="text"
              placeholder="https://example.com"
              {...register("school_website")}
              className={inputClass}
            />
            {errors.school_website && <FieldError msg={errors.school_website.message} />}
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Date of Establishment*</label>
            <input type="date" {...register("date_of_establishment")} className={inputClass} />
            {errors.date_of_establishment && (
              <FieldError msg={errors.date_of_establishment.message} />
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Logo upload is available after sign-in from your profile.
          </p>
        </>
      )}

      {mutation.error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {mutation.error.message}
        </p>
      )}

      <div className="mt-6 flex flex-row gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={mutation.isPending}
            className="flex flex-1 items-center justify-center rounded-lg border-2 border-slate-300 px-3 py-2 font-medium text-slate-700 md:px-4 md:py-3"
          >
            Back
          </button>
        )}
        {step < STEP_FIELDS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#4F46E5] bg-[#4F46E5] px-3 py-2 font-medium text-white md:px-4 md:py-3"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#4F46E5] bg-[#4F46E5] px-3 py-2 font-medium text-white disabled:opacity-60 md:px-4 md:py-3"
          >
            {mutation.isPending ? "Registering…" : "Register"}
          </button>
        )}
      </div>
    </form>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <span className="mt-1 text-sm text-red-600">{msg}</span>;
}
